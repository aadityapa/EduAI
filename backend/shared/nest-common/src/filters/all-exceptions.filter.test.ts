import { describe, expect, it, vi } from 'vitest';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter.js';

describe('AllExceptionsFilter', () => {
  it('emits flat Phase 6 envelope with nested error', () => {
    const filter = new AllExceptionsFilter();
    let body: Record<string, unknown> | undefined;
    const response = {
      setHeader: vi.fn(),
      status: (code: number) => ({
        json: (b: Record<string, unknown>) => {
          expect(code).toBe(400);
          body = b;
        },
      }),
    };
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => ({
          method: 'POST',
          url: '/api/v1/x',
          traceId: 'trace-abc',
          headers: {},
        }),
      }),
    };

    filter.catch(new BadRequestException({ code: 'BAD_INPUT', message: 'Nope' }), host as never);

    expect(body).toMatchObject({
      code: 'BAD_INPUT',
      message: 'Nope',
      traceId: 'trace-abc',
      error: {
        code: 'BAD_INPUT',
        message: 'Nope',
        traceId: 'trace-abc',
        request_id: 'trace-abc',
      },
    });
  });

  it('maps validation array messages into details', () => {
    const filter = new AllExceptionsFilter();
    let body: Record<string, unknown> | undefined;
    const response = {
      setHeader: vi.fn(),
      status: () => ({
        json: (b: Record<string, unknown>) => {
          body = b;
        },
      }),
    };
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => ({ traceId: 't1', headers: {} }),
      }),
    };

    filter.catch(
      new HttpException(
        { message: ['email must be an email', 'password too short'], error: 'Bad Request' },
        HttpStatus.BAD_REQUEST,
      ),
      host as never,
    );

    expect(body?.code).toBe('VALIDATION_ERROR');
    expect(body?.details).toEqual([
      { code: 'VALIDATION_ERROR', message: 'email must be an email' },
      { code: 'VALIDATION_ERROR', message: 'password too short' },
    ]);
  });
});

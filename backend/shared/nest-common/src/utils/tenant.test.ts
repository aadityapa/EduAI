import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { assertSameTenant, tenantWhere } from './tenant.js';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { buildPaginationMeta, normalizePagination } from '../dto/pagination.dto.js';

describe('assertSameTenant', () => {
  it('allows matching tenant', () => {
    expect(() => assertSameTenant('t1', 't1')).not.toThrow();
  });

  it('hides existence by default (404)', () => {
    expect(() => assertSameTenant('other', 't1')).toThrow(NotFoundException);
  });

  it('can leak existence as 403', () => {
    expect(() =>
      assertSameTenant('other', 't1', { leakExistence: true }),
    ).toThrow(ForbiddenException);
  });
});

describe('tenantWhere', () => {
  it('always includes tenantId', () => {
    expect(tenantWhere('t1', { status: 'active' })).toEqual({
      status: 'active',
      tenantId: 't1',
    });
  });
});

describe('pagination helpers', () => {
  it('normalizes page bounds', () => {
    expect(normalizePagination({ page: 0, page_size: 500 })).toEqual({
      page: 1,
      pageSize: 100,
      skip: 0,
    });
  });

  it('builds meta', () => {
    expect(buildPaginationMeta(2, 10, 25)).toMatchObject({
      page: 2,
      total_pages: 3,
      has_next: true,
      has_prev: true,
    });
  });
});

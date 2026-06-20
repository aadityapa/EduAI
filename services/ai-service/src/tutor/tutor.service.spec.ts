import { TutorService } from './tutor.service';
import type { UserContext } from '../common/decorators';

describe('TutorService', () => {
  const user: UserContext = {
    sub: 'user-1',
    email: 'student@example.com',
    tenantId: 'tenant-1',
    roles: ['student'],
    permissions: ['ai:tutor:use:own'],
  };

  let aiClient: { tutorMessage: jest.Mock; streamChat: jest.Mock };
  let conversationService: {
    findOrCreateConversation: jest.Mock;
    getConversationHistory: jest.Mock;
    saveMessage: jest.Mock;
    recordQuotaUsage: jest.Mock;
  };
  let securityService: { validateInput: jest.Mock; filterOutput: jest.Mock };
  let auditService: { logAiRequest: jest.Mock };
  let costService: { checkQuota: jest.Mock };
  let logger: { info: jest.Mock };
  let metrics: { recordRequest: jest.Mock };
  let tracing: { startSpan: jest.Mock; endSpan: jest.Mock };

  let service: TutorService;

  beforeEach(() => {
    aiClient = {
      tutorMessage: jest.fn().mockResolvedValue({
        content: 'Fractions represent parts of a whole.',
        model: 'mock-v1',
        provider: 'mock',
        tokensUsed: { prompt: 10, completion: 20, total: 30 },
      }),
      streamChat: jest.fn().mockImplementation(async function* () {
        yield { type: 'delta', content: 'Hello' };
        yield { type: 'done', content: 'Hello', tokensUsed: 10, model: 'mock-v1', provider: 'mock' };
      }),
    };

    conversationService = {
      findOrCreateConversation: jest.fn().mockResolvedValue({
        id: 'conv-1',
        tenantId: user.tenantId,
        userId: user.sub,
        type: 'tutor',
      }),
      getConversationHistory: jest.fn().mockResolvedValue({ id: 'conv-1', messages: [] }),
      saveMessage: jest.fn().mockResolvedValue({ id: 'msg-1' }),
      recordQuotaUsage: jest.fn().mockResolvedValue(undefined),
    };

    securityService = {
      validateInput: jest.fn().mockReturnValue({ safe: true, sanitized: 'test' }),
      filterOutput: jest.fn().mockImplementation((c: string) => ({ allowed: true, filtered: c })),
    };

    auditService = { logAiRequest: jest.fn().mockResolvedValue(undefined) };
    costService = { checkQuota: jest.fn().mockResolvedValue(undefined) };
    logger = { info: jest.fn() };
    metrics = { recordRequest: jest.fn() };
    tracing = {
      startSpan: jest.fn().mockReturnValue({ traceId: 't', spanId: 's', name: 'test', startTime: 0, attributes: {} }),
      endSpan: jest.fn(),
    };

    service = new TutorService(
      aiClient as never,
      conversationService as never,
      securityService as never,
      auditService as never,
      costService as never,
      logger as never,
      metrics as never,
      tracing as never,
    );
  });

  it('creates conversation and returns tutor response', async () => {
    const result = await service.chat(user, { message: 'Explain fractions' });

    expect(securityService.validateInput).toHaveBeenCalled();
    expect(costService.checkQuota).toHaveBeenCalled();
    expect(conversationService.saveMessage).toHaveBeenCalledTimes(2);
    expect(result.conversationId).toBe('conv-1');
    expect(result.tokensUsed).toBe(30);
  });

  it('rejects unsafe input', async () => {
    securityService.validateInput.mockReturnValue({ safe: false, reason: 'injection' });
    await expect(service.chat(user, { message: 'bad' })).rejects.toThrow();
  });

  it('continues existing conversation with history', async () => {
    conversationService.getConversationHistory.mockResolvedValue({
      id: 'conv-1',
      messages: [
        { role: 'user', content: 'Hi' },
        { role: 'assistant', content: 'Hello!' },
      ],
    });

    await service.chat(user, { message: 'Tell me more', conversationId: 'conv-1' });

    expect(aiClient.tutorMessage).toHaveBeenCalledWith(
      'Tell me more',
      expect.arrayContaining([{ role: 'user', content: 'Hi' }]),
      expect.any(Object),
    );
  });
});

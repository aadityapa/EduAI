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

  let aiClient: {
    tutorMessage: jest.Mock;
  };

  let conversationService: {
    findOrCreateConversation: jest.Mock;
    getConversationHistory: jest.Mock;
    saveMessage: jest.Mock;
    recordQuotaUsage: jest.Mock;
  };

  let service: TutorService;

  beforeEach(() => {
    aiClient = {
      tutorMessage: jest.fn().mockResolvedValue({
        content: 'Fractions represent parts of a whole.',
        model: 'mock-v1',
        provider: 'mock',
        tokensUsed: { prompt: 10, completion: 20, total: 30 },
      }),
    };

    conversationService = {
      findOrCreateConversation: jest.fn().mockResolvedValue({
        id: 'conv-1',
        tenantId: user.tenantId,
        userId: user.sub,
        type: 'tutor',
      }),
      getConversationHistory: jest.fn().mockResolvedValue({
        id: 'conv-1',
        messages: [],
      }),
      saveMessage: jest.fn().mockResolvedValue({ id: 'msg-1' }),
      recordQuotaUsage: jest.fn().mockResolvedValue(undefined),
    };

    service = new TutorService(aiClient as never, conversationService as never);
  });

  it('creates conversation and returns tutor response', async () => {
    const result = await service.chat(user, { message: 'Explain fractions' });

    expect(conversationService.findOrCreateConversation).toHaveBeenCalled();
    expect(conversationService.saveMessage).toHaveBeenCalledTimes(2);
    expect(aiClient.tutorMessage).toHaveBeenCalledWith(
      'Explain fractions',
      [],
      expect.objectContaining({ tenantId: user.tenantId, userId: user.sub }),
    );
    expect(result.conversationId).toBe('conv-1');
    expect(result.message).toContain('Fractions');
    expect(result.tokensUsed).toBe(30);
  });

  it('continues existing conversation with history', async () => {
    conversationService.getConversationHistory.mockResolvedValue({
      id: 'conv-1',
      messages: [
        { role: 'user', content: 'Hi' },
        { role: 'assistant', content: 'Hello!' },
      ],
    });

    await service.chat(user, {
      message: 'Tell me more',
      conversationId: 'conv-1',
    });

    expect(aiClient.tutorMessage).toHaveBeenCalledWith(
      'Tell me more',
      [
        { role: 'user', content: 'Hi' },
        { role: 'assistant', content: 'Hello!' },
      ],
      expect.any(Object),
    );
  });
});

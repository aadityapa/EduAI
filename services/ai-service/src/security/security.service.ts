import { Injectable } from '@nestjs/common';
import { guardPrompt, filterContent } from '@eduai/ai';

@Injectable()
export class SecurityService {
  validateInput(message: string) {
    return guardPrompt(message);
  }

  filterOutput(content: string) {
    return filterContent(content);
  }

  detectAbuse(queryCount: number, windowMinutes = 5, threshold = 50): boolean {
    return queryCount > threshold;
  }
}

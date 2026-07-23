'use server';

import {
  grantConsent,
  requestDataErasure,
  requestDataExport,
  verifyParentalConsent,
} from '@/lib/identity-api';

export async function actionGrantConsent(input: {
  purpose: string;
  subjectUserId: string;
  parentalMethod?: string;
}) {
  return grantConsent(input);
}

export async function actionVerifyConsent(id: string, code: string) {
  return verifyParentalConsent(id, code);
}

export async function actionRequestExport() {
  return requestDataExport();
}

export async function actionRequestErasure(purposeNote?: string) {
  return requestDataErasure(purposeNote);
}

import { PaymentService } from './PaymentService';
import { postgresDB } from '../../db'; // assume this is your Drizzle instance
import { paymentSessions, PaymentSession, NewPaymentSession } from '../../db/schema/paymentSessions';
import { eq } from 'drizzle-orm';

export class IncomingPaymentManager {
  constructor(private paymentService: PaymentService) {}

  async initiateIncomingPayment(userId: string, amount: string, assetCode: string, assetScale: number): Promise<PaymentSession> {
    // Request grant
    const grant = await this.paymentService.requestIncomingPaymentGrant();

    // Create incoming payment
    const incomingPayment = await this.paymentService.createIncomingPayment(
      grant.accessToken,
      { value: amount, assetCode, assetScale },
      10 // expires in 10 minutes
    );

    // Store session
    const newSession: NewPaymentSession = {
      userId,
      accessToken: grant.accessToken,
      tokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      paymentUrl: incomingPayment.id,
      paymentStatus: 'PENDING'
    };

    const [insertedSession] = await postgresDB.insert(paymentSessions).values(newSession).returning();
    return insertedSession;
  }

  async getIncomingPaymentDetails(sessionId: number): Promise<any> {
    const session = await postgresDB.select().from(paymentSessions).where(eq(paymentSessions.id, sessionId)).limit(1);
    if (!session[0]) throw new Error('Session not found');

    const encodedUrl = encodeURIComponent(session[0].paymentUrl as string);
    const paymentDetails = await this.paymentService.getIncomingPayment(encodedUrl, session[0].accessToken);

    return paymentDetails;
  }

  async completeIncomingPayment(sessionId: number): Promise<any> {
    const session = await postgresDB.select().from(paymentSessions).where(eq(paymentSessions.id, sessionId)).limit(1);
    if (!session[0]) throw new Error('Session not found');

    const encodedUrl = encodeURIComponent(session[0].paymentUrl as string);
    const completedPayment = await this.paymentService.completeIncomingPayment(encodedUrl, session[0].accessToken);

    // Update session status
    await postgresDB.update(paymentSessions)
      .set({ paymentStatus: 'COMPLETED', updatedAt: new Date() })
      .where(eq(paymentSessions.id, sessionId));

    return completedPayment;
  }

  async listIncomingPayments(userId: string, cursor?: string): Promise<any> {
    const session = await postgresDB.select().from(paymentSessions).where(eq(paymentSessions.userId, userId)).limit(1);
    if (!session[0]) throw new Error('No active session for user');

    const payments = await this.paymentService.listIncomingPayments(session[0].accessToken, { first: 10, cursor });
    return payments;
  }
}
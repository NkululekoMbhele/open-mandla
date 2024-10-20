import { PaymentService } from './PaymentService';
import { postgresDB } from '../../db'; // assume this is your Drizzle instance
import { paymentSessions, PaymentSession, NewPaymentSession } from '../../db/schema/paymentSessions';
import { eq } from 'drizzle-orm';

export class OutgoingPaymentManager {
  constructor(private paymentService: PaymentService) {}

  async initiateOutgoingPayment(
    walletAddress: string,
    debitAmount: { value: string; assetCode: string; assetScale: number },
    receiveAmount: { value: string; assetCode: string; assetScale: number },
    nonce: string
  ): Promise<PaymentSession> {
    // Step 1: Request Outgoing Payment Grant
    const grant = await this.paymentService.requestOutgoingPaymentGrant(
      walletAddress,
      debitAmount,
      receiveAmount,
      nonce
    );

    // Store session
    const newSession: NewPaymentSession = {
      userId: walletAddress, // Using wallet address as user ID for now
      accessToken: grant.continueToken,
      tokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      paymentStatus: 'GRANT_REQUESTED',
      paymentUrl: grant.continueUri
    };

    const [insertedSession] = await postgresDB.insert(paymentSessions).values(newSession).returning();
    return insertedSession;
  }

  async continueGrant(sessionId: number, interactRef: string): Promise<PaymentSession> {
    const session = await postgresDB.select().from(paymentSessions).where(eq(paymentSessions.id, sessionId)).limit(1);
    if (!session[0]) throw new Error('Session not found');

    // Step 2: Continue Grant
    const continuedGrant = await this.paymentService.continueGrant(
      session[0].accessToken,
      session[0].paymentUrl!,
      interactRef
    );

    // Update session
    const updatedSession = await postgresDB.update(paymentSessions)
      .set({
        accessToken: continuedGrant.accessToken,
        paymentStatus: 'GRANT_CONTINUED',
        updatedAt: new Date()
      })
      .where(eq(paymentSessions.id, sessionId))
      .returning();

    return updatedSession[0];
  }

  async createQuote(
    sessionId: number,
    receiveAmount: { value: string; assetCode: string; assetScale: number },
    receiver: string
  ): Promise<any> {
    const session = await postgresDB.select().from(paymentSessions).where(eq(paymentSessions.id, sessionId)).limit(1);
    if (!session[0]) throw new Error('Session not found');

    // Step 3: Create a Quote
    const quote = await this.paymentService.createQuote(
      session[0].accessToken,
      session[0].userId, // wallet address
      receiveAmount,
      receiver
    );

    // Update session
    await postgresDB.update(paymentSessions)
      .set({
        paymentStatus: 'QUOTE_CREATED',
        paymentUrl: quote.id, // Store quote ID in paymentUrl
        updatedAt: new Date()
      })
      .where(eq(paymentSessions.id, sessionId));

    return quote;
  }

  async createOutgoingPayment(sessionId: number): Promise<any> {
    const session = await postgresDB.select().from(paymentSessions).where(eq(paymentSessions.id, sessionId)).limit(1);
    if (!session[0]) throw new Error('Session not found');

    // Step 4: Create Outgoing Payment
    const outgoingPayment = await this.paymentService.createOutgoingPayment(
      session[0].accessToken,
      session[0].userId, // wallet address
      session[0].paymentUrl! // quote ID
    );

    // Update session
    await postgresDB.update(paymentSessions)
      .set({
        paymentStatus: 'PAYMENT_CREATED',
        paymentUrl: outgoingPayment.id,
        updatedAt: new Date()
      })
      .where(eq(paymentSessions.id, sessionId));

    return outgoingPayment;
  }

  async getOutgoingPaymentDetails(sessionId: number): Promise<any> {
    const session = await postgresDB.select().from(paymentSessions).where(eq(paymentSessions.id, sessionId)).limit(1);
    if (!session[0]) throw new Error('Session not found');

    // Step 5: Get Outgoing Payment Details
    return this.paymentService.getOutgoingPayment(session[0].paymentUrl!, session[0].accessToken);
  }

  async listOutgoingPayments(walletAddress: string, first: number = 10): Promise<any> {
    const session = await postgresDB.select().from(paymentSessions)
      .where(eq(paymentSessions.userId, walletAddress))
      .orderBy(paymentSessions.createdAt, 'desc')
      .limit(1);
    if (!session[0]) throw new Error('No active session for wallet');

    // Step 6: List Outgoing Payments
    return this.paymentService.listOutgoingPayments(session[0].accessToken, walletAddress, { first });
  }
}
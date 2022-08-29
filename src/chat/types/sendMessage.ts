export interface SendMessage {
  id: string;
  to: string;
  from: string;
  previousMessageId: string;
  test: string;
  createdAt: string;
  status: 'SEEN' | 'SENT' | 'UNREAD';
}

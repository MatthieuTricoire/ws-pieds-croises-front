export interface Message {
  id: string;
  title: string;
  content: string;
  messageType: 'ALERT' | 'INFORMATION' | 'EVENT' | 'REMINDER';
}

export interface Message {
  name: string;
  email: string;
  message: string;
}

export type MessageErrors = Partial<Record<keyof Message, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateMessage(m: Message): MessageErrors {
  const errors: MessageErrors = {};
  if (!m.name.trim()) errors.name = 'Please tell me your name.';
  if (!EMAIL.test(m.email.trim())) errors.email = 'Please enter a valid email.';
  if (!m.message.trim()) errors.message = 'Please write a message.';
  return errors;
}

/** Mail clients read "+" literally, so encode with encodeURIComponent (spaces → %20). */
export function buildMailto(to: string, m: Message): string {
  const subject = `Portfolio message from ${m.name.trim()}`;
  const body = `${m.message.trim()}\n\n${m.name.trim()} <${m.email.trim()}>`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

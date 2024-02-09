export interface IMail {
  to: string;
  subject: string;
  text?: string;
  template?: string;
  templateVariables?: { [key: string]: any };
}

export interface MailInput {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

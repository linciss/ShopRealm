import 'server-only';

import { Resend } from 'resend';

export const resend = new Resend(process.env.RESET_API_KEY || '');

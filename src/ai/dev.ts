import { config } from 'dotenv';
config({ path: '.env.local' });
config();

import '@/ai/flows/create-survey-from-document.ts';
import '@/ai/flows/ai-quota-generation.ts';
import '@/ai/flows/ai-question-enhancement.ts';
import '@/ai/flows/ai-chatbot-survey-creation.ts';
import '@/ai/flows/ai-data-bouncer-quality-control.ts';
'use server';
/**
 * @fileOverview An AI chatbot that helps users collaboratively design and generate survey questions and flow.
 *
 * - aiChatbotSurveyCreation - A function that handles the conversational survey design process.
 * - AiChatbotSurveyCreationInput - The input type for the aiChatbotSurveyCreation function.
 * - AiChatbotSurveyCreationOutput - The return type for the aiChatbotSurveyCreation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiChatbotSurveyCreationInputSchema = z.object({
  message: z.string().describe("The user's current message to the chatbot."),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .optional()
    .describe('An optional array of previous messages for conversation context.'),
});
export type AiChatbotSurveyCreationInput = z.infer<typeof AiChatbotSurveyCreationInputSchema>;

const AiChatbotSurveyCreationOutputSchema = z.object({
  response: z.string().describe('The AI chatbot\'s response, supporting Markdown formatting.'),
  surveyStructurePreview: z
    .object({
      questionCount: z.number().describe('The number of questions in the suggested survey.'),
      questionTypes: z
        .array(z.string())
        .describe('An array of question types, e.g., "Multiple Choice", "Open Ended", "Likert Scale".'),
    })
    .optional()
    .describe('Optional preview of the suggested survey structure.'),
  ctaButton: z.string().optional().describe('Optional call to action button text, e.g., "Create Survey with this structure".'),
});
export type AiChatbotSurveyCreationOutput = z.infer<typeof AiChatbotSurveyCreationOutputSchema>;

export async function aiChatbotSurveyCreation(input: AiChatbotSurveyCreationInput): Promise<AiChatbotSurveyCreationOutput> {
  return aiChatbotSurveyCreationFlow(input);
}

const aiChatbotSurveyCreationPrompt = ai.definePrompt({
  name: 'aiChatbotSurveyCreationPrompt',
  input: { schema: AiChatbotSurveyCreationInputSchema },
  output: { schema: AiChatbotSurveyCreationOutputSchema },
  prompt: `You are an AI Survey Designer chatbot. Your goal is to help the user collaboratively design and generate survey questions and flow.\nYou can suggest survey questions, clarify requirements, and propose a final survey structure.\nYour response MUST be a JSON object conforming to the following TypeScript interface:\n\n\`\`\`typescript\ninterface AiChatbotSurveyCreationOutput {\n  response: string; // The AI chatbot's response, supporting Markdown formatting.\n  surveyStructurePreview?: { // Optional preview of the suggested survey structure.\n    questionCount: number; // The number of questions in the suggested survey.\n    questionTypes: string[]; // An array of question types, e.g., "Multiple Choice", "Open Ended", "Likert Scale".\n  };\n  ctaButton?: string; // Optional call to action button text.\n}\n\`\`\`\n\nIf you believe you have enough information to propose a survey structure, populate the \`surveyStructurePreview\` and \`ctaButton\` fields in the JSON object. Otherwise, omit them.\n\nHere is the conversation history so far:\n{{#each history}}\n  {{role}}: {{{content}}}\n{{/each}}\n\nUser: {{{message}}}\n\nPlease ensure the 'response' field is in Markdown format.\n`,
});

const aiChatbotSurveyCreationFlow = ai.defineFlow(
  {
    name: 'aiChatbotSurveyCreationFlow',
    inputSchema: AiChatbotSurveyCreationInputSchema,
    outputSchema: AiChatbotSurveyCreationOutputSchema,
  },
  async (input) => {
    const { output } = await aiChatbotSurveyCreationPrompt(input);
    return output!;
  }
);

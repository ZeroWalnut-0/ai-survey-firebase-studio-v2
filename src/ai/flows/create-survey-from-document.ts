'use server';
/**
 * @fileOverview A Genkit flow for generating a draft survey from an uploaded document.
 *
 * - createSurveyFromDocument - A function that handles the survey generation process from a document.
 * - CreateSurveyFromDocumentInput - The input type for the createSurveyFromDocument function.
 * - CreateSurveyFromDocumentOutput - The return type for the createSurveyFromDocument function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CreateSurveyFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document's content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CreateSurveyFromDocumentInput = z.infer<typeof CreateSurveyFromDocumentInputSchema>;

const SurveyQuestionSchema = z.object({
  question: z.string().describe('The text of the survey question.'),
  type:
    z.enum(['text', 'single-choice', 'multi-choice', 'likert'])
      .describe(
        'The type of the survey question. Options: "text" for open-ended, "single-choice" for radio buttons, "multi-choice" for checkboxes, "likert" for a 5-point Likert scale.'
      ),
  options: z
    .array(z.string())
    .optional()
    .describe('Options for single-choice, multi-choice, or likert questions. Not applicable for "text" type.'),
});

const CreateSurveyFromDocumentOutputSchema = z.object({
  title: z.string().describe('A concise title for the generated survey.'),
  description: z.string().describe('A brief description or introduction for the survey.'),
  questions: z
    .array(SurveyQuestionSchema)
    .describe('An array of generated survey questions, each with its type and options.'),
});
export type CreateSurveyFromDocumentOutput = z.infer<typeof CreateSurveyFromDocumentOutputSchema>;

export async function createSurveyFromDocument(
  input: CreateSurveyFromDocumentInput
): Promise<CreateSurveyFromDocumentOutput> {
  return createSurveyFromDocumentFlow(input);
}

const createSurveyFromDocumentPrompt = ai.definePrompt({
  name: 'createSurveyFromDocumentPrompt',
  input: { schema: CreateSurveyFromDocumentInputSchema },
  output: { schema: CreateSurveyFromDocumentOutputSchema },
  prompt: `You are an expert survey designer AI. Your task is to analyze the provided document and create a draft survey.
Identify the main topics, objectives, and key information from the document to formulate relevant and clear survey questions.
The survey should cover the essential aspects discussed in the document, suitable for gathering feedback or information related to its content.

Generate a survey with a clear title, a brief description, and a list of questions.
Each question should have a 'question' string, a 'type' (e.g., 'text', 'single-choice', 'multi-choice', 'likert'), and optionally 'options' if it's a choice-based question. Make sure to define at least 5 questions.

Document: {{media url=documentDataUri}}`,
});

const createSurveyFromDocumentFlow = ai.defineFlow(
  {
    name: 'createSurveyFromDocumentFlow',
    inputSchema: CreateSurveyFromDocumentInputSchema,
    outputSchema: CreateSurveyFromDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await createSurveyFromDocumentPrompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview An AI agent that suggests improvements for survey questions.
 *
 * - aiQuestionEnhancement - A function that handles the question enhancement process.
 * - AiQuestionEnhancementInput - The input type for the aiQuestionEnhancement function.
 * - AiQuestionEnhancementOutput - The return type for the aiQuestionEnhancement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiQuestionEnhancementInputSchema = z.object({
  questionText: z.string().describe('The survey question text to be enhanced.'),
  context: z.string().optional().describe('Optional context about the survey or the purpose of the question, to help the AI provide more relevant suggestions.'),
});
export type AiQuestionEnhancementInput = z.infer<typeof AiQuestionEnhancementInputSchema>;

const AiQuestionEnhancementSuggestionSchema = z.object({
  category: z.enum(['clarity', 'bias', 'effectiveness']).describe('The category of the suggestion (clarity, bias, or effectiveness).'),
  description: z.string().describe('A detailed description of the suggestion for improvement.'),
  revisedQuestionExample: z.string().optional().describe('An optional example of how the question could be revised based on the suggestion.')
});

const AiQuestionEnhancementOutputSchema = z.object({
  suggestions: z.array(AiQuestionEnhancementSuggestionSchema).describe('An array of suggestions to improve the survey question.')
});
export type AiQuestionEnhancementOutput = z.infer<typeof AiQuestionEnhancementOutputSchema>;

export async function aiQuestionEnhancement(input: AiQuestionEnhancementInput): Promise<AiQuestionEnhancementOutput> {
  return aiQuestionEnhancementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiQuestionEnhancementPrompt',
  input: {schema: AiQuestionEnhancementInputSchema},
  output: {schema: AiQuestionEnhancementOutputSchema},
  prompt: `You are an expert survey designer and AI assistant. Your task is to analyze the provided survey question and offer constructive suggestions to improve its clarity, reduce bias, and enhance its overall effectiveness.

Provide specific, actionable feedback for each suggestion. If applicable, you can also provide an example of how the question could be revised.

Analyze the question based on these criteria:
1.  **Clarity**: Is the question easy to understand? Is it ambiguous?
2.  **Bias**: Does the question lead respondents towards a particular answer? Is it loaded or double-barreled?
3.  **Effectiveness**: Does the question effectively measure what it intends to measure? Is it too broad or too specific?

Question to analyze:
{{{questionText}}}

{{#if context}}
Context about the survey or question:
{{{context}}}
{{/if}}

Please provide your suggestions in a JSON array format, following the schema defined for the output. Each suggestion should include a 'category' (clarity, bias, or effectiveness), a 'description' of the problem and proposed solution, and optionally a 'revisedQuestionExample' if a concrete example is helpful.`,
});

const aiQuestionEnhancementFlow = ai.defineFlow(
  {
    name: 'aiQuestionEnhancementFlow',
    inputSchema: AiQuestionEnhancementInputSchema,
    outputSchema: AiQuestionEnhancementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('No output received from the AI model.');
    }
    return output;
  }
);

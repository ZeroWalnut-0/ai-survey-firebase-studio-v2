'use server';
/**
 * @fileOverview An AI Data Bouncer flow to detect and flag low-quality survey responses.
 *
 * - aiDataBouncerQualityControl - A function that handles the quality control process for survey responses.
 * - AiDataBouncerQualityControlInput - The input type for the aiDataBouncerQualityControl function.
 * - AiDataBouncerQualityControlOutput - The return type for the aiDataBouncerQualityControl function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiDataBouncerQualityControlInputSchema = z.object({
  responseId: z.string().describe('Unique identifier for the survey response.'),
  responseTimeSeconds: z.number().describe('Time taken by the respondent to complete the survey in seconds.'),
  answers: z.array(
    z.object({
      questionId: z.string().describe('Unique identifier for the question.'),
      questionText: z.string().describe('The text of the question.'),
      answerType: z.enum(['multiple-choice', 'likert', 'open-ended', 'checkbox']).describe('The type of the question.'),
      value: z.union([z.string(), z.array(z.string()), z.number()]).describe('The value of the answer provided by the respondent.'),
      options: z.array(z.string()).optional().describe('Available options for multiple-choice or likert questions, if applicable.'),
    })
  ).describe('An array of all answers provided by the respondent.'),
  expectedAverageResponseTimeSeconds: z.number().optional().describe('Optional: Expected average time for the survey completion to help detect speed traps.'),
});
export type AiDataBouncerQualityControlInput = z.infer<typeof AiDataBouncerQualityControlInputSchema>;

const AiDataBouncerQualityControlOutputSchema = z.object({
  isLowQuality: z.boolean().describe('True if the response is flagged as low-quality.'),
  flaggedReasons: z.array(z.enum(['speed_trap', 'straightlining'])).describe('Reasons for flagging the response as low-quality. Must only include \'speed_trap\' or \'straightlining\' if applicable.'),
  details: z.string().describe('A detailed explanation of why the response was flagged, including specific patterns or issues detected.'),
});
export type AiDataBouncerQualityControlOutput = z.infer<typeof AiDataBouncerQualityControlOutputSchema>;

export async function aiDataBouncerQualityControl(input: AiDataBouncerQualityControlInput): Promise<AiDataBouncerQualityControlOutput> {
  return aiDataBouncerQualityControlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDataBouncerQualityControlPrompt',
  input: { schema: AiDataBouncerQualityControlInputSchema },
  output: { schema: AiDataBouncerQualityControlOutputSchema },
  prompt: `You are an AI data quality control expert for survey responses. Your task is to analyze a given survey response and determine if it exhibits patterns of low quality, specifically "speed traps" or "straightlining".

Definition of "Speed Trap": A response is considered a "speed trap" if the respondent completes the survey in an unusually short amount of time, indicating a lack of careful consideration for the questions. Consider a response time significantly lower than typical or a given expected average. If 'expectedAverageResponseTimeSeconds' is provided, use it as a benchmark. A good heuristic for flagging could be if responseTimeSeconds is less than 20% of the expectedAverageResponseTimeSeconds, or if no expected average is given, if responseTimeSeconds is very low (e.g., under 60 seconds for a typical survey).

Definition of "Straightlining": A response is considered "straightlining" if the respondent provides the same or highly similar answers to a series of related questions (especially Likert scales or multiple-choice questions with ordered options), suggesting they are not genuinely engaging with each question individually. Look for repetitive patterns across consecutive questions of similar type.

Analyze the following survey response:

Response ID: {{{responseId}}}
Response Time: {{{responseTimeSeconds}}} seconds
{{#if expectedAverageResponseTimeSeconds}}
Expected Average Response Time: {{{expectedAverageResponseTimeSeconds}}} seconds
{{/if}}
Answers:
{{#each answers}}
  - Question ID: {{{questionId}}}
    Question Text: "{{{questionText}}}"
    Answer Type: {{{answerType}}}
    Answer Value: "{{{value}}}"
    {{#if options}}
    Options: {{#each options}} "{{{this}}}" {{/each}}
    {{/if}}
{{/each}}

Based on the definitions above and the provided response data, determine if this response is low-quality. Provide a boolean for 'isLowQuality', an array of 'flaggedReasons' (must only include 'speed_trap' or 'straightlining' if applicable), and a 'details' string explaining your findings. If no low-quality issues are found, 'isLowQuality' should be false and 'flaggedReasons' an empty array.
`,
});

const aiDataBouncerQualityControlFlow = ai.defineFlow(
  {
    name: 'aiDataBouncerQualityControlFlow',
    inputSchema: AiDataBouncerQualityControlInputSchema,
    outputSchema: AiDataBouncerQualityControlOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

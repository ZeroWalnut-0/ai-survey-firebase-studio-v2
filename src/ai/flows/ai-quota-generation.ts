'use server';
/**
 * @fileOverview A Genkit flow for generating a detailed cross-tabulated quota table
 * based on a natural language description of target audience needs.
 *
 * - generateQuotaTable - A function that handles the AI quota table generation process.
 * - GenerateQuotaTableInput - The input type for the generateQuotaTable function.
 * - GenerateQuotaTableOutput - The return type for the generateQuotaTable function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuotaTableInputSchema = z.object({
  description: z
    .string()
    .describe(
      'A natural language description of the target audience and desired quota allocation.'
    ),
});
export type GenerateQuotaTableInput = z.infer<typeof GenerateQuotaTableInputSchema>;

const QuotaCellSchema = z.record(
  z.string(),
  z.number().describe('The target response count for this specific demographic cell.')
);

const QuotaRowSchema = z.object({
  label: z.string().describe('The label for this row (e.g., age group or total).'),
  cells: QuotaCellSchema.describe(
    'A map of column names to target counts for this row.'
  ),
});

const GenerateQuotaTableOutputSchema = z.object({
  columns: z
    .array(z.string())
    .describe(
      'An ordered list of column headers (e.g., ["Male", "Female", "Total"]).'
    ),
  rows: z
    .array(QuotaRowSchema)
    .describe(
      'An array of row objects, each containing a label and cell data representing demographic segments and their target counts.'
    ),
});
export type GenerateQuotaTableOutput = z.infer<
  typeof GenerateQuotaTableOutputSchema
>;

export async function generateQuotaTable(
  input: GenerateQuotaTableInput
): Promise<GenerateQuotaTableOutput> {
  return aiQuotaGenerationFlow(input);
}

const quotaGenerationPrompt = ai.definePrompt({
  name: 'quotaGenerationPrompt',
  input: { schema: GenerateQuotaTableInputSchema },
  output: { schema: GenerateQuotaTableOutputSchema },
  prompt: `You are an AI assistant specialized in generating demographic quota tables for surveys.
Your task is to analyze the user's natural language description of their target audience and desired quota allocation, and generate a cross-tabulated quota table in JSON format.

The table should clearly define demographic segments (e.g., by age and gender) and specify the target number of respondents for each segment, including automatic row and column totals.

Your output MUST strictly adhere to the following JSON schema:

---
{{zodSchema GenerateQuotaTableOutputSchema}}
---

Natural language description: {{{description}}}
`,
});

const aiQuotaGenerationFlow = ai.defineFlow(
  {
    name: 'aiQuotaGenerationFlow',
    inputSchema: GenerateQuotaTableInputSchema,
    outputSchema: GenerateQuotaTableOutputSchema,
  },
  async (input) => {
    const { output } = await quotaGenerationPrompt(input);
    return output!;
  }
);

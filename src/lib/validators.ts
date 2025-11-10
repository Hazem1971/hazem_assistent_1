import { z } from 'zod';

export const businessProfileSchema = z.object({
  businessType: z.string().min(1, { message: 'Please select a business type.' }),
});

export const toneAnalysisSchema = z.object({
    referenceContent: z.string().min(50, { message: 'Please provide at least 50 characters of reference content.' }),
});

export const contentGeneratorSchema = z.object({
    platforms: z.array(z.string()).min(1, { message: 'Please select at least one platform.' }),
});

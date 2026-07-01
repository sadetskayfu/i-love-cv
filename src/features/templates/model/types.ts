import z from 'zod';
import { ColorsSchema } from '@/enteties/customization/color';

export const TemplateSchema = z.object({
	id: z.string(),
	name: z.string(),
	colors: ColorsSchema,
});
export const TemplatesArraySchema = z.array(TemplateSchema);

export type Template = z.infer<typeof TemplateSchema>;
export type TemplatesArray = z.infer<typeof TemplatesArraySchema>;

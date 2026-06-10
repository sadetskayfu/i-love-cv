import z from 'zod';
import { ColorValueSchema } from './color';

export const FontSizeSchema = z.enum(['12', '14', '16', '18']);
export const FontFamilySchema = z.enum(['Times New Roman', 'Mono']);

export const FontSchema = z.object({
	size: FontSizeSchema,
	family: FontFamilySchema,
	color: ColorValueSchema,
	bold: z.boolean(),
});

export type FontSize = z.infer<typeof FontSizeSchema>;
export type FontFamily = z.infer<typeof FontFamilySchema>;
export type Font = z.infer<typeof FontSchema>;

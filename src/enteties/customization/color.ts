import z from 'zod';

const hexColorRegex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;

export const ColorValueSchema = z.enum(['1', '2', '3', '4', '5']);
export const ColorSchema = z.object({
    value: ColorValueSchema,
    hex: z.string().regex(hexColorRegex),
});
export const ColorsSchema = z.array(ColorSchema);

export type ColorValue = z.infer<typeof ColorValueSchema>;
export type Color = z.infer<typeof ColorSchema>;
export type Colors = z.infer<typeof ColorsSchema>;
import { z } from 'zod';
import type { BaseEditor, Descendant } from 'slate';
import type { ReactEditor } from 'slate-react';

export const TEXT_MARK = ['bold', 'italics', 'underline', 'strikethrough'] as const;
export const TEXT_ALIGN = ['left', 'center', 'right', 'justify'] as const;
export const LIST = ['numbered-list', 'bulleted-list'] as const;

export const TextMarkSchema = z.enum(TEXT_MARK);
export const TextAlignSchema = z.enum(TEXT_ALIGN);
export const ListSchema = z.enum(LIST);

export type TextMarkType = z.infer<typeof TextMarkSchema>;
export type TextAlignType = z.infer<typeof TextAlignSchema>;
export type ListType = z.infer<typeof ListSchema>;

export const TextSchema = z.object({
	bold: z.boolean().optional(),
	italics: z.boolean().optional(),
	underline: z.boolean().optional(),
	strikethrough: z.boolean().optional(),
	fontColor: z.number(),
	backgroundColor: z.number(),
	text: z.string(),
});

export type Text = z.infer<typeof TextSchema>;

type ParagraphElement = {
	type: 'paragraph';
	align?: TextAlignType;
	children: Descendant[];
};
type LinkElement = {
	type: 'link';
	url: string;
	children: Descendant[];
};
type BulletedListElement = {
	type: 'bulleted-list';
	align?: TextAlignType;
	children: Descendant[];
};
type NumberedListElement = {
	type: 'numbered-list';
	align?: TextAlignType;
	children: Descendant[];
};
type ListItemElement = {
	type: 'list-item';
	children: Descendant[];
};
export type Element =
	| ParagraphElement
	| LinkElement
	| BulletedListElement
	| NumberedListElement
	| ListItemElement;

export const ElementSchema: z.ZodType<Element> = z.union([
	z.object({
		type: z.literal('paragraph'),
		align: TextAlignSchema.optional(),
		children: z.array(z.lazy(() => DescendantSchema)),
	}),
	z.object({
		type: z.literal('link'),
		url: z.string(),
		children: z.array(z.lazy(() => DescendantSchema)),
	}),
	z.object({
		type: z.literal('bulleted-list'),
		align: TextAlignSchema.optional(),
		children: z.array(z.lazy(() => DescendantSchema)),
	}),
	z.object({
		type: z.literal('numbered-list'),
		align: TextAlignSchema.optional(),
		children: z.array(z.lazy(() => DescendantSchema)),
	}),
	z.object({
		type: z.literal('list-item'),
		children: z.array(z.lazy(() => DescendantSchema)),
	}),
]);

const DescendantSchema: z.ZodType<Descendant> = z.union([TextSchema, z.lazy(() => ElementSchema)]);
export const EditableValueSchema = z.array(DescendantSchema);

export type ElementType = Element['type'];
export type CustomEditor = BaseEditor & ReactEditor;
export type ElementFormat =
	| Exclude<ElementType, 'link' | 'paragraph' | 'list-item'>
	| TextAlignType
	| TextMarkType;
export type ElementWithAlign = ParagraphElement | NumberedListElement | BulletedListElement;

declare module 'slate' {
	interface CustomTypes {
		Text: Text;
		Element: Element;
		Editor: CustomEditor;
	}
}

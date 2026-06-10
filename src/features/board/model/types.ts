import { FontSchema } from '@/enteties/customization/font';
import z from 'zod';

export type Mode = 'idle' | 'selection' | 'add-shape-node' | 'add-text-node';
export type WindowPosition = {
	x: number;
	y: number;
	zoom: number;
};
export type Position = {
	x: number;
	y: number;
};
export type Dimension = {
	width: number;
	height: number;
};
export type Rect = {
	position: Position;
	size: Dimension;
};

// --- Nodes ---
const PositionSchema = z.object({ x: z.number(), y: z.number() });
const DimensionsSchema = z.object({ width: z.number(), height: z.number() });

export const NodeType = {
	Shape: 'shape',
	Text: 'text',
} as const;

const NodeTypeSchema = z.enum([NodeType.Shape, NodeType.Text]);

const BaseNodeSchema = z.object({
	id: z.string(),
	type: NodeTypeSchema,
	rotate: z.number(),
});

const ShapeNodeSchema = BaseNodeSchema.extend({
	type: z.literal(NodeType.Shape),
	position: PositionSchema,
	dimensions: DimensionsSchema,
});

const TextNodeSchema = BaseNodeSchema.extend({
	type: z.literal(NodeType.Text),
	content: z.string(),
	font: FontSchema.omit({ family: true }),
	position: PositionSchema,
	width: z.number().optional(),
});

const NodeSchema = z.discriminatedUnion('type', [ShapeNodeSchema, TextNodeSchema]);
export const NodesArraySchema = z.array(NodeSchema)

export type Node = z.infer<typeof NodeSchema>;
export type NodeType = z.infer<typeof NodeTypeSchema>;
export type ShapeNode = z.infer<typeof ShapeNodeSchema>;
export type TextNode = z.infer<typeof TextNodeSchema>;
export type NodesArray = z.infer<typeof NodesArraySchema>

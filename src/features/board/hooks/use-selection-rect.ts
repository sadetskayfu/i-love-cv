import * as React from 'react';
import { useRect } from './use-rect';
import { useStableCallback } from '@/shared/hooks/use-stable-callback';
import { useAtom, useSetAtom } from 'jotai';
import { boardActions, boardState } from '../model';
import type { ElementRect } from '@/shared/hooks/use-element-rect';
import type { Position, Rect } from '../model/types';

function getRotatedBoundingBox(rect: Rect, angleDeg: number, center?: Position): Rect {
	const rad = (angleDeg * Math.PI) / 180;
	const cos = Math.cos(rad);
	const sin = Math.sin(rad);

	const cx = center?.x ?? rect.position.x + rect.size.width / 2;
	const cy = center?.y ?? rect.position.y + rect.size.height / 2;

	const corners = [
		{ x: rect.position.x, y: rect.position.y },
		{ x: rect.position.x + rect.size.width, y: rect.position.y },
		{ x: rect.position.x + rect.size.width, y: rect.position.y + rect.size.height },
		{ x: rect.position.x, y: rect.position.y + rect.size.height },
	];

	const rotatedCorners = corners.map(corner => ({
		x: cx + (corner.x - cx) * cos - (corner.y - cy) * sin,
		y: cy + (corner.x - cx) * sin + (corner.y - cy) * cos,
	}));

	const xs = rotatedCorners.map(p => p.x);
	const ys = rotatedCorners.map(p => p.y);
	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const minY = Math.min(...ys);
	const maxY = Math.max(...ys);

	return {
		position: { x: minX, y: minY },
		size: { width: maxX - minX, height: maxY - minY },
	};
}

function isRectsIntersecting(rect1: Rect, rect2: Rect) {
	return (
		rect1.position.x <= rect2.position.x + rect2.size.width &&
		rect1.position.x + rect1.size.width >= rect2.position.x &&
		rect1.position.y <= rect2.position.y + rect2.size.height &&
		rect1.position.y + rect1.size.height >= rect2.position.y
	);
}

export function useSelectionRect(canvasRect: ElementRect | null) {
	const [nodes] = useAtom(boardState.nodesAtom);
	const [domNodes] = useAtom(boardState.domNodesAtom);
	const [mode] = useAtom(boardState.modeAtom);
	const setSelectionRect = useSetAtom(boardState.selectionRectAtom);
	const setVisualSelectedNodes = useSetAtom(boardState.visualSelectedNodeIdsAtom);
	const clearVisualSelectedNodes = useSetAtom(boardActions.clearVisualSelectedNodes);
	const selectNodes = useSetAtom(boardActions.selectNodes);

	const nodeIdsInRectRef = React.useRef(new Set<string>());

	const { onPointerDown, onPointerMove, onPointerUp } = useRect(canvasRect);

	const handlePointeDown = useStableCallback((event: React.PointerEvent) => {
		if (mode === 'selection') {
			onPointerDown(event);
		}
	});

	const handlePointerMove = useStableCallback((event: PointerEvent) => {
		onPointerMove(event, (_, rect) => {
			if (!rect) {
				return;
			}

			const nodeIdsInRect = new Set<string>();

			nodes.forEach(node => {
				const domNode = domNodes[node.id];

				if (!domNode) {
					return;
				}

				let nodeRect: Rect = {
					position: node.position,
					size: {
						width: domNode.clientWidth,
						height: domNode.clientHeight,
					},
				};

				if (node.rotate && node.rotate !== 0) {
					nodeRect = getRotatedBoundingBox(nodeRect, node.rotate);
				}

				if (isRectsIntersecting(nodeRect, rect)) {
					nodeIdsInRect.add(node.id);
				}
			});

			setSelectionRect(rect);
			setVisualSelectedNodes(nodeIdsInRect);
			nodeIdsInRectRef.current = nodeIdsInRect;
		});
	});

	const handlePointerUp = useStableCallback((event: PointerEvent) => {
		onPointerUp(event, () => {
			setSelectionRect(null)
			clearVisualSelectedNodes();
			selectNodes(
				Array.from(nodeIdsInRectRef.current),
				event.ctrlKey || event.shiftKey ? 'add' : 'replace'
			);

			nodeIdsInRectRef.current.clear();
		});
	});

	React.useEffect(() => {
		document.addEventListener('pointermove', handlePointerMove);
		document.addEventListener('pointerup', handlePointerUp);

		return () => {
			document.removeEventListener('pointermove', handlePointerMove);
			document.removeEventListener('pointerup', handlePointerUp);
		};
	}, [handlePointerMove, handlePointerUp]);

	return { onSelectionRectPointerDown: handlePointeDown };
}

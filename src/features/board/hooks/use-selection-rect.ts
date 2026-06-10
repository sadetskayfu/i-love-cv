import * as React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { boardActions, boardState } from '../model';
import { hasMinDragDistance, positionOnScreenToCanvas } from '../helpers';
import { useStableCallback } from '@/shared/hooks/use-stable-callback';
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

function createRectFromPositions(startPos: Position, currentPos: Position): Rect {
	let x = Math.min(startPos.x, currentPos.x);
	let y = Math.min(startPos.y, currentPos.y);
	let width = Math.abs(currentPos.x - startPos.x);
	let height = Math.abs(currentPos.y - startPos.y);

	return {
		position: {
			x,
			y,
		},
		size: {
			width,
			height,
		},
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
	const [windowPosition] = useAtom(boardState.windowPositionAtom);
	const [mode] = useAtom(boardState.modeAtom);

	const [isSelection, setIsSelection] = React.useState<boolean>(false);
	const [isRealSelection, setIsRealSelection] = useAtom(boardState.isSelectionRectAtom);

	const nodeIdsInRectRef = React.useRef(new Set<string>());
	const startPositionRef = React.useRef<Position | null>(null);

	const setSelectionRect = useSetAtom(boardState.selectionRectAtom);
	const setVisualSelectNodes = useSetAtom(boardState.visualSelectedNodeIdsAtom);
	const selectNodes = useSetAtom(boardActions.selectNodes);

	const handlePointerDown = React.useCallback(
		(event: React.PointerEvent) => {
			if (!canvasRect || event.button !== 0 || mode === 'idle') {
				return;
			}

			setSelectionRect(null);

			const selection = window.getSelection();

			if (selection) {
				selection.removeAllRanges();
			}

			const startPosition = positionOnScreenToCanvas(
				{ x: event.clientX, y: event.clientY },
				windowPosition,
				canvasRect
			);

			startPositionRef.current = startPosition;
			setIsSelection(true);
		},
		[canvasRect, windowPosition, mode]
	);

	const handlePointerMove = useStableCallback((event: PointerEvent) => {
		const startPos = startPositionRef.current;

		if (!canvasRect || !isSelection || !startPos) {
			return;
		}

		const currentPos = positionOnScreenToCanvas(
			{ x: event.clientX, y: event.clientY },
			windowPosition,
			canvasRect
		);

		if (!isRealSelection) {
			if (hasMinDragDistance(startPos, currentPos)) {
				setIsRealSelection(true);
			}
			return;
		}

		const selectionRect = createRectFromPositions(startPos, currentPos);

		setSelectionRect(selectionRect);

		if (mode === 'selection') {
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

				if (isRectsIntersecting(nodeRect, selectionRect)) {
					nodeIdsInRect.add(node.id);
				}
			});

			setVisualSelectNodes(nodeIdsInRect);
			nodeIdsInRectRef.current = nodeIdsInRect;
		}
	});

	const handlePointerUp = useStableCallback((event: PointerEvent) => {
		if (event.button !== 0) {
			return;
		}

		if (mode === 'selection' && isRealSelection) {
			setVisualSelectNodes(new Set());
			selectNodes(
				Array.from(nodeIdsInRectRef.current),
				event.ctrlKey || event.shiftKey ? 'add' : 'replace'
			);

			nodeIdsInRectRef.current.clear();
		}

		startPositionRef.current = null;
		setIsRealSelection(false);
		setIsSelection(false);
	});

	React.useEffect(() => {
		if (isSelection) {
			document.addEventListener('pointermove', handlePointerMove);
			document.addEventListener('pointerup', handlePointerUp);

			return () => {
				document.removeEventListener('pointermove', handlePointerMove);
				document.removeEventListener('pointerup', handlePointerUp);
			};
		}
	}, [handlePointerMove, handlePointerUp, isSelection]);

	return { onPointerDown: handlePointerDown };
}

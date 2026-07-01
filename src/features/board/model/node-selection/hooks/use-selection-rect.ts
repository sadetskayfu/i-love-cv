import * as React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import {
	createRectFromPositions,
	hasMinDragDistance,
	positionOnScreenToCanvas,
} from '@/features/board/helpers';
import { useStableCallback } from '@/shared/hooks/use-stable-callback';
import { boardStore } from '../../board';
import { nodeManagerStore } from '../../node-manager/store';
import { windowStore } from '../../window';
import { nodeSelectionStore } from '../store';
import type { Position, Rect } from '../../types';
import type { ElementRect } from '@/shared/hooks/use-element-rect';

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
	const [nodes] = useAtom(nodeManagerStore.nodesAtom);
	const [domNodes] = useAtom(nodeManagerStore.domNodesAtom);
	const [mode] = useAtom(boardStore.modeAtom);
	const [isSelection, setIsSelection] = React.useState<boolean>(false);
	const [isRealSelection, setIsRealSelection] = useAtom(nodeSelectionStore.isSelectionRectAtom);
	const [windowPosition] = useAtom(windowStore.windowPositionAtom);
	const [zoom] = useAtom(windowStore.zoomAtom);
	const setSelectionRect = useSetAtom(nodeSelectionStore.selectionRectAtom);
	const setCandidateNodes = useSetAtom(nodeSelectionStore.candidateNodeIdsAtom);
	const clearCandidateNodes = useSetAtom(nodeSelectionStore.clearCandidateNodes);
	const selectNodes = useSetAtom(nodeSelectionStore.selectNodes);

	const startCursorPositionRef = React.useRef<Position | null>(null);
	const nodeIdsInRectRef = React.useRef(new Set<string>());

	const handlePointeDown = useStableCallback((event: React.PointerEvent) => {
		if (!canvasRect || event.button !== 0 || mode !== 'selection') {
			return;
		}

		const selection = window.getSelection();

		if (selection) {
			selection.removeAllRanges();
		}

		const startCursorPosition = positionOnScreenToCanvas(
			{ x: event.clientX, y: event.clientY },
			windowPosition,
			zoom,
			canvasRect
		);

		startCursorPositionRef.current = startCursorPosition;
		setIsSelection(true);
	});

	const handlePointerMove = useStableCallback((event: PointerEvent) => {
		const startCursorPos = startCursorPositionRef.current;

		if (!canvasRect || !isSelection || !startCursorPos) {
			return;
		}

		const currentCursorPos = positionOnScreenToCanvas(
			{ x: event.clientX, y: event.clientY },
			windowPosition,
			zoom,
			canvasRect
		);

		if (!isRealSelection) {
			let needContinue = false;

			if (hasMinDragDistance(startCursorPos, currentCursorPos)) {
				setIsRealSelection(true);
			}

			if (!needContinue) {
				return;
			}
		}

		const rect = createRectFromPositions(startCursorPos, currentCursorPos);
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
		setCandidateNodes(nodeIdsInRect);
		nodeIdsInRectRef.current = nodeIdsInRect;
	});

	const handlePointerUp = useStableCallback((event: PointerEvent) => {
		selectNodes(
			Array.from(nodeIdsInRectRef.current),
			event.ctrlKey || event.shiftKey ? 'add' : 'replace'
		);

		startCursorPositionRef.current = null;
		nodeIdsInRectRef.current.clear();
		setIsRealSelection(false);
		setIsSelection(false);
		setSelectionRect(null);
		clearCandidateNodes();
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

	return { handleSelectionRectPointerDown: handlePointeDown };
}

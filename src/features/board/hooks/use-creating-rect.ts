import * as React from 'react';
import { useRect } from './use-rect';
import { useStableCallback } from '@/shared/hooks/use-stable-callback';
import { useAtom, useSetAtom } from 'jotai';
import { boardState } from '../model';
import type { ElementRect } from '@/shared/hooks/use-element-rect';

export function useCreatingRect(canvasRect: ElementRect | null) {
	const [mode] = useAtom(boardState.modeAtom);
	const setCreatingRect = useSetAtom(boardState.creatingRectAtom);

	const { onPointerDown, onPointerMove, onPointerUp } = useRect(canvasRect);

	const handlePointeDown = useStableCallback((event: React.PointerEvent) => {
		if (mode !== 'idle' && mode !== 'selection') {
			onPointerDown(event, () => setCreatingRect(null));
		}
	});

	const handlePointerMove = useStableCallback((event: PointerEvent) => {
		onPointerMove(event, (_, rect) => setCreatingRect(rect));
	});

	React.useEffect(() => {
		document.addEventListener('pointermove', handlePointerMove);
		document.addEventListener('pointerup', onPointerUp);

		return () => {
			document.removeEventListener('pointermove', handlePointerMove);
			document.removeEventListener('pointerup', onPointerUp);
		};
	}, [handlePointerMove, onPointerUp]);

	return { onCreatingRectPointerDown: handlePointeDown };
}

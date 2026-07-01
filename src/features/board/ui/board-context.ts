import * as React from 'react';
import { useContext } from '@/shared/hooks/use-context';
import type { ElementRect } from '@/shared/hooks/use-element-rect';

export type BoardContext = {
	rootRef: React.RefObject<HTMLDivElement | null>;
	customizationToolbarPortalTargetRef: React.RefObject<HTMLDivElement | null>;
	canvasRect: ElementRect | null;
};

export const BoardContext = React.createContext<BoardContext | undefined>(undefined);

export function useBoardContext() {
	return useContext(BoardContext, 'BoardContext is missing');
}

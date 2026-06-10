import { useAtom } from 'jotai';
import { Button, ButtonProvider } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icons';
import { boardSelectors, boardState } from '../../model';
import { getZoomLabel } from '../../helpers';
import { Tooltip, TooltipGroup } from '@/shared/ui/tooltip';
import { useWindowZoom } from '../../hooks/use-window-zoom';
import { useBoardContext } from '../board-context';

export function ZoomControlPanel() {
	const [windowPosition] = useAtom(boardState.windowPositionAtom);
	const [isMinZoom] = useAtom(boardSelectors.isMinZoom);
	const [isMaxZoom] = useAtom(boardSelectors.isMaxZoom);
	const { canvasRect } = useBoardContext();
	const { handleZoomIn, handleZoomOut, handleZoomReset } = useWindowZoom(canvasRect);

	const zoomLabel = getZoomLabel(windowPosition.zoom);

	return (
		<div className="my-shadow-paper fixed right-2 bottom-2 flex gap-x-1 rounded-md bg-white p-1">
			<ButtonProvider radius="2">
				<TooltipGroup>
					<Tooltip content="Zoom out">
						<Button
							onClick={handleZoomOut}
							aria-label="Zoom out"
							iconButton
							focusableWhenDisabled
							disabled={isMinZoom}
						>
							<Icon.Minus />
						</Button>
					</Tooltip>
					<Tooltip content="Reset zoom">
						<Button
							onClick={handleZoomReset}
							className="w-16"
							aria-label={`Reset zoom. Current zoom: ${zoomLabel}`}
						>
							{zoomLabel}
						</Button>
					</Tooltip>
					<Tooltip content="Zoom in">
						<Button
							onClick={handleZoomIn}
							aria-label="Zoom in"
							iconButton
							focusableWhenDisabled
							disabled={isMaxZoom}
						>
							<Icon.Plus />
						</Button>
					</Tooltip>
				</TooltipGroup>
			</ButtonProvider>
		</div>
	);
}

import { useAtom } from 'jotai';
import { Button, ButtonProvider } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icons';
import { Tooltip, TooltipGroup } from '@/shared/ui/tooltip';
import { getZoomLabel, useWindowZoom, windowStore } from '../../model/window';
import { useBoardContext } from '../board-context';

export function ZoomControlPanel() {
	const [zoom] = useAtom(windowStore.zoomAtom);
	const [isMinZoom] = useAtom(windowStore.isMinZoom);
	const [isMaxZoom] = useAtom(windowStore.isMaxZoom);
	const { canvasRect } = useBoardContext();
	const { handleZoomIn, handleZoomOut, handleZoomReset } = useWindowZoom(canvasRect);

	const zoomLabel = getZoomLabel(zoom);

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

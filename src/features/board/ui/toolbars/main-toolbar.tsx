import { useAtom, useSetAtom } from 'jotai';
import { ButtonProvider } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icons';
import { Key } from '@/shared/ui/key';
import { ToggleButton } from '@/shared/ui/toggle-button';
import { Tooltip, TooltipGroup } from '@/shared/ui/tooltip';
import { boardStore } from '../../model/board';

export function MainToolbar() {
	const [mode] = useAtom(boardStore.modeAtom);
	const toggleMode = useSetAtom(boardStore.toggleMode);

	return (
		<div className="my-shadow-paper flex flex-col gap-y-1 rounded-md bg-white p-1">
			<ButtonProvider radius="2" iconButton>
				<TooltipGroup>
					<Tooltip
						className="flex items-center gap-x-1 pr-1"
						content={
							<>
								Select <Key content="S" />
							</>
						}
						side="right"
					>
						<ToggleButton
							onClick={() => toggleMode('selection')}
							pressed={mode === 'selection'}
							aria-label="Select. Use the S key"
						>
							<Icon.MousePointer />
						</ToggleButton>
					</Tooltip>
					<Tooltip
						className="flex items-center gap-x-1 pr-1"
						content={
							<>
								Text <Key content="T" />
							</>
						}
						side="right"
					>
						<ToggleButton
							onClick={() => toggleMode('add-text-node')}
							pressed={mode === 'add-text-node'}
							aria-label="Text. Use the T key"
						>
							<Icon.Type />
						</ToggleButton>
					</Tooltip>
					<Tooltip
						className="flex items-center gap-x-1 pr-1"
						content={
							<>
								Shape <Key content="F" />
							</>
						}
						side="right"
					>
						<ToggleButton
							onClick={() => toggleMode('add-shape-node')}
							pressed={mode === 'add-shape-node'}
							aria-label="Shape. Use the F key"
						>
							<Icon.Square />
						</ToggleButton>
					</Tooltip>
				</TooltipGroup>
			</ButtonProvider>
		</div>
	);
}

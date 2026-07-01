import { useAtom, useSetAtom } from 'jotai';
import { Button, ButtonProvider } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icons';
import { Key } from '@/shared/ui/key';
import { Tooltip, TooltipGroup } from '@/shared/ui/tooltip';
import { historyStore } from '../../model/history';

export function HistoryToolbar() {
	const [hasUndo] = useAtom(historyStore.hasUndo);
	const [hasRedo] = useAtom(historyStore.hasRedo);
	const undo = useSetAtom(historyStore.undo);
	const redo = useSetAtom(historyStore.redo);

	return (
		<div className="my-shadow-paper flex flex-col gap-y-1 rounded-md bg-white p-1">
			<ButtonProvider radius="2" variant="clear" iconButton>
				<TooltipGroup>
					<Tooltip
						className="flex items-center gap-x-1 pr-1"
						content={
							<>
								Undo <Key content="Ctrl + Z" />
							</>
						}
						side="right"
					>
						<Button aria-label="Undo" onClick={undo} disabled={!hasUndo} focusableWhenDisabled>
							<Icon.Undo />
						</Button>
					</Tooltip>
					<Tooltip
						className="flex items-center gap-x-1 pr-1"
						content={
							<>
								Redo <Key content="Ctrl + Shift + Z" />
							</>
						}
						side="right"
					>
						<Button aria-label="Redo" onClick={redo} disabled={!hasRedo} focusableWhenDisabled>
							<Icon.Redo />
						</Button>
					</Tooltip>
				</TooltipGroup>
			</ButtonProvider>
		</div>
	);
}

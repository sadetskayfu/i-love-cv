import { ButtonProvider, Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icons';
import { Tooltip, TooltipGroup } from '@/shared/ui/tooltip';
import { Key } from '@/shared/ui/key';
import { useAtom, useSetAtom } from 'jotai';
import { boardActions, boardSelectors } from '../../model';

export function HistoryToolbar() {
	const [hasUndo] = useAtom(boardSelectors.hasUndo);
	const [hasRedo] = useAtom(boardSelectors.hasRedo);
	const undo = useSetAtom(boardActions.undo);
	const redo = useSetAtom(boardActions.redo);

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

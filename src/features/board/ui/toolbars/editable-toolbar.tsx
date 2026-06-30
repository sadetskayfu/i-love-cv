import * as React from 'react';
import { useTranslation } from '@/shared/translation';
import { Editable } from '@/shared/ui/editable';
import { Tooltip, TooltipGroup } from '@/shared/ui/tooltip';
import { Key } from '@/shared/ui/key';
import { Button, ButtonProvider } from '@/shared/ui/button';
import { ColorButton } from '@/shared/ui/color-button';
import { useAtom } from 'jotai';
import { boardSelectors } from '../../model';

export function EditableToolbar() {
	const { fontColors, backgroundColors } = Editable.useContext();
	const { t } = useTranslation();
	const [zoom] = useAtom(boardSelectors.windowZoom);

	return (
		<div className="flex rounded-md bg-white p-1">
			<ButtonProvider radius='1' size='4'>
				<div className="flex">
					<TooltipGroup>
						{Editable.TEXT_MARK.map(format => (
							<Tooltip
								key={format}
								className="flex items-center gap-x-1 pr-1"
								content={
									<React.Fragment>
										{t(Editable.BUTTON_LABELS[format])}{' '}
										<Key content={Editable.HOTKEYS[format].keyLabel} />
									</React.Fragment>
								}
							>
								<Editable.MarkButton
									format={format}
									render={(props, state) => (
										<Button
											variant={state.active ? 'ghost' : 'clear'}
											color={state.active ? 'accent' : 'secondary'}
											{...props}
										/>
									)}
								/>
							</Tooltip>
						))}
					</TooltipGroup>
				</div>
				<div className="flex">
					<TooltipGroup>
						{Editable.TEXT_ALIGN.map(format => (
							<Tooltip key={format} content={t(Editable.BUTTON_LABELS[format])}>
								<Editable.TextAlignButton
									format={format}
									render={(props, state) => (
										<Button
											variant={state.active ? 'ghost' : 'clear'}
											color={state.active ? 'accent' : 'secondary'}
											{...props}
										/>
									)}
								/>
							</Tooltip>
						))}
					</TooltipGroup>
				</div>
				<div className="flex">
					<TooltipGroup>
						{Editable.LIST.map(format => (
							<Tooltip key={format} content={t(Editable.BUTTON_LABELS[format])}>
								<Editable.BlockTypeButton
									format={format}
									render={(props, state) => (
										<Button
											variant={state.active ? 'ghost' : 'clear'}
											color={state.active ? 'accent' : 'secondary'}
											{...props}
										/>
									)}
								/>
							</Tooltip>
						))}
					</TooltipGroup>
				</div>
				<div className="flex">
					{fontColors.map((color, index) => (
						<Editable.ColorButton
							key={index}
							format="font"
							colorValue={index + 1}
							colorHex={color}
							render={(props, state) => (
								<ColorButton active={state.active} color={state.color} {...props} />
							)}
						/>
					))}
				</div>
				<div className="flex">
					{backgroundColors.map((color, index) => (
						<Editable.ColorButton
							key={index}
							format="backgroud"
							colorValue={index + 1}
							colorHex={color}
							render={(props, state) => (
								<ColorButton active={state.active} color={state.color} {...props} />
							)}
						/>
					))}
				</div>
			</ButtonProvider>
		</div>
	);
}

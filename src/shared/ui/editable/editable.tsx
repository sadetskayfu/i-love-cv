import * as React from 'react';
import { createEditor } from 'slate';
import { Slate, Editable as SlateEditable, withReact } from 'slate-react';
import { cn } from 'tailwind-variants';
import { EditableContext } from './editable-context';
import { EditableElement } from './editable-element';
import { EditableLeaf } from './editable-leaf';
import type { Descendant } from 'slate';
import type { RenderElementProps, RenderLeafProps } from 'slate-react';

export function Editable({
	children,
	ref,
	className,
	initialValue,
	fontColors,
	backgroundColors,
	readonly,
}: Editable.Props) {
	const editor = React.useMemo(() => withReact(createEditor()), []);

	const renderLeaf = React.useCallback((props: RenderLeafProps) => <EditableLeaf {...props} />, []);
	const renderElement = React.useCallback(
		(props: RenderElementProps) => <EditableElement {...props} />,
		[]
	);
	const contextValue: EditableContext = React.useMemo(
		() => ({ fontColors, backgroundColors }),
		[fontColors, backgroundColors]
	);

	return (
		<Slate editor={editor} initialValue={initialValue}>
			<EditableContext.Provider value={contextValue}>
				{children}
				<SlateEditable
					ref={ref}
					className={cn('h-full w-full outline-hidden', { 'cursor-default': readonly }, className)}
					renderLeaf={renderLeaf}
					renderElement={renderElement}
					readOnly={readonly}
					onKeyDown={event => {
						event.stopPropagation();
					}}
				/>
			</EditableContext.Provider>
		</Slate>
	);
}

export namespace Editable {
	export type Props = {
		children?: React.ReactNode;
		ref?: React.Ref<HTMLDivElement>;
		className?: string;
		fontColors: string[];
		backgroundColors: (string | undefined)[];
		readonly?: boolean;
		initialValue: Descendant[];
	};
}

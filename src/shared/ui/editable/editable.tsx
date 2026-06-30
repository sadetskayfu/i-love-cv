import * as React from 'react';
import {
	Slate,
	Editable as SlateEditable,
	withReact,
	type RenderElementProps,
	type RenderLeafProps,
} from 'slate-react';
import { createEditor, type Descendant } from 'slate';
import { EditableLeaf } from './editable-leaf';
import { EditableElement } from './editable-element';
import { EditableContext } from './editable-context';
import { cn } from 'tailwind-variants';

export function Editable({ children, ref, className, initialValue, fontColors, backgroundColors, readonly }: Editable.Props) {
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
		<Slate
			editor={editor}
			initialValue={initialValue}
		>
			<EditableContext.Provider value={contextValue}>
				{children}
				<SlateEditable
					ref={ref}
					className={cn("h-full w-full outline-hidden", {'cursor-default': readonly}, className)}
					renderLeaf={renderLeaf}
					renderElement={renderElement}
					readOnly={readonly}
					onKeyDown={event => {
						event.stopPropagation()
					}}
				/>
			</EditableContext.Provider>
		</Slate>
	);
}

export namespace Editable {
	export type Props = {
		children?: React.ReactNode;
		ref?: React.Ref<HTMLDivElement>
		className?: string
		fontColors: string[];
		backgroundColors: (string | undefined)[];
		readonly?: boolean
		initialValue: Descendant[]
	};
}

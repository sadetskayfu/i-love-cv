export function Key({ content }: Key.Props) {
	return (
		<span className="flex h-6 min-w-6 items-center justify-center rounded-xs bg-gray-600 px-1 text-white select-none">
			{content}
		</span>
	);
}

export namespace Key {
	export interface Props {
		content: string;
	}
}

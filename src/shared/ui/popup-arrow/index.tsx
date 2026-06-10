export function PopupArrow({ style, ...otherProps }: React.ComponentProps<'div'>) {
	return (
		<div
			className="h-(--popup-arrow-size) w-(--popup-arrow-size) bg-inherit [clip-path:polygon(0_0,0_100%,100%_100%)] data-[side=bottom]:-top-[calc(var(--popup-arrow-size)/2)] data-[side=bottom]:rotate-[-225deg] data-[side=left]:-right-[calc(var(--popup-arrow-size)/2)] data-[side=left]:rotate-[-135deg] data-[side=right]:-left-[calc(var(--popup-arrow-size)/2)] data-[side=right]:rotate-[-315deg] data-[side=top]:-bottom-[calc(var(--popup-arrow-size)/2)] data-[side=top]:-rotate-45"
			style={{ ...style, ...{ '--popup-arrow-size': '10px' as React.CSSProperties } }}
			{...otherProps}
		/>
	);
}

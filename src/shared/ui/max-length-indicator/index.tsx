export function MaxLengthIndicator({ value, maxLength }: { value: string; maxLength: number }) {
	return <span className="ml-auto text-sm text-neutral-500">{`${value.length}/${maxLength}`}</span>;
}

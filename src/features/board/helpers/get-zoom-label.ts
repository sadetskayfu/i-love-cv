export function getZoomLabel(zoom: number) {
	const percent = Math.round(zoom * 100);
	return `${percent}%`;
}

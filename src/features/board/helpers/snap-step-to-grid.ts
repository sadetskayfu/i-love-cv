export function snapStepToGrid(zoom: number) {
    return zoom <= 0.6 ? 20 : 10
}
import MoveableComponent from 'react-moveable';
import { useAtom, useSetAtom } from 'jotai';
import { boardActions, boardSelectors, boardState } from '../model';
import { isNumber } from '@/shared/helpers';
import type { NodeType } from '../model/types';

type ParsedStyles = {
	width: number | undefined;
	height: number | undefined;
	x: number | undefined;
	y: number | undefined;
	rotate: number | undefined;
};

function parseStyles(styles: {
	width?: string;
	height?: string;
	transform?: string;
}): ParsedStyles {
	const parsedStyles: ParsedStyles = {
		width: undefined,
		height: undefined,
		x: undefined,
		y: undefined,
		rotate: undefined,
	};

	if (styles.width) {
		parsedStyles.width = parseFloat(styles.width);
	}
	if (styles.height) {
		parsedStyles.height = parseFloat(styles.height);
	}

	if (styles.transform) {
		const translateMatch = styles.transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
		const rotateMatch = styles.transform.match(/rotate\(([^)]+)\)/);

		if (translateMatch) {
			parsedStyles.x = parseFloat(translateMatch[1].replace('px', ''));
			parsedStyles.y = parseFloat(translateMatch[2].replace('px', ''));
		}

		if (rotateMatch) {
			parsedStyles.rotate = parseFloat(rotateMatch[1].replace('deg', ''));
		}
	}

	return parsedStyles;
}

export function Moveable() {
	const [nodes] = useAtom(boardState.nodesAtom);
	const [selectedNodes] = useAtom(boardSelectors.selectedNodes);
	const [unselectedNodes] = useAtom(boardSelectors.unselectedNodes);
	const [selectedNodeIds] = useAtom(boardState.selectedNodeIdsAtom)
	const [nodeIdInEdit, setNodeIdInEdit] = useAtom(boardState.nodeIdInEditAtom)
	const [windowPosition] = useAtom(boardState.windowPositionAtom);
	const [snapToGrid] = useAtom(boardState.snapToGrid)
	const [snapToObject] = useAtom(boardState.snapToObject)
	const setSelectedNodeIds = useSetAtom(boardState.selectedNodeIdsAtom)
	const updateNodes = useSetAtom(boardActions.updateNodes);
	const setIsNodeDragging = useSetAtom(boardState.isNodesDraggingAtom);

	const disabledDraggable = Boolean(selectedNodeIds.size === 1 && nodeIdInEdit && selectedNodeIds.has(nodeIdInEdit))

	return (
		<MoveableComponent
			target={selectedNodes}
			elementGuidelines={snapToObject ? unselectedNodes : undefined}
			snappable={snapToObject? true : false}
			draggable={!disabledDraggable}
			resizable={true}
			keepRatio={false}
			rotatable={true}
			renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
			throttleDrag={snapToGrid ? (windowPosition.zoom <= 0.6 ? 10 : 5) : 0}
			throttleResize={snapToGrid ? (windowPosition.zoom <= 0.6 ? 10 : 5) : 0}
			zoom={1 / windowPosition.zoom}
			
			
			
			snapRotationDegrees={[0, 90, 180, 270]}
			snapDirections={{
				top: true,
				left: true,
				bottom: true,
				right: true,
				center: true,
				middle: true,
			}}
			elementSnapDirections={{
				top: true,
				left: true,
				bottom: true,
				right: true,
				center: true,
				middle: true,
			}}
			
			onRenderStart={() => {
				setIsNodeDragging(true);
			}}
			onRenderEnd={() => {
				setIsNodeDragging(false);
			}}
			onRenderGroupStart={() => {
				setIsNodeDragging(true);
			}}
			onRenderGroupEnd={() => {
				setIsNodeDragging(false);
			}}
			onDrag={event => {
				console.log(event);
				event.target.style.transform = event.style.transform;
			}}
			onDragEnd={event => {
				const nodeId = event.target.dataset.id;

				if (!nodeId) {
					return;
				}

				if (!event.isDrag) {
					setNodeIdInEdit(nodeId)
					return
				}

				const node = nodes.find(n => n.id === nodeId);

				if (!node) {
					return;
				}

				const style = event.lastEvent?.style;

				if (!style) {
					return;
				}

				const updatedStyles = parseStyles(style);
				let needUpdate: boolean = false;

				if (
					(isNumber(updatedStyles.x) && updatedStyles.x !== node.position.x) ||
					(isNumber(updatedStyles.y) && updatedStyles.y !== node.position.y)
				) {
					needUpdate = true;
				}

				if (needUpdate) {
					updateNodes(prev =>
						prev.map(node => {
							if (node.id !== nodeId) {
								return node;
							}

							return {
								...node,
								position: {
									x: updatedStyles.x ?? node.position.x,
									y: updatedStyles.y ?? node.position.y,
								},
							};
						})
					);
				}
			}}
			onResize={event => {
				const nodeType = event.target.dataset.type as NodeType | undefined;

				if (nodeType) {
					if (nodeType === 'shape') {
						event.target.style.width = event.style.width;
						event.target.style.height = event.style.height;
					}

					event.target.style.transform = event.style.transform;
				}
			}}
			onResizeEnd={event => {
				const nodeId = event.target.dataset.id;

				if (!nodeId) {
					return;
				}

				const node = nodes.find(n => n.id === nodeId);

				if (!node) {
					return;
				}

				const style = event.lastEvent?.style;

				if (!style) {
					return;
				}

				const updatedStyles = parseStyles(style);
				let needUpdate: boolean = false;

				if (
					(isNumber(updatedStyles.x) && updatedStyles.x !== node.position.x) ||
					(isNumber(updatedStyles.y) && updatedStyles.y !== node.position.y)
				) {
					needUpdate = true;
				}

				if (node.type === 'shape' && !needUpdate) {
					if (
						(isNumber(updatedStyles.width) && updatedStyles.width !== node.dimensions.width) ||
						(isNumber(updatedStyles.height) && updatedStyles.height !== node.dimensions.height)
					) {
						needUpdate = true;
					}
				}

				if (needUpdate) {
					updateNodes(prev =>
						prev.map(node => {
							if (node.id !== nodeId) {
								return node;
							}

							if (node.type === 'shape') {
								return {
									...node,
									position: {
										x: updatedStyles.x ?? node.position.x,
										y: updatedStyles.y ?? node.position.y,
									},
									dimensions: {
										width: updatedStyles.width ?? node.dimensions.width,
										height: updatedStyles.height ?? node.dimensions.height,
									},
									rotate: updatedStyles.rotate ?? node.rotate,
								};
							} else if (node.type === 'text') {
								return node;
							}

							return node;
						})
					);
				}
			}}
			onRotate={event => {
				event.target.style.transform = event.style.transform;
			}}
			onRotateEnd={event => {
				const nodeId = event.target.dataset.id;

				if (!nodeId) {
					return;
				}

				const node = nodes.find(n => n.id === nodeId);

				if (!node) {
					return;
				}

				const style = event.lastEvent?.style;

				if (!style) {
					return;
				}

				const updatedStyles = parseStyles(style);
				let needUpdate: boolean = false;

				if (isNumber(updatedStyles.rotate) && updatedStyles.rotate !== node.rotate) {
					needUpdate = true;
				}

				if (needUpdate) {
					updateNodes(prev =>
						prev.map(node => {
							if (node.id !== nodeId) {
								return node;
							}

							return {
								...node,
								rotate: updatedStyles.rotate ?? node.rotate,
								position: {
									x: updatedStyles.x ?? node.position.x,
									y: updatedStyles.y ?? node.position.y,
								},
							};
						})
					);
				}
			}}
			onDragGroup={({ events }) => {
				events.forEach(event => {
					event.target.style.transform = event.style.transform;
				});
			}}
			onDragGroupEnd={({ events }) => {
				const nodeStyles: Record<string, ParsedStyles> = {};
				let needUpdate: boolean = false;

				events.forEach(event => {
					if (!event.isDrag) {
						const nodeId = event.inputEvent.target.dataset['id']
						setSelectedNodeIds(new Set(nodeId ? [nodeId] : []))
						console.log('drag end')
					}

					const nodeId = event.target.dataset.id;
					const style = event.lastEvent?.style;

					if (nodeId && style) {
						nodeStyles[nodeId] = parseStyles(style);
					}
				});

				Object.keys(nodeStyles).forEach(nodeId => {
					const node = nodes.filter(node => node.id === nodeId)[0];

					if (!node) {
						return;
					}

					const updatedStyles = nodeStyles[nodeId];

					if (
						(isNumber(updatedStyles.x) && updatedStyles.x !== node.position.x) ||
						(isNumber(updatedStyles.y) && updatedStyles.y !== node.position.y)
					) {
						needUpdate = true;
						return;
					}
				});

				if (needUpdate) {
					updateNodes(prev =>
						prev.map(node => {
							const updatedStyles = nodeStyles[node.id];

							if (updatedStyles) {
								return {
									...node,
									position: {
										x: updatedStyles.x ?? node.position.x,
										y: updatedStyles.y ?? node.position.y,
									},
								};
							}

							return node;
						})
					);
				}
			}}
			onResizeGroup={({ events }) => {
				events.forEach(event => {
					const nodeType = event.target.dataset.type as NodeType | undefined;

					if (nodeType) {
						if (nodeType === 'shape') {
							event.target.style.width = event.style.width;
							event.target.style.height = event.style.height;
						}
					}

					event.target.style.transform = event.style.transform;
				});
			}}
			onResizeGroupEnd={({ events }) => {
				const nodeStyles: Record<string, ParsedStyles> = {};
				let needUpdate: boolean = false;

				events.forEach(event => {
					const nodeId = event.target.dataset.id;
					const style = event.lastEvent?.style;

					if (nodeId && style) {
						nodeStyles[nodeId] = parseStyles(style);
					}
				});

				Object.keys(nodeStyles).forEach(nodeId => {
					const node = nodes.filter(node => node.id === nodeId)[0];

					if (!node) {
						return;
					}

					const updatedStyles = nodeStyles[nodeId];

					if (
						(isNumber(updatedStyles.x) && updatedStyles.x !== node.position.x) ||
						(isNumber(updatedStyles.y) && updatedStyles.y !== node.position.y)
					) {
						needUpdate = true;
						return;
					}

					if (node.type === 'shape') {
						if (
							(isNumber(updatedStyles.width) && updatedStyles.width !== node.dimensions.width) ||
							(isNumber(updatedStyles.height) && updatedStyles.height !== node.dimensions.height)
						) {
							needUpdate = true;
							return;
						}
					}
				});

				if (needUpdate) {
					updateNodes(prev =>
						prev.map(node => {
							const updatedStyles = nodeStyles[node.id];

							if (updatedStyles) {
								if (node.type === 'shape') {
									return {
										...node,
										position: {
											x: updatedStyles.x ?? node.position.x,
											y: updatedStyles.y ?? node.position.y,
										},
										dimensions: {
											width: updatedStyles.width ?? node.dimensions.width,
											height: updatedStyles.height ?? node.dimensions.height,
										},
									};
								} else if (node.type === 'text') {
									return node;
								}
							}

							return node;
						})
					);
				}
			}}
			onRotateGroup={({ events }) => {
				events.forEach(event => {
					event.target.style.transform = event.style.transform;
				});
			}}
			onRotateGroupEnd={({ events }) => {
				const nodeStyles: Record<string, ParsedStyles> = {};
				let needUpdate: boolean = false;

				events.forEach(event => {
					const nodeId = event.target.dataset.id;
					const style = event.lastEvent?.style;

					if (nodeId && style) {
						nodeStyles[nodeId] = parseStyles(style);
					}

					console.log(event);
				});

				Object.keys(nodeStyles).forEach(nodeId => {
					const node = nodes.filter(node => node.id === nodeId)[0];

					if (!node) {
						return;
					}

					const updatedStyles = nodeStyles[nodeId];

					if (isNumber(updatedStyles.rotate) && updatedStyles.rotate !== node.rotate) {
						needUpdate = true;
						return;
					}
				});

				if (needUpdate) {
					updateNodes(prev =>
						prev.map(node => {
							const updatedStyles = nodeStyles[node.id];

							if (updatedStyles) {
								return {
									...node,
									rotate: updatedStyles.rotate ?? node.rotate,
									position: {
										x: updatedStyles.x ?? node.position.x,
										y: updatedStyles.y ?? node.position.y,
									},
								};
							}
							return node;
						})
					);
				}
			}}
		/>
	);
}

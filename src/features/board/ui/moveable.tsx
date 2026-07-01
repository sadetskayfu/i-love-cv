import { useAtom, useSetAtom } from 'jotai';
import MoveableComponent from 'react-moveable';
import { isNumber } from '@/shared/helpers';
import { boardStore } from '../model/board';
import { nodeCustomizationStore } from '../model/node-customization';
import { nodeDraggingStore } from '../model/node-dragging';
import { nodeManagerStore } from '../model/node-manager';
import { nodeSelectionStore } from '../model/node-selection';
import { windowStore } from '../model/window';
import type { NodeType } from '../model/types';
import type { MoveableManagerInterface } from 'react-moveable';

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

const DimensionViewable = {
	name: 'dimensionViewable',
	render(moveable: MoveableManagerInterface) {
		const rect = moveable.getRect();
		const zoom = moveable.props.zoom ?? 1;
		// Add key (required)
		// Add class prefix moveable-(required)
		console.log(`moveable props: ${moveable.props.zoom}`);
		return (
			<div
				key="dimension-viewer"
				className=""
				style={{
					position: 'absolute',
					left: `${rect.width / 2}px`,
					top: `${rect.height + 20}px`,
					background: '#4af',
					borderRadius: '2px',
					padding: '2px 4px',
					color: 'white',
					whiteSpace: 'nowrap',
					fontWeight: 'bold',
					willChange: 'transform',
					transform: `translate(-50%, 0px) scale(${1 * zoom})`,
					transformOrigin: 'top',
				}}
			>
				{Math.round(rect.offsetWidth)} x {Math.round(rect.offsetHeight)}
			</div>
		);
	},
};

export function Moveable() {
	const [nodes] = useAtom(nodeManagerStore.nodesAtom);
	const [selectedNodes] = useAtom(nodeSelectionStore.selectedDomNodes);
	const [unselectedNodes] = useAtom(nodeSelectionStore.unselectedDomNodes);
	const [selectedNodeIds] = useAtom(nodeSelectionStore.selectedNodeIdsAtom);
	const [nodeIdInEdit, setNodeIdInEdit] = useAtom(nodeCustomizationStore.nodeIdInEditAtom);
	const [zoom] = useAtom(windowStore.zoomAtom);
	const [snapToGrid] = useAtom(boardStore.snapToGrid);
	const [snapToObject] = useAtom(boardStore.snapToObject);
	const setSelectedNodeIds = useSetAtom(nodeSelectionStore.selectedNodeIdsAtom);
	const updateNodes = useSetAtom(nodeManagerStore.updateNodes);
	const setIsNodeDragging = useSetAtom(nodeDraggingStore.isNodesDraggingAtom);

	const disabledDraggable = Boolean(
		selectedNodeIds.size === 1 && nodeIdInEdit && selectedNodeIds.has(nodeIdInEdit)
	);

	return (
		<MoveableComponent
			target={selectedNodes}
			ables={[DimensionViewable]}
			props={{
				dimensionViewable: true,
			}}
			elementGuidelines={snapToObject ? unselectedNodes : undefined}
			snappable={snapToObject ? true : false}
			draggable={!disabledDraggable}
			resizable={true}
			keepRatio={false}
			rotatable={true}
			edgeDraggable={true}
			edge={['w', 'e', 'n', 's']}
			renderDirections={['nw', 'ne', 'sw', 'se']}
			throttleDrag={snapToGrid ? (zoom <= 0.6 ? 10 : 5) : 0}
			throttleResize={snapToGrid ? (zoom <= 0.6 ? 10 : 5) : 0}
			zoom={1 / zoom}
			padding={10}
			linePadding={15}
			controlPadding={20}
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
				event.target.style.transform = event.style.transform;
			}}
			onDragEnd={event => {
				const nodeId = event.target.dataset.id;

				if (!nodeId) {
					return;
				}

				if (!event.isDrag) {
					setNodeIdInEdit(nodeId);
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
						const nodeId = event.inputEvent.target.dataset['id'];
						setSelectedNodeIds(new Set(nodeId ? [nodeId] : []));
						console.log('drag end');
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
		></MoveableComponent>
	);
}

import { shapes } from './shapes.js';
import type { Node, NonClusterNode, ShapeRenderOptions } from '../types.js';
import type { SVGGroup } from '../../mermaid.js';
import type { D3Selection } from '../../types.js';
import type { graphlib } from 'dagre-d3-es';
type ShapeHandler = (typeof shapes)[keyof typeof shapes];
type NodeElement = D3Selection<SVGAElement> | Awaited<ReturnType<ShapeHandler>>;
export declare function insertNode(elem: SVGGroup, node: NonClusterNode, renderOptions: ShapeRenderOptions): Promise<import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown> | D3Selection<SVGAElement>>;
export declare const setNodeElem: (elem: NodeElement, node: Pick<Node, 'id'>) => void;
export declare const clear: () => void;
export declare const positionNode: (node: ReturnType<graphlib.Graph['node']>) => any;
export {};

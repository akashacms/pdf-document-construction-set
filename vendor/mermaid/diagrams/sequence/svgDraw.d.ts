export const ACTOR_TYPE_WIDTH: number;
export function drawRect(elem: any, rectData: any): import("../common/commonTypes.js").D3RectElement;
export function drawPopup(elem: any, actor: any, minMenuWidth: any, textAttrs: any, forceMenus: any): {
    height: any;
    width: any;
};
export function drawKatex(elem: any, textData: any, msgModel?: null): Promise<any[]>;
export function drawText(elem: any, textData: any): any[];
export function drawLabel(elem: any, txtObject: any): any;
export function fixLifeLineHeights(diagram: any, actors: any, actorKeys: any, conf: any): void;
export function drawActor(elem: any, actor: any, conf: any, isFooter: any): Promise<any>;
export function drawBox(elem: any, box: any, conf: any): void;
export function anchorElement(elem: any): any;
export function drawActivation(elem: any, bounds: any, verticalPos: any, conf: any, actorActivations: any): void;
export function drawLoop(elem: any, loopModel: any, labelText: any, conf: any): any;
export function drawBackgroundRect(elem: any, bounds: any): void;
export function insertDatabaseIcon(elem: any): void;
export function insertComputerIcon(elem: any): void;
export function insertClockIcon(elem: any): void;
export function insertArrowHead(elem: any): void;
export function insertArrowFilledHead(elem: any): void;
export function insertSequenceNumber(elem: any): void;
export function insertArrowCrossHead(elem: any): void;
export function getTextObj(): {
    x: number;
    y: number;
    fill: undefined;
    anchor: undefined;
    style: string;
    width: undefined;
    height: undefined;
    textMargin: number;
    rx: number;
    ry: number;
    tspan: boolean;
    valign: undefined;
};
export function getNoteRect(): {
    x: number;
    y: number;
    fill: string;
    stroke: string;
    width: number;
    anchor: string;
    height: number;
    rx: number;
    ry: number;
};
declare namespace _default {
    export { drawRect };
    export { drawText };
    export { drawLabel };
    export { drawActor };
    export { drawBox };
    export { drawPopup };
    export { anchorElement };
    export { drawActivation };
    export { drawLoop };
    export { drawBackgroundRect };
    export { insertArrowHead };
    export { insertArrowFilledHead };
    export { insertSequenceNumber };
    export { insertArrowCrossHead };
    export { insertDatabaseIcon };
    export { insertComputerIcon };
    export { insertClockIcon };
    export { getTextObj };
    export { getNoteRect };
    export { fixLifeLineHeights };
    export { sanitizeUrl };
}
export default _default;
import { sanitizeUrl } from '@braintree/sanitize-url';

import { PanelState } from "./panelManager";
import * as lang from 'noodle-language';

export const FLOW_INSPECTOR_VIEW_TYPE = 'flow-inspector';

export type AllRowSignatures = lang.InputRowSignature | lang.OutputRowSignature;
export type RowSignatureBlueprint = {
    specifier: lang.TypeSpecifier;
    rowType: AllRowSignatures['rowType'];
}

export type FlowInspectorLists = 'inputs' | 'generics';
export type FlowInspectorSelectionItem = FlowInspectorLists | 'output';

export interface FlowInspectorPanelState extends PanelState {
    selectedItem?: {
        id: string;
        type: FlowInspectorSelectionItem;
    }
}
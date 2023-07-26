import { FlowEnvironment, JointLocation, TypeSpecifier } from "@fluss/language";
import { Vec2 } from "./utils";
import { PanelState } from "./panelManager";

export interface PlanarCamera {
    position: Vec2;
    zoom: number;
}

interface EditorActionLocation {
    worldPosition: Vec2;
    clientPosition: Vec2;
}
export interface DraggingJointContext {
    fromJoint: JointLocation;
    dataType: TypeSpecifier;
    environment: FlowEnvironment;
}

export interface EditorActionNeutralState {
    type: 'neutral';
}
export interface EditorActionAddNodeAtPositionState {
    type: 'add-node-at-position';
    location: EditorActionLocation;
}
export interface EditorActionDraggingLinkState {
    type: 'dragging-link';
    cursorWorldPosition: Vec2 | null;
    draggingContext: DraggingJointContext;
}
export interface EditorActionAddNodeWithConnectionState {
    type: 'add-node-with-connection';
    location: EditorActionLocation;
    draggingContext: DraggingJointContext;
}

export type EditorActionState =
    | EditorActionNeutralState
    | EditorActionAddNodeAtPositionState
    | EditorActionDraggingLinkState
    | EditorActionAddNodeWithConnectionState

export type JointLocationKey = `${string}.${string}.${number}` | `${string}.${string}`;

export interface FlowEditorPanelState extends PanelState {
    flowStack: string[];
    camera: PlanarCamera;
    selection: string[];
    state: EditorActionState;
    relativeJointPosition: Map<JointLocationKey, Vec2>;
}
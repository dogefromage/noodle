import { flowsRemoveNodes, selectFlows } from "../../slices/flowsSlice";
import { flowEditorSetClipboard, flowEditorSetStateAddNodeAtPosition } from "../../slices/panelFlowEditorSlice";
import { Command, ViewTypes } from "../../types";

export const flowEditorCommands: Command[] = [
    {
        scope: 'view',
        viewType: ViewTypes.FlowEditor,
        id: 'flowEditor.addNodeAtPosition',
        name: 'Add Node',
        actionCreator({ activePanelId, clientCursor, offsetCursor, offsetCenter, clientCenter }, params) {
            return flowEditorSetStateAddNodeAtPosition({
                panelId: activePanelId,
                clientPosition: clientCursor || clientCenter,
                offsetPosition: offsetCursor || offsetCenter,
            });
        },
        keyCombinations: [{ key: ' ', displayName: 'Space' }],
    },
    {
        scope: 'view',
        viewType: ViewTypes.FlowEditor,
        id: 'flowEditor.deleteSelected',
        name: 'Delete Selected',
        actionCreator({ panelState: { flowStack, selection } }, params) {
            const flowId = flowStack[0];
            if (flowId == null) return;
            return flowsRemoveNodes({
                flowId,
                selection,
                undo: { desc: `Removed all selected nodes in active geometry.` },
            });
        },
        keyCombinations: [{ key: 'Delete', displayName: 'Del' }, /*  { key: 'x', ctrlKey: true } */],
    },
    {
        scope: 'view',
        viewType: ViewTypes.FlowEditor,
        id: 'flowEditor.copySelection',
        name: 'Copy Selected',
        actionCreator({ appState, activePanelId, panelState: { flowStack, selection } }, params) {
            const flow = selectFlows(appState)[flowStack[0]];
            if (!flow) return console.error(`Could not find flow.`);
            const selectedNodes = selection
                .map(nodeId => flow.nodes[nodeId]);
            return flowEditorSetClipboard({
                panelId: activePanelId,
                clipboard: selectedNodes,
            });
        },
        keyCombinations: [{ key: 'c', ctrlKey: true }],
    },
    {
        scope: 'view',
        viewType: ViewTypes.FlowEditor,
        id: 'flowEditor.paste',
        name: 'Paste',
        actionCreator({ appState, panelState: { clipboard } }, params) {
            console.log('TODO paste', clipboard);
        },
        keyCombinations: [{ key: 'v', ctrlKey: true }],
    },
];
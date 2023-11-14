import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../redux/stateHooks';
import useContextMenu from '../utils/useContextMenu';
import useDispatchCommand from '../utils/useDispatchCommand';
import { CONTEXT_MENU_DIVIDER } from './ContextMenu';
import FlowEditorLegend from './FlowEditorLegend';
import FlowEditorTransform from './FlowEditorTransform';
import FlowNodeCatalog from './FlowNodeCatalog';
import { useSelectFlowEditorPanel } from '../slices/panelFlowEditorSlice';

const EditorWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    user-select: none;
`;

interface Props {
    panelId: string;
}

const FlowEditorViewport = ({ panelId }: Props) => {
    const dispatch = useAppDispatch();
    const panelState = useAppSelector(useSelectFlowEditorPanel(panelId));
    const flowId = panelState?.flowStack[0];
    const dispatchCommand = useDispatchCommand();

    const contextMenu = useContextMenu(
        panelId,
        'Flow Viewport',
        [
            'flowEditor.addNodeAtPosition',
            'flowEditor.addRegionAtPosition',
            'flowEditor.deleteSelected',
            CONTEXT_MENU_DIVIDER,
            'flowEditor.createFlow',
            CONTEXT_MENU_DIVIDER,
            'flowEditor.copySelected',
            'flowEditor.cutSelected',
            'flowEditor.paste',
            CONTEXT_MENU_DIVIDER,
            'flowEditor.fitCamera',
        ]
    );

    return (
        <EditorWrapper
            onContextMenu={contextMenu}
            onDoubleClick={e => {
                dispatchCommand(
                    'flowEditor.addNodeAtPosition', {
                        clientCursor: { x: e.clientX, y: e.clientY },
                    }
                );
            }}
        >
            {
                flowId && <>
                    <FlowEditorTransform
                        panelId={panelId}
                        flowId={flowId}
                    />
                    <FlowEditorLegend flowId={flowId} />
                </>
            }
            <FlowNodeCatalog
                panelId={panelId}
            />
        </EditorWrapper>
    );
}

export default FlowEditorViewport;
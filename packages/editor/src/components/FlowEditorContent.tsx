import React from 'react';
import { FlowEditorPanelState, SelectionStatus, ViewTypes } from '../types';
import FlowEdges from './FlowEdges';
import FlowNodeElement from './FlowNodeElement';
import { selectPanelState } from '../redux/panelStateEnhancer';
import { useAppSelector } from '../redux/stateHooks';
import { selectFlowContext } from '../slices/contextSlice';

interface Props {
    panelId: string;
    flowId: string;
    getPanelState: () => FlowEditorPanelState;
}

const FlowEditorContent = ({ flowId, panelId, getPanelState }: Props) => {
    const context = useAppSelector(selectFlowContext(flowId));
    const panelState = useAppSelector(selectPanelState(ViewTypes.FlowEditor, panelId));

    if (!context || !panelState) {
        return null;
    }

    return (
        <>
            <FlowEdges panelId={panelId} flowId={flowId} />
            {
                // nodes
                Object.values(context.nodeContexts).map(nodeContext => {
                    const node = nodeContext.ref;
                    let selectionStatus = SelectionStatus.Nothing;
                    if (panelState.selection.includes(node.id)) {
                        selectionStatus = SelectionStatus.Selected;
                    }
                    return (
                        <FlowNodeElement
                            key={node.id}
                            flowId={flowId}
                            panelId={panelId}
                            context={nodeContext}
                            getPanelState={getPanelState}
                            selectionStatus={selectionStatus}
                            env={context.flowEnvironment}
                        />
                    );
                })
            }
        </>
    );
}

export default React.memo(FlowEditorContent);
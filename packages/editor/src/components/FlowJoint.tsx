import { useDraggable, useDroppable } from 'dragzone';
import * as lang from 'noodle-language';
import React, { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/stateHooks';
import { flowsAddConnection } from '../slices/flowsSlice';
import { flowEditorSetStateDraggingLink, flowEditorSetStateNeutral, useSelectFlowEditorPanelActionState } from '../slices/panelFlowEditorSlice';
import { FlowJointDiv } from '../styles/flowStyles';
import { getJointLocationKey, getJointStyling } from '../utils/flows';

interface Props {
    panelId: string;
    flowId: string;
    env: lang.FlowEnvironment;
    type: lang.TypeSpecifier;
    location: lang.JointLocation;
    additional?: boolean;
}

export const DRAG_JOIN_DND_TAG = `drag-join`;
export const FLOW_JOINT_TARGET_CLASS = `joint-target`;

const FlowJoint = ({ panelId, flowId, location, env, type, additional, }: Props) => {
    const dispatch = useAppDispatch();
    const actionState = useAppSelector(useSelectFlowEditorPanelActionState(panelId));

    const drag = useDraggable({
        tag: DRAG_JOIN_DND_TAG,
        start: e => {
            e.dataTransfer.setDragImage(new Image(), 0, 0);
            dispatch(flowEditorSetStateDraggingLink({
                panelId,
                draggingContext: {
                    fromJoint: location,
                    dataType: type || lang.createAnyType(),
                    environment: env,
                }
            }));
            return {}; // remove in future, bug currently
        },
    });

    const isDroppableTarget = (
        actionState?.type === 'dragging-link' &&
        actionState.draggingContext.fromJoint.nodeId !== location.nodeId &&
        actionState.draggingContext.fromJoint.direction !== location.direction
    );

    const droppableHandler = (e: React.DragEvent) => {
        if (isDroppableTarget) {
            e.preventDefault();
        }
    }
    const drop = useDroppable({
        tag: DRAG_JOIN_DND_TAG,
        enter: droppableHandler,
        over: droppableHandler,
        leave: droppableHandler,
        drop: e => {
            if (!isDroppableTarget) return;
            dispatch(flowsAddConnection({
                flowId,
                locations: [location, actionState.draggingContext.fromJoint],
                undo: { desc: `Linked two nodes in active flow.` },
            }));
            dispatch(flowEditorSetStateNeutral({
                panelId,
            }));
            e.stopPropagation();
        },
    });

    const innerRef = useRef<HTMLDivElement>(null);
    const jointStyle = getJointStyling(type, env, additional)

    return (
        <FlowJointDiv
            $direction={location.direction}
            $jointStyle={jointStyle}
            {...drag.handlers}
            {...drop.handlers}
            onMouseDown={e => e.stopPropagation()}
            $isHovering={drop.isHovering}
        >
            <div
                className={FLOW_JOINT_TARGET_CLASS}
                ref={innerRef}
                data-joint-key={getJointLocationKey(location)}
            />
        </FlowJointDiv>
    );
}

export default FlowJoint;

import React, { PropsWithChildren } from 'react';
import { useAppSelector } from '../redux/stateHooks';
import { useSelectFlowContext } from '../slices/contextSlice';
import { Bold } from '../styles/typography';
import styled from 'styled-components';

const LegendWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;

    padding: 1rem;
    display: flex;
    flex-direction: column;
`

interface FlowEditorLegendProps {
    flowId: string;
}

const FlowEditorLegend = ({ flowId, }: PropsWithChildren<FlowEditorLegendProps>) => {

    const flowContext = useAppSelector(useSelectFlowContext(flowId));

    return (
        <LegendWrapper>
            {
                flowContext?.problems.map((problem, index) =>
                    <Bold $color='#ff0e46' key={index}>
                        {problem.message}
                    </Bold>
                )
            }
        </LegendWrapper>
    );
}

export default FlowEditorLegend;
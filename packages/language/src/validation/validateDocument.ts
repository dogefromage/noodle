import { baseEnvironmentContent } from "../content/baseEnvironment";
import { createEnvironment, pushContent } from "../core/environment";
import { FlowDocument, FlowEnvironmentContent, FlowSignature, InputRowSignature, OutputRowSignature, getInternalId } from "../types";
import { DocumentContext, FlowGraphContext } from "../types/context";
import { deepFreeze } from "../utils";
import DependencyGraph from "../utils/DependencyGraph";
import { memFreeze } from "../utils/functional";
import { collectFlowDependencies, validateFlowGraph } from "./validateFlowGraph";

export function validateDocument(document: FlowDocument): DocumentContext {
    const { 
        flows: rawFlowMap, 
        config: { entryFlows }
    } = document;
    
    const result: DocumentContext = {
        ref: document,
        flowContexts: {},
        problems: [],
        childProblemCount: 0,
        topologicalFlowOrder: [],
        entryPointDependencies: {},
    }

    const signatureDeps = new DependencyGraph<string>();

    for (const flow of Object.values(rawFlowMap)) {
        const flowDependencies = collectFlowDependencies(flow);
        signatureDeps.addDependencies(flow.id, flowDependencies);
        // add every dependency, also built-in ones
    }

    const topSortResult = signatureDeps.sortTopologically();
    if (topSortResult.cycles.length) {
        result.problems.push({
            type: 'cyclic-flows',
            cycles: topSortResult.cycles,
        });
    }
    result.topologicalFlowOrder = topSortResult.bottomToTopDependencies;


    for (const [entryId, entryPoint] of Object.entries(entryFlows)) {
        const topFlow = rawFlowMap[entryPoint.entryFlowId];
        if (topFlow == null) {
            result.problems.push({
                type: 'missing-top-flow',
                id: entryPoint.entryFlowId,
            });
        } else {
            const depsRecursive = signatureDeps.findDependenciesRecursive(entryPoint.entryFlowId);
            result.entryPointDependencies[entryId] = [...depsRecursive];
        }
    }

    let currentEnvironment = createEnvironment(baseEnvironmentContent);

    for (const flowId of topSortResult.bottomToTopDependencies) {
        const flow = rawFlowMap[flowId];
        if (!flow) {
            continue;
        }
        const flowSyntaxContent = generateFlowSyntaxLayer(flow.generics, flow.inputs, flow.outputs);
        const flowSyntaxEnv = pushContent(currentEnvironment, flowSyntaxContent);
        const flowContext = validateFlowGraph(flow, flowSyntaxEnv);
        result.flowContexts[flowId] = flowContext;
        result.childProblemCount += flowContext.problems.length + flowContext.childProblemCount;

        // extend environment
        currentEnvironment = pushContent(currentEnvironment, flowSignatureContent(flowContext))
    }

    deepFreeze(result);
    return result;
};

const flowSignatureContent = memFreeze(
    (flowContext: FlowGraphContext): FlowEnvironmentContent => ({
        signatures: { [flowContext.ref.id]: flowContext.flowSignature },
        types: {},
    })
);

const generateFlowSyntaxLayer = memFreeze(generateFlowSyntaxLayerInitial);
function generateFlowSyntaxLayerInitial(
    generics: string[],
    flowInputs: InputRowSignature[],
    flowOutputs: OutputRowSignature[],
): FlowEnvironmentContent {
    const input: FlowSignature = {
        id: getInternalId('input'),
        name: 'Input',
        description: null,
        attributes: { category: 'In/Out' },
        generics,
        inputs: [],
        outputs: flowInputs.map(o => ({
            id: o.id,
            label: o.label,
            specifier: o.specifier,
            rowType: 'output',
        })),
    }
    const output: FlowSignature = {
        id: getInternalId('output'),
        name: 'Output',
        description: null,
        attributes: { category: 'In/Out' },
        generics,
        inputs: flowOutputs.map(o => ({
            id: o.id,
            label: o.label,
            specifier: o.specifier,
            rowType: 'input-simple',
        })),
        outputs: [],
    }
    const signatures = Object.fromEntries([input, output].map(sig => [sig.id, sig]));
    return {
        signatures,
        types: {},
    }
}
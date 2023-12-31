import { TypeSystemExceptionData } from '../typeSystem/exceptionHandling';
import { FlowSignature, NamespacePath } from './signatures';
import {
    FlowDocument,
    FlowGraph,
    FlowNode,
    InputJointLocation,
    OutputJointLocation,
    RowState
} from './state';
import { FunctionTypeSpecifier, InitializerValue, TemplatedTypeSpecifier, TypeSpecifier } from './typeSystem';
import { Obj } from './internal';

export type FlowEnvironment = {
    parent: FlowEnvironment | null;
    namespace: FlowEnvironmentNamespace | null;
}
export interface FlowEnvironmentNamespace {
    name: string;
    content: FlowEnvironmentContent;
}
export interface FlowEnvironmentContent {
    signatures: FlowSignature[];
    types: Record<string, TypeSpecifier>;
}
export interface FlowNamedEnvironmentContent {
    signatures: Record<string, FlowSignature>;
    types: Record<string, TypeSpecifier>;
}

export type EdgeColor = 'normal' | 'redundant' | 'cyclic';

export interface FlowEdge {
    id: string;
    source: OutputJointLocation;
    target: InputJointLocation;
    color: EdgeColor;
}

export interface FlowDocumentContext {
    ref: FlowDocument;
    problems: DocumentProblem[];
    criticalSubProblems: number;
    flowContexts: Obj<FlowGraphContext>;
    // topologicalFlowOrder: string[];
    // entryPointDependencies: Obj<string[]>;
    environment: FlowEnvironment;
}

export interface FlowGraphContext {
    ref: FlowGraph;
    problems: FlowGraphProblem[];
    criticalSubProblems: number;
    nodeContexts: Obj<FlowNodeContext>;
    edges: Obj<FlowEdge>;
    flowSignature: FlowSignature;
    flowEnvironment: FlowEnvironment;
    sortedUsedNodes: string[];
}

export interface FlowNodeContext {
    ref: FlowNode;
    problems: NodeProblem[];
    criticalSubProblems: number;
    inputRows: Obj<RowContext>;
    outputRow: RowContext;
    templateSignature: FlowSignature | null;
    inferredType: TemplatedTypeSpecifier<FunctionTypeSpecifier> | null;
    isUsed: boolean;
}

export interface GenericTypeInference {
    id: string;
    resolvedSpecifier: TypeSpecifier;
}

export type RowDisplay = 'hidden' | 'simple' | 'initializer' | 'destructured';

export interface RowContext {
    ref?: RowState;
    display: RowDisplay;
    value?: InitializerValue;
    problems: RowProblem[];
}

interface PlaceholderProblem {
    message: string;
}

export type DocumentProblem =
    PlaceholderProblem

interface CyclicNodes {
    type: 'cyclic-nodes';
    message: string;
    cycle: string[];
}
interface MissingNode {
    type: 'missing-node';
    message: string;
    nodeId: string;
}
interface OutputMissing {
    type: 'output-missing';
    message: string;
}
export type FlowGraphProblem =
    | CyclicNodes
    | MissingNode
    | OutputMissing

interface MissingSignature {
    type: 'missing-signature';
    message: string;
    signature: NamespacePath;
}
export type NodeProblem =
    | MissingSignature

interface InvalidSpecifier {
    type: 'invalid-specifier';
    message: string;
}
interface RequiredParameter {
    type: 'required-parameter';
    message: string;
}
interface IncompatibleArgumentType {
    type: 'incompatible-argument-type';
    message: string;
    connectionIndex: number;
    typeProblem: TypeSystemExceptionData;
}
interface InvalidValue {
    type: 'invalid-value';
    message: string;
    typeProblem?: TypeSystemExceptionData;
}
interface InvalidConnection {
    type: 'invalid-connection';
    message: string;
}
export type RowProblem =
    | InvalidSpecifier
    | RequiredParameter
    | IncompatibleArgumentType
    | InvalidValue
    | InvalidConnection


export type LanguageValidator = (document: FlowDocument) => FlowDocumentContext;
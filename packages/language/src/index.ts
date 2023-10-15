
export * from './types';
export {
    validateDocument
} from './validation/validateDocument';

export {
    collectTotalEnvironmentContent,
    findEnvironmentSignature,
    findEnvironmentType,
} from './core/environment';

export {
    createAnyType,
    createPrimitiveType,
    createListType,
    createTupleType,
    createFunctionType,
    createMapType,
    getTemplatedSignatureType,
    createAliasType,
    createGenericType,
    createTemplateParameter,
} from './typeSystem';

export {
    tryResolveTypeAlias,
} from './typeSystem/resolution';

export {
    isSubsetType,
} from './typeSystem/comparison';
export {
    assertDef,
    assertNever,
    assertTruthy,
} from './utils/index';

export * as utils from './utils/functional';
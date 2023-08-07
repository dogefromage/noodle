import { primitiveTypes } from "../content/types";
import { FlowEnvironment, InitializerValue, TypeSpecifier } from "../types";
import { memFreeze } from "../utils/functional";
import { TypeTreePath } from "./exceptionHandling";
import { resolveTypeAlias } from "./resolution";

export function generateDefaultValue(specifier: TypeSpecifier, env: FlowEnvironment) {
    return _generateDefaultValue(new TypeTreePath(), specifier, env);
}
const _generateDefaultValue = memFreeze((
    path: TypeTreePath, X: TypeSpecifier, env: FlowEnvironment,
): InitializerValue => {
    X = resolveTypeAlias(path, X, env);

    const typedPath = path.add({ key: X.type, formatting: 'type' });
    if (X.type === 'primitive') {
        if (X.name === primitiveTypes.boolean.name) {
            return false;
        }
        if (X.name === primitiveTypes.number.name) {
            return 0;
        }
        if (X.name === primitiveTypes.string.name) {
            return '';
        }
        throw new Error(`Unknown primitive ${X.name}`);
    }
    
    if (X.type === 'list') {
        return [];
    }
    if (X.type === 'tuple') {
        return X.elements.map((Y, i) => 
            _generateDefaultValue(typedPath.add({ key: i.toString(), formatting: 'property' }), Y, env)
        );
    }
    if (X.type === 'map') {
        return Object.entries(X.elements)
            .map(([key, Y]) => 
                [key, _generateDefaultValue(typedPath.add({ key, formatting: 'property' }), Y, env)]
            );
    }

    throw new Error(`Unhandled specifier ${(X as any).type}`);
});
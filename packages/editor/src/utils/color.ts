import { FlowEnvironment, TypeSpecifier } from "@fluss/language";
import { ColorTuple } from "../types";
import * as lang from '@fluss/language';

export function colorTupleToHex(rgb: ColorTuple) {

    const hexLiterals = rgb.map(dec => {
        const intCol = Math.floor(255 * dec);
        return intCol.toString(16).padStart(2, '0');
    });
    return `#${hexLiterals.join('')}`;
}

export function hexToColorTuple(hex: string): ColorTuple {
    const match = hex.match(/^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i);
    if (!match) {
        throw new Error(`Input ${hex} is not hex color`);
    }
    const [ _, r, g, b ] = match;
    const tuple = [ r, g, b ].map(v => parseInt(v, 16) / 255.0);
    return tuple as ColorTuple;
}



export function getTypeSpecifierStyleTag(X: TypeSpecifier, env: FlowEnvironment) {
    X = lang.tryResolveTypeAlias(X, env)!;
    if (X == null) {
        return 'unknown';
    }
    if (X.type === 'primitive') {
        return X.name;
    }
    return X.type;
}
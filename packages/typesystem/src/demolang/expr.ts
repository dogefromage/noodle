

interface Literal {
    kind: 'LITERAL';
    value: any;
}
interface Identifier {
    kind: 'IDENTIFIER';
    value: string;
}
interface Call {
    kind: 'CALL';
    head: Expr;
    args: Expr[];
}
interface Fun {
    kind: 'FUN';
    params: string[];
    body: Expr;
}
interface Let {
    kind: 'LET';
    x: string;
    defn: Expr;
    body: Expr;
}
interface LetRec {
    kind: 'LETREC';
    x: string;
    defn: Expr;
    body: Expr;
}
interface RecordSelect {
    kind: 'RECORDSELECT';
    rec: Expr;
    key: string;
}
interface RecordExtend {
    kind: 'RECORDEXTEND';
    key: string;
    value: Expr;
    rest: Expr;
}
interface RecordRestrict {
    kind: 'RECORDRESTRICT';
    rec: Expr;
    key: string;
}
interface RecordEmpty {
    kind: 'RECORDEMPTY';
}

export type Expr =
    | Literal
    | Identifier
    | Call
    | Fun
    | Let
    | LetRec
    | RecordSelect
    | RecordExtend
    | RecordRestrict
    | RecordEmpty


// print expr as a string and put brackets if contains space
function exprToStringBrackets(expr: Expr): string {
    const str = exprToString(expr);
    return str.indexOf(' ') >= 0 ? `(${str})` : str;
}

// Print an expression as a string
export function exprToString(expr: Expr): string {
    switch (expr.kind) {
        case 'LITERAL': {
            switch (typeof expr.value) {
                case 'string': return `"${expr.value}"`;
                default: return expr.value.toString();
            }
        };
        case 'IDENTIFIER': return expr.value;
        case 'CALL': return `${exprToStringBrackets(expr.head)} ${expr.args.map(a => exprToStringBrackets(a)).join(' ')}`;
        case 'FUN': return `(${expr.params.join(', ')}) => ${exprToStringBrackets(expr.body)}`;
        case 'LET': return `let ${expr.x} = ${exprToStringBrackets(expr.defn)} in ${exprToStringBrackets(expr.body)}`;
        case 'LETREC': return `letrec ${expr.x} = ${exprToStringBrackets(expr.defn)} in ${exprToStringBrackets(expr.body)}`;
        case 'RECORDSELECT': return `${exprToStringBrackets(expr.rec)}[${expr.key}]`;
        case 'RECORDRESTRICT': return `${exprToStringBrackets(expr.rec)} - ${expr.key}`;
        case 'RECORDEMPTY': return '{}';
        case 'RECORDEXTEND': {
            let extensions: RecordExtend[] = [];
            while (expr.kind === 'RECORDEXTEND') {
                extensions.push(expr);
                expr = expr.rest;
            }
            const fields = extensions.map(e => `${e.key}: ${exprToStringBrackets(e.value)}`).join(' | ');
            if (expr.kind !== 'RECORDEMPTY') {
                return `{ ${fields} | ${exprToStringBrackets(expr)} }`;
            }
            return `{ ${fields} }`
        }
    }
}

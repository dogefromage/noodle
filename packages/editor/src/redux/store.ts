import { configureStore, Middleware } from "@reduxjs/toolkit";
import { CurriedGetDefaultMiddleware } from "@reduxjs/toolkit/dist/getDefaultMiddleware";
import { enableMapSet } from "immer";
import memoize from "lodash-es/memoize";
import { createLogger } from "redux-logger";
import { EditorConfig, RecursivePartial, UndoAction } from "../types";
import createFullReducer, { RootState } from "./rootReducer";
import { createValidatorMiddleware } from "./validatorMiddleware";
import { catchRejectedMiddleware } from "./catchRejectedMiddleware";
import { defaultDocument } from "../content/defaultDocument";

function createMiddleware(getDefaultMiddleWare: CurriedGetDefaultMiddleware, config: EditorConfig) {
    const middleware: Middleware[] = [];

    middleware.push(...getDefaultMiddleWare({
        serializableCheck: {
            ignoredPaths: [
                'context',
                'panelManager',
                'panels',
                'config',
                'menus',
                'projectStorage.storage',
                'extensions',
            ],
            ignoreActions: true,
        },
    }));

    middleware.push(catchRejectedMiddleware);

    middleware.push(createValidatorMiddleware(config));

    if (config.debug?.reduxLogger) {
        middleware.push(createLogger({
            collapsed: true,
            actionTransformer: (action: UndoAction) => {
                if (action.payload?.undo != null) {
                    console.log("[Undo] " + action.payload.undo.desc);
                }
                return action;
            }
        }));
    }

    return middleware;
}

function generatePreloadedState(config: EditorConfig): RecursivePartial<RootState> {
    return {
        config,
        document: {
            past: [],
            present: defaultDocument,
            future: [],
        }
    };
}

const _initStore = (config: EditorConfig) => {
    enableMapSet();

    const reducer = createFullReducer(config);
    const middleware = (defaultMiddleware: CurriedGetDefaultMiddleware) => 
        createMiddleware(defaultMiddleware, config);
    
    const store = configureStore({
        reducer, 
        middleware,
        preloadedState: generatePreloadedState(config),
    });
    return store;
};
export const initStore = memoize(_initStore) as typeof _initStore;

// function yjs() {
//     const yDoc = new Y.Doc();

//     const provider = new HocuspocusProvider({
//         url: "ws://127.0.0.1:1234",
//         name: "example-document",
//         document: yDoc,
//     });

//     const provider = new WebrtcProvider('flow-typescript-test-room', yDoc, {
//         signaling: ['ws://localhost:4444'],
//     });

//     bind(yDoc, store, 'document');

//     provider.awareness.setLocalState({
//         name: Math.random(),
//     })
//     provider.awareness.on('update', () => {
//         console.log(provider.awareness.getStates());
//     })
// }
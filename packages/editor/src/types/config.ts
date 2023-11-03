import { Reducer } from "@reduxjs/toolkit";
import React from 'react';
import { Command } from ".";
import { RootState } from "../redux/rootReducer";
import { assertDef } from "@noodles/language";
import * as lang from '@noodles/language';

export interface EditorConfig {
    debug: {
        reduxLogger: boolean;
    }
    stateReducers: Record<string, Reducer>;
    commands: Record<string, Command>;
    toolbar: {
        inlineMenus: [string, React.FC][];
        widgetsCenter: React.FC[];
        widgetsRight: React.FC[];
    }
    managerComponents: React.FC[];
    language: {
        validator: lang.LanguageValidator;
    }
}

export type EditorExtension = (config: EditorConfig) => void;

export const createExtensionSelector = <S extends any>(extensionId: string) => {
    return (state: RootState) => {
        const s = state as any;
        assertDef(s.extensions, 'Could not find extensions slice.');
        return s.extensions[extensionId] as S;
    }
}
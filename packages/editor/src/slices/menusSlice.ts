import { WritableDraft } from ".pnpm/immer@9.0.21/node_modules/immer/dist/internal";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { RootState } from "../redux/rootReducer";
import { MenusSliceState, MenuStackNode, MenuState } from "../types";
import { except } from "../utils/exceptions";

const initialState: MenusSliceState = {};

function getMenu(s: WritableDraft<MenusSliceState>, a: PayloadAction<{ menuId: string }>) {
    const menu = s[a.payload.menuId]
    if (menu == null) {
        except(`Menu with id ${a.payload.menuId} not found`);
    }
    return menu;
}

export const menusSlice = createSlice({
    name: 'menus',
    initialState,
    reducers: {
        add: (s, a: PayloadAction<{ menuId: string, menuState: MenuState }>) => {
            if (s[a.payload.menuId] != null) {
                except(`Menu state with id=${a.payload.menuId} already exists`);
            }
            s[a.payload.menuId] = a.payload.menuState;
        },
        remove: (s, a: PayloadAction<{ menuId: string }>) => {
            delete s[a.payload.menuId];
        },
        setClosed: (s, a: PayloadAction<{ menuId: string, closed?: boolean }>) => {
            const menu = getMenu(s, a);
            menu.isClosed = a.payload.closed ?? true;
        },
        setNode: (s, a: PayloadAction<{ menuId: string, depth: number, node: MenuStackNode }>) => {
            const menu = getMenu(s, a);
            const before = menu.nodeStack.slice(0, a.payload.depth);
            const newEl = a.payload.node;
            menu.nodeStack = [ ...before, newEl ];
            menu.isClosed = false;
        },
        setState: (s, a: PayloadAction<{ menuId: string, key: string, value: any }>) => {
            const menu = getMenu(s, a);
            menu.state.set(a.payload.key, a.payload.value);
        },
        setFocusPath: (s, a: PayloadAction<{ menuId: string, focusPath: number[] }>) => {
            const menu = getMenu(s, a);
            menu.focusedPath = a.payload.focusPath;
        },
    }
});

export const {
    add: menusAdd,
    remove: menusRemove,
    setClosed: menusSetClosed,
    setNode: menusSetNode,
    setState: menusSetState,
    setFocusPath: menusSetFocusPath,
} = menusSlice.actions;

export const selectMenus = (state: RootState) => state.menus;

export const useSelectSingleMenu = (menuId: string | undefined) => 
    useCallback((state: RootState): MenuState | undefined => 
        selectMenus(state)[menuId!],
        [ menuId ]
    );

const menusReducer = menusSlice.reducer;

export default menusReducer;
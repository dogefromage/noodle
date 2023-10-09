import { DragzonePortalMount } from '@fluss/interactive';
// import { DragzonePortalMount } from '@fluss/interactive';
import { Store } from '@reduxjs/toolkit';
import React, { PropsWithChildren, useState } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { initStore } from '../redux/store';
import defaultTheme from '../styles/defaultTheme';
import GlobalStyle from '../styles/globalStyles';
import ContextMenu from './ContextMenu';
import KeyboardCommandListener from './KeyboardCommandListener';
import LayoutRoot from './LayoutRoot';
import { MenuPortalMount } from './MenuPortalMount';
import Validator from './Validator';

interface EditorProps {

}

const Editor = ({}: PropsWithChildren<EditorProps>) => {
    const [store] = useState<Store>(initStore);

    return (<>
        {/* icons */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        {/* fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet" />

        <Provider store={store}>
            <Validator />
            <GlobalStyle />
            <ThemeProvider theme={defaultTheme}>
                <LayoutRoot />
                {/* USER INTERACTION */}
                <KeyboardCommandListener />
                <ContextMenu />
                {/* PORTAL MOUNTS */}
                <MenuPortalMount />
                <DragzonePortalMount />
                {/* DATA */}
            </ThemeProvider>
        </Provider>
    </>);
}

export default Editor;
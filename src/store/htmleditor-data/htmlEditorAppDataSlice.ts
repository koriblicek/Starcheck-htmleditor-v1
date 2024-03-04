import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IAppData, ICssData } from 'src/types';
interface State {
    appData: IAppData;
    cssData: ICssData;
}

const initialState = {
} as State;

export const htmlEditorAppDataSlice = createSlice({
    name: 'htmlEditorAppData',
    initialState,
    reducers: {
        initializeAppData: (state, action: PayloadAction<{ data: IAppData; }>) => {
            //initialize app data
            state.appData = action.payload.data;
        },
        initializeCssData: (state, action: PayloadAction<{ data: ICssData; }>) => {
            //initialize css data
            state.cssData = action.payload.data;
        }
    }
});

// Action creators are generated for each case reducer function
export const htmlEditorAppDataActions = htmlEditorAppDataSlice.actions;
export const htmlEditorAppDataReducer = htmlEditorAppDataSlice.reducer;
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IAppData } from 'src/types';

const initialState = {
} as IAppData;

export const htmlEditorAppDataSlice = createSlice({
    name: 'htmlEditorAppData',
    initialState,
    reducers: {
        initializeAppData: (_, action: PayloadAction<{ data: IAppData; }>) => {
            //initialize app data
            return { ...action.payload.data };
        }
    }
});

// Action creators are generated for each case reducer function
export const htmlEditorAppDataActions = htmlEditorAppDataSlice.actions;
export const htmlEditorAppDataReducer = htmlEditorAppDataSlice.reducer;
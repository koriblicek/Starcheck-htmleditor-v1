import { configureStore } from '@reduxjs/toolkit';
import { htmlEditorAppDataReducer } from './htmleditor-data/htmlEditorAppDataSlice';

export const store = configureStore({
  reducer: {
    htmlEditorAppData: htmlEditorAppDataReducer,
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
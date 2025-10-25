import { createSlice } from '@reduxjs/toolkit';
import { Comment } from './commentsThunks';
import { fetchComments, createComment, deleteComment } from './commentsThunks';
import {GlobalError} from "../../types";

interface CommentsState {
    items: Comment[];
    loading: boolean;
    error: boolean;
    createError: GlobalError | null;
}

const initialState: CommentsState = {
    items: [],
    loading: false,
    error: false,
    createError: null,
};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        clearComments: (state) => {
            state.items = [];
        },
        clearCreateError: (state) => {
            state.createError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchComments.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.items = payload;
            })
            .addCase(fetchComments.rejected, (state) => {
                state.loading = false;
                state.error = true;
            });

        builder
            .addCase(createComment.pending, (state) => {
                state.loading = true;
                state.createError = null;
            })
            .addCase(createComment.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.items.push(payload);
            })
            .addCase(createComment.rejected, (state, { payload }) => {
                state.loading = false;
                state.createError = payload || { error: 'Failed to create comment' };
            });

        builder
            .addCase(deleteComment.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteComment.fulfilled, (state, { meta }) => {
                state.loading = false;
                state.items = state.items.filter(comment => comment._id !== meta.arg);
            })
            .addCase(deleteComment.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const commentsReducer = commentsSlice.reducer;
export const { clearComments, clearCreateError } = commentsSlice.actions;

export const selectComments = (state: { comments: CommentsState }) => state.comments.items;
export const selectCommentsLoading = (state: { comments: CommentsState }) => state.comments.loading;
export const selectCommentsError = (state: { comments: CommentsState }) => state.comments.error;
export const selectCreateCommentError = (state: { comments: CommentsState }) => state.comments.createError;
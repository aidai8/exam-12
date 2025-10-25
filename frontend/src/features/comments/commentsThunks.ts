import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { GlobalError } from '../../types';

export interface Comment {
    _id: string;
    text: string;
    author: {
        _id: string;
        displayName: string;
    };
    recipe: string;
}

interface CreateCommentData {
    recipeId: string;
    text: string;
}

const API_BASE = 'http://localhost:8000';

export const fetchComments = createAsyncThunk<Comment[], string>(
    'comments/fetchByRecipe',
    async (recipeId: string) => {
        const response = await fetch(`${API_BASE}/comments/recipe/${recipeId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }
        return await response.json();
    }
);

export const createComment = createAsyncThunk<Comment, CreateCommentData, { state: RootState; rejectValue: GlobalError }>(
    'comments/create',
    async (commentData: CreateCommentData, { getState, rejectWithValue }) => {
        const { user } = getState().users;
        const token = user?.token;

        const response = await fetch(`${API_BASE}/comments/${commentData.recipeId}`, {
            method: 'POST',
            headers: {
                'Authorization': token || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: commentData.text }),
        });

        if (!response.ok) {
            const error: GlobalError = await response.json();
            return rejectWithValue(error);
        }
        return await response.json();
    }
);

export const deleteComment = createAsyncThunk<void, string, { state: RootState; rejectValue: GlobalError }>(
    'comments/delete',
    async (commentId: string, { getState, rejectWithValue }) => {
        const { user } = getState().users;
        const token = user?.token;

        const response = await fetch(`${API_BASE}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token || '',
            },
        });

        if (!response.ok) {
            const error: GlobalError = await response.json();
            return rejectWithValue(error);
        }
    }
);
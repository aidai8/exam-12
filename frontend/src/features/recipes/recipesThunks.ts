import { createAsyncThunk } from '@reduxjs/toolkit';
import { Recipe, GlobalError } from '../../types';
import { RootState } from '../../app/store';

const API_BASE = 'http://localhost:8000';

export interface RecipeData {
    title: string;
    description: string;
    image: File | null;
}

export const fetchRecipes = createAsyncThunk<Recipe[], void>(
    'recipes/fetchAll',
    async () => {
        const response = await fetch(`${API_BASE}/recipes`);

        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }

        return await response.json();
    }
);

export const fetchRecipesByAuthor = createAsyncThunk<Recipe[], string>(
    'recipes/fetchByAuthor',
    async (authorId: string) => {
        const response = await fetch(`${API_BASE}/recipes/by-author/${authorId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch user recipes');
        }

        return await response.json();
    }
);

export interface RecipeWithComments {
    recipe: Recipe;
    comments: any[];               //потом заменю на тип Comment!!!!
}

export const fetchRecipeById = createAsyncThunk<RecipeWithComments, string>(
    'recipes/fetchById',
    async (recipeId: string) => {
        const response = await fetch(`${API_BASE}/recipes/${recipeId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch recipe');
        }

        return await response.json();
    }
);

export const createRecipe = createAsyncThunk<Recipe, RecipeData, { state: RootState; rejectValue: GlobalError }>(
    'recipes/create',
    async (recipeData: RecipeData, { getState, rejectWithValue }) => {
        const formData = new FormData();
        formData.append('title', recipeData.title);
        formData.append('description', recipeData.description);

        if (recipeData.image) {
            formData.append('image', recipeData.image);
        }

        const { user } = getState().users;
        const token = user?.token;

        const response = await fetch(`${API_BASE}/recipes`, {
            method: 'POST',
            headers: {
                'Authorization': token || '',
            },
            body: formData,
        });

        if (!response.ok) {
            const error: GlobalError = await response.json();
            return rejectWithValue(error);
        }

        return await response.json();
    }
);

export const deleteRecipe = createAsyncThunk<void, string, { state: RootState; rejectValue: GlobalError }>(
    'recipes/delete',
    async (recipeId: string, { getState, rejectWithValue }) => {
        const { user } = getState().users;
        const token = user?.token;

        const response = await fetch(`${API_BASE}/recipes/${recipeId}`, {
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
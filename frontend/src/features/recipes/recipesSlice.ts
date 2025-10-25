import { createSlice } from '@reduxjs/toolkit';
import { Recipe, GlobalError } from '../../types';
import {
    fetchRecipes,
    fetchRecipesByAuthor,
    createRecipe,
    deleteRecipe
} from './recipesThunks';

interface RecipesState {
    items: Recipe[];
    loading: boolean;
    error: boolean;
    createError: GlobalError | null;
    deleteError: GlobalError | null;
}

const initialState: RecipesState = {
    items: [],
    loading: false,
    error: false,
    createError: null,
    deleteError: null,
};

const recipesSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {
        clearRecipes: (state) => {
            state.items = [];
        },
        clearCreateError: (state) => {
            state.createError = null;
        },
        clearDeleteError: (state) => {
            state.deleteError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecipes.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchRecipes.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.items = payload;
            })
            .addCase(fetchRecipes.rejected, (state) => {
                state.loading = false;
                state.error = true;
            });

        builder
            .addCase(fetchRecipesByAuthor.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchRecipesByAuthor.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.items = payload;
            })
            .addCase(fetchRecipesByAuthor.rejected, (state) => {
                state.loading = false;
                state.error = true;
            });

        builder
            .addCase(createRecipe.pending, (state) => {
                state.loading = true;
                state.createError = null;
            })
            .addCase(createRecipe.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.items.unshift(payload);
            })
            .addCase(createRecipe.rejected, (state, { payload }) => {
                state.loading = false;
                state.createError = payload || { error: 'Failed to create recipe' };
            });

        builder
            .addCase(deleteRecipe.pending, (state) => {
                state.loading = true;
                state.deleteError = null;
            })
            .addCase(deleteRecipe.fulfilled, (state, { meta }) => {
                state.loading = false;
                state.items = state.items.filter(recipe => recipe._id !== meta.arg);
            })
            .addCase(deleteRecipe.rejected, (state, { payload }) => {
                state.loading = false;
                state.deleteError = payload || { error: 'Failed to delete recipe' };
            });
    },
});

export const recipesReducer = recipesSlice.reducer;
export const { clearRecipes, clearCreateError, clearDeleteError } = recipesSlice.actions;

export const selectRecipes = (state: { recipes: RecipesState }) => state.recipes.items;
export const selectRecipesLoading = (state: { recipes: RecipesState }) => state.recipes.loading;
export const selectRecipesError = (state: { recipes: RecipesState }) => state.recipes.error;
export const selectCreateError = (state: { recipes: RecipesState }) => state.recipes.createError;
export const selectDeleteError = (state: { recipes: RecipesState }) => state.recipes.deleteError;

export const selectRecipeById = (recipeId: string) => (state: { recipes: RecipesState }) =>
    state.recipes.items.find(recipe => recipe._id === recipeId);
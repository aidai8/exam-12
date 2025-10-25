import { useEffect } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    Alert,
    Box,
    Button
} from '@mui/material';
import Grid from "@mui/material/Grid2";
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchRecipes } from './recipesThunks';
import { selectRecipes, selectRecipesLoading, selectRecipesError } from './recipesSlice';

const Recipes = () => {
    const dispatch = useAppDispatch();
    const recipes = useAppSelector(selectRecipes);
    const loading = useAppSelector(selectRecipesLoading);
    const error = useAppSelector(selectRecipesError);

    useEffect(() => {
        dispatch(fetchRecipes());
    }, [dispatch]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                Не удалось загрузить рецепты
            </Alert>
        );
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Все рецепты
            </Typography>

            {recipes.length === 0 ? (
                <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
                    Рецептов пока нет. Будьте первым!
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {recipes.map((recipe) => (
                        <Grid size={{xs: 12, sm: 6, md: 4}} key={recipe._id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: '0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <Link to={`/recipes/${recipe._id}`} style={{ textDecoration: 'none' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={`http://localhost:8000/${recipe.image}`}
                                        alt={recipe.title}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                </Link>

                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Link to={`/recipes/${recipe._id}`} style={{ textDecoration: 'none' }}>
                                        <Typography
                                            variant="h6"
                                            component="h2"
                                            gutterBottom
                                            sx={{
                                                color: 'text.primary',
                                                '&:hover': { color: 'primary.main' }
                                            }}
                                        >
                                            {recipe.title}
                                        </Typography>
                                    </Link>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {recipe.description}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Автор:{' '}
                                            <Button
                                                component={Link}
                                                to={`/users/${recipe.author._id}/recipes`}
                                                size="small"
                                                sx={{
                                                    textTransform: 'none',
                                                    minWidth: 'auto',
                                                    p: 0,
                                                    '&:hover': { backgroundColor: 'transparent' }
                                                }}
                                            >
                                                {recipe.author.displayName}
                                            </Button>
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Recipes;
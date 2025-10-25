import { useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    CircularProgress,
    Alert,
    IconButton
} from '@mui/material';
import Grid from "@mui/material/Grid2";
import { Delete, Add } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import { fetchRecipesByAuthor, deleteRecipe } from './recipesThunks';
import { selectRecipes, selectRecipesLoading, selectRecipesError } from './recipesSlice';

interface Props {
    isOwnProfile?: boolean;
}

const UserRecipes = ({ isOwnProfile = false }: Props) => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const user = useAppSelector(selectUser);
    const recipes = useAppSelector(selectRecipes);
    const loading = useAppSelector(selectRecipesLoading);
    const error = useAppSelector(selectRecipesError);

    const targetUserId = isOwnProfile ? user?._id : userId;

    const isCurrentUserProfile = isOwnProfile || user?._id === userId;

    useEffect(() => {
        if (targetUserId) {
            dispatch(fetchRecipesByAuthor(targetUserId));
        }
    }, [dispatch, targetUserId]);

    const handleDeleteRecipe = async (recipeId: string) => {
        if (window.confirm('Вы уверены что хотите удалить этот рецепт?')) {
            try {
                await dispatch(deleteRecipe(recipeId)).unwrap();
            } catch (err) {
                alert('Не удалось удалить рецепт');
            }
        }
    };

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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    {isOwnProfile ? 'Мои рецепты' : 'Рецепты пользователя'}
                </Typography>

                {isCurrentUserProfile && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate('/recipes/new')}
                    >
                        Создать рецепт
                    </Button>
                )}
            </Box>

            {recipes.length === 0 ? (
                <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
                    {isOwnProfile ? 'У вас пока нет рецептов' : 'У пользователя пока нет рецептов'}
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {recipes.map((recipe) => (
                        <Grid size={{xs: 12, sm: 6, md: 4}} key={recipe._id}>
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: '0.3s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}>

                                <Box
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/recipes/${recipe._id}`)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={`http://localhost:8000/${recipe.image}`}
                                        alt={recipe.title}
                                    />
                                </Box>

                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': { color: 'primary.main' }
                                        }}
                                        onClick={() => navigate(`/recipes/${recipe._id}`)}
                                    >
                                        {recipe.title}
                                    </Typography>

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
                                </CardContent>

                                {isCurrentUserProfile && (
                                    <CardActions>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteRecipe(recipe._id)}
                                            title="Удалить рецепт"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </CardActions>
                                )}
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default UserRecipes;
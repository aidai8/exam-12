import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CircularProgress,
    Alert,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    Paper
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import { fetchRecipeById } from './recipesThunks';
import { createComment, deleteComment, fetchComments } from '../comments/commentsThunks';
import { selectComments, selectCommentsLoading } from '../comments/commentsSlice';

const FullRecipe = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);

    const [recipe, setRecipe] = useState<any>(null);
    const [recipeLoading, setRecipeLoading] = useState(true);
    const [recipeError, setRecipeError] = useState('');
    const [commentText, setCommentText] = useState('');

    const comments = useAppSelector(selectComments);
    const commentsLoading = useAppSelector(selectCommentsLoading);

    useEffect(() => {
        const loadRecipeAndComments = async () => {
            if (!id) return;

            try {
                setRecipeLoading(true);
                const recipeData = await dispatch(fetchRecipeById(id)).unwrap();
                setRecipe(recipeData.recipe);

                await dispatch(fetchComments(id));
            } catch (err) {
                setRecipeError('Не удалось загрузить рецепт');
            } finally {
                setRecipeLoading(false);
            }
        };

        loadRecipeAndComments();
    }, [dispatch, id]);

    const handleAddComment = async () => {
        if (!commentText.trim() || !id || !user) return;

        try {
            await dispatch(createComment({
                recipeId: id,
                text: commentText
            })).unwrap();

            setCommentText('');
        } catch (err) {
            setRecipeError('Не удалось добавить комментарий');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await dispatch(deleteComment(commentId)).unwrap();
        } catch (err) {
            setRecipeError('Не удалось удалить комментарий');
        }
    };

    const canDeleteComment = (comment: any) => {
        if (!user || !recipe) return false;
        return user._id === comment.author._id || user._id === recipe.author._id;
    };

    if (recipeLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (recipeError || !recipe) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {recipeError || 'Рецепт не найден'}
            </Alert>
        );
    }

    return (
        <Box>
            <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                Назад
            </Button>

            <Card sx={{ mb: 4 }}>
                <CardMedia
                    component="img"
                    height="400"
                    image={`http://localhost:8000/${recipe.image}`}
                    alt={recipe.title}
                />

                <Box sx={{ p: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {recipe.title}
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Автор:{' '}
                        <Button
                            onClick={() => navigate(`/users/${recipe.author._id}/recipes`)}
                            sx={{ textTransform: 'none' }}
                        >
                            {recipe.author.displayName}
                        </Button>
                    </Typography>

                    <Typography variant="body1" whiteSpace="pre-line">
                        {recipe.description}
                    </Typography>
                </Box>
            </Card>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Комментарии ({comments.length})
                </Typography>

                {user && (
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Оставьте ваш комментарий..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            sx={{ mb: 1 }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleAddComment}
                            disabled={!commentText.trim()}
                        >
                            Добавить комментарий
                        </Button>
                    </Box>
                )}

                {commentsLoading ? (
                    <Box display="flex" justifyContent="center" sx={{ py: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : comments.length === 0 ? (
                    <Typography color="text.secondary">
                        Комментариев пока нет. Будьте первым!
                    </Typography>
                ) : (
                    <List>
                        {comments.map((comment) => (
                            <ListItem
                                key={comment._id}
                                secondaryAction={
                                    canDeleteComment(comment) && (
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleDeleteComment(comment._id)}
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    )
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        {comment.author.displayName.charAt(0)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box>
                                            <Typography variant="subtitle2" component="span">
                                                {comment.author.displayName}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={comment.text}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </Box>
    );
};

export default FullRecipe;
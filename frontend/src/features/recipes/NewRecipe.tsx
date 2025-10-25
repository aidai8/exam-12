import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    FormControl,
    FormHelperText
} from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { createRecipe } from './recipesThunks';

interface FormErrors {
    title?: string;
    description?: string;
    image?: string;
}

const NewRecipe = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [state, setState] = useState({
        title: '',
        description: '',
        image: null as File | null,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setState(prev => ({ ...prev, image: file }));

        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, image: 'Поддерживаются только JPEG, PNG и GIF изображения' }));
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, image: 'Размер файла не должен превышать 5MB' }));
                return;
            }
        }

        if (errors.image) {
            setErrors(prev => ({ ...prev, image: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!state.title.trim()) {
            newErrors.title = 'Название блюда обязательно';
        } else if (state.title.trim().length < 3) {
            newErrors.title = 'Название должно содержать минимум 3 символа';
        }

        if (!state.description.trim()) {
            newErrors.description = 'Описание рецепта обязательно';
        } else if (state.description.trim().length < 10) {
            newErrors.description = 'Описание должно содержать минимум 10 символов';
        }

        if (!state.image) {
            newErrors.image = 'Изображение обязательно';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setGlobalError('');

        try {
            await dispatch(createRecipe(state)).unwrap();
            navigate('/recipes/my-recipes');
        } catch (err: any) {
            setGlobalError(err.error || 'Не удалось создать рецепт');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Создать новый рецепт
            </Typography>

            <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
                {globalError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {globalError}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Название блюда *"
                        name="title"
                        value={state.title}
                        onChange={handleInputChange}
                        error={!!errors.title}
                        helperText={errors.title}
                        margin="normal"
                        disabled={loading}
                    />

                    <TextField
                        fullWidth
                        label="Рецепт *"
                        name="description"
                        value={state.description}
                        onChange={handleInputChange}
                        error={!!errors.description}
                        helperText={errors.description || 'Опишите ингредиенты и шаги приготовления'}
                        margin="normal"
                        multiline
                        rows={6}
                        disabled={loading}
                    />

                    <FormControl fullWidth error={!!errors.image} margin="normal">
                        <Typography variant="body1" gutterBottom>
                            Изображение блюда *
                        </Typography>
                        <input
                            type="file"
                            accept="image/jpeg, image/jpg, image/png, image/gif"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                        {errors.image && (
                            <FormHelperText>{errors.image}</FormHelperText>
                        )}
                        <FormHelperText>
                            Поддерживаются JPEG, PNG, GIF. Максимальный размер: 5MB
                        </FormHelperText>
                    </FormControl>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ minWidth: 120 }}
                        >
                            {loading ? 'Создание...' : 'Создать рецепт'}
                        </Button>

                        <Button
                            type="button"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                            variant="outlined"
                        >
                            Отмена
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default NewRecipe;
import React, {useRef, useState} from "react";
import {Avatar, Box, Button, TextField} from "@mui/material";
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import Grid from "@mui/material/Grid2";

interface Props {
    onChange: (file: File | null) => void;
    label: string;
    error?: boolean;
    helperText?: string;
    initialImage?: string;
}

const FileInput: React.FC<Props> = ({onChange, label, error, helperText, initialImage}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [filename, setFilename] = useState('');
    const [preview, setPreview] = useState(initialImage || '');

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFilename(file.name);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            onChange(file);
        } else {
            setFilename('');
            setPreview('');
            onChange(null);
        }
    };

    const activateInput = () => {
        inputRef.current?.click();
    };

    return (
        <Box sx={{mb: 2}}>
            <input
                style={{display: 'none'}}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                ref={inputRef}
            />

            <Grid container spacing={2} alignItems="center">
                <Grid size={{xs: 12, md: 4}}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        {preview ? (
                            <Avatar
                                src={preview}
                                sx={{width: 100, height: 100}}
                            />
                        ) : (
                            <Avatar sx={{width: 100, height: 100}}>
                                <NoPhotographyIcon fontSize="large" />
                            </Avatar>
                        )}
                        <Button
                            variant="contained"
                            onClick={activateInput}
                            size="small"
                        >
                            {preview ? 'Change' : 'Upload'}
                        </Button>
                    </Box>
                </Grid>

                <Grid size={{xs: 12, md: 8}}>
                    <TextField
                        fullWidth
                        disabled
                        label={label}
                        value={filename}
                        onClick={activateInput}
                        error={error}
                        helperText={helperText}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default FileInput;
import {AppBar, Toolbar, Typography, styled, Container} from '@mui/material';
import {NavLink} from 'react-router-dom';
import Grid from "@mui/material/Grid2";
import {useAppSelector} from "../../../app/hooks.ts";
import {selectUser} from "../../../features/users/usersSlice.ts";
import UserMenu from "./UserMenu.tsx";
import AnonymousMenu from "./AnonymousMenu.tsx";

const Link = styled(NavLink)({
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
        color: 'inherit',
    },
});

const AppToolbar = () => {
    const user = useAppSelector(selectUser);

    return (
        <AppBar position="sticky" color={'secondary'} sx={{mb: 2}}>
            <Toolbar>
                <Container maxWidth="xl">
                    <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            <Link to="/">Spooky Recipes</Link>
                        </Typography>
                        {user ?
                            (<UserMenu user={user}/>)
                            :
                            (<AnonymousMenu/>)
                        }
                    </Grid>
                </Container>
            </Toolbar>
        </AppBar>
    );
};

export default AppToolbar;
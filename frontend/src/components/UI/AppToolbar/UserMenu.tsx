import {User} from "../../../types";
import {Button, Menu, MenuItem} from "@mui/material";
import {Link} from "react-router-dom";
import { type FC, useState, type MouseEvent } from 'react';
import {useAppDispatch} from "../../../app/hooks.ts";
import {logout} from "../../../features/users/usersThunks.ts";
import {unsetUser} from "../../../features/users/usersSlice.ts";
import {toast} from "react-toastify";

interface Props {
    user: User;
}

const UserMenu: FC<Props> = ({ user }) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (e: MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await dispatch(logout());
        dispatch(unsetUser());
        handleClose();
        toast.success("Logout successfully");
    };

    return (
        <>
            <Button onClick={handleClick} color="inherit">
                Hi, {user.displayName}!
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem>
                    <Button component={Link} to="/my-recipes" onClick={handleClose}>
                        My Recipes
                    </Button>
                </MenuItem>
                <MenuItem>
                    <Button component={Link} to="/add-new-recipe" onClick={handleClose}>
                        Add new recipe
                    </Button>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;
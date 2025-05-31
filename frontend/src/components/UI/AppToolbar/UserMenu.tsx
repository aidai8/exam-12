import {User} from "../../../types";
import {Button, Menu, MenuItem} from "@mui/material";
import {Link, NavLink} from "react-router-dom";
import React, {useState} from "react";
import {useAppDispatch} from "../../../app/hooks.ts";
import {logout} from "../../../features/users/usersThunks.ts";
import {unsetUser} from "../../../features/users/usersSlice.ts";
import {toast} from "react-toastify";

interface Props {
    user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {
    const dispatch = useAppDispatch();
    const [userOptionsEl, setUserOptionsEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setUserOptionsEl(event.currentTarget);
    };

    const handleClose = () => {
        setUserOptionsEl(null);
    };

    const handleLogout = async () => {
        await dispatch(logout());
        dispatch(unsetUser());
        handleClose();
        toast.success("Logout successfully");
    };

    return (
        <>
            <Button onClick={handleClick} color="inherit" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                {user.displayName}
            </Button>
            <Menu
                keepMounted
                anchorEl={userOptionsEl}
                open={Boolean(userOptionsEl)}
                onClose={handleClose}
            >
                {user && user.role === 'admin' &&
                    <MenuItem>
                        <Button component={NavLink} to='/admin' onClick={handleClose} color={'secondary'}>Admin</Button>
                    </MenuItem>
                }
                <MenuItem>
                    <Button component={Link} to="/my-groups" onClick={handleClose}>
                        My Groups
                    </Button>
                </MenuItem>
                <MenuItem>
                    <Button component={Link} to="..." onClick={handleClose}>
                        My Training Groups
                    </Button>
                </MenuItem>
                <MenuItem>
                    <Button component={Link} to="/new-group" onClick={handleClose}>
                        Add new groups
                    </Button>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;
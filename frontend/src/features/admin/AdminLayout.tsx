import Grid from "@mui/material/Grid2";
import {Outlet} from "react-router-dom";
import AdminMenu from "./AdminMenu.tsx";

const AdminLayout = () => {
    return (
        <Grid container justifyContent="space-between">
            <Grid sx={{width: '20%', borderRight: '1px solid grey'}}>
                <AdminMenu/>
            </Grid>

            <Grid sx={{width: '70%'}}>
                <Outlet/>
            </Grid>
        </Grid>
    );
};

export default AdminLayout;
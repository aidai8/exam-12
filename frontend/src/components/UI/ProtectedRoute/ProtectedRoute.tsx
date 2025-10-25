import {Navigate} from "react-router-dom";
import {useAppSelector} from "../../../app/hooks.ts";
import {selectUser} from "../../../features/users/usersSlice.ts";
import React from "react";

interface Props extends React.PropsWithChildren {
    isAllowed: boolean | null;
}

const ProtectedRoute: React.FC<Props> = ({isAllowed, children}) => {
    const user = useAppSelector(selectUser);

    if (!isAllowed) {
        if (Boolean(user)) {
            return <Navigate to='/'/>
        } else {
            return <Navigate to='/login'/>
        }
    }

    return children;
};

export default ProtectedRoute;
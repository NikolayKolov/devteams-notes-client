import React, { useContext } from "react";
import { AuthenticationContextWrapper } from "../../contexts/authenticationContext";

type AuthComponentProps = {
    children: React.ReactNode
}

const AuthComponent = ({children}: AuthComponentProps) => {
    const [auth,] = useContext(AuthenticationContextWrapper);
    const isUserLoggedIn = !!auth?.user?.userId;

    if (!isUserLoggedIn) return null;

    return (
        <>
            {children}
        </>
    );
}

export default AuthComponent;
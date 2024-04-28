import React, { useContext } from "react";
import { AuthenticationContextWrapper } from "../../contexts/authenticationContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type AuthPageProps = {
    children: React.ReactNode
}

const AuthPage = ({children}: AuthPageProps): React.ReactNode => {
    const [auth,] = useContext(AuthenticationContextWrapper);
    const isUserLoggedIn = !!auth?.user?.userId;

    if (!isUserLoggedIn) return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: '100%',
            mt: '35vh'
        }}>
            <Typography variant="h5">
                Please log in to see page
            </Typography>
        </Box>
    );

    return (
        <>
            {children}
        </>
    );
}

export default AuthPage;
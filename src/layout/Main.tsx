import Header from "./Header";
import Box from '@mui/material/Box';
import { Outlet } from "react-router";

const Main = () => {
    return (
        <Box sx={{
            minHeight: '100vh',
            display: "flex",
            flexDirection: "column",
            position: "relative"
        }}>
            <Header />
            <Box component='main' sx={{
                pt: {
                    xs: '4rem',
                    lg: '5rem'
                }, // header height
                flexGrow: 1
            }}>
                <Box sx={{
                    width: {
                        xs: '100%',
                        lg: 1200,
                    },
                    mx: 'auto'
                }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}

export default Main;
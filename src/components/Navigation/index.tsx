import { useContext, useState } from 'react';
import { AuthenticationContextWrapper } from '../../contexts/authenticationContext';
import AuthComponent from '../authentication/AuthComponent';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import NavigationButton from './NavigationButton';
import NavigationLink from './NavigationLink';
import NavigationLoginDialog from './NavigationLoginDialog';
import NavigationLogoutMenu from './NavigationLogoutMenu';

const Navigation = () => {
    const [openLoginDialog, setLoginDialog] = useState<boolean>(false);
    const [auth, ] = useContext(AuthenticationContextWrapper);
    const isUserLoggedIn = !!auth?.user?.userId;

    const handleLogin = () => {
        setLoginDialog(true);
    }

    const handleCloseLoginDialog = () => {
        setLoginDialog(false);
    }

    return (
        <>
            <AppBar sx={{
                    height: {
                        xs: '4rem',
                        lg: '5rem'
                    },
                    alignItems: 'center',
                    px: 0,
                }}
                position='fixed'
                component="header">
                <Toolbar sx={{
                    height: 'inherit',
                    justifyContent: 'space-between',
                    width: {
                        xs: '100%',
                        lg: 1200,
                    }
                }}>
                    <Box sx={{ textTransform: 'uppercase' }}>
                        <NavigationLink text='notes' href='/' />
                        <AuthComponent>
                            <NavigationLink text='new note' href='/create' />
                        </AuthComponent>
                    </Box>
                    {
                        isUserLoggedIn ?
                            <NavigationLogoutMenu /> :
                            <NavigationButton text='login' onClick={handleLogin} />
                    }
                </Toolbar>
            </AppBar>
            { isUserLoggedIn ? null : <NavigationLoginDialog open={openLoginDialog} onClose={handleCloseLoginDialog}/> }
        </>
    )
}

export default Navigation;
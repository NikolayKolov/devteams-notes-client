import { useContext, useState } from 'react';
import { AuthenticationContextWrapper } from '../../contexts/authenticationContext';
import { setUserJWT } from '../../lib/usersLS/getUserLS';
import { UserLSType } from '../../lib/types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import PasswordField from '../common/PasswordField';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import { FormStatus, FormStatusMessages } from '../../lib/types';
import FormAlert from '../RegistrationForm/FormAlert';
import loginUser from '../../api/loginUser';

type LoginDialogProps = {
    open: boolean,
    onClose: (...args: unknown[]) => void
}

type LoginErrors = {
    email?: string,
    password?: string
}

const NavigationLoginDialog = ({ open, onClose }: LoginDialogProps) => {

    const [loginStatus, setLoginStatus] = useState<FormStatus>('idle');
    const [loginErrors, setLoginErrors] = useState<LoginErrors>({});
    const loginMessages: FormStatusMessages = {
        idle: 'Please fill user email and password',
        loading: 'Please wait...',
        success: 'You are now logged in',
        error: 'An error occured',
        errorNetwork: 'Please try again later'
    };

    const [auth, setAuth] = useContext(AuthenticationContextWrapper);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setLoginStatus('loading');
        setLoginErrors({});
        const formData = event.target as HTMLFormElement;
        const email = formData.email.value;
        const password = formData.password.value;

        try {
            const response = await loginUser(email, password);
            const data = await response.json();

            if (!response.ok) {
                setLoginStatus('error');
                setLoginErrors({
                    [data.name]: data.message
                });
            } else {
                setLoginStatus('success');
                const user: UserLSType = {
                    userId: data.userId,
                    userName: data.userName,
                    userEmail: data.userEmail
                };
                setUserJWT(user, data.jwt);
                setAuth && setAuth({ user, jwt:data.jwt });
            }
        } catch(e) {
            setLoginStatus('errorNetwork');
        }
    }

    if (loginErrors?.email) loginMessages.error = loginErrors.email;
    if (loginErrors?.password) loginMessages.error = loginErrors.password;
    if (auth?.user?.userName) loginMessages.success = `User ${auth.user.userName} is logged in`

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                component: 'form',
                onSubmit: handleSubmit,
              }}>
            <DialogTitle>Login or Register</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Login with your email and password.
                </DialogContentText>
                <DialogContentText>
                    If you don't have and account, <Link href='/register'>register here</Link>
                </DialogContentText>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="useremail"
                    name="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                    disabled={loginStatus === 'loading'}
                />
                <PasswordField
                    required
                    margin="dense"
                    id="userpassword"
                    name="password"
                    label="Password"
                    fullWidth
                    variant="standard"
                    disabled={loginStatus === 'loading'}
                />

                <FormAlert status={loginStatus} statusMessages={loginMessages} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loginStatus === 'loading'}>Cancel</Button>
                {
                    loginStatus === 'success' ?
                        null :
                        <Button type="submit" disabled={loginStatus === 'loading'}>Login</Button>
                }
            </DialogActions>
        </Dialog>
    )
}

export default NavigationLoginDialog;
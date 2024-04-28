import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PasswordField from "../common/PasswordField";
import Button from "@mui/material/Button";
import FormAlert from "./FormAlert";
import { CreateUser, UserCreateRequestType } from "../../validators/userValidator";
import registerUser from "../../api/registerUser";
import { FormStatus } from "../../lib/types";

const RegistrationForm = () => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [formErrors, setFormErrors] = useState<any>({});
    const [status, setStatus] = useState<FormStatus>('idle');
    const passwordHelperText = 'The password must be at least 8 characters long, and must have at least one capital letter, one number and 1 special character (!@#$%^&*()\\)';

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setFormErrors({});
        setStatus('loading');
        const firstName = (e.target as HTMLFormElement).firstName.value;
        const lastName = (e.target as HTMLFormElement).lastName.value;
        const email = (e.target as HTMLFormElement).email.value;
        const password = (e.target as HTMLFormElement).password.value;
        const passwordRepeat = (e.target as HTMLFormElement).passwordRepeat.value;
        const user: UserCreateRequestType = {
            email,
            firstName,
            lastName,
            password,
            passwordRepeat
        }
        const validate = CreateUser.safeParse(user);
        if (!validate.success) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errorsObject: any = {}
            validate.error.issues.forEach((error) => {
                const errorKey = error.path[0];
                errorsObject[errorKey] = error.message;
            });
            setFormErrors(errorsObject);
            setStatus('error');
            return;
        }

        try {
            const response = await registerUser(user);
            const data = await response.json();
                       
            if (!response.ok) {
                setStatus('error');
                if (data?.errorObject !== undefined) setFormErrors(data.errorObject);
                else setFormErrors({
                    custom: data.message
                });
            } else {
                setStatus('success');
            }
        } catch(e) {
            setStatus('errorNetwork');
        }
    }

    const statusMessages = {
        idle: 'Please fill the registration form',
        loading: 'Please wait, registration pending...',
        success: 'Registration successfull, please log in',
        error: 'Please fix form errors',
        errorNetwork: 'Network error, please try again later'
    }

    if (formErrors?.custom !== undefined) statusMessages.error = formErrors.custom;

    return (
        <Box 
            component='form'
            onSubmit={handleSubmit}
            sx={{
                width: '100%',
                px: 2,
                mt: {
                    xs: 2,
                    md: 8
                },
                display: "flex",
                flexDirection: "column"
            }}>
            <Box sx={{
                    width: 'inherit',
                    display: "grid",
                    gridTemplateColumns: {
                        xs: '1f',
                        sm: '1fr 1fr'
                    },
                    gap: 2,
                    mb: 4,
                }}>
                <TextField
                    sx={{
                    }}
                    required
                    id='registration-form-firstName'
                    name='firstName'
                    label="First name"
                    error={formErrors?.firstName}
                    helperText={formErrors?.firstName}
                    disabled={status === 'loading'} />
                <TextField
                    sx={{
                        
                    }}
                    required
                    id='registration-form-lastName'
                    name='lastName'
                    label="Last name"
                    error={formErrors?.lastName !== undefined}
                    helperText={formErrors?.lastName}
                    disabled={status === 'loading'} />
            </Box>
            <TextField
                sx={{
                    mb: 2
                }}
                required
                id='registration-form-email'
                name='email'
                type="email"
                label="Email"
                error={formErrors?.email !== undefined}
                helperText={formErrors?.email}
                disabled={status === 'loading'} />
            <PasswordField
                id='registration-form-password'
                name='password'
                label="Password"
                error={formErrors?.password !== undefined}
                helperText={formErrors?.password !== undefined ?
                    formErrors['password'] :
                    passwordHelperText
                }
                disabled={status === 'loading'} />
            <PasswordField
                id='registration-form-passwordRepeat'
                name='passwordRepeat'
                label="Repeat password"
                error={formErrors?.passwordRepeat !== undefined}
                helperText={formErrors?.passwordRepeat}
                disabled={status === 'loading'} />
            <Button type="submit" disabled={status === 'loading'} size="large">Register</Button>
            <FormAlert status={status} statusMessages={statusMessages} />
        </Box>
    )
}

export default RegistrationForm;
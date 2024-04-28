import { ComponentProps, useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const PasswordField = ({ id, label, name, helperText, ...rest }: ComponentProps<typeof TextField>) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const handleClickShowPassword = () => setPasswordVisible((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <TextField
                sx={{
                    mb: 2
                }}
                {...rest}
                required
                id={id}
                name={name}
                type={passwordVisible ? "text" : "password"}
                label={label}
                helperText={helperText}
                InputProps={{
                    endAdornment: <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onMouseDown={handleClickShowPassword}
                            onClick={handleMouseDownPassword}>
                            { passwordVisible ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>,
                  }}  />
    )
}

export default PasswordField;
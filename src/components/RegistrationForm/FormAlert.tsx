import Alert from "@mui/material/Alert";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { FormStatus, FormStatusMessages } from "../../lib/types";

type FormAlertProps = {
    status: FormStatus,
    statusMessages: FormStatusMessages
}

const FormAlert = ({ status, statusMessages }: FormAlertProps) => {
    return (
        <Alert 
                severity={
                    status === 'loading' ?
                        'warning' :
                        status === 'error' || status === 'errorNetwork' ?
                            'error' :
                            status === 'success' ?
                                'success' :
                                'info'
                }
                iconMapping={{
                    warning: <HourglassBottomIcon fontSize="inherit" />
                }}
                sx={{
                    mt: 2
                }}>
                    {
                        statusMessages[status]
                    }
                </Alert>
    );
}

export default FormAlert;
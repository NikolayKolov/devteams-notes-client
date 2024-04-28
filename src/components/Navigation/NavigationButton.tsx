import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type NavigationButtonProps = {
    text: string,
    onClick: (...args: unknown[]) => void,
}

const NavigationButton = ({ text, onClick}: NavigationButtonProps) => {

    const handleOnClick = () => {
        onClick();
    }

    return (
        <Button variant="text" color='inherit' onClick={handleOnClick} sx={
            [{
                '&:focus': {
                    outline: 'none'
                }
            }]
        }>
            <Typography variant="h6" color='inherit' component='div'>
                {text}
            </Typography>
        </Button>
    );
}

export default NavigationButton;
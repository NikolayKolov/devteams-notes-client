import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const NotFound = () => {
    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: '100%',
            mt: '35vh'
        }}>
            <Typography variant="h5">
                Page not found!
            </Typography>
        </Box>
    );
}

export default NotFound;
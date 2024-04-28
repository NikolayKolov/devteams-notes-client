import Link from '@mui/material/Link';
import { useLocation } from 'react-router-dom';

type NavigationLinkProps = {
    text: string,
    href: string
}

const NavigationLink = ({ text, href }: NavigationLinkProps) => {
    const location = useLocation();
    let isActive = false;
    if (location.pathname === href) isActive = true;

    return (
        <Link href={href} underline={isActive ? 'always' : 'hover'} color='inherit' variant="h6" sx={[{
            '&.MuiLink-root:hover': {
                color: 'primary.light'
            }},
            { mr: 2, fontWeight: isActive? "fontWeghtBold" : "fontWeightLight"}
        ]}>
            {text}
        </Link>
    )
}

export default NavigationLink;
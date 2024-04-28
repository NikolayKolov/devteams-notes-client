import React, { createContext, useState } from "react";
import { getUserJWT } from "../lib/usersLS/getUserLS";
import { UserLSType } from "../lib/types";

type AuthenticationStateObject = {
    user: UserLSType | null,
    jwt: string,
}

type UpdateContextPropsType = {
    children?: React.ReactNode
}

export const AuthenticationContextWrapper = createContext<[
    AuthenticationStateObject,
    React.Dispatch<AuthenticationStateObject>
] | []>([]);

const AuthenticationContext = ({children}: UpdateContextPropsType) => {
    const userJWTLS = getUserJWT();
    let initUserJWT: AuthenticationStateObject = {
        user: null,
        jwt: ''
    };
    if (userJWTLS.jwt !== null && userJWTLS !== null) {
        initUserJWT = {
            user: userJWTLS.user,
            jwt: userJWTLS.jwt !== null ? userJWTLS.jwt : ''
        }
    }
    const [auth, setAuth] = useState<AuthenticationStateObject>(initUserJWT);

    return (
        <AuthenticationContextWrapper.Provider value={[auth, setAuth]}>
            {children}
        </AuthenticationContextWrapper.Provider>
    );
}

export default AuthenticationContext;
import { UserLSType } from "../types";

const getUserJWT = () => {
    const storedUser = localStorage.getItem("userLoggedIn");
    const loggedInUser = storedUser !== null ? JSON.parse(storedUser) : null;
    const jwt = localStorage.getItem("jwt");

    return {
        user: loggedInUser,
        jwt
    }
}

const setUserJWT = (user: UserLSType, jwt: string) => {
    localStorage.setItem('userLoggedIn', JSON.stringify(user));
    localStorage.setItem("jwt", jwt);
}

const clearUserJWT = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("jwt");
}

export {
    getUserJWT,
    setUserJWT,
    clearUserJWT
}
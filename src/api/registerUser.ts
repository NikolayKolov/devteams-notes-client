import { UserCreateRequestType } from "../validators/userValidator";

const registerUser = async (props: UserCreateRequestType): Promise<Response> => {
    const response = await fetch(
        '/api/user/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(props)
        }
    )

    return response;
}

export default registerUser;
const loginUser = async (email: string, password: string): Promise<Response> => {
    const formBody = {
        email,
        password
    };

    const response = await fetch(
        '/api/user/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formBody)
        }
    )

    return response;
}

export default loginUser;
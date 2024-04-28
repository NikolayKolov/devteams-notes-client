const getNotesByUser = async (userId: string, jwt: string): Promise<Response> => {
    let errorInData = false;
    try {
        const response = await fetch(
            '/api/note/list/'+userId, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${jwt}`
                },
            }
        )

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            errorInData = true;
            throw new Error(JSON.stringify(data));
        }
    } catch(e) {
        if (errorInData) throw e;
        throw new Error('Network error, please try again')
    }
}

export default getNotesByUser;
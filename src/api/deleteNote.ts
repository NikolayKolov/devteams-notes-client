const deleteNoteById = async (noteId: string, jwt: string): Promise<Response> => {

    const response = await fetch(
        '/api/note/delete/'+noteId, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${jwt}`
            },
        }
    );

    return response;
}

export default deleteNoteById;
import { CreateNoteType } from "../validators/noteValidator";

const createNote = async (user: CreateNoteType, jwt: string): Promise<Response> => {
    const response = await fetch(
        '/api/note/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            body: JSON.stringify(user)
        }
    )

    return response;
}

export default createNote;
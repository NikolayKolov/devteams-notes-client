import AuthPage from "../components/authentication/AuthPage";
import NoteCreateForm from "../components/Notes/NoteCreateForm";

const NoteCreate = () => {
    return (
        <AuthPage>
            <NoteCreateForm />
        </AuthPage>
    );
}

export default NoteCreate;
import Main from './layout/Main';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Notes from './pages/Notes';
import Note from './pages/Note';
import NoteCreate from './pages/NoteCreate';
import NoteEdit from './pages/NoteEdit';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import './App.css';

function App() {

    return (
        <Router basename="/">
            <Routes>
                <Route path="/" element={<Main />}>
                    <Route index element={<Notes />} />
                    <Route path="register" element={<Register />} />
                    <Route path="create" element={<NoteCreate />} />
                    <Route path="edit/:noteId" element={<NoteEdit />} />
                    <Route path="note/:noteId" element={<Note />} />
                    <Route path="*" element={<NotFound />} />
                    {/*<Route path="note/:noteId" element={<Note />} />
                    <Route path="note/edit/:noteId" element={<NoteEdit />} />
                    
                    */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App

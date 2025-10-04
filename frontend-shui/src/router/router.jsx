import { createBrowserRouter } from "react-router-dom";
import AuthPage from "../pages/AuthPage/AuthPage";
import HomePage from "../pages/HomePage/HomePage";
import NotesPage from "../pages/NotesPage/NotesPage";
import PostPage from "../pages/PostPage/PostPage";
//import EditPage from "../pages/EditPage/EditPage";
import NoteDetailsPage from "../pages/NoteDetailsPage/NoteDetailsPage";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";



export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
        errorElement: <div>Something went wrong!</div>
    },
    {
        path: '/auth',
        element: <AuthPage />
    },
    {
        path: '/notes',
        element: (
            <ProtectedRoute>
                <NotesPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/create-note',
        element: (
            <ProtectedRoute>
                <PostPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/notes/:id',  
        element: (
            <ProtectedRoute>
                <NoteDetailsPage />
            </ProtectedRoute>
        )
    },
    {
        path: '*',
        element: <div>Page not found</div>
    }
]);
    

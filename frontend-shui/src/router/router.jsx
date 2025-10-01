import { createBrowserRouter } from "react-router-dom";
import AuthPage from "../pages/AuthPage/AuthPage";
import HomePage from "../pages/HomePage/HomePage";
import NotesPage from "../pages/NotesPage/NotesPage";
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
    // {
    //     path: '/notes/:id',
    //     element: (
    //         <ProtectedRoute>
    //             <NoteDetailPage />
    //         </ProtectedRoute>
    //     )
    // },
    {
        path: '*',
        element: <div>Page not found</div>
    }
]);
    

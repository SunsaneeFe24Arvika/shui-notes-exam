import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "../pages/AuthPage/AuthPage";
import HomePage from "../pages/HomePage/HomePage";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";


export const router = createBrowserRouter([
    {
        path : '/',
        element : <HomePage />
    },
    {
        path : '/auth',
        element : <AuthPage />
    },
    {
        path : '/notes',
        element : <NotesPage />
    },
    
]);
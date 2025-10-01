import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore();
    
    // Om inte inloggad, redirecta till auth-sidan
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }
    
    // Om inloggad, visa innehållet
    return children;
};

export default ProtectedRoute;
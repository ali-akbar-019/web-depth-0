import { useState } from "react"
import { Navigate, Route } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (!isAuthenticated) {
        return <Navigate to={"/login"} />
    }

    return (
        children)
}

<Route path="/dashboard" element={
    <ProtectedRoute>
        <>this is hte dashboard protected</>
    </ProtectedRoute>
} />



export default ProtectedRoute
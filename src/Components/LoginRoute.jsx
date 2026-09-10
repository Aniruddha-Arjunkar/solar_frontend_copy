import { Navigate } from "react-router";

function LoginRoute({ children }) {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return children;
}
export default LoginRoute;
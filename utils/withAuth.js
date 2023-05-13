import { useRouter } from "next/router";
import { useEffect } from "react";

export const withAuth = (Component) => {
    const Auth = (props) => {
        const router = useRouter();
        const isAuthenticated = checkAuthentication()

        useEffect(() => {
            if (!isAuthenticated) {
                router.push("/");
            }
        }, [isAuthenticated]);

        if (!isAuthenticated) {
            return null; // Render nothing while authentication is being checked
        }

        return <Component {...props} />;
    };

    return Auth;
};

const checkAuthentication = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem("token"); // Token is stored as 'token' in localStorage
        return !!token; // Returns true if token exists, false otherwise
    }
};
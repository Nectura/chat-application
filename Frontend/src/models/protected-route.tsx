import { ReactNode } from "react";
import { fireBaseAuth } from "../firebase/firebase";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    component: ReactNode;
}

export function ProtectedRoute(props: ProtectedRouteProps) {
    return <>{!!fireBaseAuth.currentUser ? props.component : <Navigate to="/auth/login" />}</>
}

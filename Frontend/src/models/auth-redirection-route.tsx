import { ReactNode } from "react";
import { fireBaseAuth } from "../firebase/firebase";
import { Navigate } from "react-router-dom";

interface RedirectionRouteProps {
  /**
   * The path to redirect to if the user is authenticated.
   */
  path: string;

  /**
   * The component to display if the user is not authenticated.
   */
  component: ReactNode;
}

export function AuthRedirectionRoute(props: RedirectionRouteProps) {
  return <>{!!fireBaseAuth.currentUser ? <Navigate to={props.path} /> : props.component}</>
}

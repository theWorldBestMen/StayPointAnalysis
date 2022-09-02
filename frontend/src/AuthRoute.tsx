import { useLocation, Navigate } from "react-router-dom";

interface AuthProps {
  authenticated: boolean;
  children: JSX.Element;
}

function AuthRoute({ authenticated, children }: AuthProps) {
  let location = useLocation();

  if (!authenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  } else {
    return children;
  }
}

export default AuthRoute;

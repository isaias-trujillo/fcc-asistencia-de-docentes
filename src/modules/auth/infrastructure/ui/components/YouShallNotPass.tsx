import { Navigate, Outlet } from "react-router";
import useAuth from "@/modules/auth/infrastructure/useAuth.ts";

const YouShallNotPass = ({
  isDefaultPage = false,
}: {
  isDefaultPage?: boolean;
}) => {
  const { loggedIn } = useAuth();
  if (!loggedIn) {
    if (isDefaultPage) {
      return <Outlet />;
    }
    return <Navigate to="/" />;
  }
  if (isDefaultPage) {
    return <Navigate to="/cursos" />;
  }
  return <Outlet />;
};

export default YouShallNotPass;

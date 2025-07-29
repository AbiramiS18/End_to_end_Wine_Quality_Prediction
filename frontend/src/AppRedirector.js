import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AppRedirector = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default AppRedirector;

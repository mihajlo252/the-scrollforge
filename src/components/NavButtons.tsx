import { Link, useCanGoBack, useLocation } from "@tanstack/react-router";
import { Icon } from "./Primitives";
export const BackButton = ({ classes }: { classes?: string }) => {
  const canGoBack = useCanGoBack();
  const location = useLocation();
  const path = location.pathname;

  return (
    <Link to="/profile" type="button" className={`${classes}`} disabled={path === "/profile" || !canGoBack}>
      <Icon name="back" />
    </Link>
  );
};

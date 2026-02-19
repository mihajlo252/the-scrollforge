import { useCanGoBack, useLocation, useRouter } from "@tanstack/react-router";
export const BackButton = ({ classes }: { classes?: string }) => {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const location = useLocation();
  const path = location.pathname;

  return (
    <button type="button" className={`${classes}`} onClick={() =>router.history.back()} disabled={path === "/profile" || !canGoBack}>
      {"<"}
    </button>
  );
};

export const ForwardButton = ({ classes }: { classes?: string }) => {
  const router = useRouter();

  return (
    <button type="button" className={`${classes}`} onClick={() => router.history.forward()}>
      {">"}
    </button>
  );
};

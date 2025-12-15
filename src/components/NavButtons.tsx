import { useCanGoBack, useLocation, useRouter } from "@tanstack/react-router";
import { BorderButton } from "./BorderButton";
export const BackButton = ({ styles }: { styles?: string }) => {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const location = useLocation();
  const path = location.pathname;

  return (
    <BorderButton style={`${styles}`} event={() =>router.history.back()} disabled={path === "/profile" || !canGoBack}>
      {"<"}
    </BorderButton>
  );
};

export const ForwardButton = ({ styles }: { styles?: string }) => {
  const router = useRouter();

  return (
    <BorderButton style={`${styles}`} event={() => router.history.forward()}>
      {">"}
    </BorderButton>
  );
};

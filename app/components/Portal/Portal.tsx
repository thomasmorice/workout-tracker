import { useEffect, useState, ReactElement } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }: { children: ReactElement }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  const portal = document.querySelector("#portal");
  if (portal && mounted) {
    return createPortal(children, portal);
  } else {
    return null;
  }
};

export default Portal;

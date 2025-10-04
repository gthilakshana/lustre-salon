import { useEffect } from "react";

export function useAutoScroll(ref, dep) {
  useEffect(() => {
    if (ref?.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [dep]); 
}

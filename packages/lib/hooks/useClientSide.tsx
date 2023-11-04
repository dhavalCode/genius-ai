import { useEffect, useState } from "react";

function useClientSide(): boolean {
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  return isClientSide;
}

export { useClientSide };

import { useCallback, useState } from "react";

const useStateReducer = <T extends Record<string, unknown>>(states: T) => {
  const [state, setState] = useState<T>(states);

  const handleStateChange = useCallback(
    (change: Partial<T>) => setState((prev) => ({ ...prev, ...change })),
    []
  );

  return { state, handleStateChange };
};

export default useStateReducer;

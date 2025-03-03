import { useEffect, useState } from "react";

const debounce = (fn: () => void, ms: number) => {
  let timer: NodeJS.Timeout | undefined;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined
      fn();
    }, ms)
  }
}

export function useWindowSize(debounceMs = 100) {
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    const debouncedHandleResize = debounce(handleResize, debounceMs);
    
    window.addEventListener("resize", debouncedHandleResize);
     
    handleResize();
    
    return () => window.removeEventListener("resize", debouncedHandleResize);
  }, [debounceMs]);

  return windowSize;
}

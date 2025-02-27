import { useEffect, useState } from "react";

const debounce = (fn: any, ms: number) => {
  let timer: any;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
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
  }, []);

  return windowSize;
}

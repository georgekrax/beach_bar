import { useRef, useEffect } from "react";

// Credits to -> https://stackoverflow.com/a/63776262/13142787

export function useInitialRender() {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
}
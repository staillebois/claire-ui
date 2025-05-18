import { useState, useLayoutEffect, useRef } from 'react';

function useAutosize(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [borderWidth, setBorderWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const style = window.getComputedStyle(ref.current);
    setBorderWidth(parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth));
  }, []);

  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = 'inherit';
    ref.current.style.height = `${ref.current.scrollHeight + borderWidth}px`;
  }, [value, borderWidth]);

  return ref;
}

export default useAutosize;
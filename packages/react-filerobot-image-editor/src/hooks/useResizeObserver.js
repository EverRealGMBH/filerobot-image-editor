/** External Dependencies */
import { useCallback, useEffect, useMemo, useRef } from 'react';

const useResizeObserver = (onResize = () => {}) => {
  const onResizeCallback = useRef(onResize);
  const resizeObserver = useRef();
  let animationFrame = null;

  const observerCallback = useCallback((entries) => {
    animationFrame = window?.requestAnimationFrame(() => {
      if (!Array.isArray(entries) || !entries.length) {
        return;
      }

      const { width = 0, height = 0 } = resizeObserver?.current || {};
      let newWidth = width;
      let newHeight = height;

      entries.forEach((entry) => {
        const { contentBoxSize, contentRect } = entry;

        if (contentRect) {
          newWidth =
            contentRect.width ??
            (contentBoxSize[0] || contentBoxSize)?.inlineSize;
          newHeight =
            contentRect.height ??
            (contentBoxSize[0] || contentBoxSize)?.blockSize;

          if (newWidth !== width || newHeight !== height) {
            onResizeCallback.current({ entry, width, height });
          }
        }
      });
    });
  }, []);

  const updateOnResizeCallback = useCallback((newOnResizeCallback) => {
    onResizeCallback.current = newOnResizeCallback;
  }, []);

  const initObserver = useCallback(() => {
    if (!resizeObserver.current) {
      resizeObserver.current = new ResizeObserver(observerCallback);
    }
  }, []);

  const observeElement = useCallback((element, newOnResizeCallback) => {
    if (element) {
      if (!resizeObserver.current) {
        initObserver();
      }

      resizeObserver.current.observe(element);

      if (newOnResizeCallback) {
        onResizeCallback.current = newOnResizeCallback;
      }
    }
  }, []);

  const unobserveElement = useCallback((element, newOnResizeCallback) => {
    if (resizeObserver.current && element) {
      resizeObserver.current.unobserve(element);

      if (newOnResizeCallback) {
        onResizeCallback.current = newOnResizeCallback;
      }
    }
  }, []);

  const removeObserver = useCallback(() => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }

    if (resizeObserver.current) {
      resizeObserver.current.disconnect();
    }
  }, []);

  useEffect(() => {
    initObserver();
    return removeObserver;
  }, []);

  return useMemo(
    () => [observeElement, unobserveElement, updateOnResizeCallback],
    [],
  );
};

export default useResizeObserver;

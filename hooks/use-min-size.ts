import { useLayoutEffect, useState } from 'react';

export function useMinSize(id: string, px: number, fallback?: number) {

  const [minSize, setMinSize] = useState(fallback ?? 10);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we use the ResizeObserver
  useLayoutEffect(() => {
    const panelGroup: null | HTMLDivElement = document.querySelector(`[data-panel-group-id="${id}"]`);
    const resizeHandles: NodeListOf<HTMLDivElement> = document.querySelectorAll(
      "[data-panel-resize-handle-id]"
    );
    if (!panelGroup) return;
    const observer = new ResizeObserver(() => {
      const width = panelGroup?.offsetWidth ?? 0;

      setMinSize((px / width) * 100);
    });
    observer.observe(panelGroup as Element);

    // biome-ignore lint/complexity/noForEach: don't want to use --downlevelIteration
    resizeHandles.forEach((resizeHandle) => {
      observer.observe(resizeHandle);
    });

    return () => {
      observer.disconnect();
    };
  }, [id]);

  return minSize
}

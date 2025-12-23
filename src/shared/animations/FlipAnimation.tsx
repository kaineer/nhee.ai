import { pxbr } from "@shared/dom";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  from: HTMLElement;
  to: HTMLElement;
  duration?: number;
  children?: ReactNode;
  keepContent?: boolean;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  onAnimationCancel?: () => void;
}

export const FlipAnimation = ({
  from,
  to,
  duration = 300,
  children,
  keepContent = false,
  onAnimationStart,
  onAnimationCancel,
  onAnimationComplete,
}: Props) => {
  const animationRef = useRef<Animation | null>(null);
  const cloneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!from || !to) {
      return;
    }

    const first = from.getBoundingClientRect();

    to.getBoundingClientRect();
    const last = to.getBoundingClientRect();

    // Inverted delta
    const deltaX = last.left - first.left;
    const deltaY = last.top - first.top;
    const deltaW = last.width / first.width;
    const deltaH = last.height / first.height;

    const clone = cloneRef.current;
    if (!clone) {
      return;
    }

    const transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;

    Object.assign(clone.style, {
      transform,
      transformOrigin: "0 0",
    });

    requestAnimationFrame(() => {
      onAnimationStart?.();

      animationRef.current =
        animationRef.current ||
        clone.animate(
          [
            {
              transform: "none",
            },
            {
              transform,
            },
          ],
          {
            duration,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          },
        );

      animationRef.current.onfinish = () => {
        if (animationRef.current) {
          onAnimationComplete?.();

          if (clone.parentNode) {
            // clone.parentNode.removeChild(clone);
          }

          animationRef.current = null;
        }
      };

      animationRef.current.oncancel = () => {
        onAnimationCancel?.();
      };
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.cancel();
        onAnimationCancel?.();
      }
    };
  }, [
    from,
    to,
    duration,
    onAnimationStart,
    onAnimationCancel,
    onAnimationComplete,
  ]);

  if (!from || !to) return null;

  return createPortal(
    <div
      ref={cloneRef}
      className={from.className}
      style={{
        ...pxbr(from.getBoundingClientRect()),
        position: "fixed",
        display: "block",
        zIndex: 9999,
        pointerEvents: "none",
        willChange: "transform",
      }}
    >
      {keepContent &&
        (children ||
          (from && (
            <div dangerouslySetInnerHTML={{ __html: from.innerHTML }} />
          )))}
    </div>,
    document.body,
  );
};

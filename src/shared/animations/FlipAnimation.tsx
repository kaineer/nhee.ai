import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  from: HTMLElement;
  to: HTMLElement;
  duration?: number;
  children: ReactNode;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  onAnimationCancel?: () => void;
}

export const FlipAnimation = ({
  from,
  to,
  duration = 300,
  children,
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
    const deltaX = first.left - last.left;
    const deltaY = first.top - last.top;
    const deltaW = first.width / last.width;
    const deltaH = first.height / last.height;

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

      animationRef.current = clone.animate(
        [
          {
            transform,
          },
          {
            transform: "none",
          },
        ],
        {
          duration,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        },
      );

      animationRef.current.onfinish = () => {
        onAnimationComplete?.();

        if (clone.parentNode) {
          clone.remove();
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
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: "none",
        willChange: "transform",
      }}
    >
      {children ||
        (from && <div dangerouslySetInnerHTML={{ __html: from.innerHTML }} />)}
    </div>,
    document.body,
  );
};

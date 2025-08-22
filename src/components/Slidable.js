import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

const SWIPE_THRESHOLD = 100; // distanza minima per cambiare pagina
const DRAG_SENSITIVITY = 3;  // riduce l'effetto visivo del drag

export const Slidable = ({ onNext, onPrev, children, className, style }) => {
  const [dragX, setDragX] = useState(0);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: ({ deltaX }) => {
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) onNext?.();
      setDragX(0);
    },
    onSwipedRight: ({ deltaX }) => {
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) onPrev?.();
      setDragX(0);
    },
    onSwiping: ({ deltaX }) => {
      let limitedDelta = deltaX / DRAG_SENSITIVITY;
      if (Math.abs(deltaX) < 10) limitedDelta = 0; // ignora drag troppo piccoli
      setDragX(limitedDelta);
    },
    trackMouse: true
  });

  return (
    <div
      className={className}
      style={{
        transform: `translateX(${dragX}px)`,
        transition: dragX === 0 ? 'transform 0.3s ease-out' : 'none',
        ...style
      }}
      {...swipeHandlers}
    >
      {children}
    </div>
  );
};
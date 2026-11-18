import React, { useState, useRef, useEffect, useCallback } from 'react';

const Tooltip = ({
  children,
  content,
  position = 'bottom',
  delay = 200,
  hideDelay = 100,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const timeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const triggerRef = useRef(null);

  const showTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [delay]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  }, [hideDelay]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      hideTooltip();
    }
  }, [hideTooltip]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [handleKeyDown]);

  const positionClasses = {
    bottom: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    top: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'left-full top-1/2 -translate-y-1/2 ml-2',
    right: 'right-full top-1/2 -translate-y-1/2 mr-2',
  };

  const arrowClasses = {
    bottom: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-100',
    top: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-100',
    left: 'right-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-100',
    right: 'left-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-100',
  };

  const child = Array.isArray(children) ? children[0] : children;
  const childProps = child?.props || {};

  const mergedProps = {
    ...childProps,
    ref: triggerRef,
    onMouseEnter: (e) => {
      if (!isTouch) showTooltip();
      childProps.onMouseEnter?.(e);
    },
    onMouseLeave: (e) => {
      if (!isTouch) hideTooltip();
      childProps.onMouseLeave?.(e);
    },
    onFocus: (e) => {
      showTooltip();
      childProps.onFocus?.(e);
    },
    onBlur: (e) => {
      hideTooltip();
      childProps.onBlur?.(e);
    },
    onTouchStart: (e) => {
      setIsTouch(true);
      showTooltip();
      childProps.onTouchStart?.(e);
    },
    onTouchEnd: (e) => {
      setTimeout(() => setIsTouch(false), 300);
      childProps.onTouchEnd?.(e);
    },
  };

  return (
    <div className="relative inline-block" ref={triggerRef}>
      {React.cloneElement(child, mergedProps)}
      {isVisible && (
        <div
          className={`
            absolute z-50 px-3 py-2 text-xs font-medium text-white dark:text-gray-900
            bg-gray-900 dark:bg-gray-100 rounded-lg shadow-lg max-w-xs whitespace-normal
            animate-fade-in ${positionClasses[position]}
          `}
          role="tooltip"
        >
          {content}
          <div
            className={`
              absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
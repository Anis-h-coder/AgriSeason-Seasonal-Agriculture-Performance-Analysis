import React, { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: string | number;
  durationMs?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  durationMs = 400,
  className = '',
  prefix = '',
  suffix = '',
}) => {
  // Parse string value into numerical part and textual decorations
  const stringVal = String(value).trim();
  
  // Extract leading non-numeric (e.g., ₹), number (e.g. 48.2, 12,450), and trailing (e.g. k, %, L, t)
  const match = stringVal.match(/^([^0-9.-]*)([-+]?[0-9,]*\.?[0-9]+)(.*)$/);
  
  const extractedPrefix = match ? match[1] : '';
  const extractedNumStr = match ? match[2].replace(/,/g, '') : '';
  const extractedSuffix = match ? match[3] : '';

  const targetNum = extractedNumStr ? parseFloat(extractedNumStr) : NaN;
  const isNumeric = !isNaN(targetNum);

  // Decimal precision determination
  const decimalPlaces = extractedNumStr.includes('.')
    ? extractedNumStr.split('.')[1].length
    : 0;

  const [displayNum, setDisplayNum] = useState<number>(isNumeric ? targetNum : 0);
  const prevNumRef = useRef<number>(isNumeric ? targetNum : 0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isNumeric) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayNum(targetNum);
      prevNumRef.current = targetNum;
      return;
    }

    const startNum = prevNumRef.current;
    const endNum = targetNum;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      // Quintic ease-out curve for calm, crisp deceleration
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentVal = startNum + (endNum - startNum) * easeOut;

      setDisplayNum(currentVal);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayNum(endNum);
        prevNumRef.current = endNum;
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [targetNum, isNumeric, durationMs]);

  if (!isNumeric) {
    return <span className={className}>{prefix}{stringVal}{suffix}</span>;
  }

  // Format the animated number with original commas / decimals
  const formattedNumber = decimalPlaces > 0
    ? displayNum.toFixed(decimalPlaces)
    : Math.round(displayNum).toLocaleString('en-IN');

  return (
    <span className={className}>
      {prefix || extractedPrefix}
      {formattedNumber}
      {suffix || extractedSuffix}
    </span>
  );
};

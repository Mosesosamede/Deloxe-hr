'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function TypewriterHeadline() {
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const fullText = "Where Ambition Meets Opportunity";

  useEffect(() => {
    // Initial short delay before typing starts
    const startTimeout = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current++;
        setDisplayedCount(current);

        if (current >= fullText.length) {
          clearInterval(interval);
          setIsTypingDone(true);

          // Keep visible briefly (2.5 seconds), then smoothly disappear
          setTimeout(() => {
            setIsVisible(false);
          }, 2500);
        }
      }, 50); // ~50ms per character for smooth typing speed

      return () => clearInterval(interval);
    }, 600);

    return () => clearTimeout(startTimeout);
  }, [fullText]);

  // "Where " is characters 0 to 6
  // "Ambition" is characters 6 to 14
  // " Meets Opportunity" is characters 14 to 32
  const part1 = fullText.slice(0, Math.min(displayedCount, 6));
  const part2 = displayedCount > 6 ? fullText.slice(6, Math.min(displayedCount, 14)) : '';
  const part3 = displayedCount > 14 ? fullText.slice(14, Math.min(displayedCount, 32)) : '';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -10, filter: 'blur(6px)' }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            bg-charleston/95
            backdrop-blur-xl
            text-white
            px-5 md:px-8
            py-3.5 md:py-5
            rounded-full
            border
            border-white/15
            shadow-2xl
            text-center
            whitespace-nowrap
            min-h-[56px] md:min-h-[72px]
            flex
            items-center
            justify-center
            mx-auto
            max-w-[90vw] md:max-w-none
            pointer-events-none
          "
        >
          <h1 className="text-base sm:text-lg md:text-xl lg:text-1xl font-display font-medium leading-tight tracking-tight flex items-center">
            <span>{part1}</span>
            {part2 && <span className="text-lemon font-bold italic">{part2}</span>}
            {part3 && <span>{part3}</span>}
            {!isTypingDone && (
              <span className="inline-block w-0.5 h-4 md:h-5 bg-lemon ml-1 animate-pulse rounded-full" />
            )}
          </h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

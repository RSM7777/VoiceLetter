import { useEffect, useState } from "react";
import { Feather, Heart } from "lucide-react";

// --- Colors from your website theme ---
const theme = {
  text: '#33636F',
  placeholder_text: 'rgba(90, 122, 132, 0.4)',
  background_light: '#FDEEC9',
  background_dark: '#E0F2F1',
  secondary_grey: '#5A7A84',
};

const LoadingAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // --- Adjusted steps to include "Introducing" ---
    const steps = [
      { delay: 300, step: 1 },   // Quill appears
      { delay: 800, step: 2 },   // Introducing starts
      { delay: 1600, step: 3 },  // Legacy starts
      { delay: 2400, step: 4 },  // Note starts
      { delay: 3400, step: 5 },  // Heart appears
    ];

    const timeouts = steps.map(({ delay, step }) =>
      setTimeout(() => setCurrentStep(step), delay)
    );

    // --- Adjusted total time for the new sequence ---
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4"
      style={{ background: `linear-gradient(to bottom right, ${theme.background_light}, ${theme.background_dark})`}}
    >
      {/* Main container for the animation scene */}
      <div className="relative w-full flex flex-col items-center justify-center">

        {/* Quill - Absolutely positioned for its fly-in effect */}
        {/* Adjusted position to better frame the new text layout */}
        <div
          className={`absolute transition-all duration-1000 ease-out ${
            currentStep >= 1
              ? "opacity-100 top-12  left-1/2 -translate-x-[10rem] sm:-translate-x-[14rem] md:-translate-x-[17rem] rotate-[30deg]"
              : "opacity-0 top-0 left-full -translate-x-full rotate-12"
          }`}
        >
          <Feather
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 drop-shadow-xl"
            strokeWidth={1.2}
            style={{ color: theme.text }}
          />
        </div>

        {/* --- Container for all text elements, stacked vertically --- */}
        <div className="flex flex-col items-center">

          {/* NEW: Introducing Wipe Animation */}
          <div className="relative mb-2">
            <span
              aria-hidden="true"
              className="text-2xl sm:text-3xl md:text-4xl font-serif"
              style={{ color: theme.placeholder_text }}
            >
              Introducing
            </span>
            <div
              className="absolute top-0 left-0 h-full overflow-hidden whitespace-nowrap"
              style={{
                width: currentStep >= 2 ? '100%' : '0%',
                transition: 'width 0.8s ease-in-out',
              }}
            >
              <span
                className="text-2xl sm:text-3xl md:text-4xl font-serif"
                style={{ color: theme.text }}
              >
                Introducing
              </span>
            </div>
          </div>

          {/* Text Wrapper - Horizontal flexbox for Legacy and Note */}
          <div className="flex items-baseline">
            {/* Legacy Wipe Animation (Step updated to 3) */}
            <div className="relative">
              <span
                aria-hidden="true"
                className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold"
                style={{ color: theme.placeholder_text }}
              >
                Legacy
              </span>
              <div
                className="absolute top-0 left-0 h-full overflow-hidden whitespace-nowrap"
                style={{
                  width: currentStep >= 3 ? '100%' : '0%',
                  transition: 'width 0.8s ease-in-out',
                }}
              >
                <span
                  className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold"
                  style={{ color: theme.text }}
                >
                  Legacy
                </span>
              </div>
            </div>

            <div className="w-2 sm:w-3 md:w-4"></div>

            {/* Note Wipe Animation (Step updated to 4) */}
            <div className="relative">
              <span
                aria-hidden="true"
                className="text-4xl sm:text-5xl md:text-6xl font-cursive italic"
                style={{ color: theme.placeholder_text }}
              >
                Note
              </span>
              <div
                className="absolute top-0 left-0 h-full overflow-hidden whitespace-nowrap"
                style={{
                  width: currentStep >= 4 ? '100%' : '0%',
                  transition: 'width 0.8s ease-in-out',
                }}
              >
                <span
                  className="text-4xl sm:text-5xl md:text-6xl font-cursive italic"
                  style={{ color: theme.text }}
                >
                  Note
                </span>
              </div>
            </div>
          </div>
        </div>


        {/* Heart Wrapper - Appears below the text (Step updated to 5) */}
        <div
          className={`transition-opacity duration-700 mt-4 sm:mt-6 ${
            currentStep >= 5 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Heart
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
            strokeWidth={1}
            style={{ color: theme.secondary_grey }}
          />
        </div>
      </div>

      {/* Progress Dots & Loading Text remain at the bottom of the viewport */}
      {/* --- Updated to 5 dots --- */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-3">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`relative transition-all duration-500 rounded-full ${
              currentStep >= step ? "w-3 h-3 scale-125" : "w-2 h-2"
            }`}
            style={{ backgroundColor: currentStep >= step ? theme.text : '#D1D5DB' }}
          />
        ))}
      </div>
      {/* <div className="absolute bottom-10 text-center w-full px-4">
        <p className="text-sm sm:text-base" style={{ color: theme.secondary_grey }}>
          Crafting your elegant writing experience...
        </p>
      </div> */}
    </div>
  );
};

export default LoadingAnimation;
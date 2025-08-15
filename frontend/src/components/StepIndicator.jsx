import React, { useState, useEffect } from 'react';

export default function StepIndicator({ currentStep, totalSteps, onStepClick, completedStep }) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const [lineWidth, setLineWidth] = useState(0);

  useEffect(() => {
    const width = ((currentStep - 1) / (totalSteps - 1)) * 100;
    setLineWidth(width);
  }, [currentStep, totalSteps]);

  const handleClick = (step) => {
    if (step <= completedStep) {
      onStepClick(step);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="relative flex justify-between items-center w-full py-4">
        {/* Progress fill line only */}
        <div
          className="absolute left-[4%] h-1 bg-indigo-500 rounded-full transition-all duration-500 ease-in-out"
          style={{
            top: '34%',
            width: `calc(${lineWidth}% - 8%)`,
          }}
        ></div>

        {/* Step circles */}
        {steps.map((step) => {
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <button
              key={step}
              onClick={() => handleClick(step)}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 
                  ${isCompleted ? 'bg-indigo-500 border-indigo-500 text-white' :
                    isActive ? 'border-indigo-500 text-indigo-500 bg-white scale-110' :
                      'border-gray-300 text-gray-500 bg-white'}
                `}
              >
                {step}
              </div>
              <span className="mt-2 text-xs sm:text-sm">Step {step}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

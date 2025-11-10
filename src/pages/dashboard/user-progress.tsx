import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface UserProgressProps {
  currentStep: number;
  steps: string[];
}

export const UserProgress: React.FC<UserProgressProps> = ({ currentStep, steps }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => {
          const stepIndex = index + 1;
          const isCompleted = currentStep > stepIndex;
          const isCurrent = currentStep === stepIndex;

          return (
            <li key={step} className="md:flex-1">
              {isCompleted ? (
                <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-primary transition-colors">{`Step ${stepIndex}`}</span>
                  <span className="text-sm font-medium">{step}</span>
                </div>
              ) : isCurrent ? (
                <div
                  className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-primary">{`Step ${stepIndex}`}</span>
                  <span className="text-sm font-medium">{step}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-border py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-muted-foreground transition-colors">{`Step ${stepIndex}`}</span>
                  <span className="text-sm font-medium text-muted-foreground">{step}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

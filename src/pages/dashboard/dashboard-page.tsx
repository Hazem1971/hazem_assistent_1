import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { UserProgress } from './user-progress';
import { BusinessProfile } from './business-profile';
import { ToneAnalysis } from './tone-analysis';
import { ContentGenerator } from './content-generator';
import { ContentPreview } from './content-preview';
import { GeneratedContent, ToneAnalysisResult } from '@/types';

const steps = ["Business Profile", "Tone Analysis", "Generate Content"];

export function DashboardPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [toneResult, setToneResult] = useState<ToneAnalysisResult | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);

  const handleBusinessProfileNext = (data: any) => {
    setBusinessProfile(data);
    setCurrentStep(2);
  };

  const handleToneAnalysisNext = (data: ToneAnalysisResult) => {
    setToneResult(data);
    setCurrentStep(3);
  };

  const handleContentGenerated = (content: GeneratedContent[]) => {
    setGeneratedContent(content);
  };
  
  const handleReset = () => {
    setCurrentStep(1);
    setBusinessProfile(null);
    setToneResult(null);
    setGeneratedContent([]);
  }

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <BusinessProfile onNext={handleBusinessProfileNext} />;
      case 2:
        return <ToneAnalysis onNext={handleToneAnalysisNext} onBack={() => setCurrentStep(1)} />;
      case 3:
        return <ContentGenerator onContentGenerated={handleContentGenerated} onBack={() => setCurrentStep(2)} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">Content Generation Wizard</h1>
              <p className="mt-2 text-muted-foreground">
                Welcome, {user?.email}! Let's create some amazing content in 3 simple steps.
              </p>
            </div>
            
            <UserProgress currentStep={currentStep} steps={steps} />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepComponent()}
              </motion.div>
            </AnimatePresence>

            <ContentPreview content={generatedContent} onReset={handleReset} />
          </div>
        </div>
      </main>
    </div>
  );
}

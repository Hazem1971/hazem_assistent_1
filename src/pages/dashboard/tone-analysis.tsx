import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toneAnalysisSchema } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import { ToneAnalysisResult } from '@/types';

type ToneAnalysisFormData = z.infer<typeof toneAnalysisSchema>;

interface ToneAnalysisProps {
  onNext: (data: ToneAnalysisResult) => void;
  onBack: () => void;
}

export const ToneAnalysis: React.FC<ToneAnalysisProps> = ({ onNext, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ToneAnalysisResult | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ToneAnalysisFormData>({
    resolver: zodResolver(toneAnalysisSchema),
  });

  const handleAnalysis = async (data: ToneAnalysisFormData) => {
    setLoading(true);
    setAnalysisResult(null);

    // --- Placeholder for AI Service Call ---
    // In a real app, you would call your AI service here.
    // const result = await aiService.analyzeTone(data.referenceContent);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockResult: ToneAnalysisResult = {
      tone: "Casual, Humorous, Engaging",
      keywords: ["social media", "AI", "content creation", "growth"],
    };
    // --- End of Placeholder ---

    setAnalysisResult(mockResult);
    setLoading(false);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(handleAnalysis)}>
        <CardHeader>
          <CardTitle>Tone of Voice Analysis</CardTitle>
          <CardDescription>
            Paste some of your existing content (e.g., a blog post, social media caption) so our AI can learn your brand's voice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="reference-content">Reference Content</Label>
              <Textarea
                id="reference-content"
                placeholder="Paste your content here..."
                className="min-h-[150px]"
                {...register('referenceContent')}
              />
              {errors.referenceContent && <p className="text-sm text-destructive">{errors.referenceContent.message}</p>}
            </div>
            {analysisResult && (
              <div className="rounded-lg border bg-muted p-4">
                <h4 className="font-semibold">Analysis Complete</h4>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Detected Tone:</span> {analysisResult.tone}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Key Keywords:</span> {analysisResult.keywords.join(', ')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline" onClick={onBack}>Back</Button>
          {!analysisResult ? (
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Analyze Tone
            </Button>
          ) : (
            <Button onClick={() => onNext(analysisResult)}>Next</Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

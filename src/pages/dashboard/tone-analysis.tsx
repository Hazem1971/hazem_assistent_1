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
import { analyzeTone } from '@/lib/ai-service';
import toast from 'react-hot-toast';

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

    try {
      const result = await analyzeTone(data.referenceContent);
      setAnalysisResult(result);
      toast.success("Analysis complete!");
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
              <div className="rounded-lg border bg-muted p-4 animate-in fade-in-50">
                <h4 className="font-semibold mb-2">Analysis Complete</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Detected Tone:</span> {analysisResult.tone}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywords.map((k, i) => (
                      <span key={i} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline" type="button" onClick={onBack}>Back</Button>
          {!analysisResult ? (
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Analyze Tone
            </Button>
          ) : (
            <Button type="button" onClick={() => onNext(analysisResult)}>Next</Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { contentGeneratorSchema } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Sparkles, Facebook, Youtube } from 'lucide-react';
import { GeneratedContent, Platform } from '@/types';
import { VideoIcon } from 'lucide-react';

type ContentGeneratorFormData = z.infer<typeof contentGeneratorSchema>;

interface ContentGeneratorProps {
  onContentGenerated: (content: GeneratedContent[]) => void;
  onBack: () => void;
}

const platforms: { id: Platform; label: string; icon: React.ReactNode }[] = [
  { id: 'facebook', label: 'Facebook Post', icon: <Facebook className="h-5 w-5" /> },
  { id: 'tiktok', label: 'TikTok Script', icon: <VideoIcon className="h-5 w-5" /> },
  { id: 'youtube', label: 'YouTube Shorts Script', icon: <Youtube className="h-5 w-5" /> },
];

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({ onContentGenerated, onBack }) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ContentGeneratorFormData>({
    resolver: zodResolver(contentGeneratorSchema),
    defaultValues: {
      platforms: [],
    },
  });

  const selectedPlatforms = watch('platforms');

  const handleGeneration = async (data: ContentGeneratorFormData) => {
    setLoading(true);

    // --- Placeholder for AI Content Generation ---
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockContent: GeneratedContent[] = data.platforms.map(platform => {
      let text = '';
      if (platform === 'facebook') {
        text = '🚀 Just launched our new AI-powered marketing tool! Generate viral content in seconds. #AI #Marketing #SocialMedia';
      } else if (platform === 'tiktok') {
        text = `[Scene: Upbeat music]\n\nText on screen: Tired of writer's block?\n\n(Person looking stressed at laptop)\n\nText on screen: Try Marketing AI!\n\n(Person now happy, content appears magically)\n\nVoiceover: Go from zero to hero in seconds. Link in bio! #MarketingAI #ContentHacks`;
      } else if (platform === 'youtube') {
        text = `(Intro music)\n\nHost: Are you struggling to create content for your business?\n\n(Quick cuts of different social media apps)\n\nHost: What if I told you AI could do it for you? Check out Marketing AI. It analyzes your brand and writes posts for you. It's a game-changer! #AIShorts #MarketingTools`;
      }
      return { id: platform, platform: platform as Platform, text };
    });
    // --- End of Placeholder ---

    onContentGenerated(mockContent);
    setLoading(false);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(handleGeneration)}>
        <CardHeader>
          <CardTitle>Content Generation</CardTitle>
          <CardDescription>Select the platforms you want to generate content for.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Platforms</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {platforms.map(p => (
                  <div key={p.id} className="flex items-start">
                    <Checkbox
                      id={p.id}
                      value={p.id}
                      className="me-3 mt-1"
                      {...register('platforms')}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label htmlFor={p.id} className="flex items-center font-medium cursor-pointer">
                        {p.icon}
                        <span className="ms-2">{p.label}</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              {errors.platforms && <p className="text-sm text-destructive">{errors.platforms.message}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate Content
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

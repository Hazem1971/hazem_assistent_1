import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { contentGeneratorSchema } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, Facebook, Youtube, Video } from 'lucide-react';
import { GeneratedContent, Platform } from '@/types';
import { generateContent } from '@/lib/ai-service';
import toast from 'react-hot-toast';

type ContentGeneratorFormData = z.infer<typeof contentGeneratorSchema> & { topic: string };

interface ContentGeneratorProps {
  onContentGenerated: (content: GeneratedContent[]) => void;
  onBack: () => void;
}

const platforms: { id: Platform; label: string; icon: React.ReactNode }[] = [
  { id: 'facebook', label: 'Facebook Post', icon: <Facebook className="h-5 w-5" /> },
  { id: 'tiktok', label: 'TikTok Script', icon: <Video className="h-5 w-5" /> },
  { id: 'youtube', label: 'YouTube Shorts Script', icon: <Youtube className="h-5 w-5" /> },
];

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({ onContentGenerated, onBack }) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ContentGeneratorFormData>({
    resolver: zodResolver(contentGeneratorSchema.extend({
      topic: z.string().min(3, "Topic is required")
    })),
    defaultValues: {
      platforms: [],
      topic: ""
    },
  });

  const handleGeneration = async (data: ContentGeneratorFormData) => {
    setLoading(true);
    const results: GeneratedContent[] = [];

    try {
      // Generate content for each selected platform sequentially
      for (const platformId of data.platforms) {
        const platform = platformId as Platform;
        const text = await generateContent(platform, data.topic);
        
        results.push({
          id: crypto.randomUUID(), // Temporary ID until saved
          user_id: '', // Filled by parent or context
          platform,
          text,
          created_at: new Date().toISOString()
        });
      }
      
      onContentGenerated(results);
      toast.success("Content generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(handleGeneration)}>
        <CardHeader>
          <CardTitle>Content Generation</CardTitle>
          <CardDescription>Describe what you want to post about.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="topic">Topic / Idea</Label>
              <Input 
                id="topic" 
                placeholder="e.g. New Summer Coffee Menu Launch" 
                {...register('topic')}
              />
              {errors.topic && <p className="text-sm text-destructive">{errors.topic.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label>Target Platforms</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {platforms.map(p => (
                  <div key={p.id} className="flex items-start p-3 border rounded-md hover:bg-accent cursor-pointer">
                    <Checkbox
                      id={p.id}
                      value={p.id}
                      className="me-3 mt-1"
                      {...register('platforms')}
                    />
                    <div className="grid gap-1.5 leading-none w-full">
                      <label htmlFor={p.id} className="flex items-center font-medium cursor-pointer w-full">
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
          <Button variant="outline" type="button" onClick={onBack}>Back</Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate Content
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

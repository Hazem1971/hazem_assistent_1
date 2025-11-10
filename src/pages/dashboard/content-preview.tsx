import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneratedContent } from '@/types';
import { Copy, Check, Facebook, Youtube, Video } from 'lucide-react';

interface ContentPreviewProps {
  content: GeneratedContent[];
  onReset: () => void;
}

const platformIcons: { [key: string]: React.ReactNode } = {
  facebook: <Facebook className="h-5 w-5" />,
  tiktok: <Video className="h-5 w-5" />,
  youtube: <Youtube className="h-5 w-5" />,
};

export const ContentPreview: React.FC<ContentPreviewProps> = ({ content, onReset }) => {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  if (content.length === 0) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Content Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 p-12 text-center">
            <div className="text-2xl font-bold tracking-tight">Your generated content will appear here</div>
            <p className="text-sm text-muted-foreground mt-2">Follow the steps above to generate your first post.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>Here's your AI-generated content. You can copy it to your clipboard.</CardDescription>
        </div>
        <Button variant="outline" onClick={onReset}>Start Over</Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={content[0].id}>
          <TabsList>
            {content.map(item => (
              <TabsTrigger key={item.id} value={item.id} className="flex items-center gap-2">
                {platformIcons[item.platform]}
                <span className="capitalize">{item.platform}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {content.map(item => (
            <TabsContent key={item.id} value={item.id}>
              <div className="relative mt-4 rounded-lg border bg-muted/50 p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => handleCopy(item.text, item.id)}
                >
                  {copiedStates[item.id] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
                <pre className="whitespace-pre-wrap font-sans text-sm">{item.text}</pre>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Campaign, CampaignPost, Platform } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, Plus, Trash2, Wand2, Upload, CheckCircle2, ArrowLeft } from 'lucide-react';
import { generateContent } from '@/lib/ai-service';
import toast from 'react-hot-toast';
import { useDebounce } from '@/hooks/use-debounce'; // We need to create this hook or use simple timeout

// --- Simple Debounce Hook Implementation Inline ---
function useDebouncedCallback<T extends (...args: any[]) => any>(callback: T, delay: number) {
  const callbackRef = React.useRef(callback);
  React.useLayoutEffect(() => { callbackRef.current = callback; });
  return React.useMemo(() => {
    let timer: any;
    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => callbackRef.current(...args), delay);
    };
  }, [delay]);
}

export const CampaignEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('posts');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- Data Fetching ---
  const { data: campaign, isLoading: isCampaignLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('campaigns').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Campaign;
    }
  });

  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ['campaign-posts', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('campaign_posts').select('*').eq('campaign_id', id).order('post_date');
      if (error) throw error;
      return data as CampaignPost[];
    }
  });

  // --- Auto-Save Logic for Campaign Details ---
  const updateCampaignMutation = useMutation({
    mutationFn: async (updates: Partial<Campaign>) => {
      setIsSaving(true);
      const { error } = await supabase.from('campaigns').update(updates).eq('id', id);
      if (error) throw error;
      setLastSaved(new Date());
      setIsSaving(false);
    }
  });

  const debouncedUpdateCampaign = useDebouncedCallback((updates: Partial<Campaign>) => {
    updateCampaignMutation.mutate(updates);
  }, 2000);

  const handleCampaignChange = (field: keyof Campaign, value: string) => {
    // Optimistic update handled by react-query if we wanted, but for form fields we usually control locally
    // For simplicity, we'll just debounce the API call. In a real complex form, we'd use react-hook-form.
    debouncedUpdateCampaign({ [field]: value });
  };

  // --- Post Management ---
  const createPostMutation = useMutation({
    mutationFn: async () => {
      const newPost = {
        campaign_id: id,
        platform: 'instagram' as Platform,
        post_date: new Date().toISOString(),
        caption: '',
        tone: campaign?.brand_voice || 'Professional',
      };
      const { error } = await supabase.from('campaign_posts').insert(newPost);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaign-posts', id] })
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.from('campaign_posts').delete().eq('id', postId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaign-posts', id] })
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ postId, updates }: { postId: string, updates: Partial<CampaignPost> }) => {
      setIsSaving(true);
      const { error } = await supabase.from('campaign_posts').update(updates).eq('id', postId);
      if (error) throw error;
      setLastSaved(new Date());
      setIsSaving(false);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaign-posts', id] })
  });

  // --- AI Generation ---
  const handleGenerateCaption = async (post: CampaignPost) => {
    toast.loading("Generating content...", { id: 'ai-gen' });
    try {
      const prompt = `Write a ${post.platform} caption for ${campaign?.client_name}. 
      Context/Goals: ${campaign?.goals}. 
      Target Audience: ${campaign?.target_audience}.
      Required Tone: ${post.tone || campaign?.brand_voice}.`;
      
      const generatedText = await generateContent(post.platform, prompt, post.tone || campaign?.brand_voice);
      
      await updatePostMutation.mutateAsync({ 
        postId: post.id, 
        updates: { caption: generatedText, tone: post.tone || campaign?.brand_voice } // Save tone for memory
      });
      
      toast.success("Content generated!", { id: 'ai-gen' });
    } catch (error) {
      toast.error("Generation failed", { id: 'ai-gen' });
    }
  };

  // --- Media Upload ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, post: CampaignPost) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading media...");
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}/${post.id}/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('campaign-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('campaign-media')
        .getPublicUrl(fileName);

      const currentUrls = post.media_urls || [];
      await updatePostMutation.mutateAsync({
        postId: post.id,
        updates: { media_urls: [...currentUrls, publicUrl] }
      });

      toast.success("Uploaded!", { id: toastId });
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`, { id: toastId });
    }
  };

  if (isCampaignLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!campaign) return <div>Campaign not found</div>;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background/95 backdrop-blur sticky top-0 z-10 py-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/campaigns')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {campaign.client_name}
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <CheckCircle2 className="h-4 w-4 text-green-500" />}
            </h1>
            <p className="text-xs text-muted-foreground">
              {lastSaved ? `All changes saved at ${lastSaved.toLocaleTimeString()}` : 'Up to date'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>Export PDF</Button>
          <Button onClick={() => createPostMutation.mutate()}>
            <Plus className="mr-2 h-4 w-4" /> Add Post
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="posts">Content Calendar</TabsTrigger>
          <TabsTrigger value="settings">Strategy & Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Brand Voice</Label>
                  <Input 
                    defaultValue={campaign.brand_voice} 
                    onChange={(e) => handleCampaignChange('brand_voice', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Input 
                    defaultValue={campaign.target_audience} 
                    onChange={(e) => handleCampaignChange('target_audience', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Campaign Goals</Label>
                <Textarea 
                  defaultValue={campaign.goals} 
                  onChange={(e) => handleCampaignChange('goals', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Internal Notes</Label>
                <Textarea 
                  defaultValue={campaign.notes} 
                  onChange={(e) => handleCampaignChange('notes', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="space-y-6 mt-6">
          {isPostsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
          ) : posts?.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No posts yet.</p>
              <Button onClick={() => createPostMutation.mutate()}>Create First Post</Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts?.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Media Section */}
                    <div className="w-full md:w-1/3 bg-muted/30 p-4 flex flex-col gap-4 border-r">
                      <div className="aspect-video bg-background rounded-md border flex items-center justify-center overflow-hidden relative group">
                        {post.media_urls && post.media_urls.length > 0 ? (
                          <img src={post.media_urls[0]} alt="Post media" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-muted-foreground text-sm flex flex-col items-center">
                            <Upload className="h-8 w-8 mb-2 opacity-50" />
                            No Media
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer">
                            <Input type="file" className="hidden" onChange={(e) => handleFileUpload(e, post)} accept="image/*,video/*" />
                            <Button variant="secondary" size="sm" className="pointer-events-none">
                              Change Media
                            </Button>
                          </label>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Platform</Label>
                          <Select 
                            defaultValue={post.platform} 
                            onValueChange={(val) => updatePostMutation.mutate({ postId: post.id, updates: { platform: val as Platform } })}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="instagram">Instagram</SelectItem>
                              <SelectItem value="facebook">Facebook</SelectItem>
                              <SelectItem value="tiktok">TikTok</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Date</Label>
                          <Input 
                            type="date" 
                            className="h-8 text-xs"
                            defaultValue={post.post_date ? new Date(post.post_date).toISOString().split('T')[0] : ''}
                            onChange={(e) => updatePostMutation.mutate({ postId: post.id, updates: { post_date: e.target.value } })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 w-full mr-4">
                          <div className="flex justify-between items-center mb-1">
                            <Label>Caption</Label>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-xs text-blue-600"
                              onClick={() => handleGenerateCaption(post)}
                            >
                              <Wand2 className="mr-1 h-3 w-3" /> AI Generate
                            </Button>
                          </div>
                          <Textarea 
                            className="min-h-[120px]"
                            defaultValue={post.caption}
                            onBlur={(e) => updatePostMutation.mutate({ postId: post.id, updates: { caption: e.target.value } })}
                            placeholder="Write your caption here..."
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => { if(confirm('Delete post?')) deletePostMutation.mutate(post.id) }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">Tone Used (AI Memory)</Label>
                          <Input 
                            className="h-8 text-xs"
                            defaultValue={post.tone}
                            onBlur={(e) => updatePostMutation.mutate({ postId: post.id, updates: { tone: e.target.value } })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Hashtags</Label>
                          <Input 
                            className="h-8 text-xs"
                            defaultValue={post.hashtags}
                            onBlur={(e) => updatePostMutation.mutate({ postId: post.id, updates: { hashtags: e.target.value } })}
                            placeholder="#marketing #ai"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

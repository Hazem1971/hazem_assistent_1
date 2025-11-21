import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { Campaign, AdminStrategy } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Play, Calendar, Loader2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export const CampaignListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  
  // New Campaign State
  const [newClientName, setNewClientName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('blank');
  const [copyFromCampaign, setCopyFromCampaign] = useState<string>('none');

  // Queries
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as Campaign[];
    },
    enabled: !!user
  });

  const { data: strategies } = useQuery({
    queryKey: ['active-strategies'],
    queryFn: async () => {
      const { data } = await supabase.from('admin_strategies').select('*').eq('is_active', true);
      return data as AdminStrategy[];
    }
  });

  const handleCreateCampaign = async () => {
    if (!user || !newClientName) return;
    
    try {
      let initialData: Partial<Campaign> = {
        client_name: newClientName,
        user_id: user.id,
        period: 'month',
        start_date: new Date().toISOString(),
      };

      // Smart Memory: Copy from Previous Campaign
      if (copyFromCampaign !== 'none') {
        const source = campaigns?.find(c => c.id === copyFromCampaign);
        if (source) {
          initialData = {
            ...initialData,
            brand_voice: source.brand_voice,
            target_audience: source.target_audience,
            goals: source.goals,
            notes: source.notes,
          };
        }
      } 
      // Smart Memory: Use Admin Strategy
      else if (selectedTemplate !== 'blank') {
        const strategy = strategies?.find(s => s.id === selectedTemplate);
        if (strategy) {
          initialData = {
            ...initialData,
            brand_voice: strategy.tone,
            notes: `Strategy: ${strategy.title}\n${strategy.description}`,
            // Could also pre-fill goals based on strategy description
          };
        }
      }

      const { data, error } = await supabase
        .from('campaigns')
        .insert(initialData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Campaign created!');
      setIsNewModalOpen(false);
      navigate(`/dashboard/campaigns/${data.id}`);

    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Manage content plans for your clients.</p>
        </div>
        <Button onClick={() => setIsNewModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Campaign
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>
      ) : campaigns?.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium">No campaigns yet</h3>
          <p className="text-muted-foreground mb-4">Start planning your first content calendar.</p>
          <Button onClick={() => setIsNewModalOpen(true)}>Create Campaign</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns?.map((campaign) => (
            <Card key={campaign.id} className="hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle>{campaign.client_name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> 
                  Started {new Date(campaign.start_date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {campaign.notes || "No notes provided."}
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="text-xs bg-secondary px-2 py-1 rounded-md">
                    {campaign.period}ly
                  </span>
                  {campaign.brand_voice && (
                    <span className="text-xs bg-secondary px-2 py-1 rounded-md truncate max-w-[150px]">
                      Voice: {campaign.brand_voice}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => navigate(`/dashboard/campaigns/${campaign.id}`)}>
                  <Play className="mr-2 h-4 w-4" /> Resume Campaign
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isNewModalOpen} onOpenChange={setIsNewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Start New Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Client / Campaign Name</Label>
              <Input 
                placeholder="e.g. Summer Sale 2025" 
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Smart Start (Optional)</Label>
              <Select value={copyFromCampaign} onValueChange={(val) => { setCopyFromCampaign(val); setSelectedTemplate('blank'); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Copy from previous client..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Don't copy</SelectItem>
                  {campaigns?.map(c => (
                    <SelectItem key={c.id} value={c.id}>Copy from: {c.client_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {copyFromCampaign === 'none' && (
              <div className="space-y-2">
                <Label>Use Strategy Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a strategy..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blank">Blank Campaign</SelectItem>
                    {strategies?.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.title} ({s.industry})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCampaign} disabled={!newClientName}>Create Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

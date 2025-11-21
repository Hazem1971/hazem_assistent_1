import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AIProvider } from '@/types';
import { supabase } from '@/lib/supabase';
import { AIProviderRow } from '@/components/admin/ai/AIProviderRow';
import { Loader2, RefreshCw, Wand2, Database, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminAiSettingsPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New Provider Form State
  const [newProviderName, setNewProviderName] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [newBaseUrl, setNewBaseUrl] = useState('');

  const fetchProviders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ai_providers')
      .select('*')
      .order('provider_name');
    
    if (error) {
      toast.error("Failed to load providers");
      console.error(error);
    } else {
      setProviders(data as AIProvider[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleSave = async (updatedProvider: AIProvider) => {
    const { error } = await supabase
      .from('ai_providers')
      .upsert({
        id: updatedProvider.id,
        provider_name: updatedProvider.provider_name,
        api_key: updatedProvider.api_key,
        model_name: updatedProvider.model_name,
        base_url: updatedProvider.base_url,
        updated_at: new Date().toISOString()
      });

    if (error) {
      toast.error(`Error saving ${updatedProvider.provider_name}: ${error.message}`);
    } else {
      toast.success(`${updatedProvider.provider_name} configuration saved!`);
      fetchProviders(); // Refresh to get clean state
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    if (!isActive) {
      // Allow turning off
      const { error } = await supabase
        .from('ai_providers')
        .update({ is_active: false })
        .eq('id', id);
      if (error) toast.error(error.message);
      else fetchProviders();
      return;
    }

    // If turning ON, use the DB function to ensure only one is active
    const { error } = await supabase.rpc('set_active_ai_provider', { provider_id: id });
    
    if (error) {
      // Fallback if RPC fails (e.g. permissions), do it manually
      console.warn("RPC failed, trying manual update");
      await supabase.from('ai_providers').update({ is_active: false }).neq('id', id);
      await supabase.from('ai_providers').update({ is_active: true }).eq('id', id);
      fetchProviders();
      toast.success("Active provider updated!");
    } else {
      toast.success("Active provider updated!");
      fetchProviders();
    }
  };

  const fillTestDefaults = () => {
    const updates = providers.map(p => {
      if (p.provider_name === 'gemini') {
        return { ...p, model_name: 'gemini-1.5-flash', base_url: 'https://generativelanguage.googleapis.com/v1beta/models' };
      }
      if (p.provider_name === 'openrouter') {
        return { ...p, model_name: 'google/gemini-2.0-flash-exp:free', base_url: 'https://openrouter.ai/api/v1' };
      }
      return p;
    });
    setProviders(updates);
    toast.success("Defaults filled (Add your Keys to finish)");
  };

  const initializeDefaults = async () => {
    setLoading(true);
    const defaults = [
      { provider_name: 'gemini', model_name: 'gemini-1.5-flash', base_url: 'https://generativelanguage.googleapis.com/v1beta/models' },
      { provider_name: 'openai', model_name: 'gpt-4o', base_url: 'https://api.openai.com/v1' },
      { provider_name: 'openrouter', model_name: 'openai/gpt-3.5-turbo', base_url: 'https://openrouter.ai/api/v1' },
      { provider_name: 'deepseek', model_name: 'deepseek-coder', base_url: 'https://api.deepseek.com/v1' },
      { provider_name: 'anthropic', model_name: 'claude-3-sonnet-20240229', base_url: 'https://api.anthropic.com/v1' },
    ];

    const { error } = await supabase.from('ai_providers').upsert(defaults, { onConflict: 'provider_name' });
    
    if (error) {
      toast.error("Failed to initialize: " + error.message);
    } else {
      toast.success("Providers initialized!");
      fetchProviders();
    }
    setLoading(false);
  };

  const handleAddProvider = async () => {
    if (!newProviderName) return;
    
    const { error } = await supabase.from('ai_providers').insert({
      provider_name: newProviderName.toLowerCase(),
      model_name: newModelName || 'default-model',
      base_url: newBaseUrl || '',
      is_active: false
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Provider added successfully!");
      setIsAddModalOpen(false);
      setNewProviderName('');
      setNewModelName('');
      setNewBaseUrl('');
      fetchProviders();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('manage_ai')}</h1>
          <p className="text-muted-foreground">Configure which AI provider powers the platform.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Provider
          </Button>
          <Button variant="outline" onClick={fillTestDefaults}>
            <Wand2 className="mr-2 h-4 w-4" />
            Use Free Tier Presets
          </Button>
          <Button variant="ghost" size="icon" onClick={fetchProviders}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : providers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No providers found in database.</p>
          <Button onClick={initializeDefaults}>
            <Database className="mr-2 h-4 w-4" />
            Initialize Default Providers
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {providers.map((provider) => (
            <AIProviderRow 
              key={provider.id} 
              provider={provider} 
              onSave={handleSave}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom AI Provider</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="provider-name">Provider Name</Label>
              <Input 
                id="provider-name" 
                placeholder="e.g. Mistral" 
                value={newProviderName}
                onChange={(e) => setNewProviderName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="model-name">Default Model</Label>
              <Input 
                id="model-name" 
                placeholder="e.g. mistral-large" 
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="base-url">Base URL (Optional)</Label>
              <Input 
                id="base-url" 
                placeholder="https://api.mistral.ai/v1" 
                value={newBaseUrl}
                onChange={(e) => setNewBaseUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProvider} disabled={!newProviderName}>Add Provider</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAiSettingsPage;

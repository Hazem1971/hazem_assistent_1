import React, { useState } from 'react';
import { AIProvider } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Save, Activity, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { testAIConnection } from '@/lib/ai-service';
import toast from 'react-hot-toast';

interface AIProviderRowProps {
  provider: AIProvider;
  onSave: (provider: AIProvider) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

export const AIProviderRow: React.FC<AIProviderRowProps> = ({ provider, onSave, onToggleActive }) => {
  const [showKey, setShowKey] = useState(false);
  const [editedProvider, setEditedProvider] = useState<AIProvider>(provider);
  const [isDirty, setIsDirty] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (field: keyof AIProvider, value: any) => {
    setEditedProvider(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave(editedProvider);
    setIsDirty(false);
  };

  const handleTest = async () => {
    if (!editedProvider.api_key) {
      toast.error("Please enter an API key first");
      return;
    }
    setTestStatus('loading');
    try {
      await testAIConnection(editedProvider);
      setTestStatus('success');
      toast.success(`Connection to ${editedProvider.provider_name} successful!`);
    } catch (error) {
      setTestStatus('error');
      toast.error(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Card className={`mb-4 border-l-4 ${provider.is_active ? 'border-l-green-500 shadow-md' : 'border-l-muted'}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* Header / Status */}
          <div className="w-full md:w-1/4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg capitalize">{provider.provider_name}</h3>
              {provider.is_active && <Badge className="bg-green-500">Active</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={provider.is_active}
                onCheckedChange={(checked) => onToggleActive(provider.id, checked)}
              />
              <Label className="text-sm text-muted-foreground">
                {provider.is_active ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
          </div>

          {/* Inputs */}
          <div className="flex-1 grid gap-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Model Name</Label>
                <Input 
                  value={editedProvider.model_name || ''} 
                  onChange={(e) => handleChange('model_name', e.target.value)}
                  placeholder="e.g. gpt-4"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Base URL (Optional)</Label>
                <Input 
                  value={editedProvider.base_url || ''} 
                  onChange={(e) => handleChange('base_url', e.target.value)}
                  placeholder="https://api..."
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">API Key</Label>
              <div className="relative">
                <Input 
                  type={showKey ? "text" : "password"}
                  value={editedProvider.api_key || ''}
                  onChange={(e) => handleChange('api_key', e.target.value)}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex md:flex-col gap-2 w-full md:w-auto justify-end">
            <Button 
              onClick={handleSave} 
              disabled={!isDirty} 
              variant={isDirty ? "default" : "outline"}
              size="sm"
            >
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            
            <Button 
              onClick={handleTest} 
              variant="secondary" 
              size="sm"
              disabled={testStatus === 'loading'}
            >
              {testStatus === 'loading' ? (
                <Activity className="mr-2 h-4 w-4 animate-spin" />
              ) : testStatus === 'success' ? (
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
              ) : testStatus === 'error' ? (
                <XCircle className="mr-2 h-4 w-4 text-destructive" />
              ) : (
                <Zap className="mr-2 h-4 w-4" />
              )}
              Test
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

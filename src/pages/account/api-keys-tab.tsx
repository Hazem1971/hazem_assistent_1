import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Plus, Trash, Loader2 } from 'lucide-react';
import { ApiKey } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';

export const ApiKeysTab: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'account' });
  const { user } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchKeys = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error(error.message);
      } else {
        setKeys(data || []);
      }
      setLoading(false);
    };
    fetchKeys();
  }, [user]);

  const generateKey = async () => {
    if (!newKeyName || !user) return;
    setGenerating(true);
    
    // In a real app, this key would be generated securely on the backend.
    const newKeyValue = `mai_${crypto.randomUUID().replace(/-/g, '')}`;

    const { data, error } = await supabase
      .from('api_keys')
      .insert({ name: newKeyName, user_id: user.id, key: newKeyValue })
      .select()
      .single();

    if (error) {
      toast.error(error.message);
    } else {
      setKeys([data, ...keys]);
      setNewKeyName('');
      toast.success('API Key generated! Copy it now, you won\'t see it again.');
    }
    setGenerating(false);
  };

  const revokeKey = async (id: string) => {
    if (window.confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      const { error } = await supabase.from('api_keys').delete().eq('id', id);
      if (error) {
        toast.error(error.message);
      } else {
        setKeys(keys.filter(key => key.id !== id));
        toast.success('API Key revoked.');
      }
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API Key copied to clipboard!');
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('generate_api_key')}</CardTitle>
          <CardDescription>Create a new API key to use with your integrations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input 
              type="text" 
              placeholder={t('api_key_name')} 
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              disabled={generating}
            />
            <Button onClick={generateKey} disabled={generating || !newKeyName}>
              {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('api_keys')}</CardTitle>
          <CardDescription>Your existing API keys. Don't share them with anyone.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('api_key_name')}</TableHead>
                <TableHead>{t('key')}</TableHead>
                <TableHead>{t('last_used')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : keys.length > 0 ? (
                keys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell className="font-mono flex items-center gap-2">
                      {`mai_...${apiKey.key.slice(-8)}`}
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(apiKey.key)}><Copy className="h-4 w-4" /></Button>
                    </TableCell>
                    <TableCell>{apiKey.last_used_at ? new Date(apiKey.last_used_at).toLocaleDateString() : 'Never'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => revokeKey(apiKey.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        {t('revoke')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">No API keys generated yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { AdminStrategy } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminStrategiesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<AdminStrategy | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<AdminStrategy>>({
    title: '',
    description: '',
    tone: '',
    industry: '',
    example_posts: []
  });

  const { data: strategies, isLoading } = useQuery({
    queryKey: ['admin-strategies'],
    queryFn: async () => {
      const { data, error } = await supabase.from('admin_strategies').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as AdminStrategy[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<AdminStrategy>) => {
      if (data.id) {
        const { error } = await supabase.from('admin_strategies').update(data).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('admin_strategies').insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-strategies'] });
      setIsModalOpen(false);
      toast.success('Strategy saved successfully');
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('admin_strategies').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-strategies'] });
      toast.success('Strategy deleted');
    }
  });

  const handleOpenModal = (strategy?: AdminStrategy) => {
    if (strategy) {
      setEditingStrategy(strategy);
      setFormData(strategy);
    } else {
      setEditingStrategy(null);
      setFormData({ title: '', description: '', tone: '', industry: '', example_posts: [] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ ...formData, id: editingStrategy?.id });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Strategies</h1>
          <p className="text-muted-foreground">Manage templates and strategies for user campaigns.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> Add Strategy
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {strategies?.map((strategy) => (
            <Card key={strategy.id}>
              <CardHeader>
                <CardTitle>{strategy.title}</CardTitle>
                <CardDescription>{strategy.industry} • {strategy.tone}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{strategy.description}</p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenModal(strategy)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => {
                    if(confirm('Delete this strategy?')) deleteMutation.mutate(strategy.id);
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingStrategy ? 'Edit Strategy' : 'New Strategy'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input 
                  value={formData.industry} 
                  onChange={e => setFormData({...formData, industry: e.target.value})} 
                  placeholder="e.g. Real Estate" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Input 
                value={formData.tone} 
                onChange={e => setFormData({...formData, tone: e.target.value})} 
                placeholder="e.g. Professional & Trustworthy" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                rows={3} 
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Strategy
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStrategiesPage;

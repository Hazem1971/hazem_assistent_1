import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentTable } from '@/components/admin/content/ContentTable';
import { supabase } from '@/lib/supabase';
import { GeneratedContent } from '@/types';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminContentPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const [content, setContent] = useState<(GeneratedContent & { author: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    setLoading(true);
    try {
      // 1. Fetch all generated content
      const { data: contentData, error: contentError } = await supabase
        .from('generated_content')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (contentError) throw contentError;

      if (!contentData || contentData.length === 0) {
        setContent([]);
        setLoading(false);
        return;
      }

      // 2. Get unique user IDs
      const userIds = [...new Set(contentData.map(item => item.user_id))];

      // 3. Fetch profiles for these users to get emails
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // 4. Create a map of userId -> email
      const emailMap = new Map(profilesData?.map(p => [p.id, p.email]) || []);

      // 5. Merge data
      const mergedData = contentData.map(item => ({
        ...item,
        author: emailMap.get(item.user_id) || 'Unknown',
      }));

      setContent(mergedData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch content');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      const { error } = await supabase.from('generated_content').delete().eq('id', id);
      if (error) {
        toast.error(error.message);
      } else {
        setContent(content.filter(item => item.id !== id));
        toast.success('Content deleted!');
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t('manage_content')}</CardTitle>
          <CardDescription>View, moderate, and manage all user-generated content.</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={fetchContent} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : (
          <ContentTable content={content} onDelete={handleDelete} />
        )}
      </CardContent>
    </Card>
  );
};

export default AdminContentPage;

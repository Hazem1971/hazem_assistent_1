import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentTable } from '@/components/admin/content/ContentTable';
import { supabase } from '@/lib/supabase';
import { GeneratedContent } from '@/types';
import { Loader2 } from 'lucide-react';

const AdminContentPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const [content, setContent] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      // Joining with profiles to get author email
      const { data, error } = await supabase
        .from('generated_content')
        .select(`
          *,
          profiles (
            email
          )
        `);
      
      if (error) {
        toast.error(error.message);
      } else {
        // Reshape the data to match what the table expects
        const reshapedData = data.map((item: any) => ({
          ...item,
          author: item.profiles.email,
        }));
        setContent(reshapedData);
      }
      setLoading(false);
    };
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
      <CardHeader>
        <CardTitle>{t('manage_content')}</CardTitle>
        <CardDescription>View, moderate, and manage all user-generated content.</CardDescription>
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

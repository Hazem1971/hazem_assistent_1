import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { HeroEditor } from '@/components/admin/site-content/HeroEditor';
import { FeaturesEditor } from '@/components/admin/site-content/FeaturesEditor';
import { TestimonialsEditor } from '@/components/admin/site-content/TestimonialsEditor';
import { HeroContent, FeatureContent, TestimonialContent } from '@/types';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const AdminSiteContentPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const [loading, setLoading] = useState(true);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [features, setFeatures] = useState<FeatureContent[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialContent[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('site_content').select('*');
      if (error) {
        toast.error(error.message);
      } else {
        const contentMap = new Map(data.map(item => [item.content_key, item.content_value]));
        setHeroContent(contentMap.get('hero') || { title: '', subtitle: '' });
        setFeatures(contentMap.get('features') || []);
        setTestimonials(contentMap.get('testimonials') || []);
      }
      setLoading(false);
    };
    fetchContent();
  }, []);

  const saveContent = async (key: string, value: any) => {
    const { error } = await supabase
      .from('site_content')
      .upsert({ content_key: key, content_value: value }, { onConflict: 'content_key' });
    
    if (error) {
      toast.error(`Failed to save ${key}: ${error.message}`);
    } else {
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} content saved!`);
    }
  };

  const handleUpdateHero = async (data: HeroContent) => {
    setHeroContent(data);
    await saveContent('hero', data);
  };

  const handleUpdateFeature = async (updatedFeature: FeatureContent) => {
    const newFeatures = features.map(f => f.id === updatedFeature.id ? updatedFeature : f);
    setFeatures(newFeatures);
    await saveContent('features', newFeatures);
  };

  const handleAddTestimonial = async (newTestimonial: Omit<TestimonialContent, 'id'>) => {
    const testimonialWithId = { ...newTestimonial, id: crypto.randomUUID() };
    const newTestimonials = [...testimonials, testimonialWithId];
    setTestimonials(newTestimonials);
    await saveContent('testimonials', newTestimonials);
  };
  
  const handleUpdateTestimonial = async (updatedTestimonial: TestimonialContent) => {
    const newTestimonials = testimonials.map(t => t.id === updatedTestimonial.id ? updatedTestimonial : t);
    setTestimonials(newTestimonials);
    await saveContent('testimonials', newTestimonials);
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      const newTestimonials = testimonials.filter(t => t.id !== testimonialId);
      setTestimonials(newTestimonials);
      await saveContent('testimonials', newTestimonials);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{t('manage_site_content')}</h1>
      {heroContent && <HeroEditor content={heroContent} onSave={handleUpdateHero} />}
      {features.length > 0 && <FeaturesEditor features={features} onSaveFeature={handleUpdateFeature} />}
      <TestimonialsEditor 
        testimonials={testimonials}
        onAdd={handleAddTestimonial}
        onUpdate={handleUpdateTestimonial}
        onDelete={handleDeleteTestimonial}
      />
    </div>
  );
};

export default AdminSiteContentPage;

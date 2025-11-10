import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HeroEditor } from '@/components/admin/site-content/HeroEditor';
import { FeaturesEditor } from '@/components/admin/site-content/FeaturesEditor';
import { TestimonialsEditor } from '@/components/admin/site-content/TestimonialsEditor';
import { HeroContent, FeatureContent, TestimonialContent } from '@/types';
import { faker } from '@faker-js/faker';

const initialHero: HeroContent = { 
  title: 'Generate Viral Social Media Content with AI', 
  subtitle: "Stop guessing. Start growing. Our AI analyzes your brand's voice to create posts, and scripts that resonate with your audience in any language."
};

const initialFeatures: FeatureContent[] = [
  { id: 'f1', title: 'Brand Voice Analysis', description: "Import posts or link your Facebook page. Our AI learns your unique tone." },
  { id: 'f2', title: 'Multi-Platform Content', description: "Get tailored content for Facebook, TikTok, and YouTube in one click." },
  { id: 'f3', title: 'Multilingual Magic', description: "Primary support for Arabic (RTL) and English. Reach a global audience." },
  { id: 'f4', title: 'Video Scripts', description: "Generate engaging 30-60 second video scripts for TikTok and YouTube Shorts." },
];

const initialTestimonials: TestimonialContent[] = [
    { id: 't1', text: '"Marketing AI transformed our content strategy. Our engagement in Arabic has skyrocketed!"', author: 'Fatima Al-Jamil', role: 'Coffee Shop Owner' },
    { id: 't2', text: `"I save hours every week. The AI just gets my brand's humor and style perfectly."`, author: 'Youssef Hassan', role: 'Burger Shop Marketer' },
];


const AdminSiteContentPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const [heroContent, setHeroContent] = useState<HeroContent>(initialHero);
  const [features, setFeatures] = useState<FeatureContent[]>(initialFeatures);
  const [testimonials, setTestimonials] = useState<TestimonialContent[]>(initialTestimonials);

  const handleUpdateHero = (data: HeroContent) => {
    setHeroContent(data);
    console.log("Updated Hero:", data);
  };

  const handleUpdateFeature = (updatedFeature: FeatureContent) => {
    setFeatures(features.map(f => f.id === updatedFeature.id ? updatedFeature : f));
    console.log("Updated Feature:", updatedFeature);
  };

  const handleUpdateTestimonial = (updatedTestimonial: TestimonialContent) => {
    setTestimonials(testimonials.map(t => t.id === updatedTestimonial.id ? updatedTestimonial : t));
    console.log("Updated Testimonial:", updatedTestimonial);
  };

  const handleAddTestimonial = (newTestimonial: Omit<TestimonialContent, 'id'>) => {
    const testimonialWithId = { ...newTestimonial, id: faker.string.uuid() };
    setTestimonials([...testimonials, testimonialWithId]);
    console.log("Added Testimonial:", testimonialWithId);
  };

  const handleDeleteTestimonial = (testimonialId: string) => {
    setTestimonials(testimonials.filter(t => t.id !== testimonialId));
    console.log("Deleted Testimonial ID:", testimonialId);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{t('manage_site_content')}</h1>
      <HeroEditor content={heroContent} onSave={handleUpdateHero} />
      <FeaturesEditor features={features} onSaveFeature={handleUpdateFeature} />
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

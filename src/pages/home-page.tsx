import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Bot, Languages, Clapperboard, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

export function HomePage() {
  const { t } = useTranslation();

  const features = [
    { icon: <BarChart className="h-8 w-8 mb-4" />, title: t('features.f1_title'), desc: t('features.f1_desc') },
    { icon: <Bot className="h-8 w-8 mb-4" />, title: t('features.f2_title'), desc: t('features.f2_desc') },
    { icon: <Languages className="h-8 w-8 mb-4" />, title: t('features.f3_title'), desc: t('features.f3_desc') },
    { icon: <Clapperboard className="h-8 w-8 mb-4" />, title: t('features.f4_title'), desc: t('features.f4_desc') },
  ];

  const pricingTiers = [
    {
      name: t('pricing.free_tier'),
      price: t('pricing.free_price'),
      desc: t('pricing.free_desc'),
      features: [`10 ${t('pricing.feature_generations')}`, `1 ${t('pricing.feature_brands')}`, `Basic ${t('pricing.feature_analysis')}`],
      cta: t('pricing.cta_free'),
      variant: 'secondary' as const,
    },
    {
      name: t('pricing.pro_tier'),
      price: t('pricing.pro_price'),
      desc: t('pricing.pro_desc'),
      features: [`100 ${t('pricing.feature_generations')}`, `5 ${t('pricing.feature_brands')}`, `Advanced ${t('pricing.feature_analysis')}`, t('pricing.feature_support')],
      cta: t('pricing.cta_pro'),
      variant: 'default' as const,
      popular: true,
    },
    {
      name: t('pricing.enterprise_tier'),
      price: 'Custom',
      desc: t('pricing.enterprise_desc'),
      features: ['Unlimited Generations', 'Unlimited Brands', 'Dedicated AI Model', '24/7 Support'],
      cta: t('pricing.cta_enterprise'),
      variant: 'secondary' as const,
    },
  ];

  const testimonials = [
    { text: t('testimonials.t1_text'), author: t('testimonials.t1_author'), role: t('testimonials.t1_role') },
    { text: t('testimonials.t2_text'), author: t('testimonials.t2_author'), role: t('testimonials.t2_role') },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 text-center">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight">
              {t('hero.title')}
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              {t('hero.subtitle')}
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link to="/signup">{t('hero.cta')}</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">{t('features.title')}</h2>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-4 mt-12">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="bg-background rounded-lg p-4 inline-block">{feature.icon}</div>
                <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
                <p className="text-muted-foreground mt-2">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full py-20 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">{t('pricing.title')}</h2>
          <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-3 max-w-5xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className={`flex flex-col ${tier.popular ? 'border-primary' : ''}`}>
                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <CardDescription>{tier.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      {tier.price.startsWith('$') && <span className="text-muted-foreground">{t('pricing.monthly')}</span>}
                    </div>
                    <ul className="mt-6 space-y-4">
                      {tier.features.map(feature => (
                        <li key={feature} className="flex items-center">
                          <Check className="h-4 w-4 text-primary me-2" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant={tier.variant} className="w-full">{tier.cta}</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-20 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">{t('testimonials.title')}</h2>
          <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 max-w-4xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <p className="italic">"{testimonial.text}"</p>
                    <div className="mt-4 font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

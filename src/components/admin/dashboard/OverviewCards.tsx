import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, Bot, BarChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const mockData = {
  totalUsers: 1253,
  totalRevenue: 45231.89,
  generatedContent: 8932,
  aiCosts: 1230.55,
};

export const OverviewCards: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });

  const cardItems = [
    {
      title: t('total_users'),
      value: mockData.totalUsers.toLocaleString(),
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      change: "+20.1% from last month",
    },
    {
      title: t('total_revenue'),
      value: `$${mockData.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      change: "+180.1% from last month",
    },
    {
      title: t('generated_content'),
      value: `+${mockData.generatedContent.toLocaleString()}`,
      icon: <Bot className="h-4 w-4 text-muted-foreground" />,
      change: "+19% from last month",
    },
    {
      title: t('ai_costs'),
      value: `$${mockData.aiCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <BarChart className="h-4 w-4 text-muted-foreground" />,
      change: "+5% from last month",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {cardItems.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

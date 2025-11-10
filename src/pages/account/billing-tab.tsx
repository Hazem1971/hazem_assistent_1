import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download } from 'lucide-react';
import { faker } from '@faker-js/faker';
import { BillingInvoice } from '@/types';

const mockInvoices: BillingInvoice[] = Array.from({ length: 5 }, (_, i) => ({
  id: faker.string.uuid(),
  date: faker.date.past({ years: 1 }).toLocaleDateString(),
  amount: parseFloat(faker.finance.amount(19, 99, 2)),
  url: '#',
}));

export const BillingTab: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'account' });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('current_plan')}</CardTitle>
          <CardDescription>You are currently on the Pro Plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">$29</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Your plan renews on July 31, 2025.</p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link to="/#pricing">{t('change_plan')}</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('billing_history')}</CardTitle>
          <CardDescription>View and download your past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('amount')}</TableHead>
                <TableHead className="text-right">{t('invoice')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <a href={invoice.url}>
                        <Download className="mr-2 h-4 w-4" />
                        {t('download')}
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

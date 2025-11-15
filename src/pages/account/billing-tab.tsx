import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Loader2 } from 'lucide-react';
import { BillingInvoice, Profile } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';

export const BillingTab: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'account' });
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillingInfo = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('billing_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error(error.message);
      } else {
        setInvoices(data);
      }
      setLoading(false);
    };

    fetchBillingInfo();
  }, [user]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('current_plan')}</CardTitle>
          <CardDescription>You are currently on the <span className="font-semibold">{user?.subscription_plan || 'Free'}</span> Plan.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* This part can be made dynamic based on the user's plan */}
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">{user?.subscription_plan === 'Pro' ? '$29' : '$0'}</span>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <a href={invoice.invoice_url} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          {t('download')}
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">No invoices found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

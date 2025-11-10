import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const models = [
  { name: 'OpenAI GPT-4', status: 'Active', cost: '$0.03 / 1K tokens' },
  { name: 'Hugging Face Llama 3', status: 'Active', cost: '$0.01 / 1K tokens' },
  { name: 'Google Gemini Pro', status: 'Inactive', cost: '$0.02 / 1K tokens' },
];

export const ModelManager: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('provider_name')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.name}>
              <TableCell className="font-medium">{model.name}</TableCell>
              <TableCell>
                <Badge variant={model.status === 'Active' ? 'default' : 'destructive'}>{model.status}</Badge>
              </TableCell>
              <TableCell>{model.cost}</TableCell>
              <TableCell className="text-right flex items-center justify-end gap-2">
                <Switch checked={model.status === 'Active'} />
                <Button variant="outline" size="sm">Configure</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

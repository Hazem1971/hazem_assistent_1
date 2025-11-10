import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Plus, Trash } from 'lucide-react';
import { faker } from '@faker-js/faker';
import { ApiKey } from '@/types';

const mockApiKeys: ApiKey[] = [
  {
    id: faker.string.uuid(),
    name: 'My Main App',
    key: `mai_...${faker.string.alphanumeric(8)}`,
    createdAt: faker.date.past().toLocaleDateString(),
    lastUsed: faker.date.recent().toLocaleDateString(),
  },
  {
    id: faker.string.uuid(),
    name: 'Test Integration',
    key: `mai_...${faker.string.alphanumeric(8)}`,
    createdAt: faker.date.past().toLocaleDateString(),
    lastUsed: null,
  },
];

export const ApiKeysTab: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'account' });
  const [keys, setKeys] = useState(mockApiKeys);
  const [newKeyName, setNewKeyName] = useState('');

  const generateKey = () => {
    if (!newKeyName) return;
    const newKey: ApiKey = {
      id: faker.string.uuid(),
      name: newKeyName,
      key: `mai_...${faker.string.alphanumeric(8)}`,
      createdAt: new Date().toLocaleDateString(),
      lastUsed: null,
    };
    setKeys([newKey, ...keys]);
    setNewKeyName('');
  };

  const revokeKey = (id: string) => {
    setKeys(keys.filter(key => key.id !== id));
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('generate_api_key')}</CardTitle>
          <CardDescription>Create a new API key to use with your integrations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input 
              type="text" 
              placeholder={t('api_key_name')} 
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
            <Button onClick={generateKey}>
              <Plus className="mr-2 h-4 w-4" /> Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('api_keys')}</CardTitle>
          <CardDescription>Your existing API keys. Don't share them with anyone.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('api_key_name')}</TableHead>
                <TableHead>{t('key')}</TableHead>
                <TableHead>{t('last_used')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell className="font-mono flex items-center gap-2">
                    {apiKey.key}
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="h-4 w-4" /></Button>
                  </TableCell>
                  <TableCell>{apiKey.lastUsed || 'Never'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm" onClick={() => revokeKey(apiKey.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      {t('revoke')}
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

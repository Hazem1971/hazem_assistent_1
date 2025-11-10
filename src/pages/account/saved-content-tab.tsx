import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Plus, Facebook, Youtube, Video } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { faker } from '@faker-js/faker';
import { GeneratedContent, Platform } from '@/types';
import { EditContentModal } from './edit-content-modal';

const mockContent: GeneratedContent[] = Array.from({ length: 20 }, () => ({
  id: faker.string.uuid(),
  platform: faker.helpers.arrayElement(['facebook', 'tiktok', 'youtube']),
  text: faker.lorem.sentence(),
  createdAt: faker.date.past().toISOString(),
}));

const platformIcons: { [key in Platform]: React.ReactNode } = {
  facebook: <Facebook className="h-5 w-5 text-blue-600" />,
  tiktok: <Video className="h-5 w-5 text-white" />,
  youtube: <Youtube className="h-5 w-5 text-red-600" />,
};

const columnHelper = createColumnHelper<GeneratedContent>();

export const SavedContentTab: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'account' });
  const [data, setData] = useState<GeneratedContent[]>(mockContent);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<GeneratedContent | null>(null);

  const handleSave = (content: GeneratedContent) => {
    if (content.id && data.some(item => item.id === content.id)) {
      setData(data.map(item => item.id === content.id ? content : item));
    } else {
      setData([{ ...content, id: faker.string.uuid(), createdAt: new Date().toISOString() }, ...data]);
    }
    setIsModalOpen(false);
    setEditingContent(null);
  };

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
  };
  
  const columns = [
    columnHelper.accessor('platform', {
      header: t('platform'),
      cell: (info) => (
        <div className="flex items-center gap-2">
          {platformIcons[info.getValue()]}
          <span className="capitalize font-medium">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('text', {
      header: t('content'),
      cell: (info) => <p className="truncate max-w-md">{info.getValue()}</p>,
    }),
    columnHelper.accessor('createdAt', {
      header: t('created_at'),
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => { setEditingContent(row.original); setIsModalOpen(true); }}>{t('edit_post')}</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(row.original.id)}>{t('delete_post')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('saved_content')}</CardTitle>
              <CardDescription>Manage all the content you've generated.</CardDescription>
            </div>
            <Button onClick={() => { setEditingContent(null); setIsModalOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> {t('create_post')}
            </Button>
          </div>
          <div className="pt-4">
            <Input
              placeholder={t('search_content')}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">No content saved yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
          </div>
        </CardContent>
      </Card>
      {isModalOpen && <EditContentModal content={editingContent} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

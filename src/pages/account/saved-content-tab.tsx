import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
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
import { MoreHorizontal, Plus, Facebook, Youtube, Video, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GeneratedContent, Platform } from '@/types';
import { EditContentModal } from './edit-content-modal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

const platformIcons: { [key in Platform]: React.ReactNode } = {
  facebook: <Facebook className="h-5 w-5 text-blue-600" />,
  tiktok: <Video className="h-5 w-5 text-white" />,
  youtube: <Youtube className="h-5 w-5 text-red-600" />,
};

const columnHelper = createColumnHelper<GeneratedContent>();

export const SavedContentTab: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'account' });
  const { user } = useAuth();
  const [data, setData] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<GeneratedContent | null>(null);

  const isLocalUser = user?.app_metadata?.provider === 'local';

  useEffect(() => {
    const fetchContent = async () => {
      if (!user) return;
      setLoading(true);

      if (isLocalUser) {
        // Local Storage Mock for Test User
        const localData = localStorage.getItem('mai_local_content');
        setData(localData ? JSON.parse(localData) : []);
        setLoading(false);
        return;
      }

      const { data: content, error } = await supabase
        .from('generated_content')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error(error.message);
      } else {
        setData(content || []);
      }
      setLoading(false);
    };
    fetchContent();
  }, [user, isLocalUser]);

  const saveToLocal = (newData: GeneratedContent[]) => {
    localStorage.setItem('mai_local_content', JSON.stringify(newData));
    setData(newData);
  };

  const handleSave = async (content: GeneratedContent) => {
    if (isLocalUser) {
      // Handle Local User Save
      if (content.id) {
        const updatedData = data.map(item => item.id === content.id ? { ...content, updated_at: new Date().toISOString() } : item);
        saveToLocal(updatedData);
        toast.success('Content updated (Local Mode)!');
      } else {
        const newContent = { 
          ...content, 
          id: crypto.randomUUID(), 
          user_id: user!.id, 
          created_at: new Date().toISOString() 
        };
        saveToLocal([newContent, ...data]);
        toast.success('Content created (Local Mode)!');
      }
      setIsModalOpen(false);
      setEditingContent(null);
      return;
    }

    // Handle Real Supabase User Save
    if (content.id) { 
      const { data: updatedContent, error } = await supabase
        .from('generated_content')
        .update({ text: content.text, platform: content.platform })
        .eq('id', content.id)
        .select()
        .single();
      if (error) {
        toast.error(error.message);
      } else {
        setData(data.map(item => item.id === content.id ? updatedContent : item));
        toast.success('Content updated!');
      }
    } else { 
      if (!user) return;
      const { data: newContent, error } = await supabase
        .from('generated_content')
        .insert({ ...content, user_id: user.id })
        .select()
        .single();
      if (error) {
        toast.error(error.message);
      } else {
        setData([newContent, ...data]);
        toast.success('Content created!');
      }
    }
    setIsModalOpen(false);
    setEditingContent(null);
  };

  const handleDelete = async (id: string) => {
    if (isLocalUser) {
      const filteredData = data.filter(item => item.id !== id);
      saveToLocal(filteredData);
      toast.success('Content deleted (Local Mode)!');
      return;
    }

    const { error } = await supabase.from('generated_content').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      setData(data.filter(item => item.id !== id));
      toast.success('Content deleted!');
    }
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
    columnHelper.accessor('created_at', {
      header: t('created_at'),
      cell: (info) => {
        try {
          return new Date(info.getValue()).toLocaleDateString();
        } catch {
          return 'N/A';
        }
      },
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
              <CardDescription>
                {isLocalUser 
                  ? "Manage your generated content (Local Test Mode)." 
                  : "Manage all the content you've generated."}
              </CardDescription>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
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

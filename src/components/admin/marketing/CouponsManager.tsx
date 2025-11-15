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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Plus, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Coupon } from '@/types';
import { CouponFormModal } from './CouponFormModal';
import { supabase } from '@/lib/supabase';

const columnHelper = createColumnHelper<Coupon>();

export const CouponsManager: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('coupons').select('*').order('created_at');
      if (error) {
        toast.error(error.message);
      } else {
        setCoupons(data);
      }
      setLoading(false);
    };
    fetchCoupons();
  }, []);

  const handleSaveCoupon = async (couponToSave: Coupon) => {
    if (couponToSave.id) {
      const { data, error } = await supabase
        .from('coupons')
        .update({ ...couponToSave, id: undefined, created_at: undefined })
        .eq('id', couponToSave.id)
        .select()
        .single();
      if (error) {
        toast.error(error.message);
      } else {
        setCoupons(coupons.map(c => c.id === data.id ? data : c));
        toast.success('Coupon updated!');
      }
    } else {
      const { data, error } = await supabase
        .from('coupons')
        .insert(couponToSave)
        .select()
        .single();
      if (error) {
        toast.error(error.message);
      } else {
        setCoupons([...coupons, data]);
        toast.success('Coupon created!');
      }
    }
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      const { error } = await supabase.from('coupons').delete().eq('id', couponId);
      if (error) {
        toast.error(error.message);
      } else {
        setCoupons(coupons.filter(c => c.id !== couponId));
        toast.success('Coupon deleted!');
      }
    }
  };
  
  const handleOpenModal = (coupon: Coupon | null) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const columns = [
    columnHelper.accessor('code', { header: t('coupon_code'), cell: info => <Badge variant="outline">{info.getValue()}</Badge> }),
    columnHelper.accessor(row => `${row.discount_value}${row.discount_type === 'percentage' ? '%' : '$'}`, { id: 'discount', header: t('discount') }),
    columnHelper.accessor('is_active', { header: t('status'), cell: info => <Badge variant={info.getValue() ? 'default' : 'destructive'}>{info.getValue() ? t('active') : t('inactive')}</Badge> }),
    columnHelper.accessor(row => `${row.usage_count}${row.usage_limit ? `/${row.usage_limit}` : ''}`, { id: 'usage', header: t('usage') }),
    columnHelper.accessor('expires_at', { header: t('expires_at'), cell: info => info.getValue() ? new Date(info.getValue() as string).toLocaleDateString() : 'Never' }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleOpenModal(row.original)}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteCoupon(row.original.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ];

  const table = useReactTable({
    data: coupons,
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
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder={t('search_coupons')}
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => handleOpenModal(null)}>
          <Plus className="mr-2 h-4 w-4" /> {t('create_coupon')}
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
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
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No coupons found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isModalOpen && (
        <CouponFormModal
          coupon={editingCoupon}
          onSave={handleSaveCoupon}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

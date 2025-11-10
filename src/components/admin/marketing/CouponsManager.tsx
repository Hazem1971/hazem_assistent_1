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
import { MoreHorizontal, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { faker } from '@faker-js/faker';
import { Coupon } from '@/types';
import { CouponFormModal } from './CouponFormModal';

const mockCoupons: Coupon[] = [
  { id: '1', code: 'BLACKFRIDAY20', discountType: 'percentage', discountValue: 20, usageCount: 45, usageLimit: 100, isActive: true, expiresAt: '2025-11-30' },
  { id: '2', code: 'WELCOME10', discountType: 'fixed', discountValue: 10, usageCount: 152, isActive: true },
  { id: '3', code: 'EXPIRED', discountType: 'percentage', discountValue: 50, usageCount: 10, usageLimit: 10, isActive: false, expiresAt: '2024-01-01' },
];

const columnHelper = createColumnHelper<Coupon>();

export const CouponsManager: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const handleSaveCoupon = (couponToSave: Coupon) => {
    if (couponToSave.id) {
      setCoupons(coupons.map(c => c.id === couponToSave.id ? couponToSave : c));
    } else {
      const newCoupon = { ...couponToSave, id: faker.string.uuid(), usageCount: 0, isActive: true };
      setCoupons([...coupons, newCoupon]);
    }
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = (couponId: string) => {
    setCoupons(coupons.filter(c => c.id !== couponId));
  };
  
  const handleOpenModal = (coupon: Coupon | null) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const columns = [
    columnHelper.accessor('code', { header: t('coupon_code'), cell: info => <Badge variant="outline">{info.getValue()}</Badge> }),
    columnHelper.accessor(row => `${row.discountValue}${row.discountType === 'percentage' ? '%' : '$'}`, { id: 'discount', header: t('discount') }),
    columnHelper.accessor('isActive', { header: t('status'), cell: info => <Badge variant={info.getValue() ? 'default' : 'destructive'}>{info.getValue() ? t('active') : t('inactive')}</Badge> }),
    columnHelper.accessor(row => `${row.usageCount}${row.usageLimit ? `/${row.usageLimit}` : ''}`, { id: 'usage', header: t('usage') }),
    columnHelper.accessor('expiresAt', { header: t('expires_at'), cell: info => info.getValue() ? new Date(info.getValue() as string).toLocaleDateString() : 'Never' }),
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
            {table.getRowModel().rows?.length ? (
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
                  No results.
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

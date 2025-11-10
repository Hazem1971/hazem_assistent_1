import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
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
import { Plan } from '@/types';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SubscriptionPlansProps {
  plans: Plan[];
  onEdit: (plan: Plan) => void;
  onDelete: (planId: string) => void;
}

const columnHelper = createColumnHelper<Plan>();

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ plans, onEdit, onDelete }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });

  const columns = [
    columnHelper.accessor('name', {
      header: t('plan_name'),
      cell: (info) => <div className="font-medium">{info.getValue()}</div>,
    }),
    columnHelper.accessor('price', {
      header: t('price'),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('description', {
        header: t('plan_description'),
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('features', {
      header: t('features'),
      cell: (info) => <p className="truncate max-w-xs">{info.getValue().join(', ')}</p>,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">{t('actions')}</div>,
      cell: (props) => (
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
              <DropdownMenuItem onClick={() => onEdit(props.row.original)}>
                {t('edit_plan')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(props.row.original.id)}
              >
                {t('delete_plan')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: plans,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

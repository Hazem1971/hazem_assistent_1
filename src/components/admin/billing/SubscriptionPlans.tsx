import React, { useState } from 'react';
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
import { EditPlanModal } from './EditPlanModal';

interface SubscriptionPlansProps {
  plans: Plan[];
  onUpdatePlan: (plan: Plan) => void;
}

const columnHelper = createColumnHelper<Plan>();

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ plans, onUpdatePlan }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

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
      cell: (info) => info.getValue().join(', '),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">{t('actions')}</div>,
      cell: (props) => (
        <div className="text-right">
          <Button variant="outline" size="sm" onClick={() => setEditingPlan(props.row.original)}>
            Edit
          </Button>
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
    <>
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
      {editingPlan && (
        <EditPlanModal
          plan={editingPlan}
          onSave={(updatedPlan) => {
            onUpdatePlan(updatedPlan);
            setEditingPlan(null);
          }}
          onClose={() => setEditingPlan(null)}
        />
      )}
    </>
  );
};

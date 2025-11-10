import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TestimonialContent } from '@/types';
import { Plus, Edit, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type TestimonialFormData = Omit<TestimonialContent, 'id'> & { id?: string };

interface TestimonialsEditorProps {
  testimonials: TestimonialContent[];
  onAdd: (data: Omit<TestimonialContent, 'id'>) => void;
  onUpdate: (data: TestimonialContent) => void;
  onDelete: (id: string) => void;
}

const TestimonialFormModal: React.FC<{
  testimonial?: TestimonialContent | null;
  onSave: (data: TestimonialFormData) => void;
  onClose: () => void;
}> = ({ testimonial, onSave, onClose }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const isEditing = !!testimonial;
  const { register, handleSubmit } = useForm<TestimonialFormData>({ defaultValues: testimonial || {} });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? t('edit_testimonial') : t('add_testimonial')}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details of this testimonial.' : 'Add a new testimonial to the homepage.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="text">{t('testimonial_text')}</Label>
                <Textarea id="text" {...register('text')} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="author">{t('author_name')}</Label>
                <Input id="author" {...register('author')} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="role">{t('author_role')}</Label>
                <Input id="role" {...register('role')} />
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">{t('save_changes')}</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const TestimonialsEditor: React.FC<TestimonialsEditorProps> = ({ testimonials, onAdd, onUpdate, onDelete }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialContent | null>(null);

  const handleSave = (data: TestimonialFormData) => {
    if (data.id) {
      onUpdate(data as TestimonialContent);
    } else {
      onAdd(data);
    }
    setModalOpen(false);
    setEditingTestimonial(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('manage_testimonials')}</CardTitle>
            <CardDescription>Add, edit, or remove testimonials from the homepage.</CardDescription>
          </div>
          <Button onClick={() => { setEditingTestimonial(null); setModalOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> {t('add_testimonial')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('testimonial_text')}</TableHead>
                  <TableHead>{t('author_name')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="max-w-md truncate">{item.text}</TableCell>
                    <TableCell>{item.author}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingTestimonial(item); setModalOpen(true); }}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)} className="text-destructive hover:text-destructive">
                            <Trash className="h-4 w-4" />
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {isModalOpen && (
        <TestimonialFormModal
          testimonial={editingTestimonial}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingTestimonial(null); }}
        />
      )}
    </>
  );
};

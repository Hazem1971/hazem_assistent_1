import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { businessProfileSchema } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

interface BusinessProfileProps {
  onNext: (data: BusinessProfileFormData) => void;
}

const businessTypes = [
  "Cafe", "Restaurant", "E-commerce Store", "Consulting Agency", "Fitness Studio", "Tech Startup"
];

export const BusinessProfile: React.FC<BusinessProfileProps> = ({ onNext }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema),
  });

  const businessType = watch('businessType');

  return (
    <Card>
      <form onSubmit={handleSubmit(onNext)}>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>Tell us about your business to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="business-type">Business Type</Label>
              <Select onValueChange={(value) => setValue('businessType', value, { shouldValidate: true })} value={businessType}>
                <SelectTrigger id="business-type">
                  <SelectValue placeholder="Select a business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.businessType && <p className="text-sm text-destructive">{errors.businessType.message}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit">Next</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

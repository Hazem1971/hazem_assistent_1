import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Profile } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ViewUserModalProps {
  user: Profile;
  onClose: () => void;
}

export const ViewUserModal: React.FC<ViewUserModalProps> = ({ user, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>Detailed view of the user's account information.</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} />
              <AvatarFallback className="text-lg">{user.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{user.full_name || 'No Name'}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                <Badge variant="outline">{user.subscription_plan || 'Free'}</Badge>
                {user.subscription_status && (
                    <Badge variant={user.subscription_status === 'active' ? 'default' : 'destructive'} className="bg-green-500 hover:bg-green-600">
                        {user.subscription_status}
                    </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">User ID</Label>
              <p className="text-sm font-mono bg-muted p-1 rounded truncate">{user.id}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Company</Label>
              <p className="text-sm">{user.company || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Joined Date</Label>
              <p className="text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Last Payment</Label>
              <p className="text-sm">{user.payment_date ? new Date(user.payment_date).toLocaleDateString() : 'Never'}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

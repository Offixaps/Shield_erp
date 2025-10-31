
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { NewBusiness } from '@/lib/data';

type CompleteVettingDialogProps = {
  client: NewBusiness;
  onUpdate: (newStatus: NewBusiness['onboardingStatus'], updates?: Partial<NewBusiness>) => void;
};

export default function CompleteVettingDialog({ client, onUpdate }: CompleteVettingDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [vettingStatus, setVettingStatus] = React.useState<'Successful' | 'Unsuccessful'>('Successful');
  const [remarks, setRemarks] = React.useState('');

  const handleConfirm = () => {
    if (vettingStatus === 'Unsuccessful' && !remarks) {
      toast({
        variant: 'destructive',
        title: 'Remarks Required',
        description: 'Please provide remarks explaining why the vetting was unsuccessful.',
      });
      return;
    }

    try {
      if (vettingStatus === 'Successful') {
        onUpdate('Vetting Completed', { vettingNotes: undefined });
      } else {
        onUpdate('Rework Required', { vettingNotes: remarks });
      }
      setOpen(false);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "An unexpected error occurred while updating the vetting status."
        })
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FileCheck className="mr-2 h-4 w-4" />
          Complete Vetting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Vetting for {client.client}</DialogTitle>
          <DialogDescription>
            Certify that the policy information is in order or provide remarks for rework.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup value={vettingStatus} onValueChange={(value) => setVettingStatus(value as 'Successful' | 'Unsuccessful')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Successful" id="r1" />
              <Label htmlFor="r1">Vetting Successful</Label>
            </div>
             <p className="text-sm text-muted-foreground pl-6">
                I have gone through all the policy information provided and certify that everything is in order.
            </p>
            <div className="flex items-center space-x-2 pt-4">
              <RadioGroupItem value="Unsuccessful" id="r2" />
              <Label htmlFor="r2">Vetting Unsuccessful</Label>
            </div>
          </RadioGroup>

          {vettingStatus === 'Unsuccessful' && (
            <div className="grid w-full gap-1.5 pl-6 pt-2">
              <Label htmlFor="remarks">Remarks for Business Development</Label>
              <Textarea 
                placeholder="Provide notes as to why the vetting was not successful..." 
                id="remarks" 
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

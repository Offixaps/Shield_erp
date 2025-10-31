
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
import { ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { NewBusiness } from '@/lib/data';
import { updatePolicy } from '@/lib/policy-service';

type VerifyMandateDialogProps = {
  client: NewBusiness;
  onUpdate: (updatedPolicy: NewBusiness) => void;
};

export default function VerifyMandateDialog({ client, onUpdate }: VerifyMandateDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [verificationStatus, setVerificationStatus] = React.useState<'Successful' | 'Unsuccessful'>('Successful');
  const [remarks, setRemarks] = React.useState('');

  const handleConfirm = () => {
    if (verificationStatus === 'Unsuccessful' && !remarks) {
      toast({
        variant: 'destructive',
        title: 'Remarks Required',
        description: 'Please provide remarks explaining why the mandate verification was unsuccessful.',
      });
      return;
    }

    try {
      let updatedPolicy;
      if (verificationStatus === 'Successful') {
        updatedPolicy = updatePolicy(client.id, { 
            onboardingStatus: 'Mandate Verified',
            policyStatus: 'Active', 
            mandateReworkNotes: undefined 
        });
      } else {
        updatedPolicy = updatePolicy(client.id, { onboardingStatus: 'Mandate Rework Required', mandateReworkNotes: remarks });
      }

      if (updatedPolicy) {
        onUpdate(updatedPolicy);
      }

      setOpen(false);

      if (updatedPolicy?.onboardingStatus === 'Mandate Verified') {
        toast({
            title: "Mandate Verified",
            description: `Mandate for ${client.client} has been verified and the policy is now Active.`
        });
      } else {
          toast({
            title: "Mandate Rework Required",
            description: `Mandate for ${client.client} sent back for rework.`
        });
      }

    } catch (error) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "An unexpected error occurred while updating the mandate status."
        })
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Verify Mandate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Mandate for {client.client}</DialogTitle>
          <DialogDescription>
            Confirm if the mandate submitted to the bank was successfully verified.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup value={verificationStatus} onValueChange={(value) => setVerificationStatus(value as 'Successful' | 'Unsuccessful')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Successful" id="r1" />
              <Label htmlFor="r1">Mandate Successfully Verified</Label>
            </div>
             <p className="text-sm text-muted-foreground pl-6">
                The mandate was submitted to the bank and was successfully verified. The policy will become active.
            </p>
            <div className="flex items-center space-x-2 pt-4">
              <RadioGroupItem value="Unsuccessful" id="r2" />
              <Label htmlFor="r2">Mandate Verification Unsuccessful</Label>
            </div>
          </RadioGroup>

          {verificationStatus === 'Unsuccessful' && (
            <div className="grid w-full gap-1.5 pl-6 pt-2">
              <Label htmlFor="remarks">Remarks for Business Development</Label>
              <Textarea 
                placeholder="Provide notes as to why the mandate verification failed..." 
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

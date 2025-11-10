

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { NewBusiness } from '@/lib/data';
import { updatePolicy } from '@/lib/policy-service';
import { differenceInYears } from 'date-fns';

type AcceptPolicyDialogProps = {
  client: NewBusiness;
  onUpdate: (updatedPolicy: NewBusiness) => void;
};

export default function AcceptPolicyDialog({ client, onUpdate }: AcceptPolicyDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const [policyNumber, setPolicyNumber] = React.useState('');
  const [finalPremium, setFinalPremium] = React.useState(
    client.premium.toString()
  );
  const [finalSumAssured, setFinalSumAssured] = React.useState(client.sumAssured.toString());

  const handleAccept = () => {
    
    if (!policyNumber.match(/^[TE]\d{7}$/)) {
        toast({
            variant: 'destructive',
            title: 'Invalid Policy Number',
            description: 'Policy number must start with "T" or "E" followed by 7 digits (e.g., T1234567).'
        });
        return;
    }

    try {
        const today = new Date();
        const commencementDate = today.toISOString().split('T')[0];

        // Recalculate terms based on new commencement date
        // NOTE: The full DOB is not in the client object, using a placeholder.
        // In a real app, you'd fetch the full client record.
        const dob = new Date('1985-05-20'); 
        const ageAtCommencement = differenceInYears(today, dob);
        
        const newPolicyTerm = 75 - ageAtCommencement;
        const newPremiumTerm = 65 - ageAtCommencement;

        const newExpiryDate = new Date(today);
        newExpiryDate.setFullYear(newExpiryDate.getFullYear() + newPolicyTerm);

        const updatedPolicy = updatePolicy(client.id, {
            policy: policyNumber,
            premium: parseFloat(finalPremium),
            sumAssured: parseFloat(finalSumAssured),
            onboardingStatus: 'Pending Mandate',
            commencementDate: commencementDate,
            expiryDate: newExpiryDate.toISOString().split('T')[0],
            policyTerm: newPolicyTerm,
            premiumTerm: newPremiumTerm,
        });
        
        if (updatedPolicy) {
            onUpdate(updatedPolicy);
            toast({
                title: 'Policy Accepted',
                description: `Policy for ${client.client} accepted. Now pending mandate verification.`,
            });
            setOpen(false);
        } else {
            throw new Error('Could not find the policy to update.');
        }
    } catch (error) {
        console.error("Failed to accept policy:", error);
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <ShieldCheck className="mr-2 h-4 w-4" />
          Accept Policy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Accept & Finalize Policy</DialogTitle>
          <DialogDescription>
            Enter the final details for this policy before moving to mandate verification.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="policy-number" className="text-right">
              Policy Number
            </Label>
            <Input
              id="policy-number"
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
              className="col-span-3"
              placeholder="e.g. T1234567"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="final-premium" className="text-right">
              Final Premium
            </Label>
            <Input
              id="final-premium"
              type="number"
              value={finalPremium}
              onChange={(e) => setFinalPremium(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="final-sum-assured" className="text-right">
              Final Sum Assured
            </Label>
            <Input
              id="final-sum-assured"
              type="number"
              value={finalSumAssured}
              onChange={(e) => setFinalSumAssured(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleAccept}>Accept & Request Mandate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

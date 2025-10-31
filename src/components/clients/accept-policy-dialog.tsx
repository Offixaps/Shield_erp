

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
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { NewBusiness } from '@/lib/data';
import { updatePolicy } from '@/lib/policy-service';

type AcceptPolicyDialogProps = {
  client: NewBusiness;
  onUpdate: (updatedPolicy: NewBusiness) => void;
};

export default function AcceptPolicyDialog({ client, onUpdate }: AcceptPolicyDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const [policyNumber, setPolicyNumber] = React.useState(client.policy);
  const [finalPremium, setFinalPremium] = React.useState(
    client.premium.toString()
  );
  const [finalSumAssured, setFinalSumAssured] = React.useState(client.sumAssured.toString());

  const handleAccept = () => {
    try {
        const updatedPolicy = updatePolicy(client.id, {
            policy: policyNumber,
            premium: parseFloat(finalPremium),
            sumAssured: parseFloat(finalSumAssured),
            onboardingStatus: 'Accepted',
            policyStatus: 'Active',
            commencementDate: new Date().toISOString().split('T')[0], // Set commencement to today
        });
        
        if (updatedPolicy) {
            onUpdate(updatedPolicy);
            toast({
                title: 'Policy Accepted',
                description: `Policy for ${client.client} has been accepted and updated.`,
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
          <CheckCircle className="mr-2 h-4 w-4" />
          Accept Policy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Accept Policy</DialogTitle>
          <DialogDescription>
            Enter the final details for this policy before acceptance.
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
          <Button onClick={handleAccept}>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

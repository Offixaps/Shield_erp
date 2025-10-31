
'use client';

import * as React from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { NewBusiness } from '@/lib/data';
import { updatePolicy } from '@/lib/policy-service';

type ConfirmFirstPremiumDialogProps = {
  client: NewBusiness;
  onUpdate: (updatedPolicy: NewBusiness) => void;
};

export default function ConfirmFirstPremiumDialog({
  client,
  onUpdate,
}: ConfirmFirstPremiumDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const [transactionId, setTransactionId] = React.useState('');
  const [amountPaid, setAmountPaid] = React.useState(
    client.premium.toString()
  );
  const [paymentDate, setPaymentDate] = React.useState<Date | undefined>(
    new Date()
  );

  const handleConfirm = () => {
    if (!paymentMethod || !transactionId || !amountPaid || !paymentDate) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all required payment details before confirming.',
      });
      return;
    }
    
    try {
      // New workflow: After premium is confirmed, status moves to 'Pending Vetting'
      const updatedPolicy = updatePolicy(client.id, {
        onboardingStatus: 'Pending Vetting',
        billingStatus: 'First Premium Paid',
        firstPremiumPaid: true,
      });

      if (updatedPolicy) {
        onUpdate(updatedPolicy);
        toast({
          title: "First Premium Confirmed",
          description: `Policy for ${client.client} sent for vetting.`
        });
        setOpen(false);
      } else {
        throw new Error('Policy not found');
      }

    } catch (error) {
        console.error("Failed to confirm first premium:", error);
        toast({
            variant: "destructive",
            title: "Confirmation Failed",
            description: "An unexpected error occurred while confirming the premium."
        })
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <CheckCircle className="mr-2 h-4 w-4" />
          Confirm First Premium
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm First Premium Payment</DialogTitle>
          <DialogDescription>
            Enter the payment details received for client: {client.client}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payment-method" className="text-right">
              Payment Method
            </Label>
            <Select onValueChange={setPaymentMethod} value={paymentMethod}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile-money">Mobile Money</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="payment-slip">Payment Slip</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="transaction-id" className="text-right">
              Transaction ID
            </Label>
            <Input
              id="transaction-id"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount-paid" className="text-right">
              Amount Paid
            </Label>
            <Input
              id="amount-paid"
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payment-date" className="text-right">
              Payment Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'col-span-3 justify-start text-left font-normal',
                    !paymentDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {paymentDate ? (
                    format(paymentDate, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={paymentDate}
                  onSelect={setPaymentDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleConfirm}>Confirm Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

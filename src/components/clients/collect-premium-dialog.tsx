
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
import { CalendarIcon, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { NewBusiness } from '@/lib/data';
import { recordPayment } from '@/lib/policy-service';

type CollectPremiumDialogProps = {
  client: NewBusiness;
  onUpdate: (updatedPolicy: NewBusiness) => void;
};

export default function CollectPremiumDialog({
  client,
  onUpdate,
}: CollectPremiumDialogProps) {
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
      const updatedPolicy = recordPayment(client.id, {
        amount: parseFloat(amountPaid),
        paymentDate: format(paymentDate, 'yyyy-MM-dd'),
        method: paymentMethod,
        transactionId: transactionId,
      });


      if (updatedPolicy) {
        onUpdate(updatedPolicy);
        toast({
          title: "Premium Collected",
          description: `Payment for ${client.client} has been recorded.`
        });
        setOpen(false);
      } else {
        throw new Error('Policy not found or no unpaid bill available to match payment.');
      }

    } catch (error) {
        console.error("Failed to collect premium:", error);
        toast({
            variant: "destructive",
            title: "Collection Failed",
            description: error instanceof Error ? error.message : "An unexpected error occurred while recording the premium."
        })
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Banknote className="mr-2 h-4 w-4" />
          Collect Premium
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Collect Premium Payment</DialogTitle>
          <DialogDescription>
            Record a new premium payment for client: {client.client}
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
                <SelectItem value="payment-slip">Pay-In-Slip</SelectItem>
                 <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="debit-order">Debit Order</SelectItem>
                <SelectItem value="standing-order">Standing Order</SelectItem>
                <SelectItem value="stop-order">Stop Order</SelectItem>
                <SelectItem value="controller">Controller</SelectItem>
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
                  onSelect={(date) => {
                    setPaymentDate(date);
                    setOpen(false);
                  }}
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
          <Button onClick={handleConfirm}>Record Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

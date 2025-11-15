
'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import SignaturePadComponent from './signature-pad';

const idTypes = [
  "Driver's License",
  'Passport',
  'Voter ID',
  'National ID',
  'SSNIT',
  'NHIS',
  'TIN',
] as const;

const bankNames = [
  'Absa Bank Ghana Limited',
  'Access Bank (Ghana) Plc',
  'Agricultural Development Bank Plc',
  'Bank of Africa Ghana Limited',
  'CalBank PLC',
  'Consolidated Bank Ghana Limited',
  'Ecobank Ghana PLC',
  'FBNBank (Ghana) Limited',
  'Fidelity Bank Ghana Limited',
  'First Atlantic Bank Limited',
  'First National Bank (Ghana) Limited',
  'GCB Bank PLC',
  'Guaranty Trust Bank (Ghana) Limited',
  'National Investment Bank Limited',
  'OmniBSIC Bank Ghana Limited',
  'Prudential Bank Limited',
  'Republic Bank (Ghana) PLC',
  'Societe Generale Ghana PLC',
  'Stanbic Bank Ghana Limited',
  'Standard Chartered Bank Ghana PLC',
  'United Bank for Africa (Ghana) Limited',
  'Universal Merchant Bank Limited',
  'Zenith Bank (Ghana) Limited',
];


type FormValues = any; // Replace with your form schema type

type PaymentDetailsTabProps = {
  form: UseFormReturn<FormValues>;
  payerDobOpen: boolean;
  setPayerDobOpen: (open: boolean) => void;
  payerIssueDateOpen: boolean;
  setPayerIssueDateOpen: (open: boolean) => void;
  payerExpiryDateOpen: boolean;
  setPayerExpiryDateOpen: (open: boolean) => void;
};

export default function PaymentDetailsTab({
  form,
  payerDobOpen,
  setPayerDobOpen,
  payerIssueDateOpen,
  setPayerIssueDateOpen,
  payerExpiryDateOpen,
  setPayerExpiryDateOpen,
}: PaymentDetailsTabProps) {
  const isPolicyHolderPayer = form.watch('isPolicyHolderPayer');

  return (
    <div className="space-y-8">
      <div>
        <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
          <h3>Premium Payer Details</h3>
        </div>
        <Separator className="my-0" />
        <div className="p-4 border border-t-0 rounded-b-md space-y-6">
          <FormField
            control={form.control}
            name="isPolicyHolderPayer"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Is the Life Assured also the Premium Payer?</FormLabel>
                  <FormDescription>
                    If not, you will be required to provide the details of the premium payer below.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {!isPolicyHolderPayer && (
            <div className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="premiumPayerOtherNames"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payer's First/Other Names</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Adwoa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="premiumPayerSurname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payer's Surname</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mensah" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="premiumPayerOccupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payer's Occupation</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Accountant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="premiumPayerRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship to Life Assured</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Spouse" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                  control={form.control}
                  name="premiumPayerDob"
                  render={({ field }) => (
                  <FormItem className="flex flex-col">
                      <FormLabel>Payer's Date of Birth</FormLabel>
                      <Popover open={payerDobOpen} onOpenChange={setPayerDobOpen}>
                      <PopoverTrigger asChild>
                          <FormControl>
                          <Button
                              variant={'outline'}
                              className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                              )}
                          >
                              {field.value ? (
                              format(field.value, 'PPP')
                              ) : (
                              <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                          </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setPayerDobOpen(false);
                          }}
                          initialFocus
                           disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                          }
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          />
                      </PopoverContent>
                      </Popover>
                      <FormMessage />
                  </FormItem>
                  )}
                />
              <FormField
                  control={form.control}
                  name="premiumPayerBusinessName"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Name of Business (If applicable)</FormLabel>
                      <FormControl>
                      <Input placeholder="e.g., Mensah & Co." {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
                />
              <FormField
                  control={form.control}
                  name="premiumPayerResidentialAddress"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Payer's Residential Address</FormLabel>
                      <FormControl>
                      <Input {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="premiumPayerPostalAddress"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Payer's Postal Address</FormLabel>
                      <FormControl>
                      <Input {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
                />

                <Separator />
                <h4 className="text-md font-medium">Payer's Identification</h4>
                 <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
              <FormField
                control={form.control}
                name="premiumPayerIdType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>National ID</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {idTypes.map(idType => (
                            <SelectItem key={idType} value={idType}>{idType}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="premiumPayerIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., GHA-123456789-0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="premiumPayerPlaceOfIssue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place of Issue</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Accra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="premiumPayerIssueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Issue Date</FormLabel>
                    <Popover open={payerIssueDateOpen} onOpenChange={setPayerIssueDateOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                           onSelect={(date) => {
                            field.onChange(date);
                            setPayerIssueDateOpen(false);
                          }}
                          initialFocus
                          disabled={(date) => date > new Date()}
                          captionLayout="dropdown-buttons"
                          fromYear={1980}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="premiumPayerExpiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date</FormLabel>
                    <Popover open={payerExpiryDateOpen} onOpenChange={setPayerExpiryDateOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setPayerExpiryDateOpen(false);
                          }}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          captionLayout="dropdown-buttons"
                          fromYear={new Date().getFullYear()}
                          toYear={new Date().getFullYear() + 20}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            </div>
          )}
        </div>
      </div>

       <div>
        <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
          <h3>Payment Mandate</h3>
        </div>
        <Separator className="my-0" />
        <div className="p-4 border border-t-0 rounded-b-md space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select bank" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {bankNames.map((bank) => (
                                <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bankBranch"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bank Branch</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Accra Main" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="sortCode"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Sort Code</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., 040101" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Account Type</FormLabel>
                         <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Current">Current</SelectItem>
                                <SelectItem value="Savings">Savings</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="bankAccountName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bank Account Name</FormLabel>
                        <FormControl>
                        <Input placeholder="Full name on account" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bankAccountNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bank Account Number</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter account number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="md:col-span-2">
                    <FormField
                        control={form.control}
                        name="amountInWords"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Premium Amount in Words</FormLabel>
                            <FormControl>
                                <Input disabled {...field} />
                            </FormControl>
                            <FormDescription>This is automatically generated based on the premium amount.</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>
            <Separator />
            <FormField
              control={form.control}
              name="paymentAuthoritySignature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Premium Payer's Signature for Payment Authority</FormLabel>
                  <FormControl>
                    <SignaturePadComponent
                      initialUrl={field.value}
                      onSave={(dataUrl) => field.onChange(dataUrl)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
      </div>
    </div>
  );
}

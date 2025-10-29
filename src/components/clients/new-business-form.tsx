'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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

const formSchema = z
  .object({
    // Client Details
    applicantName: z.string().min(2, 'Applicant name must be at least 2 characters.'),
    applicantDob: z.date({ required_error: 'Applicant date of birth is required.' }),
    lifeAssuredName: z.string().min(2, 'Life Assured name must be at least 2 characters.'),
    lifeAssuredDob: z.date({ required_error: 'Date of birth is required.' }),
    applicantEmail: z.string().email('Invalid email address.'),
    applicantPhone: z.string().min(10, 'Applicant Telephone Number must be at least 10 digits.'),
    applicantAddress: z.string().min(5, 'Applicant postal address is required.'),
    lifeAssuredEmail: z.string().email('Invalid email address.').optional().or(z.literal('')),
    ageNextBirthday: z.coerce.number().optional(),

    // Policy Details
    contractType: z.enum([
      'Buy Term and Invest in Mutual Fund',
      'The Education Policy',
    ]),
    policyNumber: z
      .string()
      .regex(
        /^[TE]\d{7}$/,
        'Policy number must start with "T" or "E" followed by 7 digits (e.g., T1234567).'
      ),
    commencementDate: z.date({ required_error: 'A start date is required.' }),
    premiumTerm: z.coerce.number().positive('Premium term must be a positive number of years.'),
    policyTerm: z.coerce.number().positive('Policy term must be a positive number of years.'),
    premiumAmount: z.coerce
      .number()
      .positive('Premium amount must be a positive number.'),
    sumAssured: z.coerce
      .number()
      .positive('Sum assured must be a positive number.'),
    paymentFrequency: z.enum(['Monthly', 'Annually', 'Quarterly', 'Bi-Annually']),
    increaseMonth: z.string().min(1, 'Increase month is required.'),
    notes: z.string().optional(),

    // Payment Details
    premiumPayerName: z.string().min(2, 'Premium Payer name is required.'),
    premiumPayerOccupation: z.string().min(2, 'Premium Payer occupation is required.'),
    bankName: z.string().min(2, 'Bank name is required.'),
    bankBranch: z.string().min(2, 'Bank branch is required.'),
  })
  .refine(
    (data) => {
      if (data.contractType === 'Buy Term and Invest in Mutual Fund') {
        return data.policyNumber.startsWith('T');
      }
      return true;
    },
    {
      message:
        'Policy number must start with "T" for "Buy Term and Invest in Mutual Fund".',
      path: ['policyNumber'],
    }
  )
  .refine(
    (data) => {
      if (data.contractType === 'The Education Policy') {
        return data.policyNumber.startsWith('E');
      }
      return true;
    },
    {
      message: 'Policy number must start with "E" for "The Education Policy".',
      path: ['policyNumber'],
    }
  );

export default function NewBusinessForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicantName: '',
      applicantEmail: '',
      applicantPhone: '',
      applicantAddress: '',
      lifeAssuredName: '',
      lifeAssuredEmail: '',
      ageNextBirthday: 0,
      policyNumber: '',
      premiumTerm: 0,
      policyTerm: 0,
      premiumAmount: 0,
      sumAssured: 0,
      increaseMonth: '',
      notes: '',
      premiumPayerName: '',
      premiumPayerOccupation: '',
      bankName: '',
      bankBranch: '',
      contractType: undefined,
      paymentFrequency: undefined,
      applicantDob: undefined,
      lifeAssuredDob: undefined,
    },
  });

  const commencementDate = form.watch('commencementDate');
  const lifeAssuredDob = form.watch('lifeAssuredDob');

  React.useEffect(() => {
    if (commencementDate) {
      form.setValue('increaseMonth', format(commencementDate, 'MMMM'));
    }
  }, [commencementDate, form]);

  React.useEffect(() => {
    if (lifeAssuredDob) {
      const today = new Date();
      let age = today.getFullYear() - lifeAssuredDob.getFullYear();
      const monthDiff = today.getMonth() - lifeAssuredDob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < lifeAssuredDob.getDate())) {
        // Birthday hasn't happened this year yet
      } else {
        // Birthday has already passed this year
        age += 1;
      }
      form.setValue('ageNextBirthday', age);
    }
  }, [lifeAssuredDob, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Form Submitted',
      description: 'New client and policy details have been captured.',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h3 className="text-lg font-medium">Client Details</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="applicantName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Applicant Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="applicantDob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Applicant Date of Birth</FormLabel>
                <Popover>
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
                      onSelect={field.onChange}
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
            name="lifeAssuredName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Life Assured Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="lifeAssuredDob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Life Assured Date of Birth</FormLabel>
                <Popover>
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
                      onSelect={field.onChange}
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
            name="ageNextBirthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age (Next Birthday)</FormLabel>
                <FormControl>
                  <Input type="number" disabled {...field} />
                </FormControl>
                <FormDescription>
                  This is the age of the Life Assured.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="applicantEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Applicant Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="applicant.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="applicantPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Applicant Telephone Number</FormLabel>
                <FormControl>
                  <Input placeholder="024 123 4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="applicantAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Applicant postal address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, Accra" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="lifeAssuredEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Life Assured Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="life.assured@example.com" {...field} />
                </FormControl>
                <FormDescription>Optional: Email of the person whose life is assured.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h3 className="mt-8 text-lg font-medium">Policy Details</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="contractType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a policy type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Buy Term and Invest in Mutual Fund">
                      Buy Term and Invest in Mutual Fund
                    </SelectItem>
                    <SelectItem value="The Education Policy">
                      The Education Policy
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="policyNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Policy Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., T1234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="commencementDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Policy Commencement Date</FormLabel>
                <Popover>
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
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="policyTerm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Policy Term (years)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="premiumTerm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Premium Term (years)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="sumAssured"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Life Cover (Sum Assured)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10000.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="premiumAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Premium Amount (GHS)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="500.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Frequency</FormLabel>
                 <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a payment frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Bi-Annually">Bi-Annually</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="increaseMonth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Increase Month</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormDescription>This is automatically set from the commencement date.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h3 className="mt-8 text-lg font-medium">Payment Details</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="premiumPayerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Premium Payer Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
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
                <FormLabel>Premium Payer Occupation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Teacher" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a bank" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bankNames.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
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
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add any relevant notes about the client or policy.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

    
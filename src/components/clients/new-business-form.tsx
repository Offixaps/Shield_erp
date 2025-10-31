
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
import { newBusinessData } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { countries } from '@/lib/countries';
import { Separator } from '@/components/ui/separator';

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

const ghanaRegions = [
  'Ahafo',
  'Ashanti',
  'Bono',
  'Bono East',
  'Central',
  'Eastern',
  'Greater Accra',
  'North East',
  'Northern',
  'Oti',
  'Savannah',
  'Upper East',
  'Upper West',
  'Volta',
  'Western',
  'Western North',
] as const;

const formSchema = z
  .object({
    // Client Details
    lifeAssuredFirstName: z.string().min(2, 'First name must be at least 2 characters.'),
    lifeAssuredMiddleName: z.string().optional(),
    lifeAssuredSurname: z.string().min(2, 'Surname must be at least 2 characters.'),
    lifeAssuredDob: z.date({ required_error: 'Date of birth is required.' }),
    email: z.string().email('Invalid email address.'),
    phone: z.string().min(10, 'Telephone Number must be at least 10 digits.'),
    postalAddress: z.string().min(5, 'Postal address is required.'),
    workTelephone: z.string().optional(),
    homeTelephone: z.string().optional(),
    residentialAddress: z.string().optional(),
    gpsAddress: z.string().optional(),
    ageNextBirthday: z.coerce.number().optional(),
    maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
    dependents: z.coerce.number().min(0, 'Number of dependents cannot be negative.'),
    gender: z.enum(['Male', 'Female']),
    nationalIdType: z.enum([
      "Driver's License",
      'Passport',
      'Voter ID',
      'National ID',
      'SSNIT',
      'NHIS',
      'TIN',
    ]),
    idNumber: z.string().min(2, 'ID Number is required.'),
    issueDate: z.date({ required_error: 'Issue date is required.' }),
    expiryDate: z.date({ required_error: 'Expiry date is required.' }),
    placeOfIssue: z.string().min(2, 'Place of issue is required.'),
    country: z.string().min(2, 'Country is required.'),
    region: z.enum(ghanaRegions, { required_error: 'Region is required.' }),
    religion: z.enum(['Christian', 'Muslim', 'Traditional', 'Other']),
    nationality: z.string().min(2, 'Nationality is required.'),
    languages: z.string().min(2, 'Languages spoken is required.'),

    // Policy Details
    contractType: z.enum([
      'Buy Term and Invest in Mutual Fund',
      'The Education Policy',
    ]),
    serialNumber: z.string().regex(/^\d{4}$/, 'Serial number must be a 4-digit number.'),
    policyNumber: z
      .string()
      .regex(
        /^[TE]\d{7}$/,
        'Policy number must start with "T" or "E" followed by 7 digits (e.g., T1234567).'
      ),
    commencementDate: z.date({ required_error: 'A start date is required.' }),
    premiumTerm: z.coerce.number().positive('Premium term must be a positive number.'),
    policyTerm: z.coerce.number().positive('Policy term must be a positive number.'),
    premiumAmount: z.coerce
      .number()
      .positive('Premium amount must be a positive number.'),
    sumAssured: z.coerce
      .number()
      .positive('Sum assured must be a positive number.'),
    paymentFrequency: z.enum(['Monthly', 'Annually', 'Quarterly', 'Bi-Annually']),
    increaseMonth: z.string().min(1, 'Increase month is required.'),
    notes: z.string().optional(),

    // Employment Details
    occupation: z.string().min(2, 'Occupation is required.'),
    natureOfBusiness: z.string().min(2, 'Nature of business/work is required.'),
    employer: z.string().min(2, 'Employer is required.'),
    employerAddress: z.string().min(5, 'Employer address is required.'),
    monthlyBasicIncome: z.coerce.number().positive('Monthly basic income must be a positive number.'),
    otherIncome: z.coerce.number().min(0, 'Other income cannot be negative.'),
    totalMonthlyIncome: z.coerce.number().optional(),

    // Payment Details
    premiumPayerName: z.string().min(2, 'Premium Payer name is required.'),
    premiumPayerOccupation: z.string().min(2, 'Premium Payer occupation is required.'),
    bankName: z.string().min(2, 'Bank name is required.'),
    bankBranch: z.string().min(2, 'Bank branch is required.'),
    amountInWords: z.string().min(3, 'Amount in words is required.'),
    sortCode: z.string().min(6, 'Sort code must be at least 6 characters.'),
    accountType: z.enum(['Current', 'Savings', 'Other']),
    bankAccountName: z.string().min(2, 'Bank account name is required.'),
    bankAccountNumber: z.string().min(10, 'Bank account number must be at least 10 digits.'),
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

type NewBusinessFormProps = {
    businessId?: string;
}

export default function NewBusinessForm({ businessId }: NewBusinessFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const isEditMode = !!businessId;
  
  const defaultValues = React.useMemo(() => {
    if (isEditMode) {
      const businessData = newBusinessData.find(b => b.id.toString() === businessId);
      if (businessData) {
        const nameParts = businessData.client.split(' ');
        const firstName = nameParts[0] || '';
        const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
        const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';
        
        return {
          lifeAssuredFirstName: firstName,
          lifeAssuredMiddleName: middleName,
          lifeAssuredSurname: surname,
          policyNumber: businessData.policy,
          contractType: businessData.product as "Buy Term and Invest in Mutual Fund" | "The Education Policy",
          premiumAmount: businessData.premium,
          commencementDate: new Date(businessData.commencementDate),
          lifeAssuredDob: new Date('1985-05-20'),
          email: 'j.doe@example.com',
          phone: businessData.phone,
          postalAddress: '123 Main St, Accra',
          workTelephone: '030 123 4567',
          homeTelephone: '030 765 4321',
          residentialAddress: '456 Oak Avenue, Accra',
          gpsAddress: 'GA-123-4567',
          policyTerm: businessData.policyTerm,
          premiumTerm: businessData.premiumTerm,
          sumAssured: businessData.sumAssured,
          paymentFrequency: 'Monthly' as const,
          increaseMonth: format(new Date(businessData.commencementDate), 'MMMM'),
          premiumPayerName: businessData.client,
          premiumPayerOccupation: 'Accountant',
          bankName: 'CalBank PLC',
          bankBranch: 'Accra Main',
          notes: '',
          maritalStatus: 'Married' as const,
          dependents: 2,
          gender: 'Male' as const,
          nationalIdType: 'Passport' as const,
          idNumber: 'G1234567',
          issueDate: new Date('2020-01-01'),
          expiryDate: new Date('2030-01-01'),
          placeOfIssue: 'Accra',
          country: 'Ghana',
          region: 'Greater Accra' as const,
          religion: 'Christian' as const,
          nationality: 'Ghana',
          languages: 'English, Twi',
          amountInWords: '',
          sortCode: '123456',
          accountType: 'Current' as const,
          bankAccountName: businessData.client,
          bankAccountNumber: '00112233445566',
          occupation: 'Software Engineer',
          natureOfBusiness: 'Technology',
          employer: 'Google',
          employerAddress: '1600 Amphitheatre Parkway, Mountain View, CA',
          monthlyBasicIncome: 10000,
          otherIncome: 2000,
          totalMonthlyIncome: 12000,
          serialNumber: '1234',
        };
      }
    }
    return {
      email: '',
      phone: '',
      postalAddress: '',
      lifeAssuredFirstName: '',
      lifeAssuredMiddleName: '',
      lifeAssuredSurname: '',
      lifeAssuredDob: undefined,
      ageNextBirthday: 0,
      contractType: "Buy Term and Invest in Mutual Fund" as const,
      serialNumber: '',
      policyNumber: '',
      commencementDate: undefined,
      premiumTerm: 0,
      policyTerm: 0,
      premiumAmount: 0,
      sumAssured: 0,
      paymentFrequency: 'Monthly' as const,
      increaseMonth: '',
      notes: '',
      premiumPayerName: '',
      premiumPayerOccupation: '',
      bankName: '',
      bankBranch: '',
      maritalStatus: 'Single' as const,
      dependents: 0,
      gender: 'Male' as const,
      nationalIdType: 'National ID' as const,
      idNumber: '',
      issueDate: undefined,
      expiryDate: undefined,
      placeOfIssue: '',
      country: 'Ghana',
      region: 'Greater Accra' as const,
      religion: 'Christian' as const,
      nationality: 'Ghana',
      languages: '',
      amountInWords: '',
      sortCode: '',
      accountType: 'Current' as const,
      bankAccountName: '',
      bankAccountNumber: '',
      occupation: '',
      natureOfBusiness: '',
      employer: '',
      employerAddress: '',
      monthlyBasicIncome: 0,
      otherIncome: 0,
      totalMonthlyIncome: 0,
      workTelephone: '',
      homeTelephone: '',
      residentialAddress: '',
      gpsAddress: '',
    };
  }, [isEditMode, businessId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);


  const commencementDate = form.watch('commencementDate');
  const lifeAssuredDob = form.watch('lifeAssuredDob');
  const premiumAmount = form.watch('premiumAmount');
  const paymentFrequency = form.watch('paymentFrequency');
  const monthlyBasicIncome = form.watch('monthlyBasicIncome');
  const otherIncome = form.watch('otherIncome');

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

  React.useEffect(() => {
    const basic = Number(monthlyBasicIncome) || 0;
    const other = Number(otherIncome) || 0;
    form.setValue('totalMonthlyIncome', basic + other);
  }, [monthlyBasicIncome, otherIncome, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const lifeAssuredName = [values.lifeAssuredFirstName, values.lifeAssuredMiddleName, values.lifeAssuredSurname].filter(Boolean).join(' ');

    if (isEditMode && businessId) {
      const businessIndex = newBusinessData.findIndex(b => b.id.toString() === businessId);
      if (businessIndex !== -1) {
        const currentStatus = newBusinessData[businessIndex].onboardingStatus;
        const newStatus = ['NTU', 'Declined'].includes(currentStatus)
          ? 'Pending Mandate'
          : currentStatus;

        newBusinessData[businessIndex] = {
          ...newBusinessData[businessIndex],
          client: lifeAssuredName,
          product: values.contractType,
          policy: values.policyNumber,
          premium: values.premiumAmount,
          sumAssured: values.sumAssured,
          commencementDate: format(values.commencementDate, 'yyyy-MM-dd'),
          phone: values.phone,
          onboardingStatus: newStatus,
          policyTerm: values.policyTerm,
          premiumTerm: values.premiumTerm,
        };
      }

      toast({
        title: 'Form Updated',
        description: 'Policy details have been successfully updated.',
      });
      router.push(`/business-development/clients/${businessId}?from=underwriting`);
    } else {
        // This is where you would handle creating a new entry
        toast({
            title: 'Form Submitted',
            description: 'New client and policy details have been captured.',
        });
        router.push('/business-development/sales');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-medium bg-sidebar text-sidebar-foreground p-2 rounded-t-md uppercase">Personal details of life insured</h3>
          <Separator className="my-0" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
          <FormField
            control={form.control}
            name="lifeAssuredFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lifeAssuredMiddleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="Kofi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lifeAssuredSurname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surname</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
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
                <FormLabel>Date of Birth</FormLabel>
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
                  <Input type="number" disabled {...field} value={field.value || 0} />
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
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marital Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dependents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Dependents</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.name}>
                        {country.name}
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
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Ghana" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ghanaRegions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
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
            name="religion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Religion</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select religion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Christian">Christian</SelectItem>
                    <SelectItem value="Muslim">Muslim</SelectItem>
                    <SelectItem value="Traditional">Traditional</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="languages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Languages Spoken</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., English, Twi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium bg-sidebar text-sidebar-foreground p-2 rounded-t-md uppercase">Identification</h3>
          <Separator className="my-0" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
          <FormField
            control={form.control}
            name="nationalIdType"
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
                    <SelectItem value="Driver's License">Driver's License</SelectItem>
                    <SelectItem value="Passport">Passport</SelectItem>
                    <SelectItem value="Voter ID">Voter ID</SelectItem>
                    <SelectItem value="National ID">National ID</SelectItem>
                    <SelectItem value="SSNIT">SSNIT</SelectItem>
                    <SelectItem value="NHIS">NHIS</SelectItem>
                    <SelectItem value="TIN">TIN</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="idNumber"
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
            name="placeOfIssue"
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
            name="issueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Issue Date</FormLabel>
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
            name="expiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expiry Date</FormLabel>
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

        <div className="mt-8">
          <h3 className="text-lg font-medium bg-sidebar text-sidebar-foreground p-2 rounded-t-md uppercase">Contact Details</h3>
          <Separator className="my-0" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="applicant.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telephone Number</FormLabel>
                <FormControl>
                  <Input placeholder="024 123 4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workTelephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Telephone</FormLabel>
                <FormControl>
                  <Input placeholder="030 123 4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="homeTelephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Home Telephone</FormLabel>
                <FormControl>
                  <Input placeholder="030 765 4321" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postalAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, Accra" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="residentialAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Residential Address</FormLabel>
                <FormControl>
                  <Input placeholder="456 Oak Avenue, Accra" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gpsAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GPS Address</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., GA-123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium bg-sidebar text-sidebar-foreground p-2 rounded-t-md uppercase">Policy Details</h3>
          <Separator className="my-0" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
          <FormField
            control={form.control}
            name="contractType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
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
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1234" {...field} />
                </FormControl>
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
                <FormLabel>Provisional Face Amount</FormLabel>
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
                <FormLabel>Provisional Premium (GHS)</FormLabel>
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
                  value={field.value}
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

        <div className="mt-8">
          <h3 className="text-lg font-medium bg-sidebar text-sidebar-foreground p-2 rounded-t-md uppercase">Employment Details</h3>
          <Separator className="my-0" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="natureOfBusiness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nature of Business/Work</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Technology" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employer</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employerAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employer Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Business Rd, Accra" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="monthlyBasicIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Basic Income (GHS)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="3000.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="otherIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Income (GHS)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="500.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalMonthlyIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Monthly Income (GHS)</FormLabel>
                <FormControl>
                  <Input type="number" disabled {...field} />
                </FormControl>
                <FormDescription>This is calculated automatically.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium bg-sidebar text-sidebar-foreground p-2 rounded-t-md uppercase">Payment Details</h3>
          <Separator className="my-0" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
           <FormField
              control={form.control}
              name="premiumAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Premium Amount (GHS)</FormLabel>
                  <FormControl>
                    <Input type="number" disabled value={premiumAmount} />
                  </FormControl>
                  <FormDescription>From Policy Details section.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amountInWords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount in Words</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Five Hundred Ghana Cedis" {...field} />
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
                    <FormLabel>Premium Deduction Frequency</FormLabel>
                    <FormControl>
                        <Input disabled value={paymentFrequency} />
                    </FormControl>
                    <FormDescription>From Policy Details section.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
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
                    value={field.value}
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
             <FormField
              control={form.control}
              name="sortCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 123456" {...field} />
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
                  <FormLabel>Type of Account</FormLabel>
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
                    <Input placeholder="e.g., John K. Doe" {...field} />
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
                    <Input placeholder="e.g., 001122334455" {...field} />
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
                  placeholder="Any additional notes about the client or policy."
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
        <Button type="submit">{isEditMode ? 'Update Policy' : 'Submit'}</Button>
      </form>
    </Form>
  );
}

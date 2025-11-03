

'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { CalendarIcon, Plus, Trash2, Info } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { countries } from '@/lib/countries';
import { Separator } from '@/components/ui/separator';
import { getPolicyById, createPolicy, updatePolicy } from '@/lib/policy-service';
import type { ActivityLog } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

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

const idTypes = [
  "Driver's License",
  'Passport',
  'Voter ID',
  'National ID',
  'SSNIT',
  'NHIS',
  'TIN',
] as const;

const beneficiarySchema = z.object({
    name: z.string().min(1, "Name is required."),
    dob: z.date({ required_error: 'Date of birth is required.' }),
    gender: z.enum(['Male', 'Female']),
    relationship: z.string().min(1, "Relationship is required."),
    percentage: z.coerce.number().min(0).max(100, "Percentage must be between 0 and 100."),
    isIrrevocable: z.boolean().optional().default(false),
});

const alcoholHabitsOptions = [
    'never_used',
    'occasional_socially',
    'ex_drinker_over_5_years',
    'ex_drinker_1_to_5_years',
    'ex_drinker_within_1_year',
    'current_regular_drinker',
] as const;

const formSchema = z
  .object({
    // Client Details
    title: z.enum(['Mr', 'Mrs', 'Miss', 'Dr', 'Prof', 'Hon']),
    lifeAssuredFirstName: z.string().min(2, 'First name must be at least 2 characters.'),
    lifeAssuredMiddleName: z.string().optional(),
    lifeAssuredSurname: z.string().min(2, 'Surname must be at least 2 characters.'),
    lifeAssuredDob: z.date({ required_error: 'Date of birth is required.' }),
    placeOfBirth: z.string().min(2, 'Place of birth is required.'),
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
    nationalIdType: z.enum(idTypes),
    idNumber: z.string().min(2, 'ID Number is required.'),
    issueDate: z.date({ required_error: 'Issue date is required.' }),
    expiryDate: z.date({ required_error: 'Expiry date is required.' }),
    placeOfIssue: z.string().min(2, 'Place of issue is required.'),
    country: z.string().min(2, 'Country is required.'),
    region: z.enum(ghanaRegions, { required_error: 'Region is required.' }),
    religion: z.enum(['Christian', 'Muslim', 'Traditional', 'Other']),
    nationality: z.string().min(2, 'Nationality is required.'),
    languages: z.string().min(2, 'Languages spoken is required.'),

    // Coverage Details
    contractType: z.enum([
      'Buy Term and Invest in Mutual Fund',
      'The Education Policy',
    ]),
    serialNumber: z.string().regex(/^\d{4}$/, 'Serial number must be a 4-digit number.'),
    policyNumber: z.string().optional(),
    commencementDate: z.date({ required_error: 'A start date is required.' }),
    policyTerm: z.coerce.number().positive('Policy term must be a positive number.'),
    premiumTerm: z.coerce.number().positive('Premium term must be a positive number.'),
    sumAssured: z.coerce
      .number()
      .positive('Sum assured must be a positive number.'),
    premiumAmount: z.coerce
      .number()
      .positive('Premium amount must be a positive number.'),
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
    isPolicyHolderPayer: z.boolean().default(true),
    premiumPayerSurname: z.string().optional(),
    premiumPayerOtherNames: z.string().optional(),
    premiumPayerOccupation: z.string().optional(),
    premiumPayerRelationship: z.string().optional(),
    premiumPayerResidentialAddress: z.string().optional(),
    premiumPayerPostalAddress: z.string().optional(),
    premiumPayerDob: z.date().optional(),
    premiumPayerBusinessName: z.string().optional(),
    premiumPayerIdType: z.enum(idTypes).optional(),
    premiumPayerIdNumber: z.string().optional(),
    premiumPayerIssueDate: z.date().optional(),
    premiumPayerExpiryDate: z.date().optional(),
    premiumPayerPlaceOfIssue: z.string().optional(),
    bankName: z.string().min(2, 'Bank name is required.'),
    bankBranch: z.string().min(2, 'Bank branch is required.'),
    amountInWords: z.string().min(3, 'Amount in words is required.'),
    sortCode: z.string().min(6, 'Sort code must be at least 6 characters.'),
    accountType: z.enum(['Current', 'Savings', 'Other']),
    bankAccountName: z.string().min(2, 'Bank account name is required.'),
    bankAccountNumber: z.string().min(10, 'Bank account number must be at least 10 digits.'),

    // Beneficiaries
    primaryBeneficiaries: z.array(beneficiarySchema).optional(),
    contingentBeneficiaries: z.array(beneficiarySchema).optional(),
    
    // Health
    alcoholHabits: z.enum(alcoholHabitsOptions).optional(),
  });

type NewBusinessFormProps = {
    businessId?: string;
}

const tabSequence = [
    'policy-holder',
    'payment-details',
    'beneficiaries',
    'health',
    'lifestyle',
    'declaration',
];

const alcoholHabitsLabels: Record<typeof alcoholHabitsOptions[number], string> = {
    never_used: 'Have never used alcohol',
    occasional_socially: 'Drink occasionally or socially only',
    ex_drinker_over_5_years: 'Ex-drinker; last drunk alcohol over 5 years ago',
    ex_drinker_1_to_5_years: 'Ex-drinker: last drunk alcohol 1 to 5 years ago',
    ex_drinker_within_1_year: 'Ex-drinker: last drunk alcohol within the last year',
    current_regular_drinker: 'Current regular drinker',
};

export default function NewBusinessForm({ businessId }: NewBusinessFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState(tabSequence[0]);
  
  const isEditMode = !!businessId;
  
  const defaultValues = React.useMemo(() => {
    if (isEditMode && businessId) {
      const businessData = getPolicyById(parseInt(businessId, 10));
      if (businessData) {
        const nameParts = businessData.client.split(' ');
        const title = (['Mr', 'Mrs', 'Miss', 'Dr', 'Prof', 'Hon'].find(t => t === nameParts[0]) || 'Mr') as 'Mr' | 'Mrs' | 'Miss' | 'Dr' | 'Prof' | 'Hon';
        const nameWithoutTitle = nameParts[0] === title ? nameParts.slice(1).join(' ') : businessData.client;
        const nameOnlyParts = nameWithoutTitle.split(' ');

        const firstName = nameOnlyParts[0] || '';
        const surname = nameOnlyParts.length > 1 ? nameOnlyParts[nameOnlyParts.length - 1] : '';
        const middleName = nameOnlyParts.length > 2 ? nameOnlyParts.slice(1, -1).join(' ') : '';
        
        return {
          title: title,
          lifeAssuredFirstName: firstName,
          lifeAssuredMiddleName: middleName,
          lifeAssuredSurname: surname,
          policyNumber: businessData.policy || '',
          contractType: businessData.product as "Buy Term and Invest in Mutual Fund" | "The Education Policy",
          premiumAmount: businessData.premium,
          commencementDate: new Date(businessData.commencementDate),
          lifeAssuredDob: new Date('1985-05-20'),
          placeOfBirth: businessData.placeOfBirth,
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
          premiumPayerSurname: businessData.payerName.split(' ').slice(-1).join(' '),
          premiumPayerOtherNames: businessData.payerName.split(' ').slice(0, -1).join(' '),
          premiumPayerOccupation: 'Accountant',
          bankName: businessData.bankName,
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
          sortCode: businessData.sortCode,
          accountType: 'Current' as const,
          bankAccountName: businessData.payerName,
          bankAccountNumber: businessData.bankAccountNumber,
          occupation: 'Software Engineer',
          natureOfBusiness: 'Technology',
          employer: 'Google',
          employerAddress: '1600 Amphitheatre Parkway, Mountain View, CA',
          monthlyBasicIncome: 10000,
          otherIncome: 2000,
          totalMonthlyIncome: 12000,
          serialNumber: businessData.serial,
          isPolicyHolderPayer: businessData.client === businessData.payerName,
          primaryBeneficiaries: [],
          contingentBeneficiaries: [],
        };
      }
    }
    return {
      title: 'Mr' as const,
      email: '',
      phone: '',
      postalAddress: '',
      lifeAssuredFirstName: '',
      lifeAssuredMiddleName: '',
      lifeAssuredSurname: '',
      lifeAssuredDob: undefined,
      placeOfBirth: '',
      ageNextBirthday: 0,
      contractType: "Buy Term and Invest in Mutual Fund" as const,
      serialNumber: '',
      policyNumber: '',
      commencementDate: new Date(),
      premiumTerm: 0,
      policyTerm: 0,
      premiumAmount: 0,
      sumAssured: 0,
      paymentFrequency: 'Monthly' as const,
      increaseMonth: '',
      notes: '',
      premiumPayerSurname: '',
      premiumPayerOtherNames: '',
      premiumPayerOccupation: '',
      premiumPayerRelationship: '',
      premiumPayerResidentialAddress: '',
      premiumPayerPostalAddress: '',
      premiumPayerDob: undefined,
      premiumPayerBusinessName: '',
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
      isPolicyHolderPayer: true,
      primaryBeneficiaries: [],
      contingentBeneficiaries: [],
    };
  }, [isEditMode, businessId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  
  const { fields: primaryFields, append: appendPrimary, remove: removePrimary } = useFieldArray({
    control: form.control,
    name: 'primaryBeneficiaries'
  });

  const { fields: contingentFields, append: appendContingent, remove: removeContingent } = useFieldArray({
    control: form.control,
    name: 'contingentBeneficiaries'
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
  const ageNextBirthday = form.watch('ageNextBirthday');
  const isPolicyHolderPayer = form.watch('isPolicyHolderPayer');

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
    if (ageNextBirthday && ageNextBirthday > 0) {
      const policyTerm = 75 - ageNextBirthday;
      const premiumTerm = 65 - ageNextBirthday;

      form.setValue('policyTerm', Math.max(0, policyTerm));
      form.setValue('premiumTerm', Math.max(0, premiumTerm));
    }
  }, [ageNextBirthday, form]);

  React.useEffect(() => {
    const basic = Number(monthlyBasicIncome) || 0;
    const other = Number(otherIncome) || 0;
    form.setValue('totalMonthlyIncome', basic + other);
  }, [monthlyBasicIncome, otherIncome, form]);
  
  const handleTabChange = (direction: 'next' | 'prev') => {
    const currentIndex = tabSequence.indexOf(activeTab);
    if (direction === 'next') {
        if (currentIndex < tabSequence.length - 1) {
            setActiveTab(tabSequence[currentIndex + 1]);
        }
    } else {
        if (currentIndex > 0) {
            setActiveTab(tabSequence[currentIndex - 1]);
        }
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const lifeAssuredName = [values.title, values.lifeAssuredFirstName, values.lifeAssuredMiddleName, values.lifeAssuredSurname].filter(Boolean).join(' ');
        
        let finalPayerName: string;
        if (values.isPolicyHolderPayer) {
            finalPayerName = lifeAssuredName;
            values.premiumPayerOccupation = values.occupation;
        } else {
            finalPayerName = [values.premiumPayerOtherNames, values.premiumPayerSurname].filter(Boolean).join(' ');
        }


        if (isEditMode && businessId) {
            const policyId = parseInt(businessId, 10);
            const currentPolicy = getPolicyById(policyId);
            if (currentPolicy) {
                let newStatus = currentPolicy.onboardingStatus;
                if (currentPolicy.onboardingStatus === 'Rework Required') {
                    newStatus = 'Pending Vetting';
                } else if (currentPolicy.onboardingStatus === 'Mandate Rework Required') {
                    newStatus = 'Pending Mandate';
                }

                updatePolicy(policyId, {
                    client: lifeAssuredName,
                    product: values.contractType,
                    premium: values.premiumAmount,
                    sumAssured: values.sumAssured,
                    commencementDate: format(values.commencementDate, 'yyyy-MM-dd'),
                    phone: values.phone,
                    onboardingStatus: newStatus,
                    policyTerm: values.policyTerm,
                    premiumTerm: values.premiumTerm,
                    placeOfBirth: values.placeOfBirth,
                    payerName: finalPayerName,
                    bankName: values.bankName,
                    bankAccountNumber: values.bankAccountNumber,
                    sortCode: values.sortCode,
                    vettingNotes: newStatus === 'Pending Vetting' ? undefined : currentPolicy.vettingNotes,
                    mandateReworkNotes: newStatus === 'Pending Mandate' ? undefined : currentPolicy.mandateReworkNotes,
                });
                
                toast({
                    title: 'Form Updated',
                    description: 'Policy details have been successfully updated.',
                });
                router.push(`/business-development/clients/${businessId}?from=business-development`);
            } else {
                throw new Error("Policy not found for updating.");
            }
        } else {
            createPolicy({...values, payerName: finalPayerName});
            toast({
                title: 'Form Submitted',
                description: 'New client and policy details have been captured.',
            });
            router.push('/business-development/sales');
        }
    } catch (error) {
        console.error("Form submission error:", error);
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: error instanceof Error ? error.message : "An unknown error occurred while submitting the form.",
        });
    }
  }
  
  const currentTabIndex = tabSequence.indexOf(activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabSequence.length - 1;


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="policy-holder">Policy Holder & Coverage</TabsTrigger>
            <TabsTrigger value="payment-details">Payment Details</TabsTrigger>
            <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="declaration">Declaration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="policy-holder" className="mt-6 space-y-8">
             <div>
              <h3 className="text-lg font-medium text-white p-2 rounded-t-md uppercase" style={{ backgroundColor: '#023ea3' }}>Personal details of life insured</h3>
              <Separator className="my-0" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mr">Mr</SelectItem>
                        <SelectItem value="Mrs">Mrs</SelectItem>
                        <SelectItem value="Miss">Miss</SelectItem>
                        <SelectItem value="Dr">Dr</SelectItem>
                        <SelectItem value="Prof">Prof</SelectItem>
                        <SelectItem value="Hon">Hon</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="placeOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place of Birth (City/Town)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Accra" {...field} />
                    </FormControl>
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
              <h3 className="text-lg font-medium text-white p-2 rounded-t-md uppercase" style={{ backgroundColor: '#023ea3' }}>Identification</h3>
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
              <h3 className="text-lg font-medium text-white p-2 rounded-t-md uppercase" style={{ backgroundColor: '#023ea3' }}>Contact Details</h3>
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
              <h3 className="text-lg font-medium text-white p-2 rounded-t-md uppercase" style={{ backgroundColor: '#023ea3' }}>Employment Details</h3>
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
              <h3 className="text-lg font-medium text-white p-2 rounded-t-md uppercase" style={{ backgroundColor: '#023ea3' }}>Coverage Details</h3>
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
                      <Input placeholder="Allocated upon acceptance" {...field} disabled />
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
                            disabled
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
                    <FormDescription>Set automatically on policy acceptance.</FormDescription>
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
                      <Input type="number" placeholder="e.g., 5" {...field} disabled />
                    </FormControl>
                    <FormDescription>Auto-calculated: 75 - Age</FormDescription>
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
                      <Input type="number" placeholder="e.g., 10" {...field} disabled />
                    </FormControl>
                    <FormDescription>Auto-calculated: 65 - Age</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sumAssured"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provisional Sum Assured</FormLabel>
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
                    <FormLabel>Provisional Premium Amount (GHS)</FormLabel>
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
          </TabsContent>

          <TabsContent value="payment-details" className="mt-6 space-y-8">
            <div>
              <h3 className="text-lg font-medium text-white p-2 rounded-t-md uppercase" style={{ backgroundColor: '#023ea3' }}>Payment Details</h3>
              <Separator className="my-0" />
            </div>
             <div className="p-4 space-y-6">
                <FormField
                    control={form.control}
                    name="isPolicyHolderPayer"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                Will you be paying for this policy by yourself?
                                </FormLabel>
                                <FormDescription>
                                If not, you will be required to provide the details of the person paying for the policy.
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
                    <div className="space-y-6">
                        <h4 className="font-medium p-2 rounded-t-md" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))' }}>
                            Premium Payer's Details
                        </h4>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 p-4 border rounded-md bg-muted/50">
                             <FormField
                                control={form.control}
                                name="premiumPayerSurname"
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
                                name="premiumPayerOtherNames"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Other Names</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jane" {...field} />
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
                                    <FormLabel>Occupation</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Teacher" {...field} />
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
                                    <FormLabel>Relationship to Insured</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Spouse, Parent" {...field} />
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
                                    <FormLabel>Residential Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 Payer Lane" {...field} />
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
                                    <FormLabel>Postal Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="P.O. Box 123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="premiumPayerDob"
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
                                name="premiumPayerBusinessName"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Business Name (if applicable)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Payer Corp" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <h5 className="font-medium text-primary/90">For Owners who are individuals</h5>
                         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-4 border rounded-md bg-muted/50">
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
                                name="premiumPayerExpiryDate"
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
                    </div>
                )}
            
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
             </div>
          </TabsContent>
          
          <TabsContent value="beneficiaries" className="mt-6 space-y-6">
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Important Information</AlertTitle>
                <AlertDescription>
                    <p>The Policy Owner is the principal beneficiary. The Beneficiaries stated below will receive Policy proceeds at the death of the Policy Owner, unless otherwise specified, beneficiaries will share the proceeds equally. If a minor is named as a beneficiary, financial guardianship for the minor's estate will be required before policy proceeds can be released.</p>
                    <p className="mt-2">If you select an <strong>AN IRREVOCABLE BENEFICIARY (IB)</strong>, add a photocopy of a passport or driver's license as an ID.</p>
                </AlertDescription>
            </Alert>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <CardTitle>Primary Beneficiaries</CardTitle>
                         <Button type="button" size="sm" onClick={() => appendPrimary({ name: '', dob: new Date(), gender: 'Male', relationship: '', percentage: 0, isIrrevocable: false })}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Primary
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Date of Birth</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Relationship</TableHead>
                                    <TableHead>Percentage (%)</TableHead>
                                    <TableHead>IB</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {primaryFields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`primaryBeneficiaries.${index}.name`}
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Beneficiary Name" />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                             <FormField
                                                control={form.control}
                                                name={`primaryBeneficiaries.${index}.dob`}
                                                render={({ field }) => (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                            <Button
                                                                variant={'outline'}
                                                                className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                                                            >
                                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
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
                                                                captionLayout="dropdown-buttons"
                                                                fromYear={1900}
                                                                toYear={new Date().getFullYear()}
                                                                disabled={(date) => date > new Date()}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`primaryBeneficiaries.${index}.gender`}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                        <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`primaryBeneficiaries.${index}.relationship`}
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="e.g., Spouse" />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`primaryBeneficiaries.${index}.percentage`}
                                                render={({ field }) => (
                                                    <Input type="number" {...field} placeholder="e.g., 100" />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                             <FormField
                                                control={form.control}
                                                name={`primaryBeneficiaries.${index}.isIrrevocable`}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-center h-full">
                                                        <FormControl>
                                                            <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removePrimary(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Contingent Beneficiaries</CardTitle>
                        <Button type="button" size="sm" onClick={() => appendContingent({ name: '', dob: new Date(), gender: 'Male', relationship: '', percentage: 0 })}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Contingent
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                     <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Date of Birth</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Relationship</TableHead>
                                    <TableHead>Percentage (%)</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contingentFields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`contingentBeneficiaries.${index}.name`}
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Beneficiary Name" />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                             <FormField
                                                control={form.control}
                                                name={`contingentBeneficiaries.${index}.dob`}
                                                render={({ field }) => (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                            <Button
                                                                variant={'outline'}
                                                                className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                                                            >
                                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
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
                                                                captionLayout="dropdown-buttons"
                                                                fromYear={1900}
                                                                toYear={new Date().getFullYear()}
                                                                disabled={(date) => date > new Date()}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`contingentBeneficiaries.${index}.gender`}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                        <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`contingentBeneficiaries.${index}.relationship`}
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="e.g., Child" />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`contingentBeneficiaries.${index}.percentage`}
                                                render={({ field }) => (
                                                    <Input type="number" {...field} placeholder="e.g., 100" />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeContingent(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="mt-6 space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Health Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-bold">1. Alcohol use</h3>
                        <p className="text-sm text-muted-foreground">1.1 Which of the following best describes your drinking habits (please tick one)</p>
                    </div>
                    <FormField
                        control={form.control}
                        name="alcoholHabits"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-x-8"
                                    >
                                        {alcoholHabitsOptions.map((option) => (
                                            <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value={option} />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {alcoholHabitsLabels[option]}
                                                </FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lifestyle" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle>Lifestyle Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Lifestyle-related form fields will be implemented here.</p>
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="declaration" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle>Declaration</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Declaration form fields will be implemented here.</p>
                </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
        
        <div className="flex justify-between p-4">
            {!isFirstTab ? (
                 <Button type="button" variant="outline" onClick={() => handleTabChange('prev')}>
                    Previous
                </Button>
            ) : <div />}
            {!isLastTab ? (
                 <Button type="button" onClick={() => handleTabChange('next')}>
                    Next
                </Button>
            ) : (
                <Button type="submit">
                    {isEditMode ? 'Update Application' : 'Submit Application'}
                </Button>
            )}
        </div>
      </form>
    </Form>
  );
}



    

    


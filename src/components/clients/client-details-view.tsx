

'use client';

import * as React from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn, numberToWords } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  XCircle,
  PauseCircle,
  ThumbsDown,
  FileClock,
  Check,
  Undo2,
  FileCheck,
  ShieldCheck,
  FilePenLine,
  Banknote,
  Heart,
  Stethoscope,
  Users,
  Pill,
  Syringe,
  Plane,
  Bike,
  Waves,
  GlassWater,
  Biohazard,
} from 'lucide-react';
import AcceptPolicyDialog from '@/components/clients/accept-policy-dialog';
import type { NewBusiness, OnboardingStatus, Beneficiary, IllnessDetail, ExistingPolicyDetail, DeclinedPolicyDetail, LifestyleDetail } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import Link from 'next/link';
import CompleteVettingDialog from './complete-vetting-dialog';
import { getPolicyById, updatePolicy } from '@/lib/policy-service';
import VerifyMandateDialog from '../premium-administration/verify-mandate-dialog';
import PaymentHistoryTab from './payment-history-tab';
import ActivityLogTab from './activity-log-tab';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import MandateTab from './mandate-tab';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CollectPremiumDialog from './collect-premium-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newBusinessFormSchema, illnessDetailSchema } from './new-business-form-schema';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <Card className="flex-1 bg-card">
      <CardHeader className="p-3">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm font-semibold">{value || 'N/A'}</div>
      </CardHeader>
    </Card>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: React.ReactNode;
}) {
  return (
    <Card className="flex-1 bg-card">
      <CardHeader className="p-3">
        <p className="text-xs text-muted-foreground">{title}</p>
        <div className="text-sm font-semibold">{value}</div>
      </CardHeader>
    </Card>
  );
}

function BeneficiaryTable({ title, beneficiaries }: { title: string, beneficiaries: Beneficiary[] }) {
    if (!beneficiaries || beneficiaries.length === 0) {
        return (
             <Card>
                <CardHeader className="flex flex-row items-center justify-between p-2 bg-sidebar rounded-t-md">
                    <h3 className="font-medium uppercase text-sidebar-foreground">{title}</h3>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                    <p className="text-muted-foreground">No {title.toLowerCase()} found.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between p-2 bg-sidebar rounded-t-md">
                <h3 className="font-medium uppercase text-sidebar-foreground">{title}</h3>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Date of Birth</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Relationship</TableHead>
                                <TableHead>Telephone</TableHead>
                                <TableHead>% Share</TableHead>
                                <TableHead>Irrevocable</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {beneficiaries.map((beneficiary, index) => (
                                <TableRow key={index}>
                                    <TableCell>{beneficiary.name}</TableCell>
                                    <TableCell>{format(new Date(beneficiary.dob), 'PPP')}</TableCell>
                                    <TableCell>{beneficiary.gender}</TableCell>
                                    <TableCell>{beneficiary.relationship}</TableCell>
                                    <TableCell>{beneficiary.telephone || 'N/A'}</TableCell>
                                    <TableCell>{beneficiary.percentage}%</TableCell>
                                    <TableCell>
                                        <Checkbox checked={beneficiary.isIrrevocable} disabled />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

function YesNoDisplay({ value }: { value: 'yes' | 'no' | undefined | boolean }) {
    const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value || 'no');
    const isYes = displayValue.toLowerCase() === 'yes';
    return (
      <Badge variant={isYes ? 'destructive' : 'secondary'}>
        {isYes ? 'Yes' : 'No'}
      </Badge>
    );
}


function LifestyleQuestionDisplay({
  question,
  value,
  details,
}: {
  question: string;
  value: 'yes' | 'no' | undefined;
  details: LifestyleDetail[] | undefined;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-medium">{question}</p>
        <YesNoDisplay value={value} />
      </div>
      {value === 'yes' && details && details.length > 0 && (
        <div className="pl-4">
          <div className="rounded-md border bg-muted/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.item}</TableCell>
                    <TableCell>{item.details || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}


function MedicalHistorySection({
  title,
  icon,
  data,
}: {
  title: string;
  icon: React.ReactNode;
  data: IllnessDetail[] | undefined;
}) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {data.map((history, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{history.illness}</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <DetailItem label="Date" value={history.date ? format(new Date(history.date), 'PPP') : 'N/A'} />
                  <DetailItem label="Hospital/Doctor" value={history.hospital} />
                  <DetailItem label="Duration" value={history.duration} />
                  <DetailItem label="Status" value={history.status} />
                </div>
                 {history.illness === 'High blood pressure' && (
                    <div className="p-4 mt-2 space-y-4 bg-blue-500/10 rounded-md border border-blue-500/20">
                        <h4 className="font-semibold text-primary">High Blood Pressure Specifics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <DetailItem label="Diagnosis Date" value={history.diagnosisDate ? format(new Date(history.diagnosisDate), 'PPP') : 'N/A'} />
                            <DetailItem label="Reading at Diagnosis" value={history.bpReadingAtDiagnosis} />
                            <DetailItem label="Last Monitored Date" value={history.lastMonitoredDate ? format(new Date(history.lastMonitoredDate), 'PPP') : 'N/A'} />
                            <DetailItem label="Last BP Reading" value={history.lastBpReading} />
                            <DetailItem label="Monitoring Frequency" value={history.monitoringFrequency} />
                        </div>
                         <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Cause / Contributing Factors</p>
                            <p className="text-sm font-semibold">{history.causeOfHighBp || 'N/A'}</p>
                         </div>
                         <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Prescribed Treatment</p>
                            <p className="text-sm font-semibold">{history.prescribedTreatment || 'N/A'}</p>
                         </div>
                         <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Complications</p>
                            <p className="text-sm font-semibold">{history.complications || 'N/A'}</p>
                         </div>
                         <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Sugar/Cholesterol Checked in past 2 years?</p>
                            <p className="text-sm font-semibold">{history.sugarCholesterolChecked || 'N/A'}</p>
                         </div>
                    </div>
                 )}
                 {history.illness === 'Diabetes' && (
                     <div className="p-4 mt-2 space-y-4 bg-red-500/10 rounded-md border border-red-500/20">
                         <h4 className="font-semibold text-destructive">Diabetes Specifics</h4>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <DetailItem label="First Signs Date" value={history.diabetesFirstSignsDate ? format(new Date(history.diabetesFirstSignsDate), 'PPP') : 'N/A'} />
                             <DetailItem label="Symptoms" value={history.diabetesSymptoms} />
                             <DetailItem label="Diagnosis Date" value={history.diabetesDiagnosisDate ? format(new Date(history.diabetesDiagnosisDate), 'PPP') : 'N/A'} />
                             <DetailItem label="Consulted Doctor?" value={<YesNoDisplay value={history.diabetesConsulted} />} />
                             <DetailItem label="Latest Blood Sugar Reading" value={history.diabetesLatestBloodSugar} />
                         </div>
                         <DetailItem label="Hospitalized for Diabetes?" value={history.diabetesHospitalized} />
                         <DetailItem label="Taking Insulin?" value={history.diabetesTakingInsulin} />
                         <DetailItem label="Taking Oral Treatment?" value={history.diabetesOralTreatment} />
                         <DetailItem label="Dosage Varied in Last 12 Months?" value={history.diabetesDosageVaried} />
                         <DetailItem label="Regular Tests (Blood/Urine)?" value={history.diabetesRegularTests} />
                         <DetailItem label="Ever in Diabetic Coma?" value={history.diabetesDiabeticComa} />
                         <DetailItem label="Aware of Complications?" value={history.diabetesComplications} />
                         <DetailItem label="Other Medical Exams?" value={history.diabetesOtherExams} />
                         <DetailItem label="Other Consultations?" value={history.diabetesOtherConsultations} />
                     </div>
                 )}
                 {history.illness === 'Asthma' && (
                     <div className="p-4 mt-2 space-y-4 bg-purple-500/10 rounded-md border border-purple-500/20">
                          <h4 className="font-semibold" style={{ color: 'hsl(var(--chart-3))' }}>Asthma Specifics</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <DetailItem label="Age at First Signs" value={history.asthmaFirstSignsAge} />
                            <DetailItem label="Symptom Duration" value={history.asthmaSymptomDuration} />
                            <DetailItem label="Symptom Frequency" value={history.asthmaSymptomFrequency} />
                            <DetailItem label="Last Attack Date" value={history.asthmaLastAttackDate ? format(new Date(history.asthmaLastAttackDate), 'PPP') : 'N/A'} />
                            <DetailItem label="Condition Severity" value={history.asthmaSeverity} />
                          </div>
                           <DetailItem label="Triggers" value={history.asthmaTrigger} />
                           <DetailItem label="Medication" value={history.asthmaMedication} />
                           <DetailItem label="Steroid Therapy" value={history.asthmaSteroidTherapy} />
                           <DetailItem label="Hospitalization" value={history.asthmaHospitalization} />
                           <DetailItem label="Work Absence" value={history.asthmaWorkAbsence} />
                           <DetailItem label="Functional Limitation" value={history.asthmaFunctionalLimitation} />
                           <DetailItem label="Chest X-Ray / Lung Function Test" value={history.asthmaChestXRay} />
                           <DetailItem label="Complicating Features" value={history.asthmaComplicatingFeatures} />
                     </div>
                 )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function ExistingPoliciesDisplay({ policies }: { policies: ExistingPolicyDetail[] | undefined }) {
  if (!policies || policies.length === 0) {
    return <p className="text-muted-foreground">No existing policies declared.</p>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Insurance Company</TableHead>
            <TableHead>Person(s) Covered</TableHead>
            <TableHead>Type of Policy</TableHead>
            <TableHead>Date Issued</TableHead>
            <TableHead>Premium Amount (GHS)</TableHead>
            <TableHead>Face Amount (GHS)</TableHead>
            <TableHead>Changed GRP/IND</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy, index) => (
            <TableRow key={index}>
              <TableCell>{policy.companyName}</TableCell>
              <TableCell>{policy.personCovered}</TableCell>
              <TableCell>{policy.policyType}</TableCell>
              <TableCell>{format(new Date(policy.issueDate), 'PPP')}</TableCell>
              <TableCell>{Number(policy.premiumAmount).toFixed(2)}</TableCell>
              <TableCell>{Number(policy.faceAmount).toFixed(2)}</TableCell>
              <TableCell><YesNoDisplay value={policy.changedGrpOrInd} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function DeclinedPoliciesDisplay({ policies }: { policies: DeclinedPolicyDetail[] | undefined }) {
  if (!policies || policies.length === 0) {
    return <p className="text-muted-foreground">No previously declined policies declared.</p>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Insurance Company</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy, index) => (
            <TableRow key={index}>
              <TableCell>{policy.companyName}</TableCell>
              <TableCell>{policy.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const alcoholHabitsLabels: Record<NewBusiness['alcoholHabits'], string> = {
    never_used: 'Have never used alcohol',
    occasional_socially: 'Drink occasionally or socially only',
    ex_drinker_over_5_years: 'Ex-drinker; last drunk alcohol over 5 years ago',
    ex_drinker_1_to_5_years: 'Ex-drinker: last drunk alcohol 1 to 5 years ago',
    ex_drinker_within_1_year: 'Ex-drinker: last drunk alcohol within the last year',
    current_regular_drinker: 'Current regular drinker',
};

function AlcoholConsumptionTable({ client }: { client: NewBusiness }) {
  const consumed = [
    { type: 'Beer', details: client.alcoholBeer },
    { type: 'Wine', details: client.alcoholWine },
    { type: 'Spirits', details: client.alcoholSpirits },
  ].filter(item => item.details?.consumed);

  if (consumed.length === 0) return null;

  return (
    <div className="rounded-md border bg-muted/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Average per week</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consumed.map(item => (
            <TableRow key={item.type}>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.details?.averagePerWeek || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const tobaccoHabitsLabels: Record<NewBusiness['tobaccoHabits'], string> = {
    never_smoked: 'Have never smoked',
    ex_smoker_over_5_years: 'Ex-smoker: last used over 5 years ago',
    ex_smoker_1_to_5_years: 'Ex-smoker: last used 1 to 5 years ago',
    ex_smoker_within_1_year: 'Ex-smoker: last used within the last year',
    smoke_occasionally_socially: 'Smoke occasionally or socially only',
    current_regular_smoker: 'Current regular smoker',
};

function TobaccoConsumptionTable({ client }: { client: NewBusiness }) {
  const consumed = [
    { type: 'Cigarettes', details: client.tobaccoCigarettes },
    { type: 'Cigars', details: client.tobaccoCigars },
    { type: 'Pipe', details: client.tobaccoPipe },
    { type: 'Nicotine replacement products', details: client.tobaccoNicotineReplacement },
    { type: 'E-cigarettes', details: client.tobaccoEcigarettes },
    { type: client.tobaccoOther?.otherType || 'Other', details: client.tobaccoOther },
  ].filter(item => item.details?.smoked);

  if (consumed.length === 0) return null;

  return (
    <div className="rounded-md border bg-muted/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Average per day</TableHead>
            <TableHead>Average per week</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consumed.map(item => (
            <TableRow key={item.type}>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.details?.avgPerDay || 'N/A'}</TableCell>
              <TableCell>{item.details?.avgPerWeek || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


export default function ClientDetailsView({
  client: initialClient,
  from,
  defaultTab = 'overview',
}: {
  client: NewBusiness;
  from: string;
  defaultTab?: string;
}) {
  const { toast } = useToast();
  const [client, setClient] = React.useState<NewBusiness | null>(initialClient);
  const [bmi, setBmi] = React.useState<number | null>(null);
  const [bmiStatus, setBmiStatus] = React.useState<{ text: string, color: string } | null>(null);

  const form = useForm<z.infer<typeof newBusinessFormSchema>>({
    resolver: zodResolver(newBusinessFormSchema),
    defaultValues: initialClient as any,
  });
  
  const everDiagnosedConditions = ['Blood transfusion', 'Surgery', 'High blood pressure', 'Angina', 'Heart attack', 'Stroke', 'Coma', 'Other heart/artery/circulation disease', 'Cancer', 'Leukemia', "Hodgkin's disease", 'Lymphoma', 'Other tumor', 'Diabetes', "Crohn's disease", "Colitis", 'Paralysis', 'Multiple sclerosis', 'Epilepsy', 'Dementia', 'Other central nervous system disorder', 'Hospital/psychiatric treatment for mental illness', 'Depression', 'Nervous breakdown'];
  
  const last5YearsConditions = ['Arthritis', 'Neck or back pain', 'Gout', 'Other muscle/joint/bone disorder', 'Chest pain', 'Irregular heart beat', 'Raised cholesterol', 'Asthma', 'Bronchitis', 'Shortness of breath', 'Other chest complaint', 'Duodenal Ulcer', 'Gastric Ulcer', 'Digestive System Disorder', 'Liver Disorder', 'Disorder of Pancreas', 'Blood disorder', 'Anemia', 'Thyroid disorder', 'Kidney disorder', 'Renal failure', 'Bladder disorder', 'Numbness', 'Anxiety', 'Stress', 'Depression', 'Ear disorder', 'Eye disorder', 'Blindness', 'Blurred vision', 'Double vision', 'Lump', 'Growth', 'Mole', 'Freckle', 'X-ray', 'Scan', 'Checkup', 'Operation', "Alzheimer's Disease", 'Multiple Sclerosis', 'STI', 'Urethral discharge', 'Chancroid', 'Gonorrhoea', 'Syphilis', 'Urethritis', 'Genital sores', 'HIV infection', 'Balanitis', 'Genital Warts', 'Vaginal discharge', 'Vaginal trush', 'Present Symptoms'];

  const medicalHistory = React.useMemo(() => {
    if (!client || !client.medicalHistory) return [];
    return client.medicalHistory.filter(h => everDiagnosedConditions.includes(h.illness));
  }, [client]);

  const medicalHistoryLast5Years = React.useMemo(() => {
    if (!client || !client.medicalHistory) return [];
    return client.medicalHistory.filter(h => last5YearsConditions.includes(h.illness));
  }, [client]);

  React.useEffect(() => {
    const freshClientData = getPolicyById(initialClient.id);
    if (freshClientData) {
        const combinedHistory = [
            ...(freshClientData.bloodTransfusionOrSurgeryDetails || []),
            ...(freshClientData.highBloodPressureDetails || []),
            ...(freshClientData.cancerDetails || []),
            ...(freshClientData.diabetesDetails || []),
            ...(freshClientData.colitisCrohnsDetails || []),
            ...(freshClientData.paralysisEpilepsyDetails || []),
            ...(freshClientData.mentalIllnessDetails || []),
            ...(freshClientData.arthritisDetails || []),
            ...(freshClientData.chestPainDetails || []),
            ...(freshClientData.asthmaDetails || []),
            ...(freshClientData.digestiveDisorderDetails || []),
            ...(freshClientData.bloodDisorderDetails || []),
            ...(freshClientData.thyroidDisorderDetails || []),
            ...(freshClientData.kidneyDisorderDetails || []),
            ...(freshClientData.numbnessDetails || []),
            ...(freshClientData.anxietyStressDetails || []),
            ...(freshClientData.earEyeDisorderDetails || []),
            ...(freshClientData.lumpGrowthDetails || []),
            ...(freshClientData.hospitalAttendanceDetails || []),
            ...(freshClientData.criticalIllnessDetails || []),
            ...(freshClientData.stiDetails || []),
            ...(freshClientData.presentSymptomsDetails || []),
        ].filter(Boolean); // Filter out any undefined/null entries

        setClient({
            ...freshClientData,
            medicalHistory: combinedHistory,
        });
    } else {
      setClient(initialClient);
    }
  }, [initialClient]);

   React.useEffect(() => {
    if (client?.bmi) {
      const calculatedBmi = client.bmi;
      if (calculatedBmi < 18.5) {
        setBmiStatus({ text: 'Underweight', color: 'bg-blue-500' });
      } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
        setBmiStatus({ text: 'Healthy Weight', color: 'bg-green-500' });
      } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
        setBmiStatus({ text: 'Overweight', color: 'bg-yellow-500' });
      } else {
        setBmiStatus({ text: 'Obesity', color: 'bg-red-500' });
      }
    } else {
      setBmi(null);
      setBmiStatus(null);
    }
  }, [client?.bmi]);

  React.useEffect(() => {
    if (
      client?.onboardingStatus === 'Mandate Verified' &&
      client.mandateVerificationTimestamp
    ) {
      const verificationTime = new Date(client.mandateVerificationTimestamp).getTime();
      const sixtySecondsInMillis = 60 * 1000;
      const currentTime = new Date().getTime();

      if (currentTime - verificationTime > sixtySecondsInMillis) {
        handleOnboardingStatusUpdate('Policy Issued');
      } else {
        const timeRemaining = sixtySecondsInMillis - (currentTime - verificationTime);
        const timer = setTimeout(() => {
          handleOnboardingStatusUpdate('Policy Issued');
        }, timeRemaining);

        return () => clearTimeout(timer);
      }
    }
  }, [client?.onboardingStatus, client?.mandateVerificationTimestamp]);


  const handlePolicyUpdate = (updatedPolicy: NewBusiness) => {
    setClient(updatedPolicy);
  };
  
  if (!client) {
      return <div>Loading client details...</div>;
  }

  const isFromUnderwriting = from === 'underwriting';
  const isFromBusinessDevelopment = from === 'business-development';
  const isFromPremiumAdmin = from === 'premium-admin';

  const isPendingVetting = isFromUnderwriting && client.onboardingStatus === 'Pending Vetting';
  const canStartMedicals = isFromUnderwriting && client.onboardingStatus === 'Vetting Completed';
  const isPendingMedicals = isFromUnderwriting && client.onboardingStatus === 'Pending Medicals';
  const canMakeDecision = isFromUnderwriting && client.onboardingStatus === 'Medicals Completed';
  
  const isReworkRequired = client.onboardingStatus === 'Rework Required';
  const isMandateReworkRequired = client.onboardingStatus === 'Mandate Rework Required';
  const isNTU = isFromUnderwriting && client.onboardingStatus === 'NTU';
  
  const canVerifyMandate = isFromPremiumAdmin && client.onboardingStatus === 'Pending Mandate';
  const canCollectPremium = isFromPremiumAdmin && client.policyStatus === 'Active';

  const canEditPolicy = isFromBusinessDevelopment && !['Accepted', 'Policy Issued'].includes(client.onboardingStatus);


  const handleOnboardingStatusUpdate = (
    newStatus: NewBusiness['onboardingStatus'],
    updates?: Partial<NewBusiness>
  ) => {
    try {
      const updatedPolicy = updatePolicy(client.id, {
        onboardingStatus: newStatus,
        ...updates
      });

      if(updatedPolicy) {
        setClient(updatedPolicy); 
        toast({
          title: 'Status Updated',
          description: `Policy status changed to ${newStatus}.`,
        });
      } else {
        throw new Error('Could not find policy to update.');
      }
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    }
  };

  const handleStartMedicals = () => {
    handleOnboardingStatusUpdate('Pending Medicals', {
      medicalUnderwritingState: {
        started: true,
        startDate: new Date().toISOString(),
        completed: false,
      }
    });
  };

  const handleMedicalsCompleted = () => {
    handleOnboardingStatusUpdate('Medicals Completed', {
       medicalUnderwritingState: {
        ...(client.medicalUnderwritingState || { started: true, completed: false }),
        completed: true,
      }
    });
  };
  
  const handleRevertNTU = () => {
    handleOnboardingStatusUpdate('Pending Medicals');
  };

  const getStatusBadgeStyling = (status: string) => {
    const lowerCaseStatus = status.toLowerCase();
    switch (lowerCaseStatus) {
      case 'pending vetting':
      case 'pending mandate':
      case 'pending first premium':
      case 'pending medicals':
      case 'pending decision':
      case 'pending':
        return 'bg-[#fcba03] text-black';
      case 'vetting completed':
      case 'mandate verified':
      case 'first premium confirmed':
      case 'medicals completed':
        return 'bg-blue-500/80 text-white';
      case 'accepted':
      case 'active':
      case 'in force':
      case 'up to date':
      case 'first premium paid':
      case 'policy issued':
        return 'bg-green-500/80 text-white';
      case 'ntu':
      case 'deferred':
      case 'inactive':
        return 'bg-gray-500/80 text-white';
      case 'declined':
      case 'cancelled':
      case 'rework required':
      case 'mandate rework required':
      case 'overdue':
        return 'bg-red-500/80 text-white';
      case 'lapsed':
      case 'outstanding':
        return 'bg-orange-500/80 text-white';
      default:
        return 'bg-gray-500/80 text-white';
    }
  };

  const summaryDetails = [
    { title: 'Policy Number', value: client.policy || 'Pending Acceptance' },
    { title: 'Contract Type', value: client.product },
    { title: 'Premium', value: `GHS ${client.premium.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { title: 'Sum Assured', value: `GHS ${client.sumAssured.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    {
      title: 'Commencement Date',
      value: client.commencementDate
        ? format(new Date(client.commencementDate), 'PPP')
        : 'N/A',
    },
    {
      title: 'Expiry Date',
      value: client.expiryDate
        ? format(new Date(client.expiryDate), 'PPP')
        : 'N/A',
    },
    { title: 'Policy Term', value: `${client.policyTerm} years` },
    { title: 'Premium Term', value: `${client.premiumTerm} years` },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <PageHeader title={client.client} />
          <div className="flex flex-wrap items-center gap-2">
            {canEditPolicy && (
                <Button asChild>
                    <Link href={`/business-development/sales/${client.id}/edit`}>
                        <FilePenLine className="mr-2 h-4 w-4" />
                        Edit Policy
                    </Link>
                </Button>
            )}
            {isPendingVetting && <CompleteVettingDialog client={client} onUpdate={handleOnboardingStatusUpdate} />}
            {(isReworkRequired || isMandateReworkRequired) && isFromBusinessDevelopment && (
                <Button asChild>
                    <Link href={`/business-development/sales/${client.id}/edit`}>
                        <FilePenLine className="mr-2 h-4 w-4" />
                        Rework Form
                    </Link>
                </Button>
            )}
            {canStartMedicals && (
              <Button onClick={handleStartMedicals}>
                <FileClock className="mr-2 h-4 w-4" />
                Start Medicals
              </Button>
            )}
            {isPendingMedicals && (
               <Button onClick={handleMedicalsCompleted}>
                <Check className="mr-2 h-4 w-4" />
                Medicals Completed
              </Button>
            )}
            {canMakeDecision && (
              <>
                <AcceptPolicyDialog client={client} onUpdate={handlePolicyUpdate}/>
                <Button className="bg-sidebar text-sidebar-foreground hover:bg-sidebar/90">
                  <PauseCircle className="mr-2 h-4 w-4" />
                  Defer Policy
                </Button>
                <Button className="bg-sidebar text-sidebar-foreground hover:bg-sidebar/90">
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  NTU Policy
                </Button>
                <Button variant="destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Decline Policy
                </Button>
              </>
            )}
            {canVerifyMandate && <VerifyMandateDialog client={client} onUpdate={handlePolicyUpdate} />}
            {canCollectPremium && <CollectPremiumDialog client={client} onUpdate={handlePolicyUpdate} />}
             {isNTU && (
                 <Button onClick={handleRevertNTU} variant="outline">
                    <Undo2 className="mr-2 h-4 w-4" />
                    Revert to Pending Medicals
                </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Onboarding Status:</span>
            <Badge
              className={cn(
                'w-44 justify-center truncate',
                getStatusBadgeStyling(client.onboardingStatus)
              )}
            >
              {client.onboardingStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Billing Status:</span>
            <Badge
              className={cn(
                'w-44 justify-center truncate',
                getStatusBadgeStyling(client.billingStatus)
              )}
            >
              {client.billingStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Policy Status:</span>
            <Badge
              className={cn(
                'w-44 justify-center truncate',
                getStatusBadgeStyling(client.policyStatus)
              )}
            >
              {client.policyStatus}
            </Badge>
          </div>
        </div>
         {isReworkRequired && (
            <Alert variant="destructive">
                <FilePenLine className="h-4 w-4" />
                <AlertTitle>Rework Required (Vetting)</AlertTitle>
                <AlertDescription>
                    The underwriting department requires changes. Please see the Underwriting tab for remarks.
                </AlertDescription>
            </Alert>
        )}
         {isMandateReworkRequired && (
            <Alert variant="destructive">
                <FilePenLine className="h-4 w-4" />
                <AlertTitle>Rework Required (Mandate)</AlertTitle>
                <AlertDescription>
                    <p className="font-semibold">Premium Admin Remarks:</p>
                    <p>{client.mandateReworkNotes}</p>
                </AlertDescription>
            </Alert>
        )}
      </div>
      
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="claims">Claims History</TabsTrigger>
          <TabsTrigger value="underwriting-log">Underwriting</TabsTrigger>
          <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
          <TabsTrigger value="payment-history">Payment History</TabsTrigger>
          <TabsTrigger value="mandate">Mandate</TabsTrigger>
          <TabsTrigger value="activity-log">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
           <div className="space-y-6">
             <Card>
              <CardHeader className="flex flex-row items-center justify-between p-2 bg-summary rounded-t-md">
                 <h3 className="font-medium uppercase text-sidebar-foreground">
                  Policy Summary
                </h3>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {summaryDetails.map((detail) => (
                    <SummaryCard
                      key={detail.title}
                      title={detail.title}
                      value={detail.value}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between p-2 bg-sidebar rounded-t-md">
                 <h3 className="font-medium uppercase text-sidebar-foreground">
                  Personal details of life insured
                </h3>
              </CardHeader>
              <Separator />
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-6">
                <DetailItem label="Full Name" value={client.client} />
                <DetailItem label="Date of Birth" value={client.lifeAssuredDob ? format(new Date(client.lifeAssuredDob), 'PPP') : 'N/A'} />
                <DetailItem label="Place of Birth" value={client.placeOfBirth} />
                <DetailItem label="Age (Next Birthday)" value={client.ageNextBirthday || 'N/A'} />
                <DetailItem label="Gender" value={client.gender} />
                <DetailItem label="Marital Status" value={client.maritalStatus} />
                <DetailItem label="Number of Dependents" value={client.dependents} />
                <DetailItem label="Nationality" value={client.nationality} />
                <DetailItem label="Country of Residence" value={client.country} />
                <DetailItem label="Religion" value={client.religion} />
                <DetailItem label="Languages Spoken" value={client.languages} />
              </CardContent>
            </Card>

             <Card>
              <CardHeader className="flex flex-row items-center justify-between p-2 bg-sidebar rounded-t-md">
                 <h3 className="font-medium uppercase text-sidebar-foreground">
                  Contact Details
                </h3>
              </CardHeader>
               <Separator />
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-6">
                <DetailItem label="Email Address" value={client.email} />
                <DetailItem label="Telephone Number" value={client.phone} />
                 <DetailItem label="Work Telephone" value={client.workTelephone} />
                <DetailItem label="Home Telephone" value={client.homeTelephone} />
                <DetailItem label="Postal Address" value={client.postalAddress} />
                <DetailItem label="Residential Address" value={client.residentialAddress} />
                <DetailItem label="GPS Address" value={client.gpsAddress} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between p-2 bg-sidebar rounded-t-md">
                 <h3 className="font-medium uppercase text-sidebar-foreground">
                  Identification
                </h3>
              </CardHeader>
               <Separator />
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-6">
                <DetailItem label="National ID Type" value={client.nationalIdType} />
                <DetailItem label="ID Number" value={client.idNumber} />
                <DetailItem label="Place of Issue" value={client.placeOfIssue} />
                <DetailItem
                  label="Issue Date"
                  value={client.issueDate ? format(new Date(client.issueDate), 'PPP') : 'N/A'}
                />
                <DetailItem
                  label="Expiry Date"
                  value={client.expiryDateId ? format(new Date(client.expiryDateId), 'PPP') : 'N/A'}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between p-2 bg-sidebar rounded-t-md">
                 <h3 className="font-medium uppercase text-sidebar-foreground">
                  Policy Details
                </h3>
              </CardHeader>
               <Separator />
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-6">
                <DetailItem label="Serial Number" value={client.serial} />
                <DetailItem label="Payment Frequency" value={client.paymentFrequency} />
                <DetailItem
                  label="Increase Month"
                  value={client.commencementDate ? format(new Date(client.commencementDate), 'MMMM') : 'N/A'}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between p-2 bg-sidebar rounded-t-md">
                 <h3 className="font-medium uppercase text-sidebar-foreground">
                  Employment Details
                </h3>
              </CardHeader>
               <Separator />
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-6">
                <DetailItem label="Occupation" value={client.occupation} />
                <DetailItem label="Nature of Business/Work" value={client.natureOfBusiness} />
                <DetailItem label="Employer" value={client.employer} />
                <DetailItem
                  label="Employer Address"
                  value={client.employerAddress}
                />
                <DetailItem label="Monthly Basic Income (GHS)" value={client.monthlyBasicIncome?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
                <DetailItem label="Other Income (GHS)" value={client.otherIncome?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
                <DetailItem label="Total Monthly Income (GHS)" value={client.totalMonthlyIncome?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
              </CardContent>
            </Card>

             <Card>
                <CardHeader className="flex flex-row items-center justify-between p-2 bg-sidebar rounded-t-md">
                    <h3 className="font-medium uppercase text-sidebar-foreground">
                    Payment Details
                    </h3>
                </CardHeader>
                <Separator />
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-6">
                    <DetailItem label="Premium Payer Name" value={client.payerName} />
                    <DetailItem label="Bank Name" value={client.bankName} />
                    <DetailItem label="Bank Branch" value={client.bankBranch} />
                    <DetailItem label="Sort Code" value={client.sortCode} />
                    <DetailItem label="Account Type" value={client.accountType} />
                    <DetailItem label="Bank Account Name" value={client.bankAccountName} />
                    <DetailItem label="Bank Account Number" value={client.bankAccountNumber} />
                    <DetailItem label="Premium Amount (GHS)" value={`GHS ${client.premium.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                    <DetailItem label="Amount in Words" value={client.amountInWords} />
                    <DetailItem label="Premium Deduction Frequency" value={client.paymentFrequency} />
                </CardContent>
            </Card>

             <Card>
                <CardHeader className="flex flex-row items-center justify-between p-2 bg-sidebar rounded-t-md">
                    <h3 className="font-medium uppercase text-sidebar-foreground">
                    Existing Policies
                    </h3>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6 space-y-6">
                    <div>
                        <h4 className="font-semibold mb-2">Existing Life Insurance Policies</h4>
                        <ExistingPoliciesDisplay policies={client.existingPoliciesDetails} />
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Previously Declined Life Insurance Policies</h4>
                        <DeclinedPoliciesDisplay policies={client.declinedPolicyDetails} />
                    </div>
                </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between p-2 bg-sidebar rounded-t-md">
                  <h3 className="font-medium uppercase text-sidebar-foreground">
                  Agent Details
                  </h3>
              </CardHeader>
              <Separator />
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-6">
                  <DetailItem label="Agent Name" value={client.agentName} />
                  <DetailItem label="Agent Code" value={client.agentCode} />
                  <DetailItem label="Upline Name" value={client.uplineName} />
                  <DetailItem label="Upline Code" value={client.uplineCode} />
                  <DetailItem label="Introducer's Code" value={client.introducerCode} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="beneficiaries" className="mt-6">
            <div className="space-y-6">
                <BeneficiaryTable title="Primary Beneficiaries" beneficiaries={client.primaryBeneficiaries} />
                <BeneficiaryTable title="Contingent Beneficiaries" beneficiaries={client.contingentBeneficiaries} />
            </div>
        </TabsContent>
        
        <TabsContent value="health" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Heart className="text-primary"/> Health & Lifestyle Overview</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailItem label="Height" value={client.height ? `${client.height} ${client.heightUnit}` : 'N/A'} />
                <DetailItem label="Weight" value={client.weight ? `${client.weight} kg` : 'N/A'} />
                 <DetailItem
                    label="BMI"
                    value={
                        client.bmi && bmiStatus ? (
                        <div className="flex items-center gap-2">
                            <span>{client.bmi.toFixed(1)}</span>
                            <Badge className={cn('text-white', bmiStatus.color)}>{bmiStatus.text}</Badge>
                        </div>
                        ) : (
                        'N/A'
                        )
                    }
                />
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><GlassWater className="text-primary"/> Alcohol Consumption</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <DetailItem label="Drinking Habits" value={client.alcoholHabits ? alcoholHabitsLabels[client.alcoholHabits] : 'N/A'} />
                    
                    <AlcoholConsumptionTable client={client} />
                    
                    <div className="space-y-2">
                        <p className="font-medium">Advised by medical professional to reduce alcohol?</p>
                        <div className="flex items-center gap-2">
                             <YesNoDisplay value={client.reducedAlcoholMedicalAdvice?.reduced} />
                             {client.reducedAlcoholMedicalAdvice?.notes && <p className="text-sm text-muted-foreground">({client.reducedAlcoholMedicalAdvice.notes})</p>}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <p className="font-medium">Reduced alcohol due to health problems?</p>
                        <div className="flex items-center gap-2">
                             <YesNoDisplay value={client.reducedAlcoholHealthProblems?.reduced} />
                             {client.reducedAlcoholHealthProblems?.notes && <p className="text-sm text-muted-foreground">({client.reducedAlcoholHealthProblems.notes})</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cigarette text-primary"><path d="M18 12H2v4h16"/><path d="M22 12v4"/><path d="M7 12v4"/><path d="M18 8c0-2.2-1.8-4-4-4"/><path d="M22 8c0-2.2-1.8-4-4-4"/></svg> Tobacco & Nicotine Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <DetailItem label="Smoking Habits" value={client.tobaccoHabits ? tobaccoHabitsLabels[client.tobaccoHabits] : 'N/A'} />
                    <div className="space-y-2">
                        <p className="font-medium">Used any tobacco or nicotine products in the last 12 months?</p>
                        <YesNoDisplay value={client.usedNicotineLast12Months} />
                    </div>
                    <TobaccoConsumptionTable client={client} />
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Pill className="text-primary"/> Recreational Drugs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="font-medium max-w-[80%]">Have you ever used recreational drugs (e.g. cocaine, heroin, weed) or taken drugs other than for medical purposes?</p>
                    <YesNoDisplay value={client.usedRecreationalDrugs} />
                </div>
                <Separator />
                 <div className="flex items-center justify-between">
                    <p className="font-medium max-w-[80%]">Have you ever injected a non-prescribed drugs?</p>
                    <YesNoDisplay value={client.injectedNonPrescribedDrugs} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Biohazard className="text-primary" /> Viral Co-infections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium max-w-[80%]">
                    Have you ever been tested positive for HIV, Hepatitis B or C, or are you awaiting the results of such a test?
                  </p>
                  <YesNoDisplay value={client.testedPositiveViralInfection} />
                </div>
                {client.testedPositiveViralInfection === 'yes' && (
                  <div className="space-y-4 rounded-md border bg-muted/50 p-4">
                    {client.testedPositiveFor && (client.testedPositiveFor.hiv || client.testedPositiveFor.hepB || client.testedPositiveFor.hepC) && (
                      <div className="flex items-start gap-4">
                        <p className="font-semibold min-w-36">Tested positive for:</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {client.testedPositiveFor.hiv && <div>HIV</div>}
                          {client.testedPositiveFor.hepB && <div>Hepatitis B</div>}
                          {client.testedPositiveFor.hepC && <div>Hepatitis C</div>}
                        </div>
                      </div>
                    )}
                    {client.awaitingResultsFor && (client.awaitingResultsFor.hiv || client.awaitingResultsFor.hepB || client.awaitingResultsFor.hepC) && (
                      <div className="flex items-start gap-4">
                        <p className="font-semibold min-w-36">Awaiting results for:</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {client.awaitingResultsFor.hiv && <div>HIV</div>}
                          {client.awaitingResultsFor.hepB && <div>Hepatitis B</div>}
                          {client.awaitingResultsFor.hepC && <div>Hepatitis C</div>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <MedicalHistorySection
                title="Have you ever had, received or been diagnosed with any of the following:"
                icon={<Stethoscope className="text-primary" />}
                data={medicalHistory}
            />

             <MedicalHistorySection
                title="In the past 5 years have you ever had:"
                icon={<Stethoscope className="text-primary" />}
                data={medicalHistoryLast5Years}
            />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="text-primary"/> Family Medical History</CardTitle>
                </CardHeader>
                <CardContent>
                 <div className='mb-4'>
                    <YesNoDisplay value={client.familyMedicalHistory} />
                 </div>
                 {client.familyMedicalHistory === 'yes' && client.familyMedicalHistoryDetails && client.familyMedicalHistoryDetails.length > 0 ? (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Condition</TableHead>
                                    <TableHead>Relation</TableHead>
                                    <TableHead>Age of Occurrence</TableHead>
                                    <TableHead>Current Age / Age at Death</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {client.familyMedicalHistoryDetails.map((familyMember, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{familyMember.condition}</TableCell>
                                        <TableCell>{familyMember.relation}</TableCell>
                                        <TableCell>{familyMember.ageOfOccurrence}</TableCell>
                                        <TableCell>{familyMember.currentAgeOrAgeAtDeath}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                 ) : (
                    <p className="text-muted-foreground">No family medical history disclosed.</p>
                 )}
                </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="text-primary" /> Doctor's Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Current Doctor</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <DetailItem label="Name" value={client.currentDoctorName} />
                    <DetailItem label="Phone" value={client.currentDoctorPhone} />
                    <DetailItem label="Hospital" value={client.currentDoctorHospital} />
                  </div>
                </div>
                {(client.previousDoctorName || client.previousDoctorPhone || client.previousDoctorHospital) && (
                    <div className="pt-4">
                        <Separator className="my-4" />
                        <h4 className="font-semibold">Previous Doctor (if changed in last 6 months)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            <DetailItem label="Name" value={client.previousDoctorName} />
                            <DetailItem label="Phone" value={client.previousDoctorPhone} />
                            <DetailItem label="Hospital" value={client.previousDoctorHospital} />
                        </div>
                    </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="mandate" className="mt-6">
          <MandateTab client={client} />
        </TabsContent>

        <TabsContent value="claims" className="mt-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Claims History</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">A detailed history of all claims filed against this policy will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="underwriting-log" className="mt-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Underwriting Log</h3>
            </CardHeader>
            <CardContent>
              {isReworkRequired && client.vettingNotes ? (
                <div>
                    <h4 className="font-semibold">Vetting Rework Remarks</h4>
                    <p className="text-muted-foreground p-2 border rounded-md bg-destructive/10">{client.vettingNotes}</p>
                </div>
              ) : (
                 <p className="text-muted-foreground">A log of all underwriting activities, comments, and decisions will be shown here.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enquiries" className="mt-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Enquiries & Requests</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">A log of all client enquiries and service requests will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-history" className="mt-6">
          <PaymentHistoryTab client={client} />
        </TabsContent>
        
        <TabsContent value="activity-log" className="mt-6">
          <ActivityLogTab client={client} />
        </TabsContent>

      </Tabs>
    </div>
  );
}

    
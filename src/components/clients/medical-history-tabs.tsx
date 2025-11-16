
'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { Separator } from '@/components/ui/separator';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import MedicalConditionDetailsTable from './medical-condition-details-table';
import FamilyMedicalHistoryTable from './family-medical-history-table';
import { Input } from '../ui/input';

type FormValues = any; // Replace with z.infer<typeof yourSchema>

type MedicalHistoryTabsProps = {
  form: UseFormReturn<FormValues>;
};

function MedicalQuestion({ form, name, label, detailsFieldName, detailsOptions, children }: { form: UseFormReturn<FormValues>, name: string, label: string, detailsFieldName: string, detailsOptions?: string[], children?: React.ReactNode }) {
    const watchValue = useWatch({ control: form.control, name });

    return (
        <div className="p-4 border border-t-0 rounded-b-md space-y-6">
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="yes" /></FormControl>
                                    <FormLabel className="font-normal">Yes</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="no" /></FormControl>
                                    <FormLabel className="font-normal">No</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {watchValue === 'yes' && (
                children || <MedicalConditionDetailsTable form={form} fieldName={detailsFieldName} illnessOptions={detailsOptions} />
            )}
        </div>
    );
}

export default function MedicalHistoryTabs({ form }: MedicalHistoryTabsProps) {
    const watchFamilyHistory = useWatch({ control: form.control, name: 'familyMedicalHistory' });
    const watchPresentSymptoms = useWatch({ control: form.control, name: 'presentSymptoms' });

  return (
    <div className="space-y-8">
        <div>
            <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
                <h3>Past & Present Medical Diagnosis</h3>
            </div>
            <Separator className="my-0" />
            <div className="p-4 border border-t-0 rounded-b-md space-y-6">
                 <MedicalQuestion 
                    form={form} 
                    name="bloodTransfusionOrSurgery" 
                    label="Have you ever had a blood transfusion or surgery?" 
                    detailsFieldName="bloodTransfusionOrSurgeryDetails" 
                />
                <Separator />
                <MedicalQuestion 
                    form={form} 
                    name="highBloodPressure" 
                    label="Have you ever had or been told you had any of the following: High blood pressure, Angina, Heart attack, Stroke, Coma, any other disease of the heart, arteries, or circulation?" 
                    detailsFieldName="highBloodPressureDetails"
                    illnessOptions={['High blood pressure', 'Angina', 'Heart attack', 'Stroke', 'Coma', 'Other heart/artery/circulation disease']}
                />
                <Separator />
                <MedicalQuestion form={form} name="cancer" label="Have you ever had or been told you had any of the following: Cancer, Leukemia, Hodgkin's disease, Lymphoma, or any other tumor?" detailsFieldName="cancerDetails" illnessOptions={['Cancer', 'Leukemia', "Hodgkin's disease", 'Lymphoma', 'Other tumor']} />
                <Separator />
                <MedicalQuestion form={form} name="diabetes" label="Have you ever had or been told you had Diabetes?" detailsFieldName="diabetesDetails" illnessOptions={['Diabetes']} />
                <Separator />
                <MedicalQuestion form={form} name="colitisCrohns" label="Have you ever had or been told you had Colitis or Crohn's disease?" detailsFieldName="colitisCrohnsDetails" illnessOptions={["Crohn's disease", 'Colitis']} />
                <Separator />
                <MedicalQuestion form={form} name="paralysisEpilepsy" label="Have you ever had or been told you had any of the following: Paralysis, Multiple sclerosis, Epilepsy, Dementia, or any other central nervous system disorder?" detailsFieldName="paralysisEpilepsyDetails" illnessOptions={['Paralysis', 'Multiple sclerosis', 'Epilepsy', 'Dementia', 'Other central nervous system disorder']} />
                <Separator />
                <MedicalQuestion form={form} name="mentalIllness" label="Have you ever had or been told you had any of the following: Hospital/psychiatric treatment for mental illness, Depression, or a Nervous breakdown?" detailsFieldName="mentalIllnessDetails" illnessOptions={['Hospital/psychiatric treatment for mental illness', 'Depression', 'Nervous breakdown']} />
            </div>
        </div>

       <div>
        <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
          <h3>In the past 5 years have you had any of the following:</h3>
        </div>
        <Separator className="my-0" />
      </div>

      <MedicalQuestion form={form} name="arthritis" label="Arthritis, neck or back pain, gout or any other muscle, joint or bone disorder?" detailsFieldName="arthritisDetails" illnessOptions={['Arthritis', 'Neck or back pain', 'Gout', 'Other muscle/joint/bone disorder']} />
      <MedicalQuestion form={form} name="chestPain" label="Chest pain, irregular heart beat or raised cholesterol?" detailsFieldName="chestPainDetails" illnessOptions={['Chest pain', 'Irregular heart beat', 'Raised cholesterol']} />
      <MedicalQuestion form={form} name="asthma" label="Asthma, bronchitis, shortness of breath or any other chest complaint?" detailsFieldName="asthmaDetails" illnessOptions={['Asthma', 'Bronchitis', 'Shortness of breath', 'Other chest complaint']} />
      <MedicalQuestion form={form} name="digestiveDisorder" label="Duodenal or Gastric Ulcer or any other disorder of the digestive system (including the liver and pancreas)?" detailsFieldName="digestiveDisorderDetails" illnessOptions={['Duodenal Ulcer', 'Gastric Ulcer', 'Digestive System Disorder', 'Liver Disorder', 'Disorder of Pancreas']} />
      <MedicalQuestion form={form} name="bloodDisorder" label="Blood disorder or anemia?" detailsFieldName="bloodDisorderDetails" illnessOptions={['Blood disorder', 'Anemia']} />
      <MedicalQuestion form={form} name="thyroidDisorder" label="Thyroid disorder?" detailsFieldName="thyroidDisorderDetails" illnessOptions={['Thyroid disorder']} />
      <MedicalQuestion form={form} name="kidneyDisorder" label="Kidney disorder, renal failure or bladder disorder?" detailsFieldName="kidneyDisorderDetails" illnessOptions={['Kidney disorder', 'Renal failure', 'Bladder disorder']} />
      <MedicalQuestion form={form} name="numbness" label="Numbness, loss of felling or tingling of the limbs or face or temporary loss of muscle power?" detailsFieldName="numbnessDetails" illnessOptions={['Numbness']} />
      <MedicalQuestion form={form} name="anxietyStress" label="Anxiety, stress or depression?" detailsFieldName="anxietyStressDetails" illnessOptions={['Anxiety', 'Stress', 'Depression']} />
      <MedicalQuestion form={form} name="earEyeDisorder" label="Disorder of the ears or eyes including blindness, blurred or double vision?" detailsFieldName="earEyeDisorderDetails" illnessOptions={['Ear disorder', 'Eye disorder', 'Blindness', 'Blurred vision', 'Double vision']} />
      <MedicalQuestion form={form} name="lumpGrowth" label="A lump, growth, or change in a mole or freckle?" detailsFieldName="lumpGrowthDetails" illnessOptions={['Lump', 'Growth', 'Mole', 'Freckle']} />
      <MedicalQuestion form={form} name="hospitalAttendance" label="Attended a hospital, clinic or had any checkups, X-rays, scans or any other medical investigations?" detailsFieldName="hospitalAttendanceDetails" illnessOptions={['X-ray', 'Scan', 'Checkup', 'Operation']} />
      <MedicalQuestion form={form} name="criticalIllness" label="Any other condition for which you have been advised to have, or have had, treatment including Alzheimer's Disease or Multiple Sclerosis?" detailsFieldName="criticalIllnessDetails" illnessOptions={["Alzheimer's Disease", 'Multiple Sclerosis']} />
      <MedicalQuestion form={form} name="sti" label="Urethral discharge, Chancroid, Gonorrhoea, Syphilis, Urethritis, Genital sores, HIV infection, Balanitis, Genital Warts, Vaginal discharge or Vaginal trush?" detailsFieldName="stiDetails" illnessOptions={['Urethral discharge', 'Chancroid', 'Gonorrhoea', 'Syphilis', 'Urethritis', 'Genital sores', 'HIV infection', 'Balanitis', 'Genital Warts', 'Vaginal discharge', 'Vaginal trush']} />
      
      <div>
        <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
          <h3>Are you presently</h3>
        </div>
        <Separator className="my-0" />
      </div>
      
      <MedicalQuestion form={form} name="presentSymptoms" label="Do you currently have any symptoms for which you have not yet sought medical advice?" detailsFieldName="presentSymptomsDetails" illnessOptions={['Present Symptoms']} />

       {watchPresentSymptoms === 'yes' && (
           <div className="space-y-6 -mt-8 pt-4 p-4 border border-t-0 rounded-b-md">
                <FormField
                    control={form.control}
                    name="presentWaitingConsultation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Are you waiting for a consultation, test or result?</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                                    <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="presentTakingMedication"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Are you currently taking any medication (prescribed or otherwise)?</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                                    <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}
                />
           </div>
       )}

        <div>
            <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
                <h3>Family Medical History</h3>
            </div>
            <Separator className="my-0" />
            <div className="p-4 border border-t-0 rounded-b-md space-y-6">
                <FormField
                    control={form.control}
                    name="familyMedicalHistory"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Has any member of your immediate family (parents, brothers, sisters) suffered from Heart disease, Diabetes, Cancer, Huntington’s disease, Polycystic kidney disease, Multiple sclerosis, Polyposis, Glaucoma, Polyposis of colon or any hereditary disorder?</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value="yes" /></FormControl>
                                        <FormLabel className="font-normal">Yes</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value="no" /></FormControl>
                                        <FormLabel className="font-normal">No</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {watchFamilyHistory === 'yes' && <FamilyMedicalHistoryTable form={form} fieldName="familyMedicalHistoryDetails" />}
            </div>
        </div>
        
        <div>
            <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
                <h3>Doctor's Details</h3>
            </div>
            <Separator className="my-0" />
            <div className="p-4 border border-t-0 rounded-b-md space-y-6">
                <div>
                    <h4 className="font-semibold mb-4">Current Doctor</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField control={form.control} name="currentDoctorName" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name="currentDoctorPhone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name="currentDoctorHospital" render={({ field }) => (<FormItem><FormLabel>Hospital/Clinic &amp; Address</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                    </div>
                </div>
                 <Separator />
                <div>
                    <h4 className="font-semibold mb-4">Previous Doctor (if changed in last 6 months)</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField control={form.control} name="previousDoctorName" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name="previousDoctorPhone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name="previousDoctorHospital" render={({ field }) => (<FormItem><FormLabel>Hospital/Clinic &amp; Address</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                    </div>
                </div>
            </div>
        </div>

    </div>
  );
}

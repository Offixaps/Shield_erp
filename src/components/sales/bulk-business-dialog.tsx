
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
import { Upload, FileDown, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { createPolicy, getPolicies, generateNewSerialNumber } from '@/lib/policy-service';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { z } from 'zod';
import { newBusinessFormSchema } from '../clients/new-business-form-schema';


export default function BulkBusinessDialog() {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [simulationResult, setSimulationResult] = React.useState<{ successCount: number; failureCount: number; data: any[] } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDownloadSample = () => {
    // Defines the columns for the sample sheet based on a subset of the form schema
    const sampleData = [{
      Title: 'Mr',
      LifeAssuredFirstName: 'John',
      LifeAssuredMiddleName: 'Kofi',
      LifeAssuredSurname: 'Doe',
      LifeAssuredDob: '1990-01-15',
      PlaceOfBirth: 'Accra',
      Gender: 'Male',
      MaritalStatus: 'Single',
      Dependents: 0,
      Nationality: 'Ghanaian',
      Country: 'Ghana',
      Religion: 'Christian',
      Languages: 'English, Twi',
      Email: 'john.doe@example.com',
      Phone: '0244123456',
      PostalAddress: 'P.O. Box 123, Accra',
      NationalIdType: 'Ghana Card',
      IdNumber: 'GHA-123456789-0',
      PlaceOfIssue: 'NIA, Accra',
      IssueDate: '2020-01-15',
      ContractType: 'The Education Policy',
      PremiumAmount: 250,
      SumAssured: 120000,
      PaymentFrequency: 'Monthly',
      Occupation: 'Software Engineer',
      NatureOfBusiness: 'Technology',
      Employer: 'Tech Corp',
      EmployerAddress: '123 Tech Lane, Accra',
      MonthlyBasicIncome: 5000,
      BankName: 'GCB Bank PLC',
      BankBranch: 'Accra Main',
      SortCode: '040101',
      BankAccountName: 'John Kofi Doe',
      BankAccountNumber: '1234567890123',
      AccountType: 'Savings'
    }];
    
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bulk Business Sample');
    XLSX.writeFile(workbook, 'Bulk_Business_Sample.xlsx');
  };

  const handleUploadClick = () => {
    setSimulationResult(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSimulating(true);
    setSimulationResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet) as any[];

        let successCount = 0;
        let failureCount = 0;
        
        json.forEach(row => {
          const result = newBusinessFormSchema.partial().safeParse(row);
          if (result.success) {
            successCount++;
          } else {
            failureCount++;
          }
        });

        setSimulationResult({ successCount, failureCount, data: json });
      } catch (error) {
        console.error('Error processing uploaded file:', error);
        toast({
          variant: 'destructive',
          title: 'Simulation Failed',
          description: 'Could not read or process the uploaded file. Please check the format.',
        });
      } finally {
        setIsSimulating(false);
      }
    };
    reader.readAsBinaryString(file);

    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleConfirmImport = async () => {
    if (!simulationResult || simulationResult.successCount === 0) {
      toast({
        variant: 'destructive',
        title: 'Import Error',
        description: 'No valid data to import.',
      });
      return;
    }

    setIsSimulating(true);

    try {
      const policies = await getPolicies();
      const existingSerials = new Set(policies.map((p) => p.serial));
      let importedCount = 0;

      for (const row of simulationResult.data) {
        const result = newBusinessFormSchema.partial().safeParse(row);
        
        // We only process rows that passed the initial simulation.
        if (result.success) {
          const serial = await generateNewSerialNumber();
          
          if (!existingSerials.has(serial)) {
            // Augment with defaults and create
            const policyDataWithDefaults = {
              ...result.data,
              serial: serial, 
            };
            await createPolicy(policyDataWithDefaults);
            importedCount++;
            existingSerials.add(serial); // Add to set to prevent duplicate serials within the same batch
          }
        }
      }

      toast({
        title: 'Import Successful',
        description: `${importedCount} new business policies have been successfully imported.`,
      });

      window.dispatchEvent(new Event('storage'));
      setOpen(false);
      setSimulationResult(null);

    } catch (error) {
      console.error("Bulk import failed", error);
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred during the final import.',
      });
    } finally {
      setIsSimulating(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Business
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Business Upload</DialogTitle>
          <DialogDescription>
            Upload an Excel file with multiple new business applications.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="flex flex-col space-y-2">
                 <p className="text-sm text-muted-foreground">
                    1. Download the sample template to ensure your data is in the correct format.
                 </p>
                 <Button variant="secondary" onClick={handleDownloadSample}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Download Sample Template
                </Button>
            </div>
            <div className="flex flex-col space-y-2">
                <p className="text-sm text-muted-foreground">
                    2. Upload the populated Excel file to simulate the import.
                </p>
                 <Button onClick={handleUploadClick} disabled={isSimulating}>
                    {isSimulating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Upload className="mr-2 h-4 w-4" />
                    )}
                    Upload & Simulate
                </Button>
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".xlsx, .xls"
                />
            </div>

            {simulationResult && (
                 <Alert variant={simulationResult.failureCount > 0 ? 'destructive' : 'default'} className="bg-muted/50">
                    <AlertTitle>Simulation Complete</AlertTitle>
                    <AlertDescription className="space-y-1">
                        <p><strong>{simulationResult.successCount}</strong> records will be successfully imported.</p>
                        <p><strong>{simulationResult.failureCount}</strong> records have errors and will be skipped.</p>
                        {simulationResult.failureCount > 0 && <p className="text-xs">Please correct the errors in your file and re-upload.</p>}
                    </AlertDescription>
                </Alert>
            )}
        </div>
        <DialogFooter className="sm:justify-between">
           <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
           </DialogClose>
           <Button onClick={handleConfirmImport} disabled={isSimulating || !simulationResult || simulationResult.successCount === 0}>
                {isSimulating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirm and Import
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

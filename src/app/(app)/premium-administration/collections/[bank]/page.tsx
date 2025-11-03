
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { getPolicies } from '@/lib/policy-service';
import type { NewBusiness } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Upload, Download, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function BankPoliciesPage() {
  const params = useParams();
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const bankName = React.useMemo(() => {
    const bank = params.bank;
    return typeof bank === 'string' ? decodeURIComponent(bank) : '';
  }, [params.bank]);

  const [allPolicies, setAllPolicies] = React.useState<NewBusiness[]>([]);
  const [filteredPolicies, setFilteredPolicies] = React.useState<NewBusiness[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    if (bankName) {
      const allPolicies = getPolicies();
      const filtered = allPolicies.filter(
        (p) => p.policyStatus === 'Active' && p.bankName === bankName
      );
      setAllPolicies(filtered);
      setFilteredPolicies(filtered);
    }
  }, [bankName]);

   React.useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = allPolicies.filter(item => {
      return (
        item.policy.toLowerCase().includes(lowercasedFilter) ||
        item.payerName.toLowerCase().includes(lowercasedFilter) ||
        item.bankAccountNumber.toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredPolicies(filtered);
  }, [searchTerm, allPolicies]);

  const handlePostToBank = () => {
    const dataToExport = filteredPolicies.map(p => ({
        'Policy Number': p.policy,
        'Payer Name': p.payerName,
        'Premium Amount': p.premium,
        'Bank Account Number': p.bankAccountNumber,
        'Sort Code': p.sortCode,
        'Narration': p.narration,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bank Policies");
    XLSX.writeFile(workbook, `${bankName.replace(/ /g, '_')}_Policies.xlsx`);

    toast({
      title: 'Export Successful',
      description: 'The list of policies has been exported to an Excel file.',
    });
  };

  const handleUploadBankReport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        console.log('Uploaded Bank Report Data:', json);
        
        toast({
          title: 'File Uploaded',
          description: `${file.name} has been successfully processed. Check the console for the data.`,
        });
        
        // TODO: Implement logic to update policies based on the uploaded report
      
      } catch (error) {
        console.error('Error processing uploaded file:', error);
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: 'There was an error processing the uploaded file.',
        });
      }
    };
    reader.readAsBinaryString(file);

    // Reset file input
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`Active Policies for ${bankName.replace(' (Ghana) Limited', '').replace(' PLC', '').replace(' Limited', '')}`}
          description="A list of all active policies for this bank."
        />
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePostToBank}>
                <Download className="mr-2 h-4 w-4" />
                Post to Bank
            </Button>
            <Button onClick={handleUploadBankReport}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Bank Report
            </Button>
             <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".xlsx, .xls, .csv"
            />
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6 space-y-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by policy, payer name, or account..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {filteredPolicies.length > 0 ? (
            <div className="rounded-md border">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Policy number</TableHead>
                    <TableHead>Payer Name</TableHead>
                    <TableHead>Premium Amount</TableHead>
                    <TableHead>Bank Account Number</TableHead>
                    <TableHead>Sort Code</TableHead>
                    <TableHead>Narration</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredPolicies.map((policy) => (
                    <TableRow key={policy.id}>
                        <TableCell>
                            <Link href={`/business-development/clients/${policy.id}?from=premium-admin&tab=payment-history`} className="font-medium text-primary hover:underline">
                                {policy.policy}
                            </Link>
                        </TableCell>
                        <TableCell>{policy.payerName}</TableCell>
                        <TableCell>GHS{policy.premium.toFixed(2)}</TableCell>
                        <TableCell>{policy.bankAccountNumber}</TableCell>
                        <TableCell>{policy.sortCode}</TableCell>
                        <TableCell>{policy.narration}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No active policies found for {bankName.replace(' (Ghana) Limited', '').replace(' PLC', '').replace(' Limited', '')} matching your search.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



'use client';

import * as React from 'react';
import type { NewBusiness } from '@/lib/data';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import Image from 'next/image';
import { format } from 'date-fns';

function DetailRow({ label, value, children }: { label: string, value?: string | number | undefined, children?: React.ReactNode }) {
    return (
        <div className="flex flex-col space-y-1">
            <span className="text-xs uppercase text-gray-500 tracking-wider">{label}</span>
             {children ? (
                <div className="border-b border-gray-300 pb-1 h-20 relative">{children}</div>
             ) : (
                <span className="text-sm font-semibold border-b border-gray-300 pb-1 h-6">{value || ''}</span>
             )}
        </div>
    )
}

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="bg-gray-800 text-white -mx-6 px-6 py-1">
            <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
        </div>
    )
}

export default function MandateTab({ client }: { client: NewBusiness }) {
    const clientDetails = {
        surname: client.payerName.split(' ').slice(-1).join(' '),
        firstName: client.payerName.split(' ').slice(0, -1).join(' '),
        middleName: '',
        postalAddress: client.postalAddress || 'N/A',
        emailAddress: client.email || 'N/A',
        amountInWords: client.amountInWords || 'N/A',
        accountType: client.accountType || 'N/A',
        paymentFrequency: client.paymentFrequency || 'N/A',
        bankBranch: client.bankBranch || 'N/A',
        bankAccountName: client.bankAccountName || 'N/A',
    };

    return (
        <Card className="max-w-4xl mx-auto font-serif">
            <CardContent className="p-0">
                <div className="p-6">
                    <header className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20">
                                <Image
                                    src="/logo - mandate.svg"
                                    alt="First Insurance Company Limited Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-800">FIRST INSURANCE COMPANY LIMITED</h1>
                                <p className="text-xs text-gray-600">Home Office:</p>
                                <p className="text-xs text-gray-600">House No. 59 Ring Road</p>
                                <p className="text-xs text-gray-600">Asylum Down</p>
                                <p className="text-xs text-gray-600">Accra</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <h2 className="text-xl font-bold text-gray-800 tracking-wider">PAYMENT AUTHORISATION</h2>
                             <h2 className="text-xl font-bold text-gray-800 tracking-wider">FORM</h2>
                        </div>
                    </header>

                    <div className="space-y-4">
                        <SectionHeader title="Client Details" />
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <DetailRow label="Surname" value={clientDetails.surname} />
                            <DetailRow label="First Name" value={clientDetails.firstName} />
                            <DetailRow label="Middle Name(s)" value={clientDetails.middleName} />
                            <DetailRow label="Phone Number" value={client.phone} />
                            <div className="col-span-2">
                                <DetailRow label="Postal Address" value={clientDetails.postalAddress} />
                            </div>
                             <div className="col-span-2">
                                <DetailRow label="Email Address" value={clientDetails.emailAddress} />
                            </div>
                        </div>
                        
                        <SectionHeader title="Premium Details" />
                        <div className="space-y-4">
                             <DetailRow label="Premium GHC" value={client.premium.toFixed(2)} />
                             <DetailRow label="Amount in Words" value={clientDetails.amountInWords} />
                             <div>
                                <span className="text-xs uppercase text-gray-500 tracking-wider">Premium Deduction Frequency</span>
                                 <RadioGroup value={clientDetails.paymentFrequency} className="flex gap-6 pt-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Monthly" id="r-monthly" checked={clientDetails.paymentFrequency === 'Monthly'} disabled />
                                        <Label htmlFor="r-monthly" className="font-normal">Monthly</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Quarterly" id="r-quarterly" disabled />
                                        <Label htmlFor="r-quarterly" className="font-normal text-gray-400">Quarterly</Label>
                                    </div>
                                     <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Semi-Annually" id="r-semi" disabled />
                                        <Label htmlFor="r-semi" className="font-normal text-gray-400">Semi-Annually</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Annually" id="r-annually" disabled />
                                        <Label htmlFor="r-annually" className="font-normal text-gray-400">Annually</Label>
                                    </div>
                                </RadioGroup>
                             </div>
                        </div>

                        <SectionHeader title="Instruction to the Bank" />
                        <div className="space-y-4">
                            <DetailRow label="Name of Bank" value={client.bankName} />
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                <DetailRow label="Branch" value={clientDetails.bankBranch} />
                                <DetailRow label="Sort Code" value={client.sortCode} />
                            </div>
                            <div>
                                <span className="text-xs uppercase text-gray-500 tracking-wider">Type of Account</span>
                                 <RadioGroup value={clientDetails.accountType} className="flex gap-6 pt-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Current" id="r-current" checked={clientDetails.accountType === 'Current'} disabled />
                                        <Label htmlFor="r-current" className="font-normal">Current</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Savings" id="r-savings" checked={clientDetails.accountType === 'Savings'} disabled />
                                        <Label htmlFor="r-savings" className="font-normal">Savings</Label>
                                    </div>
                                     <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Others" id="r-others" checked={clientDetails.accountType === 'Others'} disabled />
                                        <Label htmlFor="r-others" className="font-normal">Others</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <DetailRow label="Bank Account Name" value={clientDetails.bankAccountName} />
                            <DetailRow label="Bank Account Number" value={client.bankAccountNumber} />
                            <DetailRow label="Phone Number" value={client.phone} />
                        </div>

                        <div className="pt-4 text-sm space-y-4">
                             <p>I, the undersigned, hereby authorize the Bank to deduct the premium from my bank account to First Insurance</p>
                             <p>I hereby agree that my Bank withholds and credit First Insurance an amount equal to the premium including any premium update that may be due at all times to ensure I am adequately covered under this policy.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 pt-10">
                             <DetailRow label="Signature">
                                {(client as any).lifeInsuredSignature && (
                                    <Image src={(client as any).lifeInsuredSignature} alt="Life Insured Signature" fill style={{ objectFit: 'contain', objectPosition: 'left bottom' }} />
                                )}
                            </DetailRow>
                            <DetailRow label="Date" value={client.commencementDate ? format(new Date(client.commencementDate), 'PPP') : ''} />
                        </div>
                        
                        <div className="pt-6">
                            <SectionHeader title="Office use only:" />
                            <div className="space-y-4 p-4 border border-t-0 border-gray-800">
                                <DetailRow label="Policy Number" value={client.policy} />
                                <DetailRow label="Approval Date" value={client.commencementDate ? format(new Date(client.commencementDate), 'PPP') : ''} />
                                <DetailRow label="Authorized by (Name, Signature and Stamp)" value={undefined} />
                            </div>
                        </div>

                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

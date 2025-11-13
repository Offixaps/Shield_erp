
'use client';

import * as React from 'react';
import type { NewBusiness } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export default function DeclarationTab({ client }: { client: NewBusiness }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Declarations & Signatures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                    <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
                        <h3>DECLARATION BY LIFE INSURED</h3>
                    </div>
                    <Separator className="my-0" />
                    <div className="p-4 border border-t-0 rounded-b-md space-y-4 text-sm">
                        <p>1. I declare that the information provided by me in this application together with any additional statements or documents, whether in my own handwriting or not, are wholly true and accurate and shall form the basis of the life insurance contract between the Company and myself and shall be read together with the policy document.</p>
                        <p>2. I have read over my responses to the questions in this application and I declare that all the answers are true and correct.</p>
                        <p>3. I understand that if any information is found to be false, misleading or incorrect, this policy shall be rendered void and the position of any payments made shall be at the discretion of the Company.</p>
                        <div className="pt-4 space-y-4">
                            <h4 className="font-bold uppercase">INFORMED CONSENT BY LIFE INSURED</h4>
                            <p>4. I hereby consent and irrevocably authorize FIRST INSURANCE COMPANY LIMITED to elicit relevant and necessary information from any certified medical Officer who has attended to me, or any insurance office to which an application for insurance has been made on my life, or any other person who may be in possession or hereafter acquire information concerning my state or health up to the present time to disclose such information to the Company First Insurance and agree that this authority shall remain in force prior to or after my death.</p>
                            <p>5. I understand that i may be required to undergo medical examination and/or tests where necessary and I give consent to a certified Medical Officer or any other appointed health provider to take sample of my blood, urine or other bodily fluid for the purpose of conducting such test.</p>
                            <p>6. I understand that it is my responsibility to avail myself for any necessary re-testing and that, if i choose not to do so, the Company may consider my inaction as a request to withdraw this application.</p>
                        </div>
                        <Separator className="my-6" />
                        <div className="space-y-2">
                            <h4 className="font-bold">Signature of Life Insured</h4>
                            {client.lifeInsuredSignature ? (
                                <div className="relative aspect-[4/1] w-full max-w-sm rounded-md border p-2 bg-muted/20">
                                    <Image src={client.lifeInsuredSignature} alt="Life Insured's signature" fill className="object-contain" />
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No signature provided.</p>
                            )}
                        </div>
                    </div>
                </div>

                 <div>
                    <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
                        <h3>DECLARATION OF CONDITIONAL COVERAGE BY POLICY OWNER</h3>
                    </div>
                     <Separator className="my-0" />
                    <div className="p-4 border border-t-0 rounded-b-md space-y-4 text-sm">
                        <p className="font-bold">I understand and agree that the insurance coverage I am applying for is subject to all the following conditions being met:</p>
                        <ol className="list-decimal list-outside space-y-2 pl-5">
                            <li>I submit this application with the intention of entering into a contract with FIRST INSURANCE COMPANY LIMITED for the benefit set out in its policy and on its terms and conditions.</li>
                            <li>All the information provided in this application together with any additional statement or documents are wholly true and accurate.</li>
                            <li>All information concerning the insurability of the Life Insured (including but not limited to, the result of medical examinations or body fluid studies and certified Medical Officer's statements) is received by the Company.</li>
                            <li>The Company's underwriters have accepted this application for life insurance.</li>
                            <li>The Company has received the first premium in full.</li>
                            <li>The final premium will be determined by the Company's underwriters.</li>
                        </ol>
                         <Separator className="my-6" />
                        <div className="space-y-2">
                            <h4 className="font-bold">Signature of Policy Owner</h4>
                             {client.policyOwnerSignature ? (
                                <div className="relative aspect-[4/1] w-full max-w-sm rounded-md border p-2 bg-muted/20">
                                    <Image src={client.policyOwnerSignature} alt="Policy Owner's signature" fill className="object-contain" />
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No signature provided. (This may be because the Policy Owner is the same as the Life Insured).</p>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

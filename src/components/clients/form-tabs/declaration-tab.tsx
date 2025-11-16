
'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import SignaturePadComponent from '../signature-pad';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Send } from 'lucide-react';

type DeclarationTabProps = {
  form: UseFormReturn<any>;
};

export default function DeclarationTab({ form }: DeclarationTabProps) {
  const { toast } = useToast();
  const [isLifeInsuredSignatureVerified, setIsLifeInsuredSignatureVerified] = React.useState(false);
  const [lifeInsuredVerificationCode, setLifeInsuredVerificationCode] = React.useState('');
  const [isLifeInsuredCodeSent, setIsLifeInsuredCodeSent] = React.useState(false);

  const [isPolicyOwnerSignatureVerified, setIsPolicyOwnerSignatureVerified] = React.useState(false);
  const [policyOwnerVerificationCode, setPolicyOwnerVerificationCode] = React.useState('');
  const [isPolicyOwnerCodeSent, setIsPolicyOwnerCodeSent] = React.useState(false);

  const handleSendLifeInsuredCode = () => {
    setIsLifeInsuredCodeSent(true);
    toast({
      title: "Verification Code Sent",
      description: `A verification code has been sent to ${form.getValues('email')}. (This is a simulation).`,
    });
  };

  const handleVerifyLifeInsuredCode = () => {
    if (lifeInsuredVerificationCode === "123456") {
      setIsLifeInsuredSignatureVerified(true);
      toast({
        title: "Identity Verified",
        description: "Your signature has been successfully verified.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "The verification code is incorrect. Please try again.",
      });
    }
  };

  const handleSendPolicyOwnerCode = () => {
    setIsPolicyOwnerCodeSent(true);
    toast({
      title: "Verification Code Sent",
      description: `A verification code has been sent to the policy owner's contact. (This is a simulation).`,
    });
  };

  const handleVerifyPolicyOwnerCode = () => {
    if (policyOwnerVerificationCode === "123456") {
      setIsPolicyOwnerSignatureVerified(true);
      toast({
        title: "Identity Verified",
        description: "The policy owner's signature has been successfully verified.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "The verification code is incorrect. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
          <h3>Declaration and Authorisation by Life Insured</h3>
        </div>
        <Separator className="my-0" />
        <div className="p-4 border border-t-0 rounded-b-md space-y-6">
          <p className="text-sm text-justify">
            I, the life to be insured, hereby declare that all the foregoing statements and answers are true, complete and correct and I agree that this proposal and declaration, together with any other declarations by me, shall be the basis of the contract between me and First Insurance Company Ltd. I further agree that in the event of any untrue or incorrect statement or any suppression or misrepresentation of material information, the policy to be issued shall be void and all monies which shall have been paid in respect thereof, shall be forfeited to the company. I agree to First Insurance Company Ltd processing my personal data including my sensitive personal data for the purpose of this insurance. I further agree to First Insurance Company Ltd transferring my personal data including my sensitive personal data outside Ghana where it is necessary to do so for the purpose of this insurance.
          </p>
          <Separator />
          <FormField
            control={form.control}
            name="lifeInsuredSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Life Insured's Signature</FormLabel>
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
          <div className="space-y-4">
            <AlertTitle>Signature Verification</AlertTitle>
            <Alert>
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle>Verify your identity to confirm your signature</AlertTitle>
              <AlertDescription>
                We will send a one-time verification code to your email address ({form.getValues('email') || 'not provided'}) to confirm your signature.
              </AlertDescription>
            </Alert>
            {!isLifeInsuredCodeSent ? (
              <Button type="button" onClick={handleSendLifeInsuredCode} className="w-full sm:w-auto">
                <Send className="mr-2" /> Send Verification Code
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Enter 6-digit code"
                  value={lifeInsuredVerificationCode}
                  onChange={(e) => setLifeInsuredVerificationCode(e.target.value)}
                  maxLength={6}
                  className="w-full sm:w-48"
                />
                <Button
                  type="button"
                  onClick={handleVerifyLifeInsuredCode}
                  disabled={isLifeInsuredSignatureVerified}
                  className="w-full sm:w-auto"
                >
                  <ShieldCheck className="mr-2" /> {isLifeInsuredSignatureVerified ? 'Verified' : 'Verify'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className='flex items-center justify-between text-lg font-medium text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
          <h3>Declaration of Conditional Coverage by Policy Owner</h3>
        </div>
        <Separator className="my-0" />
        <div className="p-4 border border-t-0 rounded-b-md space-y-6">
          <p className="text-sm text-justify">
            I, the policy owner, hereby declare that all the foregoing statements and answers are true, complete and correct and I agree that this proposal and declaration, together with any other declarations by me, shall be the basis of the contract between me and First Insurance Company Ltd.
          </p>
          <Separator />
          <FormField
            control={form.control}
            name="policyOwnerSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Policy Owner's Signature</FormLabel>
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
          <div className="space-y-4">
            <AlertTitle>Signature Verification</AlertTitle>
            <Alert>
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle>Verify Policy Owner's identity to confirm signature</AlertTitle>
              <AlertDescription>
                We will send a one-time verification code to the policy owner's contact details to confirm their signature.
              </AlertDescription>
            </Alert>
            {!isPolicyOwnerCodeSent ? (
              <Button type="button" onClick={handleSendPolicyOwnerCode} className="w-full sm:w-auto">
                <Send className="mr-2" /> Send Verification Code
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Enter 6-digit code"
                  value={policyOwnerVerificationCode}
                  onChange={(e) => setPolicyOwnerVerificationCode(e.target.value)}
                  maxLength={6}
                  className="w-full sm:w-48"
                />
                <Button
                  type="button"
                  onClick={handleVerifyPolicyOwnerCode}
                  disabled={isPolicyOwnerSignatureVerified}
                  className="w-full sm:w-auto"
                >
                  <ShieldCheck className="mr-2" /> {isPolicyOwnerSignatureVerified ? 'Verified' : 'Verify'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

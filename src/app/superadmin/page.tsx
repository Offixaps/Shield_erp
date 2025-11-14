
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { setSuperAdminUser } from '@/lib/staff-service';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,36.45,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);

export default function SuperAdminLoginPage() {
  const { signInWithGoogle, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithGoogle();
      if (userCredential?.user) {
        await setSuperAdminUser(userCredential.user);
        toast({
            title: 'Login Successful',
            description: `Welcome, Super Admin ${userCredential.user.displayName}.`,
        });
        router.push('/select-department');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="relative h-16 w-48">
            <Image
              src="/logo - light.svg"
              alt="SHIELD ERP Logo"
              fill
              className="object-contain dark:hidden"
              priority
            />
            <Image
              src="/logo - dark.svg"
              alt="SHIELD ERP Logo"
              fill
              className="object-contain hidden dark:block"
              priority
            />
          </div>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Super Admin Login</CardTitle>
            <CardDescription>
              Sign in with your Google account to access the administration panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleLogin} disabled={loading}>
              {loading ? 'Signing In...' : <><GoogleIcon /> Sign In with Google</>}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

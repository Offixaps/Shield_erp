
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { getRoles } from '@/lib/role-service';
import type { Role } from '@/lib/data';
import { createStaffMember, getStaffByUid, updateStaff } from '@/lib/staff-service';
import { useAuth, db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { TelephoneInput } from '@/components/ui/telephone-input';

const phoneRegex = /^[0-9]{9}$/;
const phoneError = "Phone number must be a 9-digit number (e.g., 558009876)";

export const newStaffFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters.'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().regex(phoneRegex, phoneError),
  role: z.string({ required_error: 'Please select a role.' }),
  department: z.string().optional(),
  profileImage: z.any().optional(),
  sendWelcomeEmail: z.boolean().default(false),
  password: z.string().min(8, 'Password must be at least 8 characters.').optional(),
});

type NewStaffFormProps = {
  staffId?: string;
};

export default function NewStaffForm({ staffId }: NewStaffFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [currentUserDepartment, setCurrentUserDepartment] = React.useState('');
  const isEditMode = !!staffId;

  React.useEffect(() => {
    async function fetchInitialData() {
        const fetchedRoles = await getRoles();
        setRoles(fetchedRoles);
        if (user) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setCurrentUserDepartment(userData.department);
                if (!isEditMode) {
                    form.setValue('department', userData.department);
                }
            }
        }
    }
    fetchInitialData();
  }, [user, isEditMode]);

  const form = useForm<z.infer<typeof newStaffFormSchema>>({
    resolver: zodResolver(newStaffFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      sendWelcomeEmail: true,
      password: '',
    },
  });
  
  React.useEffect(() => {
    if (isEditMode && staffId) {
        const fetchStaff = async () => {
            const staffData = await getStaffByUid(staffId);
            if (staffData) {
                form.reset({
                ...staffData,
                password: '',
                });
            }
        };
        fetchStaff();
    }
  }, [isEditMode, staffId, form]);

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    form.setValue('password', retVal);
    toast({
        title: "Password Generated",
        description: "A new secure password has been generated and filled in."
    })
  };
  
  async function onSubmit(values: z.infer<typeof newStaffFormSchema>) {
    if (isEditMode && staffId) {
      await updateStaff(staffId, values);
      toast({
        title: 'Staff Member Updated',
        description: `${values.firstName} ${values.lastName}'s details have been updated.`,
      });
    } else {
        if (!values.password) {
            form.setError('password', { message: 'Password is required for new staff members.' });
            return;
        }
      await createStaffMember(values);
      toast({
        title: 'Staff Member Added',
        description: `${values.firstName} ${values.lastName} has been added to the system.`,
      });
    }
    router.push('/staff');
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
                control={form.control}
                name="firstName"
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
                name="lastName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                    <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
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
                    <TelephoneInput placeholder="55 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role for the staff member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name}
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
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value} disabled={currentUserDepartment !== 'Super Admin' && currentUserDepartment !== 'Administrator'}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Business Development">Business Development</SelectItem>
                        <SelectItem value="Premium Administration">Premium Administration</SelectItem>
                        <SelectItem value="Underwriting">Underwriting</SelectItem>
                      </SelectContent>
                    </Select>
                     <FormDescription>
                      The staff member will be assigned to this department.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
        </div>

        <FormField
            control={form.control}
            name="profileImage"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <FormControl>
                    <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                </FormControl>
                <FormDescription>Upload an image for the staff member's profile.</FormDescription>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="flex items-center gap-2">
                        <FormControl>
                            <Input type={showPassword ? 'text' : 'password'} placeholder={isEditMode ? "Enter new password to change" : "Enter a strong password"} {...field} />
                        </FormControl>
                        <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)}>
                           {showPassword ? <EyeOff /> : <Eye />}
                           <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </Button>
                        <Button type="button" variant="outline" onClick={generatePassword}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Generate
                        </Button>
                    </div>
                     <FormDescription>{isEditMode ? "Leave blank to keep the current password." : "The user will use this password to log in."}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField
          control={form.control}
          name="sendWelcomeEmail"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isEditMode}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Send Welcome Email
                </FormLabel>
                <FormDescription>
                  If checked, the new staff member will receive an email with their login credentials. (Disabled on edit)
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <Button type="submit">{isEditMode ? 'Update Staff Member' : 'Add Staff Member'}</Button>
      </form>
    </Form>
  );
}

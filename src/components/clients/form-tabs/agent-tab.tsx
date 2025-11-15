
'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

type AgentTabProps = {
  form: UseFormReturn<any>;
};

export default function AgentTab({ form }: AgentTabProps) {
  return (
    <div>
      <div className='flex items-center justify-between text-lg font-bold text-white p-2 rounded-t-md uppercase' style={{ backgroundColor: '#023ea3' }}>
        <h3>DETAILS OF AGENT</h3>
      </div>
      <Separator className="my-0" />
      <div className="p-4 space-y-6">
        <p>I am a duly authorized agent of First Insurance.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="agentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of Agent</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Jane Doe" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agentCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., A1234" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="uplineName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of Upline</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Smith" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="uplineCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upline Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., U5678" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="introducerCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Introducer's Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g., I9101" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

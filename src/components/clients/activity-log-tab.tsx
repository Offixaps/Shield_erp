
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Briefcase,
  FileCheck,
  FileClock,
  FilePenLine,
  FileX,
  Mail,
  MessageSquare,
  type LucideIcon,
  User,
  CheckCircle,
  Banknote,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { format } from 'date-fns';
import type { ActivityLog, NewBusiness } from '@/lib/data';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

type ActivityLogTabProps = {
  client: NewBusiness;
};

const iconMap: Record<string, LucideIcon> = {
  default: FileClock,
  created: FileCheck,
  changed: FilePenLine,
  payment: Banknote,
  vetted: ShieldCheck,
  declined: FileX,
  rework: ShieldAlert,
};

const getIconForAction = (action: string): LucideIcon => {
  const lowerCaseAction = action.toLowerCase();
  if (lowerCaseAction.includes('created')) return iconMap.created;
  if (lowerCaseAction.includes('payment')) return iconMap.payment;
  if (lowerCaseAction.includes('paid')) return iconMap.payment;
  if (lowerCaseAction.includes('confirmed')) return iconMap.payment;
  if (lowerCaseAction.includes('vetting')) return iconMap.vetted;
  if (lowerCaseAction.includes('vetted')) return iconMap.vetted;
  if (lowerCaseAction.includes('declined')) return iconMap.declined;
  if (lowerCaseAction.includes('rework')) return iconMap.rework;
  if (lowerCaseAction.includes('changed')) return iconMap.changed;
  return iconMap.default;
};

const userColorMap: Record<string, string> = {
    'system': 'bg-gray-500',
    'sales agent': 'bg-blue-500',
    'underwriting': 'bg-purple-500',
    'premium admin': 'bg-green-500',
    'client': 'bg-orange-500',
}

const getUserBadgeColor = (user: string) => {
    return userColorMap[user.toLowerCase()] || 'bg-gray-500';
}

export default function ActivityLogTab({ client }: ActivityLogTabProps) {
  const sortedLog = React.useMemo(() => {
    if (!client.activityLog) return [];
    return [...client.activityLog].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [client.activityLog]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedLog && sortedLog.length > 0 ? (
          <div className="relative pl-6">
            <div className="absolute left-[35px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
            <ul className="space-y-8">
              {sortedLog.map((log, index) => {
                const Icon = getIconForAction(log.action);
                return (
                  <li key={index} className="flex items-start gap-4">
                    <div className="absolute left-[35px] z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-background ring-4 ring-background">
                       <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                         <Icon className="h-4 w-4" />
                       </div>
                    </div>
                    <div className="flex-1 space-y-1 pl-8">
                        <div className="flex items-center justify-between">
                             <div className="font-medium">{log.action}</div>
                             <time className="text-xs text-muted-foreground">
                                {format(new Date(log.date), "PPP p")}
                             </time>
                        </div>
                        <div className='flex items-center gap-2'>
                             <Badge className={cn('text-white', getUserBadgeColor(log.user))}>{log.user}</Badge>
                             {log.details && <p className="text-sm text-muted-foreground">{log.details}</p>}
                        </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className="text-muted-foreground">
            No activity log found for this policy.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

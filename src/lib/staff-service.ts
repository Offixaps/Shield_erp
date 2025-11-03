
'use client';

import { staffData, type StaffMember } from './data';
import type { z } from 'zod';
import type { newStaffFormSchema } from '@/components/staff/new-staff-form';


const LOCAL_STORAGE_KEY = 'shield-erp-staff';

function getStaffFromStorage(): StaffMember[] {
  if (typeof window === 'undefined') {
    return staffData;
  }

  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      return Array.isArray(parsedData) ? parsedData : staffData;
    } catch (e) {
      console.error("Failed to parse staff from localStorage", e);
    }
  }
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(staffData));
  return staffData;
}

function saveStaffToStorage(staff: StaffMember[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(staff));
}

export function getStaff(): StaffMember[] {
  return getStaffFromStorage();
}

export function getStaffById(id: number): StaffMember | undefined {
  const staff = getStaffFromStorage();
  return staff.find((member) => member.id === id);
}

export function createStaffMember(values: z.infer<typeof newStaffFormSchema>): StaffMember {
    const staff = getStaffFromStorage();
    const newId = staff.length > 0 ? Math.max(...staff.map(r => r.id)) + 1 : 1;
    
    const newStaffMember: StaffMember = {
        id: newId,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        role: values.role,
    };

    const updatedStaff = [...staff, newStaffMember];
    saveStaffToStorage(updatedStaff);
    return newStaffMember;
}

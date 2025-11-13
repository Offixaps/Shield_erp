
'use client';

import { staffData, type StaffMember } from './data';
import type { z } from 'zod';
import type { newStaffFormSchema } from '@/components/staff/new-staff-form';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


const USERS_COLLECTION = 'users';

const getDepartmentForRole = (role: string): string => {
    if (role === 'Administrator') return 'Administrator';
    if (['Sales Agent', 'Business Development Manager'].includes(role)) return 'Business Development';
    if (role === 'Premium Administrator') return 'Premium Administration';
    if (role === 'Underwriter') return 'Underwriting';
    return 'General';
};

// --- Firestore Service Functions ---

export async function getStaff(): Promise<StaffMember[]> {
  const usersCollection = collection(db, USERS_COLLECTION);
  const userSnapshot = await getDocs(usersCollection).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: usersCollection.path,
      operation: 'list',
    });
    errorEmitter.emit('permission-error', permissionError);
    return { docs: [] };
  });

  const staffList = userSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
          id: parseInt(doc.id, 10), // Assuming you want a number ID
          uid: doc.id,
          ...data
      } as StaffMember & { uid: string };
  });

  return staffList as StaffMember[];
}


export async function getStaffById(id: number): Promise<StaffMember | undefined> {
    const usersQuery = query(collection(db, USERS_COLLECTION), where("id", "==", id));
    const querySnapshot = await getDocs(usersQuery);
    if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return { id: parseInt(docSnap.id, 10), ...docSnap.data() } as StaffMember;
    }
    return undefined;
}

export async function createStaffMember(values: z.infer<typeof newStaffFormSchema>): Promise<StaffMember> {
    // This function should be called from a server-side context (e.g., a Firebase Function)
    // to securely create a Firebase Auth user and then a Firestore user document.
    // For client-side simulation, we'll just add to Firestore.
    
    // In a real app, you would:
    // 1. Call a Firebase Function `createUser` with the values.
    // 2. The function would use `admin.auth().createUser(...)`.
    // 3. The function would then create the Firestore document.

    console.warn("Client-side user creation is not secure. This is for simulation only.");

    const staff = await getStaff();
    const newId = staff.length > 0 ? Math.max(...staff.map(r => r.id)) + 1 : 1;

    const newStaffMemberData = {
        // id: newId, // Firestore generates the ID (UID)
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        role: values.role,
        department: getDepartmentForRole(values.role),
    };

    const docRef = await addDoc(collection(db, USERS_COLLECTION), newStaffMemberData)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: USERS_COLLECTION,
                operation: 'create',
                requestResourceData: newStaffMemberData,
            });
            errorEmitter.emit('permission-error', permissionError);
            throw serverError;
        });

    return { id: newId, ...newStaffMemberData } as StaffMember;
}

export async function updateStaff(id: number, values: z.infer<typeof newStaffFormSchema>): Promise<StaffMember | undefined> {
    const staffMember = await getStaffById(id);
    if (!staffMember || !(staffMember as any).uid) {
        throw new Error("Staff member not found or UID is missing.");
    }
    
    const staffRef = doc(db, USERS_COLLECTION, (staffMember as any).uid);

    const updatedData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        role: values.role,
        department: getDepartmentForRole(values.role),
    };

    await setDoc(staffRef, updatedData, { merge: true }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: staffRef.path,
            operation: 'update',
            requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });

    return { ...staffMember, ...updatedData };
}

export async function deleteStaffMember(id: number): Promise<boolean> {
    const staffMember = await getStaffById(id);
    if (!staffMember || !(staffMember as any).uid) {
       return false;
    }
    const staffRef = doc(db, USERS_COLLECTION, (staffMember as any).uid);
    await deleteDoc(staffRef).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: staffRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
    return true;
}

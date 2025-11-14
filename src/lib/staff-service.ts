
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
import type { User } from 'firebase/auth';


const USERS_COLLECTION = 'users';

const getDepartmentForRole = (role: string): string => {
    if (role === 'Administrator' || role === 'Super Admin') return 'Administrator';
    if (['Sales Agent', 'Business Development Manager'].includes(role)) return 'Business Development';
    if (role === 'Premium Administrator') return 'Premium Administration';
    if (role === 'Underwriter') return 'Underwriting';
    return 'General';
};

export async function setSuperAdminUser(user: User): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const [firstName, ...lastName] = user.displayName?.split(' ') || ['Super', 'Admin'];
    const superAdminData = {
        uid: user.uid,
        email: user.email,
        firstName: firstName,
        lastName: lastName.join(' '),
        phone: user.phoneNumber || '',
        role: 'Super Admin',
        department: 'Super Admin',
    };
    await setDoc(userRef, superAdminData).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'create',
            requestResourceData: superAdminData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  } else {
    // If user exists, ensure they have the Super Admin role
    await setDoc(userRef, { role: 'Super Admin', department: 'Super Admin' }, { merge: true }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: { role: 'Super Admin' },
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  }
}

// --- Firestore Service Functions ---

export async function getStaff(): Promise<StaffMember[]> {
  const usersCollection = collection(db, USERS_COLLECTION);
  // Filter out the Super Admin
  const q = query(usersCollection, where("role", "!=", "Super Admin"));
  const userSnapshot = await getDocs(q).catch(async (serverError) => {
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
          id: data.id, // Assuming 'id' field exists
          uid: doc.id,
          ...data
      } as StaffMember & { uid: string };
  });

  return staffList as StaffMember[];
}


export async function getStaffByUid(uid: string): Promise<StaffMember | undefined> {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return { ...data, uid: docSnap.id, id: data.id } as StaffMember;
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
        id: newId,
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
    const staffQuery = query(collection(db, USERS_COLLECTION), where("id", "==", id));
    const querySnapshot = await getDocs(staffQuery);

    if (querySnapshot.empty) {
        throw new Error("Staff member not found.");
    }
    
    const staffDoc = querySnapshot.docs[0];
    const staffRef = doc(db, USERS_COLLECTION, staffDoc.id);

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

    return { id, ...staffDoc.data(), ...updatedData } as StaffMember;
}

export async function deleteStaffMember(id: number): Promise<boolean> {
    const staffQuery = query(collection(db, USERS_COLLECTION), where("id", "==", id));
    const querySnapshot = await getDocs(staffQuery);
     if (querySnapshot.empty) {
       return false;
    }

    const staffDoc = querySnapshot.docs[0];
    const staffRef = doc(db, USERS_COLLECTION, staffDoc.id);
    
    await deleteDoc(staffRef).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: staffRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
    return true;
}

// Legacy functions using local storage (to be deprecated)
export function getStaffById(id: number): StaffMember | undefined {
    // This is now a mock. In a real scenario, this would be an async DB call.
    const allStaff = staffData;
    return allStaff.find(s => s.id === id);
}

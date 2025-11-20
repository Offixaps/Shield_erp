
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
import { db, auth as firebaseAuth, useAuth, errorEmitter, FirestorePermissionError } from '@/firebase';
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
  // Hardcoded check for the allowed Super Admin email.
  if (user.email !== 'offixaps@gmail.com') {
    throw new Error('This account is not authorized for Super Admin access.');
  }
  
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
  const auth = firebaseAuth;
  const currentUser = auth.currentUser;

  if (!currentUser) return [];

  const currentUserDoc = await getDoc(doc(db, USERS_COLLECTION, currentUser.uid));
  if (!currentUserDoc.exists()) return [];
  
  const currentUserData = currentUserDoc.data();
  const usersCollection = collection(db, USERS_COLLECTION);
  let q;

  if (currentUserData.role === 'Super Admin') {
    // Super Admin sees everyone except themselves
    q = query(usersCollection, where("role", "!=", "Super Admin"));
  } else if (currentUserData.role === 'Administrator') {
    // Administrator sees everyone in their own department
    q = query(usersCollection, where("department", "==", currentUserData.department));
  } else {
    // Other roles see no one for now, or just themselves if needed
    q = query(usersCollection, where("uid", "==", '')); // No results
  }

  const userSnapshot = await getDocs(q).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: usersCollection.path,
      operation: 'list',
    });
    errorEmitter.emit('permission-error', permissionError);
    return { docs: [] };
  });

  const staffList = userSnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
          id: docSnap.id, 
          uid: docSnap.id,
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
    // NOTE: This client-side user creation is a security risk.
    // In a production app, this logic MUST be moved to a secure backend (e.g., Firebase Functions)
    // where you can use the Admin SDK to create users. The Admin SDK bypasses security rules.
    console.warn("Client-side user creation is not secure. This is for simulation only.");
    
    // This is a placeholder for the `createUser` hook that should be coming from useAuth
    // In a real scenario, this service wouldn't call the hook directly.
    const { createUser } = useAuth();
    if (!values.password) throw new Error("Password is required to create a new staff member.");
    
    try {
        // Step 1: Create user in Firebase Authentication (Simulated)
        // This is where you would call a backend function in a real app.
        // For now, we simulate this, but it will fail due to security rules unless you are an admin.
        const userCredential = await createUser(values.email, values.password);
        const newUser = userCredential.user;

        // Step 2: Create user document in Firestore
        const newStaffMemberData = {
            uid: newUser.uid,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone,
            role: values.role,
            department: values.department || getDepartmentForRole(values.role),
        };

        await setDoc(doc(db, USERS_COLLECTION, newUser.uid), newStaffMemberData);

        return { id: newUser.uid, ...newStaffMemberData } as StaffMember;
    } catch (error: any) {
        console.error("Error creating staff member:", error);
        // More specific error handling can be done here.
        // For example, if error.code === 'auth/email-already-in-use'
        throw new Error(error.message || "Failed to create staff member.");
    }
}

export async function updateStaff(id: number, values: z.infer<typeof newStaffFormSchema>): Promise<StaffMember | undefined> {
    // In Firestore, the document ID (uid) is the true unique identifier
    // 'id' is a legacy field from the local data model.
    // The correct way is to use the uid which we assume is passed as `staffId` in the component.
    
    const staffId = id.toString(); // Assuming the numeric id is not the firestore id. A proper app would pass the uid.
    const staffRef = doc(db, USERS_COLLECTION, staffId);

    const docSnap = await getDoc(staffRef);

    if (!docSnap.exists()) {
        console.error("Staff member not found with ID:", staffId);
        return undefined;
    }

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

    return { id, ...docSnap.data(), ...updatedData } as StaffMember;
}

export async function deleteStaffMember(id: number | string): Promise<boolean> {
    // The ID passed here should be the Firestore document UID.
    const staffRef = doc(db, USERS_COLLECTION, id.toString());
    
    try {
        await deleteDoc(staffRef);
        return true;
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: staffRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        return false;
    }
}


// Legacy functions using local storage (to be deprecated)
export function getStaffById(id: number): StaffMember | undefined {
    // This is now a mock. In a real scenario, this would be an async DB call.
    const allStaff = staffData;
    return allStaff.find(s => s.id === id);
}

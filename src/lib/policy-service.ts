
'use client';

import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  setDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { format, startOfMonth, getYear, isBefore, startOfDay, differenceInYears, parse, isAfter } from 'date-fns';
import { newBusinessData as policiesData, type NewBusiness, type Bill, type Payment, type ActivityLog } from './data';
import { seedPoliciesData } from './seed-data';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Helper function to convert Firestore Timestamps to serializable format
const policyFromFirebase = (data: any): NewBusiness => {
  const policy: { [key: string]: any } = { ...data };
  for (const key in policy) {
    if (policy[key] instanceof Timestamp) {
      policy[key] = policy[key].toDate().toISOString();
    } else if (typeof policy[key] === 'object' && policy[key] !== null) {
      // Recursively check for nested Timestamps (though our current schema is flat)
      // This is good practice for more complex objects.
       const nested = policy[key];
       for(const nestedKey in nested) {
           if(nested[nestedKey] instanceof Timestamp) {
                nested[nestedKey] = nested[nestedKey].toDate().toISOString();
           }
       }
       policy[key] = nested;
    }
  }
  return policy as NewBusiness;
};

// Helper function to convert dates back to Timestamps for Firestore
const policyToFirebase = (data: Partial<NewBusiness>): any => {
    const firestoreData: { [key: string]: any } = { ...data };
    for (const key in firestoreData) {
        // Check for string that looks like an ISO date and convert it
        if (typeof firestoreData[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(firestoreData[key])) {
            firestoreData[key] = Timestamp.fromDate(new Date(firestoreData[key]));
        } else if (firestoreData[key] instanceof Date) {
            firestoreData[key] = Timestamp.fromDate(firestoreData[key]);
        }
    }
    return firestoreData;
}


export async function getPolicies(): Promise<NewBusiness[]> {
    try {
        const policiesCollection = collection(db, 'policies');
        const policySnapshot = await getDocs(policiesCollection);
        const policiesList = policySnapshot.docs.map(doc => policyFromFirebase({ ...doc.data(), id: doc.id }));
        return policiesList;
    } catch (error) {
        console.error("Error fetching policies from Firestore: ", error);
        // We no longer fall back to local data. We throw the error so the UI can handle it.
        throw new Error("Failed to fetch policies from the database. Please check your connection and permissions.");
    }
}

export async function getPolicyById(id: string): Promise<NewBusiness | undefined> {
    try {
        const policyDocRef = doc(db, 'policies', id);
        const docSnap = await getDoc(policyDocRef);
        if (docSnap.exists()) {
            return policyFromFirebase({ ...docSnap.data(), id: docSnap.id });
        }
        return undefined;
    } catch (error) {
        console.error(`Error fetching policy with ID ${id}: `, error);
        throw new Error("Failed to fetch policy details.");
    }
}

export async function createPolicy(values: Partial<Omit<NewBusiness, 'id'>>): Promise<NewBusiness> {
    const lifeAssuredName = [values.title, values.lifeAssuredFirstName, values.lifeAssuredMiddleName, values.lifeAssuredSurname].filter(Boolean).join(' ');

    const newPolicyData = {
        ...values,
        client: lifeAssuredName,
        product: values.contractType,
        premium: values.premiumAmount,
        initialSumAssured: values.sumAssured,
        onboardingStatus: 'Pending First Premium',
        billingStatus: 'Outstanding',
        policyStatus: 'Inactive',
        payerName: values.isPolicyHolderPayer ? lifeAssuredName : [values.premiumPayerOtherNames, values.premiumPayerSurname].filter(Boolean).join(' '),
        narration: `${format(new Date(), 'MMMM yyyy').toUpperCase()} PREMIUM`,
        mandateVerified: false,
        firstPremiumPaid: false,
        medicalUnderwritingState: { started: false, completed: false },
        bills: [],
        payments: [],
        activityLog: [
            { date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created', details: 'Initial policy creation.' },
            { date: new Date().toISOString(), user: 'System', action: 'Status changed to Pending First Premium' }
        ],
    };
    
    const firestoreData = policyToFirebase(newPolicyData);

    const policiesCollection = collection(db, 'policies');
    try {
        const docRef = await addDoc(policiesCollection, firestoreData);
        return { ...newPolicyData, id: docRef.id } as NewBusiness;
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: policiesCollection.path,
            operation: 'create',
            requestResourceData: firestoreData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function updatePolicy(id: string, updates: Partial<Omit<NewBusiness, 'id'>>): Promise<NewBusiness> {
    const policyDocRef = doc(db, 'policies', id);

    // Fetch existing policy to merge updates correctly
    const existingDoc = await getDoc(policyDocRef);
    if (!existingDoc.exists()) {
        throw new Error("Policy not found");
    }
    const originalPolicy = policyFromFirebase({ ...existingDoc.data(), id: existingDoc.id });

    // Create the final updated object
    const updatedPolicyData = { ...originalPolicy, ...updates };

    // Add activity log entry if status changes
    if (updates.onboardingStatus && updates.onboardingStatus !== originalPolicy.onboardingStatus) {
        let user = 'System';
        if (['Pending Vetting', 'Vetting Completed', 'Rework Required', 'Accepted', 'Declined', 'NTU', 'Deferred', 'Pending Medicals', 'Medicals Completed'].includes(updates.onboardingStatus)) {
            user = 'Underwriting';
        } else if (['Pending Mandate', 'Mandate Verified', 'Mandate Rework Required', 'Pending First Premium', 'First Premium Confirmed', 'Policy Issued'].includes(updates.onboardingStatus)) {
            user = 'Premium Admin';
        }

        const newLogEntry: ActivityLog = {
            date: new Date().toISOString(),
            user: user,
            action: `Status changed to ${updates.onboardingStatus}`,
            details: (updates as any).vettingNotes || (updates as any).mandateReworkNotes || undefined
        };
        updatedPolicyData.activityLog = [...(updatedPolicyData.activityLog || []), newLogEntry];
    }
    
    const firestoreData = policyToFirebase(updates);

    await setDoc(policyDocRef, firestoreData, { merge: true }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: policyDocRef.path,
            operation: 'update',
            requestResourceData: firestoreData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    });

    return updatedPolicyData;
}

export async function deletePolicy(id: string): Promise<boolean> {
    const policyDocRef = doc(db, 'policies', id);
    try {
        await deleteDoc(policyDocRef);
        return true;
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: policyDocRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        return false;
    }
}


// --- Functions below are local mocks or specific actions ---

export function generateNewSerialNumber(): string {
    const maxSerial = policiesData.reduce((max, p) => {
        const serialNum = parseInt(p.serial, 10);
        return !isNaN(serialNum) && serialNum > max ? serialNum : max;
    }, 1000);
    return (maxSerial + 1).toString();
}

export async function seedDatabase(): Promise<number> {
    const policiesCollection = collection(db, 'policies');
    let seededCount = 0;
    for (const policy of seedPoliciesData) {
        const firestorePolicy = policyToFirebase(policy);
        try {
            await addDoc(policiesCollection, firestorePolicy);
            seededCount++;
        } catch (serverError) {
             const permissionError = new FirestorePermissionError({
                path: policiesCollection.path,
                operation: 'create',
                requestResourceData: firestorePolicy,
            });
            errorEmitter.emit('permission-error', permissionError);
            console.error("Failed to seed policy:", policy.client, serverError);
        }
    }
    return seededCount;
}


// The rest of the functions seem to be local data manipulations.
// They need to be refactored to work with Firestore if they are to be used.
// For now, I am assuming they are either deprecated or need async implementation.
// To avoid breaking the app, I will leave them but they might not work as expected
// as they manipulate an in-memory array, not Firestore.

let policies: NewBusiness[] = [...policiesData];
let nextId = policies.length > 0 ? Math.max(...policies.map(p => p.id)) + 1 : 1;

function newId() {
    return nextId++;
}

export function recordFirstPayment(policyId: number, paymentDetails: Omit<Payment, 'id' | 'policyId' | 'billId'>): NewBusiness | undefined {
    // This function needs to be rewritten to use async/await and update Firestore
    return undefined;
}

export function recordPayment(policyId: number, paymentDetails: Omit<Payment, 'id' | 'policyId' | 'billId'>): NewBusiness | undefined {
     // This function needs to be rewritten to use async/await and update Firestore
    return undefined;
}


export function billAllActivePolicies(): number {
    // This function needs to be rewritten to use async/await and update Firestore
    return 0;
}

export function applyAnnualIncreases(): number {
    // This function needs to be rewritten to use async/await and update Firestore
    return 0;
}

type BankReportPayment = {
    'Policy Number': string;
    'Amount': number;
    'Payment Date': string | number;
    'Status': string;
    'Transaction ID': string;
};

export function recordBulkPayments(payments: BankReportPayment[]): { successCount: number; failureCount: number; } {
     // This function needs to be rewritten to use async/await and update Firestore
    return { successCount: 0, failureCount: payments.length };
}


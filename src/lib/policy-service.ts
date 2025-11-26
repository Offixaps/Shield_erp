
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
  query,
  where,
  arrayUnion,
  updateDoc
} from 'firebase/firestore';
import { format, isAfter, startOfMonth, getYear, isBefore, startOfDay, differenceInYears, addYears } from 'date-fns';
import { type NewBusiness, type Bill, type Payment, type ActivityLog } from './data';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Helper to recursively convert Firestore Timestamps to serializable ISO strings
const policyFromFirebase = (data: any): any => {
  if (!data) return data;
  const newData: { [key: string]: any } = { ...data };

  for (const key in newData) {
    if (Object.prototype.hasOwnProperty.call(newData, key)) {
      const value = newData[key];
      if (value instanceof Timestamp) {
        newData[key] = value.toDate().toISOString();
      } else if (Array.isArray(value)) {
        newData[key] = value.map(item => policyFromFirebase(item));
      } else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        newData[key] = policyFromFirebase(value);
      }
    }
  }
  return newData as NewBusiness;
};

// Recursive helper to convert date strings/objects back to Timestamps for Firestore
const policyToFirebase = (data: any): any => {
    if (!data) return data;

    if (data instanceof Date) {
        return Timestamp.fromDate(data);
    }
    
    // Check for ISO string format
    if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(data)) {
        return Timestamp.fromDate(new Date(data));
    }
    
    if (Array.isArray(data)) {
        return data.map(item => policyToFirebase(item));
    }

    if (typeof data === 'object' && data !== null) {
        const firestoreData: { [key: string]: any } = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) { 
                firestoreData[key] = policyToFirebase(data[key]);
            }
        }
        return firestoreData;
    }

    return data;
}

let allPoliciesCache: NewBusiness[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchPoliciesFromFirestore(): Promise<NewBusiness[]> {
    const policiesCollection = collection(db, 'policies');
    const policySnapshot = await getDocs(policiesCollection);
    if (policySnapshot.empty) {
        return [];
    }
    return policySnapshot.docs.map(doc => policyFromFirebase({ ...doc.data(), id: doc.id }));
}

export async function getPolicies(forceRefresh = false): Promise<NewBusiness[]> {
    const now = Date.now();
    if (forceRefresh || !allPoliciesCache || !cacheTimestamp || (now - cacheTimestamp > CACHE_DURATION)) {
        try {
            allPoliciesCache = await fetchPoliciesFromFirestore();
            cacheTimestamp = now;
        } catch (error) {
            console.error("Error fetching policies from Firestore: ", error);
            allPoliciesCache = []; // Reset cache on error
            throw new Error("Failed to fetch policies from the database. Please check your connection and permissions.");
        }
    }
    return allPoliciesCache;
}

export async function getPolicyById(id: string): Promise<NewBusiness | undefined> {
    const cachedPolicy = allPoliciesCache?.find(p => p.id === id);
    if (cachedPolicy) {
        return cachedPolicy;
    }
    
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

    const firstBill: Bill = {
        id: Date.now(),
        policyId: 0, 
        amount: values.premiumAmount || 0,
        dueDate: values.commencementDate ? new Date(values.commencementDate).toISOString() : new Date().toISOString(),
        status: 'Unpaid',
        description: 'First Premium'
    };

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
        bills: [firstBill],
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
        await getPolicies(true);
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

    const existingDoc = await getDoc(policyDocRef);
    if (!existingDoc.exists()) {
        throw new Error("Policy not found");
    }
    const originalPolicy = policyFromFirebase({ ...existingDoc.data(), id: existingDoc.id });

    let updatedPolicyData: Partial<NewBusiness> = { ...originalPolicy, ...updates };

    const nameFields: (keyof NewBusiness)[] = ['title', 'lifeAssuredFirstName', 'lifeAssuredMiddleName', 'lifeAssuredSurname'];
    const payerNameFields: (keyof NewBusiness)[] = ['premiumPayerOtherNames', 'premiumPayerSurname'];

    const hasNameChanged = nameFields.some(field => field in updates);
    const hasPayerNameChanged = payerNameFields.some(field => field in updates);
    
    if (hasNameChanged) {
        updatedPolicyData.client = [updatedPolicyData.title, updatedPolicyData.lifeAssuredFirstName, updatedPolicyData.lifeAssuredMiddleName, updatedPolicyData.lifeAssuredSurname].filter(Boolean).join(' ');
    }
    
    if ((hasNameChanged && updatedPolicyData.isPolicyHolderPayer) || (hasPayerNameChanged && !updatedPolicyData.isPolicyHolderPayer)) {
         updatedPolicyData.payerName = updatedPolicyData.isPolicyHolderPayer ? updatedPolicyData.client : [updatedPolicyData.premiumPayerOtherNames, updatedPolicyData.premiumPayerSurname].filter(Boolean).join(' ');
    }

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
    
    const firestoreData = policyToFirebase(updatedPolicyData);

    await setDoc(policyDocRef, firestoreData, { merge: true }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: policyDocRef.path,
            operation: 'update',
            requestResourceData: firestoreData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    });

    await getPolicies(true);
    return updatedPolicyData as NewBusiness;
}

export async function deletePolicy(id: string): Promise<boolean> {
    const policyDocRef = doc(db, 'policies', id);
    try {
        await deleteDoc(policyDocRef);
        await getPolicies(true);
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

export async function generateNewSerialNumber(): Promise<string> {
    const policies = await getPolicies();
    if (policies.length === 0) {
        return "1001";
    }
    const maxSerial = policies.reduce((max, p) => {
        const serialNum = parseInt(p.serial, 10);
        return !isNaN(serialNum) && serialNum > max ? serialNum : max;
    }, 1000);
    return (maxSerial + 1).toString();
}

export async function recordFirstPayment(policyId: string, paymentDetails: Omit<Payment, 'id' | 'policyId' | 'billId'>): Promise<NewBusiness | undefined> {
    const policyRef = doc(db, 'policies', policyId);
    const policySnap = await getDoc(policyRef);

    if (!policySnap.exists()) return undefined;
    const policyData = policyFromFirebase(policySnap.data()) as NewBusiness;

    const firstBill = (policyData.bills || []).find(b => b.description === 'First Premium' && b.status === 'Unpaid');
    if (!firstBill) {
        throw new Error("First premium bill not found or already paid.");
    }
    
    firstBill.status = 'Paid';
    const newPaymentId = Date.now();
    firstBill.paymentId = newPaymentId;

    const newPayment: Payment = {
        ...paymentDetails,
        id: newPaymentId,
        policyId: Number(policyId),
        billId: firstBill.id
    };

    const updatedBills = (policyData.bills || []).map(b => b.id === firstBill.id ? firstBill : b);
    
    await updateDoc(policyRef, policyToFirebase({
        bills: updatedBills,
        payments: arrayUnion(newPayment),
        onboardingStatus: 'First Premium Confirmed',
        billingStatus: 'First Premium Paid',
        firstPremiumPaid: true,
        activityLog: arrayUnion({
            date: new Date().toISOString(),
            user: 'Premium Admin',
            action: 'First Premium Confirmed',
            details: `GHS ${paymentDetails.amount.toFixed(2)} via ${paymentDetails.method}`
        })
    }));

    await getPolicies(true);
    const updatedPolicySnap = await getDoc(policyRef);
    return policyFromFirebase({ ...updatedPolicySnap.data(), id: updatedPolicySnap.id });
}

export async function recordPayment(policyId: string, paymentDetails: Omit<Payment, 'id' | 'policyId' | 'billId'>): Promise<NewBusiness | undefined> {
    const policyRef = doc(db, 'policies', policyId);
    const policySnap = await getDoc(policyRef);

    if (!policySnap.exists()) return undefined;

    const policyData = policyFromFirebase(policySnap.data()) as NewBusiness;
    const unpaidBill = (policyData.bills || []).find(b => b.status === 'Unpaid');

    if (!unpaidBill) {
        throw new Error("No unpaid bill available for this policy.");
    }
    
    unpaidBill.status = 'Paid';
    const newPaymentId = Date.now();
    unpaidBill.paymentId = newPaymentId;
    
    const newPayment: Payment = { ...paymentDetails, id: newPaymentId, policyId: Number(policyId), billId: unpaidBill.id };
    
    const updatedBills = (policyData.bills || []).map(b => b.id === unpaidBill.id ? unpaidBill : b);

    await updateDoc(policyRef, policyToFirebase({
        payments: arrayUnion(newPayment),
        bills: updatedBills,
        billingStatus: (updatedBills || []).every(b => b.status === 'Paid') ? 'Up to Date' : 'Outstanding',
        activityLog: arrayUnion({
            date: new Date().toISOString(),
            user: 'Premium Admin',
            action: 'Premium Payment Recorded',
            details: `GHS ${paymentDetails.amount.toFixed(2)} for bill #${unpaidBill.id}`
        })
    }));
    
    await getPolicies(true);
    const updatedPolicySnap = await getDoc(policyRef);
    return policyFromFirebase({ ...updatedPolicySnap.data(), id: updatedPolicySnap.id });
}

type BankReportPayment = {
    'Policy Number': string;
    'Amount': number;
    'Payment Date': string | number;
    'Status': string;
    'Transaction ID': string;
};

export async function recordBulkPayments(payments: BankReportPayment[]): Promise<{ successCount: number; failureCount: number; }> {
    let successCount = 0;
    let failureCount = 0;

    for (const payment of payments) {
        try {
            const policiesRef = collection(db, "policies");
            const q = query(policiesRef, where("policy", "==", payment['Policy Number']));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const policyDoc = querySnapshot.docs[0];
                await recordPayment(policyDoc.id, {
                    amount: payment.Amount,
                    paymentDate: typeof payment['Payment Date'] === 'number' 
                        ? new Date(1900, 0, payment['Payment Date'] - 1).toISOString().split('T')[0] // Excel date number
                        : new Date(payment['Payment Date']).toISOString().split('T')[0],
                    method: 'Bank Report',
                    transactionId: payment['Transaction ID']
                });
                successCount++;
            } else {
                failureCount++;
            }
        } catch (error) {
            console.error(`Failed to process payment for policy ${payment['Policy Number']}:`, error);
            failureCount++;
        }
    }
    await getPolicies(true);
    return { successCount, failureCount };
}

export function billAllActivePolicies(): number {
    // This is a placeholder implementation.
    // In a real application, this would involve complex logic to determine which policies to bill.
    console.log("Simulating billing all active policies...");
    return 0; // Returning 0 as no actual policies were billed.
}

export function applyAnnualIncreases(): number {
    // This is a placeholder implementation.
    console.log("Simulating applying annual increases...");
    return 0;
}

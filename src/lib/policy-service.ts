
'use client';

import { newBusinessData, type NewBusiness, type Bill, type Payment, type ActivityLog } from './data';
import { format, startOfMonth, getYear, isBefore, startOfDay, differenceInYears, parse, isAfter } from 'date-fns';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const POLICIES_COLLECTION = 'policies';

// --- Data Conversion Helpers ---

function policyToFirebase(data: any): any {
    if (data === undefined) {
        return null;
    }
    if (data === null) {
        return null;
    }
    if (data instanceof Date) {
        return Timestamp.fromDate(data);
    }
    if (Array.isArray(data)) {
        return data.map(item => policyToFirebase(item));
    }
    if (typeof data === 'object' && !data.hasOwnProperty('seconds')) {
        const newObj: { [key: string]: any } = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = data[key];
                if (value !== undefined) {
                    newObj[key] = policyToFirebase(value);
                }
            }
        }
        return newObj;
    }
    return data;
}

// Converts any Firestore Timestamps in the data to ISO date strings for serialization.
function policyFromFirebase(data: any): any {
    if (data instanceof Timestamp) {
        return data.toDate().toISOString();
    }
    if (Array.isArray(data)) {
        return data.map(item => policyFromFirebase(item));
    }
    if (data && typeof data === 'object') {
        const newObj: { [key: string]: any } = {};
        for (const key in data) {
            newObj[key] = policyFromFirebase(data[key]);
        }
        return newObj;
    }
    return data;
}


// --- Firestore Service Functions ---

export async function getPolicies(): Promise<NewBusiness[]> {
  const policiesCollection = collection(db, POLICIES_COLLECTION);
  const policySnapshot = await getDocs(policiesCollection).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: policiesCollection.path,
      operation: 'list',
    });
    errorEmitter.emit('permission-error', permissionError);
    // Return an empty array or handle the error as appropriate for your UI
    return { docs: [] };
  });

  const policyList = policySnapshot.docs.map(doc => ({
      id: doc.id,
      ...policyFromFirebase(doc.data())
  } as NewBusiness));
  return policyList;
}

export async function getPolicyById(id: string): Promise<NewBusiness | undefined> {
  if (!id || typeof id !== 'string') {
    console.error("Invalid ID passed to getPolicyById:", id);
    return undefined;
  }
  const policyDocRef = doc(db, POLICIES_COLLECTION, id);
  const docSnap = await getDoc(policyDocRef).catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: policyDocRef.path,
        operation: 'get',
      });
      errorEmitter.emit('permission-error', permissionError);
      return null;
  });

  if (docSnap && docSnap.exists()) {
    return { id: docSnap.id, ...policyFromFirebase(docSnap.data()) } as NewBusiness;
  } 
  return undefined;
}

export async function updatePolicy(id: string, updates: Partial<Omit<NewBusiness, 'id'>>): Promise<NewBusiness | undefined> {
  const policyRef = doc(db, POLICIES_COLLECTION, id);
  
  const currentDoc = await getDoc(policyRef);
  if (!currentDoc.exists()) {
    throw new Error("Policy not found");
  }
  const originalPolicy = { id: currentDoc.id, ...policyFromFirebase(currentDoc.data()) } as NewBusiness;

  const updatedData = { 
    ...originalPolicy, 
    ...updates,
  };
  
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
          details: updates.vettingNotes || updates.mandateReworkNotes || undefined
      };
      updatedData.activityLog = [...(updatedData.activityLog || []), newLogEntry];
  }

  // Remove the 'id' field before sending to Firestore
  const { id: policyId, ...dataToSave } = updatedData;

  const firebaseData = policyToFirebase(dataToSave);
  await setDoc(policyRef, firebaseData, { merge: true }).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
        path: policyRef.path,
        operation: 'update',
        requestResourceData: firebaseData,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
  
  return updatedData;
}

export async function generateNewSerialNumber(): Promise<string> {
    const policies = await getPolicies();
    const maxSerial = policies.reduce((max, p) => {
        const serialNum = parseInt(p.serial, 10);
        return !isNaN(serialNum) && serialNum > max ? serialNum : max;
    }, 1000);
    return (maxSerial + 1).toString();
}

export async function createPolicy(values: any): Promise<string> {
    const lifeAssuredName = [values.title, values.lifeAssuredFirstName, values.lifeAssuredMiddleName, values.lifeAssuredSurname].filter(Boolean).join(' ');

    const newPolicyData = {
        ...values,
        client: lifeAssuredName,
        department: "Business Development",
        product: values.contractType,
        premium: values.premiumAmount,
        initialSumAssured: values.sumAssured,
        onboardingStatus: 'Incomplete Policy',
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
            { date: new Date(), user: 'Sales Agent', action: 'Policy Created', details: 'Initial policy creation.' },
            { date: new Date(), user: 'System', action: 'Status changed to Incomplete Policy' }
        ],
    };
    
    const { id, ...dataToSave } = newPolicyData;
    const firebaseData = policyToFirebase(dataToSave);
    const policiesCollectionRef = collection(db, POLICIES_COLLECTION);
    
    const docRef = await addDoc(policiesCollectionRef, firebaseData)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: policiesCollectionRef.path,
                operation: 'create',
                requestResourceData: firebaseData,
            });
            errorEmitter.emit('permission-error', permissionError);
            throw serverError; // Re-throw the original error after emitting our custom one
        });
    
    // Update the local object with the real doc ID
    await setDoc(docRef, { uid: docRef.id }, { merge: true });
    
    return docRef.id;
}


export async function deletePolicy(id: string): Promise<boolean> {
  const policyRef = doc(db, POLICIES_COLLECTION, id.toString());
  deleteDoc(policyRef)
    .then(() => {
        return true;
    })
    .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: policyRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  return false; // The operation is async, the immediate return should be false.
}

export async function recordFirstPayment(policyId: string, paymentDetails: Omit<Payment, 'id' | 'policyId' | 'billId'>): Promise<NewBusiness | undefined> {
    const policy = await getPolicyById(policyId);
    if (!policy) return undefined;

    if (!policy.bills) policy.bills = [];
    if (!policy.payments) policy.payments = [];
    if (!policy.activityLog) policy.activityLog = [];

    // Create a first premium bill if it doesn't exist
    let firstBill = policy.bills.find(b => b.description === 'First Premium');
    if (!firstBill) {
        const newBillId = (policy.bills.length > 0 ? Math.max(...policy.bills.map(b => b.id)) : 0) + 1;
        firstBill = {
            id: newBillId,
            policyId: policy.id as number,
            amount: policy.premium,
            dueDate: format(new Date(policy.commencementDate), 'yyyy-MM-dd'),
            status: 'Unpaid',
            description: 'First Premium',
        };
        policy.bills.push(firstBill);
    }
    
    if (firstBill.status === 'Paid') return undefined; // Already paid

    const newPaymentId = (policy.payments.length > 0 ? Math.max(...policy.payments.map(p => p.id)) : 0) + 1;
    const newPayment: Payment = { id: newPaymentId, policyId: policy.id as number, billId: firstBill.id, ...paymentDetails };

    policy.payments.push(newPayment);
    firstBill.status = 'Paid';
    firstBill.paymentId = newPaymentId;

    policy.onboardingStatus = 'Pending Vetting';
    policy.billingStatus = 'First Premium Paid';
    policy.firstPremiumPaid = true;

    policy.activityLog.push({
        date: new Date().toISOString(),
        user: 'Premium Admin',
        action: 'First Premium Confirmed',
        details: `Payment of GHS ${paymentDetails.amount.toFixed(2)} received via ${paymentDetails.method}.`
    });
    policy.activityLog.push({ date: new Date().toISOString(), user: 'System', action: 'Status changed to Pending Vetting' });

    return updatePolicy(policyId, policy);
}

export async function recordPayment(policyId: string, paymentDetails: Omit<Payment, 'id' | 'policyId' | 'billId'>): Promise<NewBusiness | undefined> {
    const policy = await getPolicyById(policyId);
    if (!policy) return undefined;

    if (!policy.bills) policy.bills = [];
    if (!policy.payments) policy.payments = [];
    if (!policy.activityLog) policy.activityLog = [];

    const unpaidBill = policy.bills.find(b => b.status === 'Unpaid');
    if (!unpaidBill) return undefined;

    const newPaymentId = (policy.payments.length > 0 ? Math.max(...policy.payments.map(p => p.id)) : 0) + 1;
    const newPayment: Payment = { id: newPaymentId, policyId: policy.id as number, billId: unpaidBill.id, ...paymentDetails };

    policy.payments.push(newPayment);
    unpaidBill.status = 'Paid';
    unpaidBill.paymentId = newPaymentId;

    const hasOtherUnpaidBills = policy.bills.some(b => b.status === 'Unpaid');
    policy.billingStatus = hasOtherUnpaidBills ? 'Outstanding' : 'Up to Date';

    policy.activityLog.push({
        date: new Date().toISOString(),
        user: 'Premium Admin',
        action: 'Premium Collected',
        details: `Payment of GHS ${paymentDetails.amount.toFixed(2)} received via ${paymentDetails.method}.`
    });

    return updatePolicy(policyId, policy);
}


export async function billAllActivePolicies(): Promise<number> {
    const policies = await getPolicies();
    const batch = writeBatch(db);
    let billedCount = 0;
    const today = new Date();
    const currentMonthBillingDate = startOfMonth(today);

    policies.forEach(policy => {
        if (policy.policyStatus !== 'Active') return;

        const commencementDate = startOfDay(new Date(policy.commencementDate));
        if (isAfter(commencementDate, today)) return;

        const hasBeenBilledThisMonth = (policy.bills || []).some(bill => {
            const billDate = new Date(bill.dueDate);
            return billDate.getFullYear() === currentMonthBillingDate.getFullYear() &&
                   billDate.getMonth() === currentMonthBillingDate.getMonth();
        });

        if (!hasBeenBilledThisMonth) {
            const newBillId = ((policy.bills || []).length > 0 ? Math.max(...policy.bills.map(b => b.id)) : 0) + 1;
            const newBill: Bill = {
                id: newBillId,
                policyId: policy.id as number,
                amount: policy.premium,
                dueDate: format(currentMonthBillingDate, 'yyyy-MM-dd'),
                status: 'Unpaid',
                description: `${format(currentMonthBillingDate, 'MMMM yyyy')} Premium`,
            };
            
            const updatedPolicy = { ...policy };
            updatedPolicy.bills = [...(updatedPolicy.bills || []), newBill];
            updatedPolicy.billingStatus = 'Outstanding';
            updatedPolicy.activityLog = [...(updatedPolicy.activityLog || []), {
                date: new Date().toISOString(),
                user: 'System',
                action: 'Policy Billed',
                details: `Billed GHS ${policy.premium.toFixed(2)} for ${format(currentMonthBillingDate, 'MMMM yyyy')}.`
            }];
            
            const policyRef = doc(db, POLICIES_COLLECTION, policy.id.toString());
            const {id, ...dataToSave} = updatedPolicy;
            const updateData = policyToFirebase(dataToSave);
            
            batch.update(policyRef, updateData);
            billedCount++;
        }
    });

    if (billedCount > 0) {
        await batch.commit().catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: `batch write to ${POLICIES_COLLECTION}`,
                operation: 'update',
            });
            errorEmitter.emit('permission-error', permissionError);
        });
    }
    return billedCount;
}

export async function applyAnnualIncreases(): Promise<number> {
    const policies = await getPolicies();
    const batch = writeBatch(db);
    let updatedCount = 0;
    const today = startOfDay(new Date());
    const currentYear = getYear(today);

    policies.forEach(policy => {
        if (policy.policyStatus !== 'Active') return;

        const commencementDate = startOfDay(new Date(policy.commencementDate));
        const policyAgeInYears = differenceInYears(today, commencementDate);

        if (policyAgeInYears >= 10) return;
        
        const anniversaryThisYear = new Date(commencementDate);
        anniversaryThisYear.setFullYear(currentYear);

        if (isBefore(anniversaryThisYear, today) || anniversaryThisYear.getTime() === today.getTime()) {
            const alreadyIncreasedThisYear = (policy.activityLog || []).some(log => 
                log.action === 'API/ABI Applied' && getYear(new Date(log.date)) === currentYear
            );

            if (alreadyIncreasedThisYear) return;

            const premiumIncreaseRate = policy.sumAssured >= 500000 ? 0.07 : 0.05;
            const sumAssuredIncreaseRate = policy.sumAssured >= 500000 ? 0.03 : 0.02;
            
            const oldPremium = policy.premium;
            const oldSumAssured = policy.sumAssured;
            const newPremium = oldPremium * (1 + premiumIncreaseRate);
            const newSumAssured = oldSumAssured * (1 + sumAssuredIncreaseRate);

            const updatedPolicy = { ...policy };
            updatedPolicy.premium = newPremium;
            updatedPolicy.sumAssured = newSumAssured;
            updatedPolicy.activityLog = [...(updatedPolicy.activityLog || []), {
                date: new Date().toISOString(),
                user: 'System',
                action: 'API/ABI Applied',
                details: `Year ${policyAgeInYears + 1}. Premium increased from GHS ${oldPremium.toFixed(2)} to GHS ${newPremium.toFixed(2)}. Sum assured increased from GHS ${oldSumAssured.toFixed(2)} to GHS ${newSumAssured.toFixed(2)}.`,
            }];
            
            const policyRef = doc(db, POLICIES_COLLECTION, policy.id.toString());
            const {id, ...dataToSave} = updatedPolicy;
            const updateData = policyToFirebase(dataToSave);

            batch.update(policyRef, updateData);
            updatedCount++;
        }
    });

    if (updatedCount > 0) {
        await batch.commit().catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: `batch write to ${POLICIES_COLLECTION}`,
                operation: 'update',
            });
            errorEmitter.emit('permission-error', permissionError);
        });
    }
    return updatedCount;
}

type BankReportPayment = {
    'Policy Number': string;
    'Amount': number;
    'Payment Date': string | number;
    'Status': string;
    'Transaction ID': string;
};

export async function recordBulkPayments(payments: BankReportPayment[]): Promise<{ successCount: number; failureCount: number; }> {
    const policies = await getPolicies();
    const batch = writeBatch(db);
    let successCount = 0;
    let failureCount = 0;
    const successfulPaymentStatuses = ['paid', 'success', 'processed'];

    for (const payment of payments) {
        if (!payment['Policy Number'] || !payment['Status'] || !successfulPaymentStatuses.includes(payment['Status'].toLowerCase())) {
            failureCount++;
            continue;
        }

        const policy = policies.find(p => p.policy === payment['Policy Number']);
        if (!policy) {
            failureCount++;
            continue;
        }

        const paymentAmount = payment['Amount'] ? Number(payment['Amount']) : policy.premium;
        let paymentDate: Date;
        
        try {
            if (typeof payment['Payment Date'] === 'number') {
                paymentDate = new Date((payment['Payment Date'] - 25569) * 86400 * 1000);
            } else {
                 paymentDate = parse(payment['Payment Date'], 'yyyy-MM-dd', new Date());
                 if (isNaN(paymentDate.getTime())) paymentDate = parse(payment['Payment Date'], 'dd/MM/yyyy', new Date());
                 if (isNaN(paymentDate.getTime())) paymentDate = new Date(payment['Payment Date']);
                 if (isNaN(paymentDate.getTime())) throw new Error("Invalid date format");
            }
        } catch {
            failureCount++;
            continue;
        }
        
        const unpaidBill = (policy.bills || []).find(b => b.status === 'Unpaid' && Math.abs(b.amount - paymentAmount) < 0.01);
        if (!unpaidBill) {
            failureCount++;
            continue;
        }

        const newPaymentId = ((policy.payments || []).length > 0 ? Math.max(...policy.payments.map(p => p.id)) : 0) + 1;
        const newPayment: Payment = {
            id: newPaymentId,
            policyId: policy.id as number,
            billId: unpaidBill.id,
            amount: paymentAmount,
            paymentDate: format(paymentDate, 'yyyy-MM-dd'),
            method: 'Bank Transfer',
            transactionId: payment['Transaction ID'] || `BANK-${newId()}`,
        };

        const updatedPolicy = { ...policy };
        updatedPolicy.payments = [...(updatedPolicy.payments || []), newPayment];
        const billIndex = updatedPolicy.bills.findIndex(b => b.id === unpaidBill.id);
        if (billIndex > -1) {
            updatedPolicy.bills[billIndex].status = 'Paid';
            updatedPolicy.bills[billIndex].paymentId = newPaymentId;
        }

        const allBillsPaid = updatedPolicy.bills.every(b => b.status === 'Paid');
        if (allBillsPaid) {
            updatedPolicy.billingStatus = 'Up to Date';
        }

        updatedPolicy.activityLog = [...(updatedPolicy.activityLog || []), {
            date: new Date().toISOString(),
            user: 'System',
            action: 'Payment Recorded',
            details: `Bulk upload: GHS ${paymentAmount.toFixed(2)} paid on ${format(paymentDate, 'PPP')}.`,
        }];

        const policyRef = doc(db, POLICIES_COLLECTION, policy.id.toString());
        const {id, ...dataToSave} = updatedPolicy;
        const updateData = policyToFirebase(dataToSave);
        batch.update(policyRef, updateData);
        successCount++;
    }

    if (successCount > 0) {
        await batch.commit().catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: `batch write to ${POLICIES_COLLECTION}`,
                operation: 'update',
            });
            errorEmitter.emit('permission-error', permissionError);
        });
    }
    
    return { successCount, failureCount };
}

function newId() {
    return Math.random().toString(36).substr(2, 9);
}

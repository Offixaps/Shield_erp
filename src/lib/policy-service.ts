

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

export function policyToFirebase(policy: NewBusiness): any {
  const data = { ...policy };

  // Convert Date objects to Timestamps for Firestore
  const toTimestamp = (dateStr: string | Date | undefined | null) => {
    if (!dateStr) return null;
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return null;
    return Timestamp.fromDate(date);
  }

  data.lifeAssuredDob = toTimestamp(data.lifeAssuredDob) as any;
  data.commencementDate = toTimestamp(data.commencementDate) as any;
  data.expiryDate = toTimestamp(data.expiryDate) as any;
  data.issueDate = toTimestamp(data.issueDate) as any;
  data.expiryDateId = toTimestamp(data.expiryDateId) as any;
  (data as any).premiumPayerDob = toTimestamp((data as any).premiumPayerDob);
  (data as any).premiumPayerIssueDate = toTimestamp((data as any).premiumPayerIssueDate);
  (data as any).premiumPayerExpiryDate = toTimestamp((data as any).premiumPayerExpiryDate);


  data.primaryBeneficiaries = (data.primaryBeneficiaries || []).map(b => ({
    ...b,
    dob: toTimestamp(b.dob)
  }));
  data.contingentBeneficiaries = (data.contingentBeneficiaries || []).map(b => ({
    ...b,
    dob: toTimestamp(b.dob)
  }));
  
  if (data.activityLog) {
      data.activityLog = data.activityLog.map(log => ({...log, date: toTimestamp(log.date)}));
  }
   if (data.payments) {
      data.payments = data.payments.map(p => ({...p, paymentDate: toTimestamp(p.paymentDate)}));
  }
   if (data.bills) {
      data.bills = data.bills.map(b => ({...b, dueDate: toTimestamp(b.dueDate)}));
  }

  // Handle nested medical details
  if (data.medicalHistory) {
      data.medicalHistory = data.medicalHistory.map(mh => {
          const newMh = {...mh};
          Object.keys(newMh).forEach(key => {
              if (key.toLowerCase().includes('date') && newMh[key as keyof typeof newMh]) {
                  (newMh as any)[key] = toTimestamp((newMh as any)[key]);
              }
          });
          return newMh;
      });
  }

  return data;
}

function policyFromFirebase(docSnap: any): NewBusiness {
    const data = docSnap.data();
    if (!data) {
        throw new Error("Document data is undefined.");
    }
    const fromTimestamp = (timestamp: any): string => {
        if (!timestamp) return '';
        if (timestamp instanceof Timestamp) {
            const date = timestamp.toDate();
            return format(date, 'yyyy-MM-dd');
        }
        if (typeof timestamp === 'string') {
            // Handle cases where date is already a string
             try {
                return format(new Date(timestamp), 'yyyy-MM-dd');
            } catch (e) {
                return ''; // Return empty string for invalid date strings
            }
        }
        return '';
    };

    const newId = docSnap.id;

    // Ensure string fields are not null/undefined
    const ensureString = (val: any) => val || '';

    const result: NewBusiness = {
        ...data,
        id: newId,
        client: ensureString(data.client),
        placeOfBirth: ensureString(data.placeOfBirth),
        email: ensureString(data.email),
        phone: ensureString(data.phone),
        workTelephone: ensureString(data.workTelephone),
        homeTelephone: ensureString(data.homeTelephone),
        postalAddress: ensureString(data.postalAddress),
        residentialAddress: ensureString(data.residentialAddress),
        gpsAddress: ensureString(data.gpsAddress),
        idNumber: ensureString(data.idNumber),
        placeOfIssue: ensureString(data.placeOfIssue),
        policy: ensureString(data.policy),
        serial: ensureString(data.serial),
        occupation: ensureString(data.occupation),
        natureOfBusiness: ensureString(data.natureOfBusiness),
        employer: ensureString(data.employer),
        employerAddress: ensureString(data.employerAddress),
        payerName: ensureString(data.payerName),
        bankName: ensureString(data.bankName),
        bankBranch: ensureString(data.bankBranch),
        bankAccountNumber: ensureString(data.bankAccountNumber),
        sortCode: ensureString(data.sortCode),
        narration: ensureString(data.narration),
        bankAccountName: ensureString(data.bankAccountName),
        amountInWords: ensureString(data.amountInWords),
        agentName: ensureString(data.agentName),
        agentCode: ensureString(data.agentCode),
        uplineName: ensureString(data.uplineName),
        uplineCode: ensureString(data.uplineCode),
        introducerCode: ensureString(data.introducerCode),
        lifeAssuredDob: fromTimestamp(data.lifeAssuredDob),
        commencementDate: fromTimestamp(data.commencementDate),
        expiryDate: fromTimestamp(data.expiryDate),
        issueDate: fromTimestamp(data.issueDate),
        expiryDateId: fromTimestamp(data.expiryDateId),
        primaryBeneficiaries: (data.primaryBeneficiaries || []).map((b: any) => ({
            ...b,
            dob: fromTimestamp(b.dob),
            telephone: ensureString(b.telephone)
        })),
        contingentBeneficiaries: (data.contingentBeneficiaries || []).map((b: any) => ({
            ...b,
            dob: fromTimestamp(b.dob),
            telephone: ensureString(b.telephone)
        })),
         activityLog: (data.activityLog || []).map((log: any) => ({ ...log, date: log.date ? fromTimestamp(log.date) : new Date().toISOString() })),
         payments: (data.payments || []).map((p: any) => ({ ...p, paymentDate: fromTimestamp(p.paymentDate) })),
         bills: (data.bills || []).map((b: any) => ({ ...b, dueDate: fromTimestamp(b.dueDate) })),
         vettingNotes: ensureString(data.vettingNotes),
         mandateReworkNotes: ensureString(data.mandateReworkNotes),
         lifeInsuredSignature: ensureString(data.lifeInsuredSignature),
         policyOwnerSignature: ensureString(data.policyOwnerSignature),
         paymentAuthoritySignature: ensureString(data.paymentAuthoritySignature),
    };

    return result;
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

  const policyList = policySnapshot.docs.map(doc => policyFromFirebase({ id: doc.id, data: () => doc.data() }));
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
    return policyFromFirebase({id: docSnap.id, data: ()=> docSnap.data()});
  } 
  return undefined;
}

export async function updatePolicy(id: string, updates: Partial<Omit<NewBusiness, 'id'>>): Promise<NewBusiness | undefined> {
  const policyRef = doc(db, POLICIES_COLLECTION, id);
  
  const currentDoc = await getDoc(policyRef);
  if (!currentDoc.exists()) {
    throw new Error("Policy not found");
  }
  const originalPolicy = policyFromFirebase(currentDoc);

  const updatedData = { 
    ...originalPolicy, 
    ...updates,
    serial: originalPolicy.serial || updates.serial, // Explicitly preserve the original serial number
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

  const firebaseData = policyToFirebase(updatedData);
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
        client: lifeAssuredName,
        department: "Business Development",
        lifeAssuredDob: values.lifeAssuredDob ? format(values.lifeAssuredDob, 'yyyy-MM-dd') : null,
        placeOfBirth: values.placeOfBirth || null,
        ageNextBirthday: values.ageNextBirthday || 0,
        gender: values.gender || null,
        maritalStatus: values.maritalStatus || null,
        dependents: values.dependents || 0,
        nationality: values.nationality || null,
        country: values.country || null,
        religion: values.religion || null,
        languages: values.languages || null,
        email: values.email || null,
        phone: values.phone || '',
        workTelephone: values.workTelephone || '',
        homeTelephone: values.homeTelephone || '',
        postalAddress: values.postalAddress || null,
        residentialAddress: values.residentialAddress || null,
        gpsAddress: values.gpsAddress || null,
        nationalIdType: values.nationalIdType || null,
        idNumber: values.idNumber || null,
        placeOfIssue: values.placeOfIssue || null,
        issueDate: values.issueDate ? format(values.issueDate, 'yyyy-MM-dd') : null,
        expiryDateId: values.expiryDate ? format(values.expiryDate, 'yyyy-MM-dd') : null,
        policy: '', // Blank on creation
        product: values.contractType || null,
        premium: values.premiumAmount || 0,
        initialSumAssured: values.sumAssured || 0,
        sumAssured: values.sumAssured || 0,
        commencementDate: format(new Date(), 'yyyy-MM-dd'),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + (values.policyTerm || 0))).toISOString().split('T')[0],
        policyTerm: values.policyTerm || 0,
        premiumTerm: values.premiumTerm || 0,
        serial: values.serial,
        paymentFrequency: values.paymentFrequency || null,
        onboardingStatus: 'Incomplete Policy',
        billingStatus: 'Outstanding',
        policyStatus: 'Inactive',
        vettingNotes: values.vettingNotes || null,
        mandateReworkNotes: values.mandateReworkNotes || null,
        mandateVerificationTimestamp: values.mandateVerificationTimestamp || null,
        occupation: values.occupation || null,
        natureOfBusiness: values.natureOfBusiness || null,
        employer: values.employer || null,
        employerAddress: values.employerAddress || null,
        monthlyBasicIncome: values.monthlyBasicIncome || 0,
        otherIncome: values.otherIncome || 0,
        totalMonthlyIncome: values.totalMonthlyIncome || 0,
        isPolicyHolderPayer: values.isPolicyHolderPayer,
        payerName: values.isPolicyHolderPayer ? lifeAssuredName : [values.premiumPayerOtherNames, values.premiumPayerSurname].filter(Boolean).join(' '),
        bankName: values.bankName || null,
        bankBranch: values.bankBranch || null,
        bankAccountNumber: values.bankAccountNumber || null,
        sortCode: values.sortCode || null,
        narration: `${format(new Date(), 'MMMM yyyy').toUpperCase()} PREMIUM`,
        accountType: values.accountType || null,
        bankAccountName: values.bankAccountName || null,
        amountInWords: values.amountInWords || null,
        paymentAuthoritySignature: values.paymentAuthoritySignature || null,
        lifeInsuredSignature: values.lifeInsuredSignature || null,
        policyOwnerSignature: values.policyOwnerSignature || null,
        primaryBeneficiaries: (values.primaryBeneficiaries || []).map((b: any) => ({ ...b, dob: b.dob ? format(b.dob, 'yyyy-MM-dd') : null })),
        contingentBeneficiaries: (values.contingentBeneficiaries || []).map((b: any) => ({ ...b, dob: b.dob ? format(b.dob, 'yyyy-MM-dd') : null })),
        height: values.height || 0,
        heightUnit: values.heightUnit || 'cm',
        weight: values.weight || 0,
        bmi: values.bmi || 0,
        alcoholHabits: values.alcoholHabits || null,
        tobaccoHabits: values.tobaccoHabits || null,
        medicalHistory: values.medicalHistory || [],
        familyMedicalHistory: values.familyMedicalHistory || null,
        familyMedicalHistoryDetails: values.familyMedicalHistoryDetails || [],
        lifestyleDetails: values.lifestyleDetails || [],
        existingPoliciesDetails: (values.existingPoliciesDetails || []).map((p: any) => ({...p, issueDate: p.issueDate ? format(p.issueDate, 'yyyy-MM-dd') : null})),
        declinedPolicyDetails: values.declinedPolicyDetails || [],
        mandateVerified: false,
        firstPremiumPaid: false,
        medicalUnderwritingState: { started: false, completed: false },
        bills: [],
        payments: [],
        activityLog: [
            { date: new Date().toISOString(), user: 'Sales Agent', action: 'Policy Created', details: 'Initial policy creation.' },
            { date: new Date().toISOString(), user: 'System', action: 'Status changed to Incomplete Policy' }
        ],
    };
    
    const firebaseData = policyToFirebase(newPolicyData as unknown as NewBusiness);
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
    await setDoc(docRef, { id: docRef.id, uid: docRef.id }, { merge: true });

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

    const firstBill = policy.bills.find(b => b.description === 'First Premium');
    if (!firstBill || firstBill.status === 'Paid') return undefined;

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
            const updateData = { 
                bills: updatedPolicy.bills.map(b => ({...b, dueDate: Timestamp.fromDate(new Date(b.dueDate))})), 
                billingStatus: 'Outstanding', 
                activityLog: updatedPolicy.activityLog.map(a => ({...a, date: Timestamp.fromDate(new Date(a.date))}))
            };

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
            const updateData = {
                premium: newPremium,
                sumAssured: newSumAssured,
                activityLog: updatedPolicy.activityLog.map(a => ({...a, date: Timestamp.fromDate(new Date(a.date))}))
            };

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
        const updateData = { 
            payments: updatedPolicy.payments.map(p => ({...p, paymentDate: Timestamp.fromDate(new Date(p.paymentDate))})), 
            bills: updatedPolicy.bills.map(b => ({...b, dueDate: Timestamp.fromDate(new Date(b.dueDate))})), 
            billingStatus: updatedPolicy.billingStatus, 
            activityLog: updatedPolicy.activityLog.map(a => ({...a, date: Timestamp.fromDate(new Date(a.date))}))
        };
        batch.update(policyRef, updateData);
        successCount++;
    }

    await batch.commit().catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: `batch write to ${POLICIES_COLLECTION}`,
            operation: 'update',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
    
    return { successCount, failureCount };
}

function newId() {
    return Math.random().toString(36).substr(2, 9);
}

    




    





    

    

    


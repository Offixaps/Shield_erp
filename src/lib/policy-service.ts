
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

const POLICIES_COLLECTION = 'policies';

// --- Data Conversion Helpers ---

function policyToFirebase(policy: NewBusiness): any {
  const data = { ...policy };
  // Convert Date objects to Timestamps for Firestore
  const toTimestamp = (dateStr: string | undefined | null) =>
    dateStr ? Timestamp.fromDate(new Date(dateStr)) : null;

  data.lifeAssuredDob = toTimestamp(data.lifeAssuredDob) as any;
  data.commencementDate = toTimestamp(data.commencementDate) as any;
  data.expiryDate = toTimestamp(data.expiryDate) as any;
  data.issueDate = toTimestamp(data.issueDate) as any;
  data.expiryDateId = toTimestamp(data.expiryDateId) as any;

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


  return data;
}

function policyFromFirebase(docSnap: any): NewBusiness {
    const data = docSnap.data();
    if (!data) {
        throw new Error("Document data is undefined.");
    }
    const fromTimestamp = (timestamp: any): string => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return format(date, 'yyyy-MM-dd');
    };

    const newId = docSnap.id ? parseInt(docSnap.id, 10) : data.id;

    return {
        ...data,
        id: newId,
        lifeAssuredDob: fromTimestamp(data.lifeAssuredDob),
        commencementDate: fromTimestamp(data.commencementDate),
        expiryDate: fromTimestamp(data.expiryDate),
        issueDate: fromTimestamp(data.issueDate),
        expiryDateId: fromTimestamp(data.expiryDateId),
        primaryBeneficiaries: (data.primaryBeneficiaries || []).map((b: any) => ({
            ...b,
            dob: fromTimestamp(b.dob),
        })),
        contingentBeneficiaries: (data.contingentBeneficiaries || []).map((b: any) => ({
            ...b,
            dob: fromTimestamp(b.dob),
        })),
         activityLog: (data.activityLog || []).map((log: any) => ({ ...log, date: fromTimestamp(log.date) })),
         payments: (data.payments || []).map((p: any) => ({ ...p, paymentDate: fromTimestamp(p.paymentDate) })),
         bills: (data.bills || []).map((b: any) => ({ ...b, dueDate: fromTimestamp(b.dueDate) })),
    };
}


// --- Firestore Service Functions ---

export async function getPolicies(): Promise<NewBusiness[]> {
  try {
    const policiesCollection = collection(db, POLICIES_COLLECTION);
    const policySnapshot = await getDocs(policiesCollection);
    const policyList = policySnapshot.docs.map(doc => policyFromFirebase({ id: doc.id, data: () => doc.data() }));
    return policyList;
  } catch (error) {
    console.error("Error getting policies: ", error);
    return [];
  }
}

export async function getPolicyById(id: number): Promise<NewBusiness | undefined> {
  try {
    const policyDocRef = doc(db, POLICIES_COLLECTION, id.toString());
    const docSnap = await getDoc(policyDocRef);
    if (docSnap.exists()) {
      return policyFromFirebase(docSnap);
    } else {
      console.log("No such document!");
      return undefined;
    }
  } catch (error) {
    console.error("Error getting policy by ID: ", error);
    return undefined;
  }
}

export async function updatePolicy(id: number, updates: Partial<Omit<NewBusiness, 'id'>>): Promise<NewBusiness | undefined> {
  const policyRef = doc(db, POLICIES_COLLECTION, id.toString());
  try {
    const currentDoc = await getDoc(policyRef);
    if (!currentDoc.exists()) {
      throw new Error("Policy not found");
    }
    const originalPolicy = policyFromFirebase(currentDoc);

    const updatedData = { ...originalPolicy, ...updates };
    
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
    
    await setDoc(policyRef, policyToFirebase(updatedData), { merge: true });

    return updatedData;
  } catch (error) {
    console.error("Error updating policy: ", error);
    return undefined;
  }
}

export async function createPolicy(values: any): Promise<NewBusiness> {
    const lifeAssuredName = [values.title, values.lifeAssuredFirstName, values.lifeAssuredMiddleName, values.lifeAssuredSurname].filter(Boolean).join(' ');

    const newPolicyData: Omit<NewBusiness, 'id'> = {
        client: lifeAssuredName,
        lifeAssuredDob: values.lifeAssuredDob ? format(values.lifeAssuredDob, 'yyyy-MM-dd') : '',
        placeOfBirth: values.placeOfBirth,
        ageNextBirthday: values.ageNextBirthday,
        gender: values.gender,
        maritalStatus: values.maritalStatus,
        dependents: values.dependents,
        nationality: values.nationality,
        country: values.country,
        religion: values.religion,
        languages: values.languages,
        email: values.email,
        phone: values.phone,
        workTelephone: values.workTelephone,
        homeTelephone: values.homeTelephone,
        postalAddress: values.postalAddress,
        residentialAddress: values.residentialAddress,
        gpsAddress: values.gpsAddress,
        nationalIdType: values.nationalIdType,
        idNumber: values.idNumber,
        placeOfIssue: values.placeOfIssue,
        issueDate: values.issueDate ? format(values.issueDate, 'yyyy-MM-dd') : '',
        expiryDateId: values.expiryDate ? format(values.expiryDate, 'yyyy-MM-dd') : '',
        policy: '', // Blank on creation
        product: values.contractType,
        premium: values.premiumAmount,
        initialSumAssured: values.sumAssured,
        sumAssured: values.sumAssured,
        commencementDate: format(new Date(), 'yyyy-MM-dd'),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + values.policyTerm)).toISOString().split('T')[0],
        policyTerm: values.policyTerm,
        premiumTerm: values.premiumTerm,
        serial: values.serialNumber,
        paymentFrequency: values.paymentFrequency,
        onboardingStatus: 'Pending First Premium',
        billingStatus: 'Outstanding',
        policyStatus: 'Inactive',
        vettingNotes: undefined,
        mandateReworkNotes: undefined,
        mandateVerificationTimestamp: undefined,
        occupation: values.occupation,
        natureOfBusiness: values.natureOfBusiness,
        employer: values.employer,
        employerAddress: values.employerAddress,
        monthlyBasicIncome: values.monthlyBasicIncome,
        otherIncome: values.otherIncome,
        totalMonthlyIncome: values.totalMonthlyIncome,
        payerName: values.isPolicyHolderPayer ? lifeAssuredName : [values.premiumPayerOtherNames, values.premiumPayerSurname].filter(Boolean).join(' '),
        bankName: values.bankName,
        bankBranch: values.bankBranch,
        bankAccountNumber: values.bankAccountNumber,
        sortCode: values.sortCode,
        narration: `${format(new Date(), 'MMMM yyyy').toUpperCase()} PREMIUM`,
        accountType: values.accountType,
        bankAccountName: values.bankAccountName,
        amountInWords: values.amountInWords,
        paymentAuthoritySignature: values.paymentAuthoritySignature,
        primaryBeneficiaries: (values.primaryBeneficiaries || []).map((b: any) => ({ ...b, dob: format(b.dob, 'yyyy-MM-dd') })),
        contingentBeneficiaries: (values.contingentBeneficiaries || []).map((b: any) => ({ ...b, dob: format(b.dob, 'yyyy-MM-dd') })),
        height: values.height,
        heightUnit: values.heightUnit,
        weight: values.weight,
        bmi: values.bmi,
        alcoholHabits: values.alcoholHabits,
        tobaccoHabits: values.tobaccoHabits,
        medicalHistory: values.medicalHistory || [],
        familyMedicalHistory: values.familyMedicalHistory,
        familyMedicalHistoryDetails: values.familyMedicalHistoryDetails || [],
        lifestyleDetails: values.lifestyleDetails || [],
        existingPoliciesDetails: (values.existingPoliciesDetails || []).map((p: any) => ({...p, issueDate: format(p.issueDate, 'yyyy-MM-dd')})),
        declinedPolicyDetails: values.declinedPolicyDetails,
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
    
    const newDocRef = await addDoc(collection(db, POLICIES_COLLECTION), policyToFirebase(newPolicyData as NewBusiness));
    
    const newPolicyWithId = { ...newPolicyData, id: parseInt(newDocRef.id, 10) };

    const firstBill: Bill = {
        id: 1,
        policyId: newPolicyWithId.id,
        amount: newPolicyWithId.premium,
        dueDate: newPolicyWithId.commencementDate,
        status: 'Unpaid',
        description: 'First Premium'
    };
    newPolicyWithId.bills.push(firstBill);

    await setDoc(doc(db, POLICIES_COLLECTION, newDocRef.id), policyToFirebase(newPolicyWithId as NewBusiness));
    
    return newPolicyWithId as NewBusiness;
}


export async function deletePolicy(id: number): Promise<boolean> {
  try {
    await deleteDoc(doc(db, POLICIES_COLLECTION, id.toString()));
    return true;
  } catch (error) {
    console.error("Error deleting policy: ", error);
    return false;
  }
}

export async function recordFirstPayment(policyId: number, paymentDetails: Omit<Payment, 'id' | 'policyId' | 'billId'>): Promise<NewBusiness | undefined> {
    const policy = await getPolicyById(policyId);
    if (!policy) return undefined;

    if (!policy.bills) policy.bills = [];
    if (!policy.payments) policy.payments = [];
    if (!policy.activityLog) policy.activityLog = [];

    const firstBill = policy.bills.find(b => b.description === 'First Premium');
    if (!firstBill || firstBill.status === 'Paid') return undefined;

    const newPaymentId = (policy.payments.length > 0 ? Math.max(...policy.payments.map(p => p.id)) : 0) + 1;
    const newPayment: Payment = { id: newPaymentId, policyId, billId: firstBill.id, ...paymentDetails };

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

export async function recordPayment(policyId: number, paymentDetails: Omit<Payment, 'id' | 'policyId' | 'billId'>): Promise<NewBusiness | undefined> {
    const policy = await getPolicyById(policyId);
    if (!policy) return undefined;

    if (!policy.bills) policy.bills = [];
    if (!policy.payments) policy.payments = [];
    if (!policy.activityLog) policy.activityLog = [];

    const unpaidBill = policy.bills.find(b => b.status === 'Unpaid');
    if (!unpaidBill) return undefined;

    const newPaymentId = (policy.payments.length > 0 ? Math.max(...policy.payments.map(p => p.id)) : 0) + 1;
    const newPayment: Payment = { id: newPaymentId, policyId, billId: unpaidBill.id, ...paymentDetails };

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
                policyId: policy.id,
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
            batch.update(policyRef, { 
                bills: updatedPolicy.bills, 
                billingStatus: 'Outstanding', 
                activityLog: updatedPolicy.activityLog 
            });

            billedCount++;
        }
    });

    if (billedCount > 0) {
        await batch.commit();
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
            batch.update(policyRef, {
                premium: newPremium,
                sumAssured: newSumAssured,
                activityLog: updatedPolicy.activityLog
            });
            
            updatedCount++;
        }
    });

    if (updatedCount > 0) {
        await batch.commit();
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
            policyId: policy.id,
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
        batch.update(policyRef, { 
            payments: updatedPolicy.payments, 
            bills: updatedPolicy.bills, 
            billingStatus: updatedPolicy.billingStatus, 
            activityLog: updatedPolicy.activityLog 
        });
        successCount++;
    }

    await batch.commit();
    return { successCount, failureCount };
}

function newId() {
    return Math.random().toString(36).substr(2, 9);
}

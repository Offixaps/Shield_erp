


'use client';

import { newBusinessData, type NewBusiness, type Bill, type Payment, type ActivityLog } from './data';
import { format } from 'date-fns';

const LOCAL_STORAGE_KEY = 'shield-erp-policies';

// Helper function to get policies from localStorage
function getPoliciesFromStorage(): NewBusiness[] {
  if (typeof window === 'undefined') {
    return newBusinessData; // Return initial data during server-side rendering
  }
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      // Basic validation to ensure it's an array
      return Array.isArray(parsedData) ? parsedData : newBusinessData;
    } catch (e) {
      console.error("Failed to parse policies from localStorage", e);
      return newBusinessData; // Fallback to initial data
    }
  } else {
    // Seed localStorage with initial data if it's not there
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newBusinessData));
    return newBusinessData;
  }
}

// Helper function to save policies to localStorage
function savePoliciesToStorage(policies: NewBusiness[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(policies));
}


export function getPolicies(): NewBusiness[] {
  return getPoliciesFromStorage();
}

export function getPolicyById(id: number): NewBusiness | undefined {
  const policies = getPoliciesFromStorage();
  return policies.find((policy) => policy.id === id);
}

type UpdatePayload = Partial<Omit<NewBusiness, 'id' | 'activityLog'>> & { activityLog?: ActivityLog[] };


export function updatePolicy(id: number, updates: UpdatePayload): NewBusiness | undefined {
    const policies = getPoliciesFromStorage();
    const policyIndex = policies.findIndex(p => p.id === id);
    if (policyIndex !== -1) {
        const originalPolicy = policies[policyIndex];
        const updatedPolicy = { ...originalPolicy, ...updates };

        // Ensure activityLog is an array
        if (!Array.isArray(updatedPolicy.activityLog)) {
            updatedPolicy.activityLog = [];
        }

        // Check if onboardingStatus has changed and add a log entry
        if (updates.onboardingStatus && updates.onboardingStatus !== originalPolicy.onboardingStatus) {
            let user = 'System';
            if (['Pending Vetting', 'Vetting Completed', 'Rework Required', 'Accepted', 'Declined', 'NTU', 'Deferred', 'Pending Medicals', 'Medicals Completed'].includes(updates.onboardingStatus)) {
                user = 'Underwriting';
            } else if (['Pending Mandate', 'Mandate Verified', 'Mandate Rework Required', 'Pending First Premium', 'First Premium Confirmed'].includes(updates.onboardingStatus)) {
                user = 'Premium Admin';
            }

            const newLogEntry: ActivityLog = {
                date: new Date().toISOString(),
                user: user,
                action: `Status changed to ${updates.onboardingStatus}`,
                details: updates.vettingNotes || updates.mandateReworkNotes || undefined
            };
            updatedPolicy.activityLog.push(newLogEntry);
        }
        
        policies[policyIndex] = updatedPolicy;
        savePoliciesToStorage(policies);
        return policies[policyIndex];
    }
    return undefined;
}


export function createPolicy(values: any): NewBusiness {
    const policies = getPoliciesFromStorage();
    const newId = policies.length > 0 ? Math.max(...policies.map(b => b.id)) + 1 : 1;
    const lifeAssuredName = [values.title, values.lifeAssuredFirstName, values.lifeAssuredMiddleName, values.lifeAssuredSurname].filter(Boolean).join(' ');

    const newPolicy: NewBusiness = {
        id: newId,
        client: lifeAssuredName,
        product: values.contractType,
        policy: values.policyNumber,
        premium: values.premiumAmount,
        sumAssured: values.sumAssured,
        commencementDate: format(values.commencementDate, 'yyyy-MM-dd'),
        phone: values.phone,
        serial: values.serialNumber,
        onboardingStatus: 'Pending First Premium',
        billingStatus: 'Outstanding',
        policyStatus: 'Inactive',
        expiryDate: new Date(new Date(values.commencementDate).setFullYear(new Date(values.commencementDate).getFullYear() + values.policyTerm)).toISOString().split('T')[0],
        policyTerm: values.policyTerm,
        premiumTerm: values.premiumTerm,
        mandateVerified: false,
        firstPremiumPaid: false,
        medicalUnderwritingState: { started: false, completed: false },
        bills: [],
        payments: [],
        activityLog: [
            {
                date: new Date().toISOString(),
                user: 'Sales Agent',
                action: 'Policy Created',
                details: 'Initial policy creation.'
            },
            {
                date: new Date().toISOString(),
                user: 'System',
                action: 'Status changed to Pending First Premium'
            }
        ],
        bankName: values.bankName,
    };
    
    const firstBill: Bill = {
        id: 1, // Simple ID for now
        policyId: newId,
        amount: newPolicy.premium,
        dueDate: newPolicy.commencementDate,
        status: 'Unpaid',
        description: 'First Premium'
    };
    newPolicy.bills.push(firstBill);


    const updatedPolicies = [...policies, newPolicy];
    savePoliciesToStorage(updatedPolicies);
    return newPolicy;
}

export function deletePolicy(id: number): boolean {
    let policies = getPoliciesFromStorage();
    const policyIndex = policies.findIndex(p => p.id === id);
    if (policyIndex !== -1) {
        policies.splice(policyIndex, 1);
        savePoliciesToStorage(policies);
        return true;
    }
    return false;
}

export function recordFirstPayment(policyId: number, paymentDetails: Omit<Payment, 'id' | 'policyId' | 'billId'>): NewBusiness | undefined {
    const policies = getPoliciesFromStorage();
    const policyIndex = policies.findIndex(p => p.id === policyId);
    if (policyIndex === -1) return undefined;

    const policy = policies[policyIndex];
    if (!policy.bills) { // Defensive check
        policy.bills = [];
    }
    if (!policy.payments) { // Defensive check
        policy.payments = [];
    }
     if (!policy.activityLog) { // Defensive check
        policy.activityLog = [];
    }
    
    const firstBill = policy.bills.find(b => b.description === 'First Premium');

    if (!firstBill || firstBill.status === 'Paid') return undefined;

    const newPaymentId = (policy.payments.length > 0 ? Math.max(...policy.payments.map(p => p.id)) : 0) + 1;
    
    const newPayment: Payment = {
        id: newPaymentId,
        policyId: policyId,
        billId: firstBill.id,
        ...paymentDetails
    };

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

    policy.activityLog.push({
        date: new Date().toISOString(),
        user: 'System',
        action: 'Status changed to Pending Vetting'
    });

    policies[policyIndex] = policy;
    savePoliciesToStorage(policies);
    return policy;
}



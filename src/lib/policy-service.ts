

'use client';

import { newBusinessData, type NewBusiness, type Bill, type Payment, type ActivityLog } from './data';
import { format, startOfMonth, getYear, isBefore, startOfDay, differenceInYears } from 'date-fns';

const LOCAL_STORAGE_KEY = 'shield-erp-policies';
const DATA_VERSION_KEY = 'shield-erp-data-version';
const CURRENT_DATA_VERSION = 3; // Increment this version to force a data refresh

// Helper function to get policies from localStorage
function getPoliciesFromStorage(): NewBusiness[] {
  if (typeof window === 'undefined') {
    return newBusinessData; // Return initial data during server-side rendering
  }

  const storedVersion = localStorage.getItem(DATA_VERSION_KEY);
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (storedData && storedVersion && parseInt(storedVersion, 10) === CURRENT_DATA_VERSION) {
    try {
      const parsedData = JSON.parse(storedData);
      return Array.isArray(parsedData) ? parsedData : newBusinessData;
    } catch (e) {
      console.error("Failed to parse policies from localStorage", e);
      // If parsing fails, fall back to seeding with initial data
    }
  }
  
  // If no data, version mismatch, or parsing error, re-seed localStorage
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newBusinessData));
  localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION.toString());
  return newBusinessData;
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
        policy: '', // Policy number is blank on creation
        premium: values.premiumAmount,
        sumAssured: values.sumAssured,
        commencementDate: format(new Date(), 'yyyy-MM-dd'),
        phone: values.phone,
        serial: values.serialNumber,
        placeOfBirth: values.placeOfBirth,
        onboardingStatus: 'Pending First Premium',
        billingStatus: 'Outstanding',
        policyStatus: 'Inactive',
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + values.policyTerm)).toISOString().split('T')[0],
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
        payerName: values.premiumPayerName,
        bankAccountNumber: values.bankAccountNumber,
        sortCode: values.sortCode,
        narration: `${format(new Date(), 'MMMM yyyy').toUpperCase()} PREMIUM`,
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

export function billAllActivePolicies(): number {
    const policies = getPoliciesFromStorage();
    let billedCount = 0;
    const today = new Date();
    const currentMonthBillingDate = startOfMonth(today);

    policies.forEach(policy => {
        if (policy.policyStatus === 'Active') {
            const hasBeenBilledThisMonth = policy.bills.some(bill => {
                const billDate = new Date(bill.dueDate);
                return billDate.getFullYear() === currentMonthBillingDate.getFullYear() &&
                       billDate.getMonth() === currentMonthBillingDate.getMonth();
            });

            if (!hasBeenBilledThisMonth) {
                const newBillId = (policy.bills.length > 0 ? Math.max(...policy.bills.map(b => b.id)) : 0) + 1;
                const newBill: Bill = {
                    id: newBillId,
                    policyId: policy.id,
                    amount: policy.premium,
                    dueDate: format(currentMonthBillingDate, 'yyyy-MM-dd'),
                    status: 'Unpaid',
                    description: `${format(currentMonthBillingDate, 'MMMM yyyy')} Premium`,
                };
                
                policy.bills.push(newBill);
                policy.billingStatus = 'Outstanding';
                
                policy.activityLog.push({
                    date: new Date().toISOString(),
                    user: 'System',
                    action: 'Policy Billed',
                    details: `Billed GHS ${policy.premium.toFixed(2)} for ${format(currentMonthBillingDate, 'MMMM yyyy')}.`
                });

                billedCount++;
            }
        }
    });

    savePoliciesToStorage(policies);
    return billedCount;
}

export function applyAnnualIncreases(): number {
    const policies = getPoliciesFromStorage();
    let updatedCount = 0;
    const today = startOfDay(new Date());
    const currentYear = getYear(today);

    policies.forEach(policy => {
        if (policy.policyStatus !== 'Active') {
            return;
        }

        const commencementDate = startOfDay(new Date(policy.commencementDate));
        const policyAgeInYears = differenceInYears(today, commencementDate);

        // Rule: Increases stop after the 10th year.
        if (policyAgeInYears >= 10) {
            return;
        }
        
        // Construct the anniversary date for the current year.
        const anniversaryThisYear = new Date(commencementDate);
        anniversaryThisYear.setFullYear(currentYear);

        // Check if the anniversary is today or has passed, but we are still in the same year.
        if (isBefore(anniversaryThisYear, today) || anniversaryThisYear.getTime() === today.getTime()) {
             // Check if an API/ABI has already been applied this year.
            const alreadyIncreasedThisYear = policy.activityLog.some(log => 
                log.action === 'API/ABI Applied' && getYear(new Date(log.date)) === currentYear
            );

            if (alreadyIncreasedThisYear) {
                return;
            }

            let premiumIncreaseRate: number;
            let sumAssuredIncreaseRate: number;
            
            // Determine which rule to apply
            if (policy.sumAssured >= 500000) {
                premiumIncreaseRate = 0.07; // 7%
                sumAssuredIncreaseRate = 0.03; // 3%
            } else {
                premiumIncreaseRate = 0.05; // 5%
                sumAssuredIncreaseRate = 0.02; // 2%
            }
            
            const oldPremium = policy.premium;
            const oldSumAssured = policy.sumAssured;

            const newPremium = oldPremium * (1 + premiumIncreaseRate);
            const newSumAssured = oldSumAssured * (1 + sumAssuredIncreaseRate);

            policy.premium = newPremium;
            policy.sumAssured = newSumAssured;

            policy.activityLog.push({
                date: new Date().toISOString(),
                user: 'System',
                action: 'API/ABI Applied',
                details: `Year ${policyAgeInYears + 1}. Premium increased from GHS ${oldPremium.toFixed(2)} to GHS ${newPremium.toFixed(2)}. Sum assured increased from GHS ${oldSumAssured.toFixed(2)} to GHS ${newSumAssured.toFixed(2)}.`,
            });
            
            updatedCount++;
        }
    });

    if (updatedCount > 0) {
        savePoliciesToStorage(policies);
    }

    return updatedCount;
}

    

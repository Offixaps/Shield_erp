

'use client';

import { newBusinessData, type NewBusiness, type Bill, type Payment, type ActivityLog } from './data';
import { format, startOfMonth, getYear, isBefore, startOfDay, differenceInYears, parse } from 'date-fns';

const LOCAL_STORAGE_KEY = 'shield-erp-policies';
const DATA_VERSION_KEY = 'shield-erp-data-version';
const CURRENT_DATA_VERSION = 11; // Increment this version to force a data migration

// Helper function to get policies from localStorage
function getPoliciesFromStorage(): NewBusiness[] {
  if (typeof window === 'undefined') {
    return [...newBusinessData]; // Return initial data during server-side rendering
  }

  const storedVersionStr = localStorage.getItem(DATA_VERSION_KEY);
  const storedVersion = storedVersionStr ? parseInt(storedVersionStr, 10) : 0;
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (storedData && storedVersion === CURRENT_DATA_VERSION) {
    try {
      const parsedData = JSON.parse(storedData);
      return Array.isArray(parsedData) ? parsedData : [...newBusinessData];
    } catch (e) {
      console.error("Failed to parse policies from localStorage", e);
      // If parsing fails, fall back to default
    }
  }

  // Handle data migration or initial load
  let policiesToStore = [...newBusinessData];
  if (storedData && storedVersion < CURRENT_DATA_VERSION) {
    console.log(`Upgrading data from version ${storedVersion} to ${CURRENT_DATA_VERSION}`);
    try {
        const oldData = JSON.parse(storedData);
        if (Array.isArray(oldData)) {
            // This is the migration logic. It merges existing data with the default new data.
            const migratedData = newBusinessData.map(defaultPolicy => {
                const existingPolicy = oldData.find(p => p.id === defaultPolicy.id);
                if (existingPolicy) {
                    // Merge existing data over the new default structure
                    return { ...defaultPolicy, ...existingPolicy };
                }
                return defaultPolicy; // Should not happen if IDs are stable
            });
            
            // Add any policies that might exist in old data but not in newBusinessData (e.g. user created)
            oldData.forEach(oldPolicy => {
                if (!migratedData.some(p => p.id === oldPolicy.id)) {
                    migratedData.push(oldPolicy);
                }
            });

            policiesToStore = migratedData;
        }
    } catch(e) {
        console.error("Failed to migrate old policy data", e);
        // Fallback to default if migration fails
        policiesToStore = [...newBusinessData];
    }
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(policiesToStore));
  localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION.toString());
  return policiesToStore;
}


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

export function updatePolicy(id: number, updates: Partial<Omit<NewBusiness, 'id'>>): NewBusiness | undefined {
    const policies = getPoliciesFromStorage();
    const policyIndex = policies.findIndex(p => p.id === id);

    if (policyIndex !== -1) {
        const originalPolicy = { ...policies[policyIndex] };
        
        // Create the updated policy object
        const updatedPolicy = { 
            ...originalPolicy, 
            ...updates 
        };

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
    
    const firstBill: Bill = {
        id: 1,
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
    if (!policy.bills) policy.bills = [];
    if (!policy.payments) policy.payments = [];
    if (!policy.activityLog) policy.activityLog = [];
    
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
             // IDEMPOTENCY CHECK: This is the preventative measure.
             // It checks the activity log to ensure an increase hasn't already been applied this calendar year.
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

type BankReportPayment = {
    'Policy Number': string;
    'Amount': number;
    'Payment Date': string | number;
    'Status': string;
    'Transaction ID': string;
};

export function recordBulkPayments(payments: BankReportPayment[]): { successCount: number; failureCount: number; } {
    const policies = getPoliciesFromStorage();
    let successCount = 0;
    let failureCount = 0;

    const successfulPaymentStatuses = ['paid', 'success', 'processed'];

    payments.forEach(payment => {
        if (!payment['Policy Number'] || !payment['Status'] || !successfulPaymentStatuses.includes(payment['Status'].toLowerCase())) {
            failureCount++;
            return;
        }

        const policy = policies.find(p => p.policy === payment['Policy Number']);

        if (!policy) {
            failureCount++;
            return;
        }

        const paymentAmount = payment['Amount'] ? Number(payment['Amount']) : policy.premium;
        let paymentDate: Date;
        
        // Handle Excel's numeric date format
        if (typeof payment['Payment Date'] === 'number') {
            // Excel stores dates as number of days since 1900-01-01.
            // The following formula converts it to a JS Date.
            // Subtract 25569 to convert from Excel's epoch (1900) to Unix epoch (1970) and account for leap year bug.
            paymentDate = new Date((payment['Payment Date'] - 25569) * 86400 * 1000);
        } else {
            // Attempt to parse various string date formats
            try {
                 paymentDate = parse(payment['Payment Date'], 'yyyy-MM-dd', new Date());
                 if (isNaN(paymentDate.getTime())) {
                    paymentDate = parse(payment['Payment Date'], 'dd/MM/yyyy', new Date());
                 }
                 if (isNaN(paymentDate.getTime())) {
                     paymentDate = new Date(payment['Payment Date']);
                 }
                 if (isNaN(paymentDate.getTime())) throw new Error("Invalid date format");
            } catch {
                failureCount++;
                return;
            }
        }
        
        // Find an unpaid bill to match this payment to.
        const unpaidBill = policy.bills.find(b => b.status === 'Unpaid' && Math.abs(b.amount - paymentAmount) < 0.01);
        
        if (!unpaidBill) {
            // Optional: Handle overpayments or payments without a bill by creating a new payment record anyway
            // For now, we'll count it as a failure if no matching bill is found.
            failureCount++;
            return;
        }

        const newPaymentId = (policy.payments.length > 0 ? Math.max(...policy.payments.map(p => p.id)) : 0) + 1;
        const newPayment: Payment = {
            id: newPaymentId,
            policyId: policy.id,
            billId: unpaidBill.id,
            amount: paymentAmount,
            paymentDate: format(paymentDate, 'yyyy-MM-dd'),
            method: 'Bank Transfer', // Assuming since it's a bank report
            transactionId: payment['Transaction ID'] || `BANK-${newId()}`,
        };

        policy.payments.push(newPayment);
        unpaidBill.status = 'Paid';
        unpaidBill.paymentId = newPaymentId;

        // Update billing status if all bills are paid
        const allBillsPaid = policy.bills.every(b => b.status === 'Paid');
        if (allBillsPaid) {
            policy.billingStatus = 'Up to Date';
        }

        policy.activityLog.push({
            date: new Date().toISOString(),
            user: 'System',
            action: 'Payment Recorded',
            details: `Bulk upload: GHS ${paymentAmount.toFixed(2)} paid on ${format(paymentDate, 'PPP')}.`,
        });

        successCount++;
    });

    savePoliciesToStorage(policies);
    return { successCount, failureCount };
}

// Simple unique ID generator for transactions without one
function newId() {
    return Math.random().toString(36).substr(2, 9);
}

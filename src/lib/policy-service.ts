
'use client';

import { newBusinessData, type NewBusiness, type Bill, type Payment, type ActivityLog } from './data';
import { format, startOfMonth, getYear, isBefore, startOfDay, differenceInYears, parse, isAfter } from 'date-fns';

let policies: NewBusiness[] = [...newBusinessData];

let nextId = policies.length > 0 ? Math.max(...policies.map(p => p.id)) + 1 : 1;

function newId() {
    return nextId++;
}

export function getPolicies(): NewBusiness[] {
  return policies;
}

export function getPolicyById(id: number | string): NewBusiness | undefined {
  return policies.find(p => p.id === Number(id));
}

export function updatePolicy(id: number | string, updates: Partial<Omit<NewBusiness, 'id'>>): NewBusiness | undefined {
    const policyIndex = policies.findIndex(p => p.id === Number(id));
    if (policyIndex === -1) {
        throw new Error("Policy not found");
    }

    const originalPolicy = policies[policyIndex];
    const updatedPolicy = { ...originalPolicy, ...updates };

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
        updatedPolicy.activityLog = [...(updatedPolicy.activityLog || []), newLogEntry];
    }
    
    policies[policyIndex] = updatedPolicy;
    
    // Simulate notifying other components about the data change
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
    }

    return updatedPolicy;
}

export function generateNewSerialNumber(): string {
    const maxSerial = policies.reduce((max, p) => {
        const serialNum = parseInt(p.serial, 10);
        return !isNaN(serialNum) && serialNum > max ? serialNum : max;
    }, 1000);
    return (maxSerial + 1).toString();
}

export function createPolicy(values: any): NewBusiness {
    const lifeAssuredName = [values.title, values.lifeAssuredFirstName, values.lifeAssuredMiddleName, values.lifeAssuredSurname].filter(Boolean).join(' ');

    const newPolicy: NewBusiness = {
        ...values,
        id: newId(),
        client: lifeAssuredName,
        department: "Business Development",
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
    policies.push(newPolicy);
    
    // Simulate notifying other components about the data change
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
    }
    
    return newPolicy;
}

export function deletePolicy(id: number | string): boolean {
    const initialLength = policies.length;
    policies = policies.filter(p => p.id !== Number(id));
    
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
    }

    return policies.length < initialLength;
}

export function recordFirstPayment(policyId: number, paymentDetails: Omit<Payment, 'id' | 'policyId' | 'billId'>): NewBusiness | undefined {
    const policy = getPolicyById(policyId);
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
            policyId: policy.id,
            amount: policy.premium,
            dueDate: format(new Date(policy.commencementDate), 'yyyy-MM-dd'),
            status: 'Unpaid',
            description: 'First Premium',
        };
        policy.bills.push(firstBill);
    }
    
    if (firstBill.status === 'Paid') return undefined; // Already paid

    const newPaymentId = (policy.payments.length > 0 ? Math.max(...policy.payments.map(p => p.id)) : 0) + 1;
    const newPayment: Payment = { id: newPaymentId, policyId: policy.id, billId: firstBill.id, ...paymentDetails };

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

export function recordPayment(policyId: number, paymentDetails: Omit<Payment, 'id' | 'policyId' | 'billId'>): NewBusiness | undefined {
    const policy = getPolicyById(policyId);
    if (!policy) return undefined;

    if (!policy.bills) policy.bills = [];
    if (!policy.payments) policy.payments = [];
    if (!policy.activityLog) policy.activityLog = [];

    const unpaidBill = policy.bills.find(b => b.status === 'Unpaid');
    if (!unpaidBill) return undefined;

    const newPaymentId = (policy.payments.length > 0 ? Math.max(...policy.payments.map(p => p.id)) : 0) + 1;
    const newPayment: Payment = { id: newPaymentId, policyId: policy.id, billId: unpaidBill.id, ...paymentDetails };

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


export function billAllActivePolicies(): number {
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
            
            policy.bills = [...(policy.bills || []), newBill];
            policy.billingStatus = 'Outstanding';
            policy.activityLog = [...(policy.activityLog || []), {
                date: new Date().toISOString(),
                user: 'System',
                action: 'Policy Billed',
                details: `Billed GHS ${policy.premium.toFixed(2)} for ${format(currentMonthBillingDate, 'MMMM yyyy')}.`
            }];
            
            updatePolicy(policy.id, policy);
            billedCount++;
        }
    });

    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
    }

    return billedCount;
}

export function applyAnnualIncreases(): number {
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

            policy.premium = newPremium;
            policy.sumAssured = newSumAssured;
            policy.activityLog.push({
                date: new Date().toISOString(),
                user: 'System',
                action: 'API/ABI Applied',
                details: `Year ${policyAgeInYears + 1}. Premium increased from GHS ${oldPremium.toFixed(2)} to GHS ${newPremium.toFixed(2)}. Sum assured increased from GHS ${oldSumAssured.toFixed(2)} to GHS ${newSumAssured.toFixed(2)}.`,
            });
            
            updatePolicy(policy.id, policy);
            updatedCount++;
        }
    });

    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
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
                // Handle Excel date serial numbers
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

        policy.payments.push(newPayment);
        const billIndex = policy.bills.findIndex(b => b.id === unpaidBill.id);
        if (billIndex > -1) {
            policy.bills[billIndex].status = 'Paid';
            policy.bills[billIndex].paymentId = newPaymentId;
        }

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

        updatePolicy(policy.id, policy);
        successCount++;
    }

    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
    }
    
    return { successCount, failureCount };
}

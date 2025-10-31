
'use client';

import { newBusinessData, type NewBusiness, type OnboardingStatus } from './data';
import { format } from 'date-fns';

// This is a mock service. In the future, this will be replaced with Firestore calls.

export function getPolicies(): NewBusiness[] {
  // In a real app, this would fetch from Firestore.
  return newBusinessData;
}

export function getPolicyById(id: number): NewBusiness | undefined {
  // In a real app, this would fetch a single document from Firestore.
  return newBusinessData.find((policy) => policy.id === id);
}

type UpdatePayload = Partial<Omit<NewBusiness, 'id'>>;

export function updatePolicy(id: number, updates: UpdatePayload): NewBusiness | undefined {
    const policyIndex = newBusinessData.findIndex(p => p.id === id);
    if (policyIndex !== -1) {
        newBusinessData[policyIndex] = { ...newBusinessData[policyIndex], ...updates };
        return newBusinessData[policyIndex];
    }
    return undefined;
}


export function createPolicy(values: any): NewBusiness {
    const newId = Math.max(...newBusinessData.map(b => b.id)) + 1;
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
        onboardingStatus: 'Pending Vetting',
        billingStatus: 'Outstanding',
        policyStatus: 'Inactive',
        expiryDate: new Date(new Date(values.commencementDate).setFullYear(new Date(values.commencementDate).getFullYear() + values.policyTerm)).toISOString().split('T')[0],
        policyTerm: values.policyTerm,
        premiumTerm: values.premiumTerm,
        mandateVerified: false,
        firstPremiumPaid: false,
        medicalUnderwritingState: { started: false, completed: false },
    };

    newBusinessData.push(newPolicy);
    return newPolicy;
}

export function deletePolicy(id: number): boolean {
    const policyIndex = newBusinessData.findIndex(p => p.id === id);
    if (policyIndex !== -1) {
        newBusinessData.splice(policyIndex, 1);
        return true;
    }
    return false;
}

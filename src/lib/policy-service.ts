
'use client';

import { newBusinessData, type NewBusiness } from './data';
import { format } from 'date-fns';

const LOCAL_STORAGE_KEY = 'shield-erp-policies';

// Helper function to get policies from localStorage
function getPoliciesFromStorage(): NewBusiness[] {
  if (typeof window === 'undefined') {
    return newBusinessData; // Return initial data during server-side rendering
  }
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedData) {
    return JSON.parse(storedData);
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

type UpdatePayload = Partial<Omit<NewBusiness, 'id'>>;

export function updatePolicy(id: number, updates: UpdatePayload): NewBusiness | undefined {
    const policies = getPoliciesFromStorage();
    const policyIndex = policies.findIndex(p => p.id === id);
    if (policyIndex !== -1) {
        policies[policyIndex] = { ...policies[policyIndex], ...updates };
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

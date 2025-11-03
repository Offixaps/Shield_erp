
'use client';

import { rolesData, type Role } from './data';

const LOCAL_STORAGE_KEY = 'shield-erp-roles';

function getRolesFromStorage(): Role[] {
  if (typeof window === 'undefined') {
    return rolesData;
  }

  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      return Array.isArray(parsedData) ? parsedData : rolesData;
    } catch (e) {
      console.error("Failed to parse roles from localStorage", e);
    }
  }
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rolesData));
  return rolesData;
}

function saveRolesToStorage(roles: Role[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(roles));
}

export function getRoles(): Role[] {
  return getRolesFromStorage();
}

export function getRoleById(id: number): Role | undefined {
  const roles = getRolesFromStorage();
  return roles.find((role) => role.id === id);
}

export function createRole(values: { roleName: string; permissions: string[] }): Role {
    const roles = getRolesFromStorage();
    const newId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
    
    const newRole: Role = {
        id: newId,
        name: values.roleName,
        permissions: values.permissions,
    };

    const updatedRoles = [...roles, newRole];
    saveRolesToStorage(updatedRoles);
    return newRole;
}

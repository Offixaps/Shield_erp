
export type Permission = {
    id: string;
    label: string;
    description: string;
};

export type PermissionModule = {
    [moduleName: string]: Permission[];
};

export type PermissionsConfig = {
    [department: string]: PermissionModule;
};

const commonActions: Omit<Permission, 'id'>[] = [
    { label: 'View', description: 'Can view items in this module' },
    { label: 'Create', description: 'Can create new items in this module' },
    { label: 'Edit', description: 'Can edit existing items in this module' },
    { label: 'Delete', description: 'Can delete items in this module' },
];

const createPermissions = (department: string, module: string): Permission[] => {
    return commonActions.map(action => ({
        id: `${department}.${module}.${action.label.toLowerCase()}`,
        label: action.label,
        description: action.description,
    }));
};

export const permissionsConfig: PermissionsConfig = {
    'Business Development': {
        'Sales': createPermissions('Business Development', 'Sales'),
        'Clients': createPermissions('Business Development', 'Clients'),
        'Advisors': createPermissions('Business Development', 'Advisors'),
        'Policies': createPermissions('Business Development', 'Policies'),
        'Claims': createPermissions('Business Development', 'Claims'),
        'Reports': [{ id: 'Business Development.Reports.view', label: 'View', description: 'Can view reports' }],
    },
    'Premium Administration': {
        'New Business': createPermissions('Premium Administration', 'New Business'),
        'Premium Collection': createPermissions('Premium Administration', 'Premium Collection'),
        'Reconciliation': createPermissions('Premium Administration', 'Reconciliation'),
    },
    'Underwriting': {
        'New Business': createPermissions('Underwriting', 'New Business'),
        'Mandates': createPermissions('Underwriting', 'Mandates'),
        'Occupational': createPermissions('Underwriting', 'Occupational'),
        'Lifestyle': createPermissions('Underwriting', 'Lifestyle'),
        'Medicals': createPermissions('Underwriting', 'Medicals'),
        'Financial': createPermissions('Underwriting', 'Financial'),
        'Claims': createPermissions('Underwriting', 'Claims'),
    },
    'General': {
        'Staff Management': createPermissions('General', 'Staff Management'),
        'Role Management': createPermissions('General', 'Role Management'),
    }
};


'use client';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, setDoc } from 'firebase/firestore';
import type { Role } from './data';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export async function getRoles(): Promise<Role[]> {
    const rolesCollection = collection(db, 'roles');
    try {
        const roleSnapshot = await getDocs(rolesCollection);
        if (roleSnapshot.empty) {
            return [];
        }
        return roleSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as unknown as Role);
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: rolesCollection.path,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function getRoleById(id: string): Promise<Role | undefined> {
    const roleDocRef = doc(db, 'roles', id);
    try {
        const docSnap = await getDoc(roleDocRef);
        if (docSnap.exists()) {
            return { ...docSnap.data(), id: docSnap.id } as Role;
        }
        return undefined;
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: roleDocRef.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function createRole(values: { roleName: string; permissions: string[] }): Promise<Role> {
    const rolesCollection = collection(db, 'roles');
    const newRoleData = {
        name: values.roleName,
        permissions: values.permissions,
    };

    try {
        const docRef = await addDoc(rolesCollection, newRoleData);
        return { id: docRef.id, ...newRoleData } as unknown as Role;
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: rolesCollection.path,
            operation: 'create',
            requestResourceData: newRoleData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function updateRole(id: string, values: { roleName: string; permissions: string[] }): Promise<Role> {
    const roleDocRef = doc(db, 'roles', id);
    const updatedData = {
        name: values.roleName,
        permissions: values.permissions,
    };

    try {
        await setDoc(roleDocRef, updatedData, { merge: true });
        const docSnap = await getDoc(roleDocRef);
        return { ...docSnap.data(), id: docSnap.id } as Role;
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: roleDocRef.path,
            operation: 'update',
            requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

import React, { useState, FormEvent } from 'react';
import { User } from '../../types';

interface UserManagementTabProps {
    users: User[];
    setUsers: (users: User[]) => void;
}

// Icons for modals
const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);
const ExclamationTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);


const UserManagementTab: React.FC<UserManagementTabProps> = ({ users, setUsers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const handleOpenModal = (user: Partial<User> | null = null) => {
        setEditingUser(user ? { ...user } : { name: '', nip: '', role: 'teacher', password: ''});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };
    
    const handleSaveUser = (e: FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        if (editingUser.id) { // Editing existing user
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...editingUser } as User : u));
        } else { // Adding new user
            const newUser: User = {
                id: Date.now(),
                lastActive: new Date().toISOString().slice(0, 16).replace('T', ' '),
                ...editingUser,
            } as User;
            setUsers([...users, newUser]);
        }
        handleCloseModal();
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
    };

    const handleConfirmDelete = () => {
        if (!userToDelete) return;
        setUsers(users.filter(u => u.id !== userToDelete.id));
        setUserToDelete(null);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">User Accounts</h3>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        Add New User
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">NIP / Username</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Active</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.nip}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.lastActive}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => handleOpenModal(user)} className="text-emerald-600 hover:text-emerald-900">Edit</button>
                                        <button onClick={() => handleDeleteClick(user)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit User Modal */}
            {isModalOpen && editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" aria-modal="true">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        <form onSubmit={handleSaveUser}>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">{editingUser.id ? 'Edit User' : 'Add New User'}</h3>
                                    <button type="button" onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                        <XMarkIcon className="h-6 w-6"/>
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                                        <input type="text" id="name" required value={editingUser.name || ''} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-800 text-white placeholder-slate-400 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="nip" className="block text-sm font-medium text-slate-700">NIP / Username</label>
                                        <input type="text" id="nip" required value={editingUser.nip || ''} onChange={(e) => setEditingUser({...editingUser, nip: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-800 text-white placeholder-slate-400 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                                        <input type="password" id="password" placeholder={editingUser.id ? 'Leave blank to keep current password' : ''} required={!editingUser.id} onChange={(e) => setEditingUser({...editingUser, password: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-800 text-white placeholder-slate-400 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="role" className="block text-sm font-medium text-slate-700">Role</label>
                                        <select id="role" value={editingUser.role || 'teacher'} onChange={(e) => setEditingUser({...editingUser, role: e.target.value as 'admin' | 'teacher'})} className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                                            <option value="teacher">Teacher</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 px-6 py-3 flex justify-end gap-3">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700">{editingUser.id ? 'Save Changes' : 'Create User'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Delete Confirmation Modal */}
            {userToDelete && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" aria-modal="true">
                     <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-slate-900">Delete User</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-slate-500">
                                        Are you sure you want to delete <strong>{userToDelete.name}</strong>? This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:w-auto sm:text-sm"
                                onClick={handleConfirmDelete}
                            >
                                Confirm Delete
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 sm:mt-0 sm:w-auto sm:text-sm"
                                onClick={() => setUserToDelete(null)}
                            >
                                Cancel
                            </button>
                        </div>
                     </div>
                 </div>
            )}
        </>
    );
};

export default UserManagementTab;
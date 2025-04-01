import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';

function UserList({ users = [], onEditUser, onDeleteUser, loading }) {
    const [showModal, setShowModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowModal(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            onDeleteUser(userToDelete.id); // llama al padre
            setShowModal(false);
            setUserToDelete(null);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>
            {loading ? (
                <p className="text-gray-500">Cargando usuarios...</p>
            ) : users.length === 0 ? (
                <p>No hay usuarios registrados.</p>
            ) : (
                <ul className="space-y-4">
                    {users.map((user) => (
                        <li key={user.id} className="border-b pb-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEditUser(user)}
                                        className="px-3 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 rounded"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(user)}
                                        className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <ConfirmModal
                show={showModal}
                message={`¿Estás seguro de eliminar a "${userToDelete?.name}"?`}
                onCancel={() => setShowModal(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}

export default UserList;

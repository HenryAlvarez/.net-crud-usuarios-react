import React, { useState, useEffect } from 'react';

const API_URL = 'https://mycrudapp-api-e3ebgpf5gpbsfdgt.centralus-01.azurewebsites.net/api/Users';

function UserForm({ onUserSaved, editingUser, onCancelEdit }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // 🔁 Cargar datos si está editando
    useEffect(() => {
        if (editingUser) {
            setName(editingUser.name);
            setEmail(editingUser.email);
        } else {
            // Limpiar el form si no hay usuario editando
            setName('');
            setEmail('');
        }
    }, [editingUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            name,
            email,
            createdAt: editingUser ? editingUser.createdAt : new Date().toISOString()
        };

        try {
            const res = await fetch(
                editingUser ? `${API_URL}/${editingUser.id}` : API_URL,
                {
                    method: editingUser ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editingUser ? { ...editingUser, ...userData } : userData)
                }
            );

            if (res.ok) {
                if (editingUser) {
                    // Si estás editando, buscá el usuario actualizado
                    const updatedUser = await fetch(`${API_URL}/${editingUser.id}`).then(res => res.json());
                    onUserSaved(updatedUser);
                } else {
                    // Si estás creando, tomá el resultado directamente del POST
                    const newUser = await res.json(); // 👈 importante
                    onUserSaved(newUser);
                }

                setName('');
                setEmail('');
                onCancelEdit();
            }

        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded shadow space-y-4"
        >
            <h2 className="text-xl font-bold">
                {editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
            </h2>

            <div>
                <label className="block mb-1 font-medium">Nombre:</label>
                <input
                    className="w-full border px-3 py-2 rounded"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Email:</label>
                <input
                    className="w-full border px-3 py-2 rounded"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="flex justify-between">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    {editingUser ? 'Guardar Cambios' : 'Guardar Usuario'}
                </button>

                {editingUser && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}

export default UserForm;

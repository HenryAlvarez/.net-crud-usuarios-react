import { useEffect, useState } from 'react';
import UserList from './components/UserList';
import UserForm from './components/UserForm';

const API_URL = 'https://mycrudapp-api-e3ebgpf5gpbsfdgt.centralus-01.azurewebsites.net/api/Users';

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchUsers = async () => {
    setLoading(true); // 👈 empezamos a cargar
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    } finally {
      setLoading(false); // 👈 dejamos de cargar
    }
  };
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserSaved = (savedUser) => {
    setUsers(prev => {
      const exists = prev.find(u => u.id === savedUser.id);
      return exists
        ? prev.map(u => u.id === savedUser.id ? savedUser : u) // ✅ actualiza usuario existente
        : [...prev, savedUser]; // ✅ agrega nuevo usuario
    });
    setEditingUser(null); // ✅ limpia formulario
  };
  

  const handleUserDeleted = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUsers(prev => prev.filter(user => user.id !== id));
      }
    } catch (err) {
      console.error('Error eliminando:', err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        CRUD de Usuarios
      </h1>

      <UserForm
        onUserSaved={handleUserSaved}
        editingUser={editingUser}
        onCancelEdit={() => setEditingUser(null)}
      />
      <UserList
        users={users}
        onEditUser={setEditingUser}
        onDeleteUser={handleUserDeleted}
        loading={loading}
      />
    </div>
  );
}

export default App;

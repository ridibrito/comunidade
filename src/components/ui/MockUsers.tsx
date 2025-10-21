"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/ToastProvider";

type Role = "admin" | "aluno" | "profissional";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: Role | null;
}

// Dados mockados para demonstração
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@comunidade.com",
    full_name: "Administrador Principal",
    role: "admin"
  },
  {
    id: "2", 
    email: "aluno1@comunidade.com",
    full_name: "João Silva",
    role: "aluno"
  },
  {
    id: "3",
    email: "profissional1@comunidade.com", 
    full_name: "Maria Santos",
    role: "profissional"
  },
  {
    id: "4",
    email: "aluno2@comunidade.com",
    full_name: "Pedro Costa",
    role: "aluno"
  }
];

export function useMockUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    // Simular carregamento inicial
    setLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const createUser = async (userData: Omit<User, 'id'>) => {
    setLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    
    setUsers(prev => [...prev, newUser]);
    setLoading(false);
    
    push({
      title: "Usuário criado",
      message: "Usuário adicionado com sucesso (dados mockados)"
    });
    
    return newUser;
  };

  const updateUser = async (id: string, userData: Partial<Omit<User, 'id'>>) => {
    setLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ));
    
    setLoading(false);
    
    push({
      title: "Usuário atualizado",
      message: "Dados atualizados com sucesso (dados mockados)"
    });
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUsers(prev => prev.filter(user => user.id !== id));
    setLoading(false);
    
    push({
      title: "Usuário removido",
      message: "Usuário excluído com sucesso (dados mockados)"
    });
  };

  return {
    users,
    loading,
    createUser,
    updateUser,
    deleteUser
  };
}

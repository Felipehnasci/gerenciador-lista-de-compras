import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { ShoppingDashboard } from "@/components/shopping/ShoppingDashboard";

const Index = () => {
  const [user, setUser] = useState<{ email: string } | null>(null);

  const handleLogin = (email: string, password: string) => {
    // Simular autenticação bem-sucedida
    setUser({ email });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (user) {
    return <ShoppingDashboard userEmail={user.email} onLogout={handleLogout} />;
  }

  return <LoginForm onLogin={handleLogin} />;
};

export default Index;

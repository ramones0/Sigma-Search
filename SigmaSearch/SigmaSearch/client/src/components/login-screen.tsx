import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { APP_PASSWORD, APP_USERNAME } from "@/lib/constants";
import { AlertCircle } from "lucide-react";

interface LoginScreenProps {
  onLogin: (password: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple username/password validation - in a real app this would be a server call
    if (username === APP_USERNAME && password === APP_PASSWORD) {
      setError(false);
      onLogin(password);
    } else {
      setError(true);
      if (username !== APP_USERNAME) {
        setErrorMessage("Usuário incorreto. Tente novamente.");
      } else {
        setErrorMessage("Senha incorreta. Tente novamente.");
      }
    }
  };

  return (
    <div id="login-screen" className="bg-primary/60 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg max-w-md mx-auto mb-8 border border-secondary grid-pattern glowing-border">
      <div className="text-center mb-6">
        <h2 className="font-exo text-2xl mb-2">Acesso Restrito</h2>
        <p className="text-accent-light text-sm">Digite suas credenciais para acessar o sistema</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">Usuário</label>
          <Input 
            type="text" 
            id="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg py-3 px-4 text-white futuristic-input focus:outline-none"
            placeholder="Digite seu usuário"
            required
            error={error && username !== APP_USERNAME}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Senha</label>
          <Input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg py-3 px-4 text-white futuristic-input focus:outline-none"
            placeholder="Digite sua senha"
            required
            error={error && username === APP_USERNAME}
          />
          {error && (
            <div className="mt-2 text-red-400 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errorMessage}
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          variant="gradient"
          className="w-full rounded-lg text-white py-3 font-medium shadow-lg mt-4"
        >
          Acessar
        </Button>
      </form>
    </div>
  );
}

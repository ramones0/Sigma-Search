import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Lock, Check, X } from "lucide-react";
import { APK_PASSWORD } from "@/lib/constants";

interface ApkDownloadProps {
  onClose: () => void;
}

export default function ApkDownload({ onClose }: ApkDownloadProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [status, setStatus] = useState<"idle" | "downloading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === APK_PASSWORD) {
      setError(false);
      downloadApk();
    } else {
      setError(true);
    }
  };

  const downloadApk = async () => {
    setStatus("downloading");
    
    try {
      // Fazer requisição para verificar a senha e obter o link de download
      const response = await fetch('/api/download-apk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });
      
      if (!response.ok) {
        throw new Error('Falha na autenticação para download');
      }
      
      const data = await response.json();
      
      // Iniciar o download do arquivo APK
      const element = document.createElement("a");
      element.setAttribute("href", data.downloadUrl);
      element.setAttribute("download", "sigma-search.apk");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      setStatus("success");
      
      // Fechamos o modal após 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-primary/90 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl border border-secondary grid-pattern max-w-md w-full">
        <div className="text-right">
          <button onClick={onClose} className="text-accent-light hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="h-8 w-8 text-accent" />
          </div>
          <h2 className="font-exo text-2xl mb-2">Baixar APK</h2>
          <p className="text-accent-light text-sm">
            Versão para Android do SIGMA SEARCH.
            <br />
            Digite a senha para iniciar o download.
          </p>
        </div>
        
        {status === "idle" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="apk-password" className="block text-sm font-medium mb-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <Input 
                  type="password" 
                  id="apk-password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg py-3 pl-10 pr-4 text-white futuristic-input focus:outline-none"
                  placeholder="Digite a senha"
                  required
                  error={error}
                />
                <Lock className="absolute left-3 top-3 h-5 w-5 text-accent-light" />
              </div>
              {error && (
                <div className="mt-2 text-red-400 text-sm flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  Senha incorreta. Tente novamente.
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              variant="gradient"
              className="w-full rounded-lg text-white py-3 font-medium shadow-lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar APK
            </Button>
          </form>
        )}
        
        {status === "downloading" && (
          <div className="text-center py-4">
            <div className="animate-spin h-12 w-12 border-t-2 border-accent rounded-full mb-4 mx-auto"></div>
            <p>Preparando download...</p>
          </div>
        )}
        
        {status === "success" && (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-green-400 font-medium mb-2">Download iniciado!</p>
            <p className="text-sm text-accent-light">
              Se o download não iniciar automaticamente, 
              <a href="#" className="text-accent hover:underline ml-1">clique aqui</a>.
            </p>
          </div>
        )}
        
        {status === "error" && (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-red-400 font-medium mb-2">Erro ao baixar</p>
            <p className="text-sm text-accent-light mb-4">
              Houve um problema ao preparar o download. Por favor, tente novamente.
            </p>
            <Button 
              onClick={() => setStatus("idle")} 
              variant="secondary"
              className="mx-auto"
            >
              Tentar Novamente
            </Button>
          </div>
        )}
        
        <div className="mt-6 text-xs text-center text-accent-light/70">
          <p>Apenas para uso autorizado em dispositivos Android.</p>
          <p>Versão 1.0.0 • SIGMA SEARCH</p>
        </div>
      </div>
    </div>
  );
}
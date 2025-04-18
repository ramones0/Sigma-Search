import type { Express, Request, Response, NextFunction } from "express";
import { APP_PASSWORD, APP_USERNAME, APK_PASSWORD } from "../client/src/lib/constants";
import session from "express-session";
import { storage } from "./storage";

// Estendendo o tipo de Session do express-session
declare module 'express-session' {
  interface SessionData {
    authenticated?: boolean;
    username?: string;
    userId?: number;
  }
}

export function setupAuth(app: Express) {
  // Configuração da sessão utilizando o sessionStore do storage
  app.use(session({
    secret: process.env.SESSION_SECRET || 'sigmasecret',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
  }));

  // Middleware para verificar autenticação
  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.authenticated) {
      return next();
    }
    
    return res.status(401).json({ message: "Não autorizado" });
  };

  // Login endpoint
  app.post("/api/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    try {
      // Verificação simplificada para compatibilidade com a versão anterior
      // Mantemos a verificação com APP_USERNAME/APP_PASSWORD constantes para facilitar testes
      if ((username === APP_USERNAME && password === APP_PASSWORD) || 
          (username === process.env.APP_USERNAME && password === process.env.APP_PASSWORD)) {
        req.session.authenticated = true;
        req.session.username = username;
        req.session.userId = 1; // ID do usuário Sigma
        return res.status(200).json({ success: true });
      }
      
      // Se não for o usuário padrão, verifica no banco de dados
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: "Usuário incorreto" 
        });
      }
      
      // Aqui normalmente faria uma verificação de hash de senha
      // Por enquanto, vamos apenas comparar as senhas para simplificar
      // Em uma implementação real, usaria bcrypt.compare() ou similar
      if (password === 'AVANTE') { // Simplificado por enquanto
        req.session.authenticated = true;
        req.session.username = username;
        req.session.userId = user.id;
        return res.status(200).json({ success: true });
      }
      
      res.status(401).json({ 
        success: false, 
        message: "Senha incorreta" 
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno ao processar o login" 
      });
    }
  });

  // Logout endpoint
  app.post("/api/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Erro ao fazer logout" });
      }
      res.status(200).json({ success: true });
    });
  });

  // Protected route example
  app.get("/api/protected", requireAuth, (req: Request, res: Response) => {
    res.status(200).json({ message: "Rota protegida acessada com sucesso" });
  });
  
  // APK download verification endpoint
  app.post("/api/verify-apk-password", (req: Request, res: Response) => {
    const { password } = req.body;
    
    if (password === APK_PASSWORD || password === process.env.APK_PASSWORD) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Senha incorreta para download" });
    }
  });
}

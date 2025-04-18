import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { APK_PASSWORD } from "../client/src/lib/constants";
import path from "path";
import fs from "fs";
import { db } from "./db";
import { missingPersons } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // API route to validate login
  app.post("/api/validate-password", (req, res) => {
    const { password } = req.body;
    
    // This is a simple example for demo purposes.
    // In a real application, this would use proper authentication methods.
    if (password === process.env.APP_PASSWORD || password === APK_PASSWORD) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Senha incorreta" });
    }
  });

  // API route for saving missing person data
  app.post("/api/missing-person", async (req, res) => {
    const missingPersonData = req.body;
    
    try {
      // Verifica se o usuário está autenticado
      if (!req.session || !req.session.authenticated) {
        return res.status(401).json({ 
          success: false, 
          message: "Usuário não autenticado" 
        });
      }
      
      // Em uma aplicação real, você converteria a foto para uma URL ou base64
      let fotoUrl = null;
      if (missingPersonData.fotoPreview) {
        fotoUrl = missingPersonData.fotoPreview;  // Salva o preview da foto como URL
      }
      
      // Converte o array de filhos para o formato esperado pelo banco
      const filhos = Array.isArray(missingPersonData.filhos) 
        ? missingPersonData.filhos 
        : [];
        
      // Salva no banco de dados usando o Drizzle ORM
      
      const [result] = await db.insert(missingPersons).values({
        userId: 1, // Usando um ID fixo para demonstração, em um sistema real usaria o ID do usuário logado
        nome: missingPersonData.nome,
        cpf: missingPersonData.cpf,
        fotoUrl: fotoUrl,
        mae: missingPersonData.mae,
        pai: missingPersonData.pai,
        irmaoNovo: missingPersonData.irmao_novo,
        irmaoVelho: missingPersonData.irmao_velho,
        celular: missingPersonData.celular,
        cidadeNasc: missingPersonData.cidade_nasc,
        estadoNasc: missingPersonData.estado_nasc,
        endereco: missingPersonData.endereco,
        bairro: missingPersonData.bairro,
        cidade: missingPersonData.cidade,
        estado: missingPersonData.estado,
        conjuge: missingPersonData.conjuge,
        filhos: filhos,
        corPele: missingPersonData.cor_pele,
        corCabelo: missingPersonData.cor_cabelo,
        corOlhos: missingPersonData.cor_olhos,
        altura: missingPersonData.altura,
        peso: missingPersonData.peso,
        observacoes: missingPersonData.observacoes,
      }).returning();
      
      res.status(201).json({ 
        success: true, 
        message: "Dados salvos com sucesso no banco de dados",
        data: result
      });
    } catch (error) {
      console.error("Erro ao salvar pessoa desaparecida:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro ao salvar os dados: " + (error instanceof Error ? error.message : "Erro desconhecido")
      });
    }
  });

  // API route for APK download
  app.post("/api/download-apk", (req, res) => {
    const { password } = req.body;
    
    if (password === APK_PASSWORD || password === process.env.APK_PASSWORD) {
      // Simulação de download (na prática, um arquivo APK real seria enviado)
      res.status(200).json({ 
        success: true,
        downloadUrl: "/api/apk-file"
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: "Senha incorreta para download" 
      });
    }
  });

  // Simula o download de um arquivo APK
  app.get("/api/apk-file", (req, res) => {
    // Em uma aplicação real, você serviria um arquivo APK real aqui
    // Aqui estamos gerando um arquivo de texto como simulação
    const filePath = path.join(__dirname, "sigma-search-apk.txt");
    
    // Se o arquivo não existir, vamos criar um arquivo de texto simulando um APK
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "Este é um arquivo simulando um APK do SIGMA SEARCH.\nEm uma aplicação real, este seria um arquivo binário .apk para instalação no Android.");
    }
    
    res.download(filePath, "sigma-search.apk");
  });

  // Lista todas as pessoas desaparecidas
  app.get("/api/missing-persons", async (req, res) => {
    try {
      // Verifica se o usuário está autenticado
      if (!req.session || !req.session.authenticated) {
        return res.status(401).json({ 
          success: false, 
          message: "Usuário não autenticado" 
        });
      }
      
      // Busca todas as pessoas desaparecidas no banco de dados
      const results = await db.select().from(missingPersons).orderBy(missingPersons.nome);
      
      res.status(200).json({ 
        success: true, 
        data: results 
      });
    } catch (error) {
      console.error("Erro ao buscar pessoas desaparecidas:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro ao buscar pessoas desaparecidas: " + (error instanceof Error ? error.message : "Erro desconhecido")
      });
    }
  });
  
  // Busca uma pessoa desaparecida pelo ID
  app.get("/api/missing-persons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          message: "ID inválido" 
        });
      }
      
      // Verifica se o usuário está autenticado
      if (!req.session || !req.session.authenticated) {
        return res.status(401).json({ 
          success: false, 
          message: "Usuário não autenticado" 
        });
      }
      
      // Busca a pessoa desaparecida pelo ID
      const [person] = await db.select().from(missingPersons).where(eq(missingPersons.id, id));
      
      if (!person) {
        return res.status(404).json({ 
          success: false, 
          message: "Pessoa desaparecida não encontrada" 
        });
      }
      
      res.status(200).json({ 
        success: true, 
        data: person 
      });
    } catch (error) {
      console.error("Erro ao buscar pessoa desaparecida:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro ao buscar pessoa desaparecida: " + (error instanceof Error ? error.message : "Erro desconhecido")
      });
    }
  });

  // Verifica o status do sistema
  app.get("/api/system-status", (req, res) => {
    // Aqui poderia verificar várias condições do sistema
    // Ex: conectividade do banco de dados, acesso a APIs externas, etc.
    res.status(200).json({
      status: "online",
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      components: {
        database: "functional",
        authentication: "functional",
        searchEngine: "functional"
      }
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}

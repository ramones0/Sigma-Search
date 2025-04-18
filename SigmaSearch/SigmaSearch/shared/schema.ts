import { pgTable, text, serial, integer, boolean, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Missing person schema
export const missingPersons = pgTable("missing_persons", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  nome: text("nome").notNull(),
  cpf: text("cpf").notNull(),
  fotoUrl: text("foto_url"),
  mae: text("mae").notNull(),
  pai: text("pai"),
  irmaoNovo: text("irmao_novo"),
  irmaoVelho: text("irmao_velho"),
  celular: text("celular").notNull(),
  cidadeNasc: text("cidade_nasc").notNull(),
  estadoNasc: text("estado_nasc").notNull(),
  endereco: text("endereco").notNull(),
  bairro: text("bairro").notNull(),
  cidade: text("cidade").notNull(),
  estado: text("estado").notNull(),
  conjuge: text("conjuge"),
  filhos: text("filhos").array(),
  corPele: text("cor_pele").notNull(),
  corCabelo: text("cor_cabelo").notNull(),
  corOlhos: text("cor_olhos").notNull(),
  altura: text("altura").notNull(),
  peso: text("peso").notNull(),
  observacoes: text("observacoes"),
  dataCadastro: date("data_cadastro").defaultNow(),
});

export const insertMissingPersonSchema = createInsertSchema(missingPersons).omit({
  id: true,
  dataCadastro: true,
});

// Search results schema
export const searchResults = pgTable("search_results", {
  id: serial("id").primaryKey(),
  missingPersonId: integer("missing_person_id").references(() => missingPersons.id),
  resultados: jsonb("resultados"),
  dataConsulta: date("data_consulta").defaultNow(),
  encontrado: boolean("encontrado").default(false),
});

export const insertSearchResultSchema = createInsertSchema(searchResults).omit({
  id: true,
  dataConsulta: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMissingPerson = z.infer<typeof insertMissingPersonSchema>;
export type MissingPerson = typeof missingPersons.$inferSelect;

export type InsertSearchResult = z.infer<typeof insertSearchResultSchema>;
export type SearchResult = typeof searchResults.$inferSelect;

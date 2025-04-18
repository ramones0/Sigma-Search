import React, { useState, useEffect } from "react";
import LoginScreen from "./login-screen";
import FormScreen from "./form-screen";
import ValidationScreen from "./validation-screen";
import SearchScreen from "./search-screen";
import ResultsScreen from "./results-screen";
import { MissingPersonFormData, SearchResults } from "@/lib/types";
import { simulateSearchResults } from "@/lib/utils";

export type AppScreen = "login" | "form" | "validation" | "search" | "results";

export default function AppContainer() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("login");
  const [formData, setFormData] = useState<MissingPersonFormData>({
    nome: "",
    cpf: "",
    foto: null,
    fotoPreview: undefined,
    mae: "",
    pai: "",
    irmao_novo: "",
    irmao_velho: "",
    celular: "",
    cidade_nasc: "",
    estado_nasc: "",
    endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
    conjuge: "",
    filhos: [""],
    cor_pele: "",
    cor_cabelo: "",
    cor_olhos: "",
    altura: "",
    peso: "",
    observacoes: ""
  });
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [progress, setProgress] = useState(0);

  const handleLogin = (password: string) => {
    setCurrentScreen("form");
  };

  const handleFormSubmit = (data: MissingPersonFormData) => {
    setFormData(data);
    setCurrentScreen("validation");
  };

  const handleEditForm = () => {
    setCurrentScreen("form");
  };

  const handleStartSearch = () => {
    setCurrentScreen("search");
    // Simulate search delay
    setTimeout(() => {
      const results = simulateSearchResults(formData);
      setSearchResults(results);
      setCurrentScreen("results");
    }, 3000);
  };

  const handleNewSearch = () => {
    // Reset form data except for the password
    setFormData({
      nome: "",
      cpf: "",
      foto: null,
      fotoPreview: undefined,
      mae: "",
      pai: "",
      irmao_novo: "",
      irmao_velho: "",
      celular: "",
      cidade_nasc: "",
      estado_nasc: "",
      endereco: "",
      bairro: "",
      cidade: "",
      estado: "",
      conjuge: "",
      filhos: [""],
      cor_pele: "",
      cor_cabelo: "",
      cor_olhos: "",
      altura: "",
      peso: "",
      observacoes: ""
    });
    setProgress(0);
    setCurrentScreen("form");
  };
  
  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
  };

  return (
    <div id="app" className="relative">
      {currentScreen === "login" && (
        <LoginScreen onLogin={handleLogin} />
      )}
      
      {currentScreen === "form" && (
        <FormScreen 
          formData={formData} 
          onSubmit={handleFormSubmit} 
          progress={progress}
          updateProgress={updateProgress}
        />
      )}
      
      {currentScreen === "validation" && (
        <ValidationScreen 
          formData={formData} 
          onEdit={handleEditForm} 
          onStartSearch={handleStartSearch} 
        />
      )}
      
      {currentScreen === "search" && (
        <SearchScreen 
          formData={formData}
        />
      )}
      
      {currentScreen === "results" && searchResults && (
        <ResultsScreen 
          results={searchResults} 
          onNewSearch={handleNewSearch} 
        />
      )}
    </div>
  );
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MissingPersonFormData, SearchResults } from "./types";

/**
 * Combines multiple class names into a single string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Takes a File object and returns a data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Formats a CPF string (Brazilian ID)
 */
export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
}

/**
 * Formats a Brazilian phone number
 */
export function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

/**
 * Creates a simulated search results based on form data
 */
export function simulateSearchResults(formData: MissingPersonFormData): SearchResults {
  // Randomly decide if we found results or not
  const found = Math.random() > 0.3;
  
  if (!found) {
    return {
      person: {
        nome: formData.nome,
        altura: formData.altura,
        cor_cabelo: formData.cor_cabelo,
        fotoPreview: formData.fotoPreview,
        idade: "37",
        summary: "Nenhuma informação recente encontrada."
      },
      results: [],
      recommendations: [
        {
          title: "Registro de Desaparecimento",
          description: "Registrar boletim de ocorrência na delegacia mais próxima"
        },
        {
          title: "Ampliar a Busca",
          description: "Compartilhar informações em grupos e comunidades locais"
        },
        {
          title: "Agendar Nova Busca",
          description: "Repetir a busca após 24 horas para verificar novas informações"
        }
      ],
      found: false
    };
  }
  
  // Generate fake but consistent results for demo
  return {
    person: {
      nome: formData.nome,
      altura: formData.altura,
      cor_cabelo: formData.cor_cabelo,
      fotoPreview: formData.fotoPreview,
      idade: "37",
      summary: "Última informação registrada: " + new Date().toLocaleDateString('pt-BR')
    },
    results: [
      {
        type: "location",
        title: "Hospital Regional de São Paulo",
        description: "Av. Brigadeiro Faria Lima, 5544 - Vila Olímpia, São Paulo/SP",
        date: "15/05/2023 às 14:30",
        link: "https://www.openstreetmap.org/search?query=S%C3%A3o%20Paulo",
        linkText: "Ver no OpenMap",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
      },
      {
        type: "social",
        title: "Perfil encontrado",
        description: "Atividade recente em grupo 'Moradores de Vila Nova'",
        date: "20/05/2023",
        link: "#",
        linkText: "Ver perfil",
        platform: "Facebook",
        image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
      }
    ],
    recommendations: [
      {
        title: "Contatar o Hospital Regional",
        description: "Telefone: (11) 3456-7890"
      },
      {
        title: "Enviar mensagem via Facebook",
        description: "Utilize o link do perfil acima para entrar em contato"
      }
    ],
    found: true
  };
}

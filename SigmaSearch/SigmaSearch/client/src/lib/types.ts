export interface MissingPersonFormData {
  nome: string;
  cpf: string;
  foto: File | null;
  fotoPreview?: string;
  mae: string;
  pai: string;
  irmao_novo: string;
  irmao_velho: string;
  celular: string;
  cidade_nasc: string;
  estado_nasc: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  conjuge: string;
  filhos: string[];
  cor_pele: string;
  cor_cabelo: string;
  cor_olhos: string;
  altura: string;
  peso: string;
  observacoes: string;
}

export interface SearchResult {
  type: "location" | "social" | "none";
  title: string;
  description: string;
  date: string;
  link?: string;
  linkText?: string;
  image?: string;
  platform?: string;
}

export type SearchResults = {
  person: {
    nome: string;
    altura: string;
    cor_cabelo: string;
    fotoPreview?: string;
    idade?: string;
    summary?: string;
  };
  results: SearchResult[];
  recommendations: {
    title: string;
    description: string;
  }[];
  found: boolean;
}

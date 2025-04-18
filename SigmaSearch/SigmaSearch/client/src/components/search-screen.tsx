import React from "react";
import { MissingPersonFormData } from "@/lib/types";
import { SEARCH_SOURCES } from "@/lib/constants";

interface SearchScreenProps {
  formData: MissingPersonFormData;
}

export default function SearchScreen({ formData }: SearchScreenProps) {
  return (
    <div id="search-screen">
      <div className="bg-primary/60 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg border border-secondary grid-pattern glowing-border mb-8">
        <h2 className="font-exo text-2xl mb-6 text-center">Busca em Andamento</h2>
        
        <div id="search-progress" className="space-y-6">
          <div className="space-y-4">
            {/* Public Organizations Search */}
            <div className="relative overflow-hidden rounded-lg bg-primary-dark p-4 animate-scanning">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Órgãos Públicos</h4>
                  <p className="text-sm text-accent-light">
                    Buscando em {SEARCH_SOURCES.PUBLIC_ORGS.join(', ')}...
                  </p>
                </div>
              </div>
            </div>
            
            {/* Social Networks Search */}
            <div className="relative overflow-hidden rounded-lg bg-primary-dark p-4 animate-scanning">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Redes Sociais</h4>
                  <p className="text-sm text-accent-light">
                    Verificando {SEARCH_SOURCES.SOCIAL_NETWORKS.join(', ')}...
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-block animate-spin h-8 w-8 border-t-2 border-accent rounded-full mb-3"></div>
            <p className="text-accent-light">
              Buscando por <span id="search-name" className="font-medium text-white">{formData.nome || 'Nome da Pessoa'}</span>...
            </p>
            <p className="text-xs">Este processo pode levar alguns minutos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Button } from "@/components/ui/button";
import { SearchResults } from "@/lib/types";
import { ExternalLink } from "lucide-react";

interface ResultsScreenProps {
  results: SearchResults;
  onNewSearch: () => void;
}

export default function ResultsScreen({ results, onNewSearch }: ResultsScreenProps) {
  if (!results.found) {
    return (
      <div id="results-screen">
        <div className="bg-primary/60 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg border border-secondary grid-pattern glowing-border mb-8">
          <h2 className="font-exo text-2xl mb-6 text-center">Resultados da Busca</h2>
          
          <div id="no-results-content" className="space-y-6 text-center">
            <div className="py-6">
              <div className="w-20 h-20 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-exo text-xl text-accent mb-2">Nenhum resultado encontrado</h3>
              <p className="text-accent-light max-w-md mx-auto">Infelizmente não encontramos registros correspondentes nas fontes de dados pesquisadas.</p>
            </div>
            
            <div className="border-t border-secondary pt-6">
              <h3 className="font-exo text-lg text-accent mb-4">Ações Recomendadas</h3>
              <div className="space-y-3 max-w-md mx-auto">
                {results.recommendations.map((recommendation, index) => (
                  <div key={index} className="bg-secondary/30 rounded-lg p-4 text-left">
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{recommendation.title}</h4>
                        <p className="text-sm text-accent-light">{recommendation.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button 
                type="button" 
                variant="gradient"
                className="rounded-lg text-white py-3 px-8 font-medium shadow-lg"
                onClick={onNewSearch}
              >
                Nova Busca
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="results-screen">
      <div className="bg-primary/60 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg border border-secondary grid-pattern glowing-border mb-8">
        <h2 className="font-exo text-2xl mb-6 text-center">Resultados da Busca</h2>
        
        <div id="results-content" className="space-y-6">
          <div className="flex items-start space-x-4 mb-8">
            <div id="result-photo" className="w-24 h-24 bg-primary-light rounded-lg flex-shrink-0 border border-secondary overflow-hidden">
              {results.person.fotoPreview ? (
                <img src={results.person.fotoPreview} alt="Foto do desaparecido" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-light">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-exo text-xl text-accent mb-1">{results.person.nome}</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-block bg-accent/20 px-2 py-1 rounded text-xs">{results.person.idade} anos</span>
                <span className="inline-block bg-accent/20 px-2 py-1 rounded text-xs">{results.person.altura} cm</span>
                <span className="inline-block bg-accent/20 px-2 py-1 rounded text-xs">Cabelo {results.person.cor_cabelo}</span>
              </div>
              <p className="text-sm text-accent-light">{results.person.summary}</p>
            </div>
          </div>
          
          <div className="results-grid">
            {results.results.map((result, index) => (
              <div key={index} className="bg-primary-dark rounded-lg overflow-hidden border border-secondary">
                <div className="h-36 bg-primary-light relative">
                  {result.image && (
                    <img 
                      src={result.image} 
                      alt={result.type === 'location' ? 'Mapa da localização' : 'Captura de tela de rede social'} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 to-transparent"></div>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs bg-accent text-primary-dark px-2 py-1 rounded font-medium">
                      {result.type === 'location' ? 'Localização' : result.platform}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-2">{result.title}</h4>
                  <p className="text-sm text-accent-light mb-3">{result.description}</p>
                  <p className="text-xs text-white/70 mb-3">Registrado em: {result.date}</p>
                  {result.link && (
                    <a 
                      href={result.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent text-sm inline-flex items-center"
                    >
                      {result.linkText || 'Ver detalhes'}
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-secondary pt-6">
            <h3 className="font-exo text-lg text-accent mb-4">Ações Recomendadas</h3>
            <div className="space-y-3">
              {results.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-secondary/30 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{recommendation.title}</h4>
                      <p className="text-sm text-accent-light">{recommendation.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button 
              type="button" 
              variant="gradient"
              className="rounded-lg text-white py-3 px-8 font-medium shadow-lg"
              onClick={onNewSearch}
            >
              Nova Busca
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

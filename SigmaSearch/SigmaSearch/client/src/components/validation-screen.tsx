import React from "react";
import { Button } from "@/components/ui/button";
import { MissingPersonFormData } from "@/lib/types";

interface ValidationScreenProps {
  formData: MissingPersonFormData;
  onEdit: () => void;
  onStartSearch: () => void;
}

export default function ValidationScreen({ formData, onEdit, onStartSearch }: ValidationScreenProps) {
  // Format the address for display
  const formatAddress = () => {
    return `${formData.endereco} - ${formData.bairro}, ${formData.cidade}/${formData.estado}`;
  };
  
  // Get label for color values
  const getColorLabel = (type: 'pele' | 'cabelo' | 'olhos', value: string) => {
    const maps = {
      pele: {
        'negra': 'Negra',
        'parda': 'Parda',
        'branca': 'Branca',
        'amarela': 'Amarela',
        'indigena': 'Indígena'
      },
      cabelo: {
        'preto': 'Preto',
        'castanho': 'Castanho',
        'loiro': 'Loiro',
        'ruivo': 'Ruivo',
        'grisalho': 'Grisalho',
        'branco': 'Branco',
        'outro': 'Outro'
      },
      olhos: {
        'castanho': 'Castanho',
        'preto': 'Preto',
        'azul': 'Azul',
        'verde': 'Verde',
        'cinza': 'Cinza',
        'mel': 'Mel'
      }
    };
    
    return maps[type][value as keyof typeof maps[typeof type]] || value;
  };

  return (
    <div id="validation-screen">
      <div className="bg-primary/60 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg border border-secondary grid-pattern glowing-border mb-8">
        <h2 className="font-exo text-2xl mb-6 text-center">Confirmação de Dados</h2>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div id="confirm-photo-preview" className="w-28 h-28 bg-primary-light rounded-lg flex-shrink-0 border border-secondary overflow-hidden">
              {formData.fotoPreview ? (
                <img src={formData.fotoPreview} alt="Foto do desaparecido" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-light">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-exo text-xl text-accent mb-2">{formData.nome || 'Nome Completo'}</h3>
                <p className="text-sm">CPF: {formData.cpf || '000.000.000-00'}</p>
                <p className="text-sm">Celular: {formData.celular || '(00) 00000-0000'}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="inline-block bg-secondary px-2 py-1 rounded text-xs">{formData.altura || '175'} cm</span>
                <span className="inline-block bg-secondary px-2 py-1 rounded text-xs">{formData.peso || '70'} kg</span>
                <span className="inline-block bg-secondary px-2 py-1 rounded text-xs">
                  Pele: {formData.cor_pele ? getColorLabel('pele', formData.cor_pele) : 'Parda'}
                </span>
                <span className="inline-block bg-secondary px-2 py-1 rounded text-xs">
                  Cabelo: {formData.cor_cabelo ? getColorLabel('cabelo', formData.cor_cabelo) : 'Castanho'}
                </span>
                <span className="inline-block bg-secondary px-2 py-1 rounded text-xs">
                  Olhos: {formData.cor_olhos ? getColorLabel('olhos', formData.cor_olhos) : 'Castanhos'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="border-t border-secondary pt-4">
              <h4 className="font-medium text-accent mb-2">Endereço</h4>
              <p className="text-sm">{formatAddress()}</p>
            </div>
            
            <div className="border-t border-secondary pt-4">
              <h4 className="font-medium text-accent mb-2">Filiação</h4>
              <p className="text-sm"><span className="text-accent-light">Mãe:</span> <span>{formData.mae || 'Nome da Mãe'}</span></p>
              <p className="text-sm"><span className="text-accent-light">Pai:</span> <span>{formData.pai || 'Nome do Pai'}</span></p>
            </div>
            
            {formData.observacoes && (
              <div className="border-t border-secondary pt-4">
                <h4 className="font-medium text-accent mb-2">Observações</h4>
                <p className="text-sm">{formData.observacoes}</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-end pt-4">
            <Button 
              type="button" 
              variant="secondary"
              className="bg-secondary-light/50 hover:bg-secondary-light rounded-lg text-white py-2 px-6 font-medium transition-colors"
              onClick={onEdit}
            >
              Editar Dados
            </Button>
            
            <Button 
              type="button" 
              variant="gradient"
              className="rounded-lg text-white py-2 px-6 font-medium shadow-lg"
              onClick={onStartSearch}
            >
              Iniciar Busca
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

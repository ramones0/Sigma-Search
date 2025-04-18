import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ESTADOS_BRASILEIROS, CORES_PELE, CORES_CABELO, CORES_OLHOS } from "@/lib/constants";
import { MissingPersonFormData } from "@/lib/types";
import { formatCPF, formatPhoneNumber, fileToDataUrl } from "@/lib/utils";
import { Plus, Minus, Upload } from "lucide-react";

interface FormScreenProps {
  formData: MissingPersonFormData;
  onSubmit: (data: MissingPersonFormData) => void;
  progress: number;
  updateProgress: (progress: number) => void;
}

export default function FormScreen({ formData, onSubmit, progress, updateProgress }: FormScreenProps) {
  const [data, setData] = useState<MissingPersonFormData>(formData);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  
  // Update form data whenever a field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Format specific fields
    if (name === 'cpf') {
      processedValue = formatCPF(value);
    } else if (name === 'celular') {
      processedValue = formatPhoneNumber(value);
    }
    
    setData({ ...data, [name]: processedValue });
    
    // Clear error on change
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setData({ ...data, [name]: value });
    
    // Clear error on change
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };
  
  // Add more child fields
  const addChildField = () => {
    setData({ ...data, filhos: [...data.filhos, ""] });
  };
  
  // Remove child field
  const removeChildField = (index: number) => {
    const updatedFilhos = [...data.filhos];
    updatedFilhos.splice(index, 1);
    setData({ ...data, filhos: updatedFilhos });
  };
  
  // Update child field
  const updateChildField = (index: number, value: string) => {
    const updatedFilhos = [...data.filhos];
    updatedFilhos[index] = value;
    setData({ ...data, filhos: updatedFilhos });
  };
  
  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await fileToDataUrl(file);
        setData({ ...data, foto: file, fotoPreview: dataUrl });
        
        // Clear error on successful upload
        if (errors['foto']) {
          setErrors({ ...errors, foto: false });
        }
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
  };
  
  // Form validation
  const validateForm = () => {
    const requiredFields = [
      'nome', 'mae', 
      'cor_pele', 'cor_cabelo', 'cor_olhos'
    ];
    
    const newErrors: Record<string, boolean> = {};
    let isValid = true;
    let validCount = 0;
    
    // Foto não é obrigatória, mas se existir, contamos para o progresso
    if (data.foto || data.fotoPreview) {
      validCount++;
    }
    
    // Check other required fields
    requiredFields.forEach(field => {
      const value = data[field as keyof MissingPersonFormData];
      if (!value || value === "selecione") {
        newErrors[field] = true;
        isValid = false;
      } else {
        validCount++;
      }
    });
    
    setErrors(newErrors);
    
    // Calculate progress
    const totalFields = requiredFields.length + 1; // +1 for foto
    const newProgress = Math.round((validCount / totalFields) * 100);
    updateProgress(newProgress);
    
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(data);
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };
  
  // Validate form and calculate progress on mount and data changes
  useEffect(() => {
    validateForm();
  }, []);

  return (
    <div id="form-screen">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="w-full max-w-2xl bg-primary-dark rounded-full h-2.5">
          <div 
            id="progress-bar" 
            className="bg-accent h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-primary/60 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg border border-secondary grid-pattern glowing-border">
        <h2 className="font-exo text-2xl mb-6 text-center">Dados do Desaparecido</h2>
        
        <form id="missing-person-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="font-exo text-xl border-b border-secondary pb-2 text-accent">Informações Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium mb-1">Nome Completo *</label>
                <Input 
                  type="text" 
                  id="nome" 
                  name="nome"
                  value={data.nome}
                  onChange={handleChange}
                  className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                  placeholder="Nome completo"
                  error={errors.nome}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium mb-1">CPF</label>
                <Input 
                  type="text" 
                  id="cpf" 
                  name="cpf"
                  value={data.cpf}
                  onChange={handleChange}
                  className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  error={errors.cpf}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="foto" className="block text-sm font-medium mb-1">Foto Atual</label>
              <div className="flex items-center space-x-4">
                <div 
                  id="photo-preview" 
                  className={`w-24 h-24 bg-primary-light rounded-lg flex items-center justify-center border ${errors.foto ? 'border-red-500' : 'border-secondary'}`}
                >
                  {data.fotoPreview ? (
                    <img src={data.fotoPreview} alt="Foto do desaparecido" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <input 
                    type="file" 
                    id="foto" 
                    name="foto"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                  <Button 
                    type="button" 
                    variant="gradient"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => document.getElementById('foto')?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    Carregar Foto
                  </Button>
                  <p className="text-xs text-accent-light mt-1">Formatos aceitos: JPG, PNG (max. 5MB)</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pai" className="block text-sm font-medium mb-1">Nome do Pai</label>
                <Input 
                  type="text" 
                  id="pai" 
                  name="pai"
                  value={data.pai}
                  onChange={handleChange}
                  className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                  placeholder="Nome completo do pai"
                />
              </div>
              
              <div>
                <label htmlFor="mae" className="block text-sm font-medium mb-1">Nome da Mãe *</label>
                <Input 
                  type="text" 
                  id="mae" 
                  name="mae"
                  value={data.mae}
                  onChange={handleChange}
                  className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                  placeholder="Nome completo da mãe"
                  error={errors.mae}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="irmao_novo" className="block text-sm font-medium mb-1">Nome do Irmão Mais Novo</label>
                <Input 
                  type="text" 
                  id="irmao_novo" 
                  name="irmao_novo"
                  value={data.irmao_novo}
                  onChange={handleChange}
                  className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                  placeholder="Nome do irmão mais novo"
                />
              </div>
              
              <div>
                <label htmlFor="irmao_velho" className="block text-sm font-medium mb-1">Nome do Irmão Mais Velho</label>
                <Input 
                  type="text" 
                  id="irmao_velho" 
                  name="irmao_velho"
                  value={data.irmao_velho}
                  onChange={handleChange}
                  className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                  placeholder="Nome do irmão mais velho"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="celular" className="block text-sm font-medium mb-1">Número de Celular</label>
              <Input 
                type="tel" 
                id="celular" 
                name="celular"
                value={data.celular}
                onChange={handleChange}
                className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                placeholder="(00) 00000-0000"
                maxLength={15}
                error={errors.celular}
              />
            </div>
          </div>
          
          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="font-exo text-xl border-b border-secondary pb-2 text-accent">Localização</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cidade_nasc" className="block text-sm font-medium mb-1">Cidade de Nascimento</label>
                <Input 
                  type="text" 
                  id="cidade_nasc" 
                  name="cidade_nasc"
                  value={data.cidade_nasc}
                  onChange={handleChange}
                  className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                  placeholder="Cidade"
                  error={errors.cidade_nasc}
                />
              </div>
              
              <div>
                <label htmlFor="estado_nasc" className="block text-sm font-medium mb-1">Estado de Nascimento</label>
                <Select
                  value={data.estado_nasc}
                  onValueChange={(value) => handleSelectChange('estado_nasc', value)}
                >
                  <SelectTrigger 
                    id="estado_nasc"
                    className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                    error={errors.estado_nasc}
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS_BRASILEIROS.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>{estado.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label htmlFor="endereco" className="block text-sm font-medium mb-1">Último Endereço Residencial</label>
              <Input 
                type="text" 
                id="endereco" 
                name="endereco"
                value={data.endereco}
                onChange={handleChange}
                className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                placeholder="Rua, Número"
                error={errors.endereco}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="bairro" className="block text-sm font-medium mb-1">Bairro</label>
                <Input 
                  type="text" 
                  id="bairro" 
                  name="bairro"
                  value={data.bairro}
                  onChange={handleChange}
                  className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                  placeholder="Bairro"
                  error={errors.bairro}
                />
              </div>
              
              <div>
                <label htmlFor="cidade" className="block text-sm font-medium mb-1">Cidade</label>
                <Input 
                  type="text" 
                  id="cidade" 
                  name="cidade"
                  value={data.cidade}
                  onChange={handleChange}
                  className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                  placeholder="Cidade"
                  error={errors.cidade}
                />
              </div>
              
              <div>
                <label htmlFor="estado" className="block text-sm font-medium mb-1">Estado</label>
                <Select
                  value={data.estado}
                  onValueChange={(value) => handleSelectChange('estado', value)}
                >
                  <SelectTrigger 
                    id="estado"
                    className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                    error={errors.estado}
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS_BRASILEIROS.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>{estado.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Family Information */}
          <div className="space-y-4">
            <h3 className="font-exo text-xl border-b border-secondary pb-2 text-accent">Informações Familiares</h3>
            
            <div>
              <label htmlFor="conjuge" className="block text-sm font-medium mb-1">Cônjuge</label>
              <Input 
                type="text" 
                id="conjuge" 
                name="conjuge"
                value={data.conjuge}
                onChange={handleChange}
                className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                placeholder="Nome completo do cônjuge"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Filhos</label>
              <div id="filhos-container" className="space-y-2">
                {data.filhos.map((filho, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      type="text" 
                      value={filho}
                      onChange={(e) => updateChildField(index, e.target.value)}
                      className="flex-1 rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                      placeholder="Nome do filho"
                    />
                    {index === 0 ? (
                      <Button 
                        type="button" 
                        variant="secondary"
                        className="bg-secondary rounded-lg text-white py-2 px-3 text-sm font-medium hover:bg-secondary-light"
                        onClick={addChildField}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        type="button" 
                        variant="secondary"
                        className="bg-secondary/70 hover:bg-secondary rounded-lg text-white py-2 px-3 text-sm font-medium"
                        onClick={() => removeChildField(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Physical Characteristics */}
          <div className="space-y-4">
            <h3 className="font-exo text-xl border-b border-secondary pb-2 text-accent">Características Físicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="cor_pele" className="block text-sm font-medium mb-1">Cor da Pele *</label>
                <Select
                  value={data.cor_pele}
                  onValueChange={(value) => handleSelectChange('cor_pele', value)}
                >
                  <SelectTrigger 
                    id="cor_pele"
                    className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                    error={errors.cor_pele}
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {CORES_PELE.map((cor) => (
                      <SelectItem key={cor.value} value={cor.value}>{cor.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="cor_cabelo" className="block text-sm font-medium mb-1">Cor do Cabelo *</label>
                <Select
                  value={data.cor_cabelo}
                  onValueChange={(value) => handleSelectChange('cor_cabelo', value)}
                >
                  <SelectTrigger 
                    id="cor_cabelo"
                    className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                    error={errors.cor_cabelo}
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {CORES_CABELO.map((cor) => (
                      <SelectItem key={cor.value} value={cor.value}>{cor.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="cor_olhos" className="block text-sm font-medium mb-1">Cor dos Olhos *</label>
                <Select
                  value={data.cor_olhos}
                  onValueChange={(value) => handleSelectChange('cor_olhos', value)}
                >
                  <SelectTrigger 
                    id="cor_olhos"
                    className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                    error={errors.cor_olhos}
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {CORES_OLHOS.map((cor) => (
                      <SelectItem key={cor.value} value={cor.value}>{cor.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="altura" className="block text-sm font-medium mb-1">Altura (cm)</label>
                <Input 
                  type="number" 
                  id="altura" 
                  name="altura"
                  value={data.altura}
                  onChange={handleChange}
                  className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                  placeholder="175"
                  min="50"
                  max="250"
                  error={errors.altura}
                />
              </div>
              
              <div>
                <label htmlFor="peso" className="block text-sm font-medium mb-1">Peso Aproximado (kg)</label>
                <Input 
                  type="number" 
                  id="peso" 
                  name="peso"
                  value={data.peso}
                  onChange={handleChange}
                  className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none"
                  placeholder="70"
                  min="3"
                  max="300"
                  error={errors.peso}
                />
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="font-exo text-xl border-b border-secondary pb-2 text-accent">Informações Adicionais</h3>
            
            <div>
              <label htmlFor="observacoes" className="block text-sm font-medium mb-1">Observações Importantes</label>
              <Textarea 
                id="observacoes" 
                name="observacoes"
                value={data.observacoes}
                onChange={handleChange}
                className="w-full rounded-lg py-2 px-3 text-white futuristic-input focus:outline-none h-32"
                placeholder="Informações adicionais relevantes para a busca"
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              variant="gradient"
              className="rounded-lg text-white py-3 px-8 font-medium shadow-lg"
            >
              Concluir
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

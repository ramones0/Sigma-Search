
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function AppNavigation() {
  return (
    <NavigationMenu className="max-w-full w-full justify-start mb-4">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Pessoas Desaparecidas</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px]">
              <ListItem 
                href="/missing-persons/search" 
                title="Buscar Pessoas">
                Procurar por pessoas desaparecidas no sistema
              </ListItem>
              <ListItem 
                href="/missing-persons/register" 
                title="Registrar Novo Caso">
                Cadastrar uma nova pessoa desaparecida
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Veículos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px]">
              <ListItem 
                href="/vehicles/search" 
                title="Rastreamento de Veículos">
                Buscar e rastrear veículos registrados
              </ListItem>
              <ListItem 
                href="/vehicles/register" 
                title="Registrar Veículo">
                Cadastrar um novo veículo para rastreamento
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Humanoides</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px]">
              <ListItem 
                href="/humanoids/search" 
                title="Busca de Humanoides">
                Sistema de busca e identificação de humanoides
              </ListItem>
              <ListItem 
                href="/humanoids/register" 
                title="Registrar Humanoide">
                Cadastrar novo registro de humanoide
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Serviços Públicos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px] md:w-[500px]">
              <ListItem 
                href="/services/security" 
                title="Segurança">
                Localizar delegacias, postos policiais e outros serviços de segurança
              </ListItem>
              <ListItem 
                href="/services/health" 
                title="Saúde">
                Encontrar hospitais, UPAs, postos de saúde e outros serviços médicos
              </ListItem>
              <ListItem 
                href="/services/education" 
                title="Educação">
                Buscar escolas, universidades e instituições de ensino
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

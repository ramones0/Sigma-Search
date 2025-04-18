import React from "react";
import AppHeader from "@/components/app-header";
import AppFooter from "@/components/app-footer";
import AppContainer from "@/components/app-container";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <AppHeader />
      <AppContainer />
      <AppFooter />
    </div>
  );
}

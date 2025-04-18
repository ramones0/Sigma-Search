import React, { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApkDownload from "./apk-download";
import AppNavigation from "./app-navigation";

export default function AppHeader() {
  const [showApkDownload, setShowApkDownload] = useState(false);

  return (
    <header className="mb-8">
      <div className="flex justify-end mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-accent hover:text-accent hover:bg-accent/10"
          onClick={() => setShowApkDownload(true)}
        >
          <Download className="h-4 w-4 mr-1" /> 
          Android APK
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-exo font-bold text-center mb-2">
          <span className="text-accent">SIGMA</span> <span className="text-white">SEARCH</span>
        </h1>
        <p className="text-accent text-lg md:text-xl italic">Global Quântic System</p>
      </div>
      <AppNavigation />

      {showApkDownload && (
        <ApkDownload onClose={() => setShowApkDownload(false)} />
      )}
    </header>
  );
}

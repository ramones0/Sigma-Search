import React from "react";

export default function AppFooter() {
  return (
    <footer className="mt-10 text-center">
      <p className="text-sm text-accent-light mb-2">SIGMA SEARCH - Global Quântic System</p>
      <p className="text-xs text-accent-light/60">
        &copy; {new Date().getFullYear()} GRL CORP. Todos os direitos reservados.
      </p>
    </footer>
  );
}

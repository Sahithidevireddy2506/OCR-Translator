import React from 'react';
import { Shield, Languages } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground leading-tight">
            Bridging Language Barrier
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Languages className="h-3 w-3" />
            Multilingual OCR for Police Records
          </p>
        </div>
      </div>
    </header>
  );
}
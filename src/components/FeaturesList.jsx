import React from 'react';
import { Languages, Brain, Search, FileText, Shield, Wifi } from 'lucide-react';

const features = [
  { icon: Languages, title: 'Telugu, Hindi & English', desc: 'Including mixed-language handwritten text' },
  { icon: Brain, title: 'Smart Recognition', desc: 'Learns handwriting patterns over time' },
  { icon: Search, title: 'Key Info Extraction', desc: 'Names, locations, and crime details' },
  { icon: FileText, title: 'Digital Records', desc: 'Searchable, structured data with summaries' },
  { icon: Shield, title: 'Tamper Detection', desc: 'Flags unclear or altered text' },
  { icon: Wifi, title: 'Offline Ready', desc: 'Works in low-resource environments' },
];

export default function FeaturesList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {features.map((f, i) => (
        <div key={i} className="p-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors">
          <f.icon className="h-5 w-5 text-primary mb-2" />
          <p className="text-xs font-semibold text-foreground leading-tight">{f.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
import React from 'react';
import { Languages, ArrowRight, FileText } from 'lucide-react';
import Button from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LANGUAGES = [
  { value: 'telugu', label: 'Telugu (తెలుగు)' },
  { value: 'hindi', label: 'Hindi (हिन्दी)' },
  { value: 'english', label: 'English' },
];

export default function LanguageChoice({ mode, setMode, targetLanguage, setTargetLanguage, onProcess }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <Languages className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Output Language</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => setMode('same')}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            mode === 'same'
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-border hover:border-primary/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
              mode === 'same' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-sm">Same Language</p>
              <p className="text-xs text-muted-foreground">Keep original language</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setMode('translate')}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            mode === 'translate'
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-border hover:border-primary/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
              mode === 'translate' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              <Languages className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-sm">Translate</p>
              <p className="text-xs text-muted-foreground">Convert to another language</p>
            </div>
          </div>
        </button>
      </div>

      {mode === 'translate' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Translate to:</label>
          <select
  value={targetLanguage}
  onChange={(e) => setTargetLanguage(e.target.value)}
  className="p-2 border rounded w-full"
>
  <option value="">Select language</option>
  {LANGUAGES.map((lang) => (
    <option key={lang.value} value={lang.value}>
      {lang.label}
    </option>
  ))}
</select>
        </div>
      )}

      <button
  onClick={onProcess}
  disabled={mode === 'translate' && !targetLanguage}
  className="w-full gap-2 rounded-xl h-12 text-base border p-2"
>
  Process Document
</button>
    </div>
  );
}
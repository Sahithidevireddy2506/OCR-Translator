import React, { useState } from 'react';
import { Copy, Check, FileText, User, MapPin, AlertTriangle, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

function InfoBadge({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/50 border border-border">
      <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function ResultDisplay({ result, onReset }) {
  const [copied, setCopied] = useState(null);

  const copyText = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyButton = ({ text, label }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyText(text, label)}
      className="gap-1.5 text-xs h-8"
    >
      {copied === label ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied === label ? 'Copied' : 'Copy'}
    </Button>
  );

  return (
    <div className="space-y-4">
      {/* Detected Language */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className="rounded-lg px-3 py-1 text-xs">
          Detected: {result.detected_language}
        </Badge>
        {result.output_language && result.output_language !== result.detected_language && (
          <Badge className="rounded-lg px-3 py-1 text-xs bg-primary text-primary-foreground">
            Translated to: {result.output_language}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="w-full rounded-xl bg-muted">
          <TabsTrigger value="text" className="flex-1 rounded-lg gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Document Text
          </TabsTrigger>
          <TabsTrigger value="details" className="flex-1 rounded-lg gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Key Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-4 space-y-4">
          {/* Extracted / Translated Text */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-sm font-medium text-foreground">
                {result.output_language && result.output_language !== result.detected_language
                  ? 'Translated Text'
                  : 'Extracted Text'}
              </p>
              <CopyButton text={result.corrected_text || result.extracted_text} label="main" />
            </div>
            <div className="p-4">
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {result.corrected_text || result.extracted_text}
              </p>
            </div>
          </div>

          {/* Summary */}
          {result.summary && (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-sm font-medium text-foreground">Summary</p>
                <CopyButton text={result.summary} label="summary" />
              </div>
              <div className="p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
              </div>
            </div>
          )}

          {/* Corrections */}
          {result.corrections && result.corrections.length > 0 && (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  Auto-Corrections Applied
                </p>
              </div>
              <div className="p-4 space-y-2">
                {result.corrections.map((c, i) => (
                  <div key={i} className="text-xs flex items-center gap-2">
                    <span className="line-through text-destructive">{c.original}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-green-600 font-medium">{c.corrected}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="details" className="mt-4 space-y-4">
          {/* Key Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.names && result.names.length > 0 && (
              <InfoBadge icon={User} label="Names" value={result.names.join(', ')} />
            )}
            {result.locations && result.locations.length > 0 && (
              <InfoBadge icon={MapPin} label="Locations" value={result.locations.join(', ')} />
            )}
            {result.crime_details && (
              <InfoBadge icon={AlertTriangle} label="Crime Details" value={result.crime_details} />
            )}
          </div>

          {/* Tampering warnings */}
          {result.tampering_notes && (
            <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/20">
              <p className="text-sm font-medium text-destructive flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4" />
                Document Integrity Notes
              </p>
              <p className="text-xs text-destructive/80">{result.tampering_notes}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Button
        onClick={onReset}
        variant="outline"
        className="w-full gap-2 rounded-xl h-11"
      >
        <RotateCcw className="h-4 w-4" />
        Scan Another Document
      </Button>
    </div>
  );
}
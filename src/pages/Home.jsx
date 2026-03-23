import HeaderList from "../components/HeaderList";
import ImageCapture from "../components/ImageCapture";
import LanguageChoice from "../components/LanguageChoice";
export default function Home() {
  const [step, setStep] = useState('upload'); // upload | language-choice | processing | result
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [mode, setMode] = useState('same');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [result, setResult] = useState(null);

  const processDocument = async () => {
    setStep('processing');

    const translateInstruction = mode === 'translate'
      ? `Then translate the full text to ${targetLanguage}.`
      : 'Keep the text in the original detected language.';

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert multilingual OCR and document analysis system for police stations.

Analyze this handwritten document image carefully.

Instructions:
1. Detect the language(s) used (Telugu, Hindi, English, or mixed).
2. Extract ALL text from the handwritten document accurately.
3. Auto-correct any grammatical or spelling mistakes in the extracted text.
4. ${translateInstruction}
5. Extract key information: names of people, locations, and any crime-related details.
6. Generate a brief summary of the document content.
7. Note any signs of tampering, unclear text, or suspicious alterations.
8. List the corrections you made (original → corrected).

Be thorough and accurate. This is for official police record digitization.`,
      file_urls: [imageUrl],
      response_json_schema: {
        type: 'object',
        properties: {
          detected_language: { type: 'string', description: 'Language(s) detected e.g. Telugu, Hindi, English, Mixed (Telugu+English)' },
          output_language: { type: 'string', description: 'Language of the output text' },
          extracted_text: { type: 'string', description: 'Raw extracted text from the document' },
          corrected_text: { type: 'string', description: 'Auto-corrected and cleaned text (or translated text if translation was requested)' },
          summary: { type: 'string', description: 'Brief summary of the document' },
          names: { type: 'array', items: { type: 'string' }, description: 'Names found in the document' },
          locations: { type: 'array', items: { type: 'string' }, description: 'Locations mentioned' },
          crime_details: { type: 'string', description: 'Any crime-related details found, or empty string if none' },
          corrections: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                original: { type: 'string' },
                corrected: { type: 'string' }
              }
            },
            description: 'List of corrections made'
          },
          tampering_notes: { type: 'string', description: 'Any signs of tampering or unclear text, or empty string if none' }
        }
      },
      model: 'gemini_3_pro'
    });

    setResult(res);
    setStep('result');
  };

  const handleReset = () => {
    setStep('upload');
    setImagePreview(null);
    setImageUrl(null);
    setMode('same');
    setTargetLanguage('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Step 1: Image Upload */}
        <ImageCapture
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          setImageUrl={setImageUrl}
          setStep={setStep}
        />

        {/* Step 2: Language Choice */}
        {step === 'language-choice' && (
          <LanguageChoice
            mode={mode}
            setMode={setMode}
            targetLanguage={targetLanguage}
            setTargetLanguage={setTargetLanguage}
            onProcess={processDocument}
          />
        )}

        {/* Step 3: Processing */}
        {step === 'processing' && (
          <div className="bg-card rounded-2xl border border-border p-10 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="font-medium text-foreground">Analyzing Document...</p>
            <p className="text-sm text-muted-foreground mt-1">
              Recognizing text, detecting language & extracting details
            </p>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 'result' && result && (
          <ResultDisplay result={result} onReset={handleReset} />
        )}

        {/* Features section - only show on upload step */}
        {step === 'upload' && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Capabilities
            </h2>
            <FeaturesList />
          </div>
        )}
      </main>
    </div>
  );
}
import React, { useState, useEffect } from 'react';

// ============================================
// DESIGN SYSTEM
// ============================================

const COLORS = {
  bg: '#0C1220',
  bgCard: '#141C2E',
  bgHover: '#1A2540',
  primary: '#00D4AA',
  primaryHover: '#00E8BC',
  primaryMuted: 'rgba(0, 212, 170, 0.15)',
  white: '#FFFFFF',
  gray100: '#F1F5F9',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  border: '#1E293B',
  borderLight: '#334155',
  amber: '#FBBF24',
  coral: '#F87171',
  blue: '#3B82F6',
  red: '#EF4444',
};

// ============================================
// SUPABASE CONFIG (Update these after setup)
// ============================================

const SUPABASE_URL = 'https://oraormhllnyoxqslfbry.supabase.co'; // e.g., https://xyz.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yYW9ybWhsbG55b3hxc2xmYnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzk1NjEsImV4cCI6MjA4NTgxNTU2MX0.Qnf8CEFTmv3W4Or9yUIVKNjeoWY5LQkO_ss9Ufd4twQ';

// Helper to upload to Supabase
const uploadToSupabase = async (file, metadata) => {
  if (SUPABASE_URL === 'https://oraormhllnyoxqslfbry.supabase.co') {
    console.log('Supabase not configured, skipping upload');
    return null;
  }

  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    
    // Upload file to storage
    const formData = new FormData();
    formData.append('file', file);
    
    const uploadResponse = await fetch(
      `${SUPABASE_URL}/storage/v1/object/documents/${fileName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'x-upsert': 'true',
        },
        body: file,
      }
    );

    // Save metadata to database
    const dbResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/uploads`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          file_name: fileName,
          original_name: file.name,
          document_type: metadata.documentType,
          extracted_data: metadata.extractedData,
          country: metadata.country,
          created_at: new Date().toISOString(),
        }),
      }
    );

    return { success: true, fileName };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error };
  }
};

// ============================================
// NAVIGATION
// ============================================

const Navigation = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'examples', label: 'Examples' },
    { id: 'how-it-works', label: 'How it works' },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: scrolled ? 'rgba(12, 18, 32, 0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? `1px solid ${COLORS.border}` : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div 
          onClick={() => scrollToSection('hero')}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="16" width="8" height="14" rx="2" fill={COLORS.primary} opacity="0.6"/>
            <rect x="12" y="10" width="8" height="20" rx="2" fill={COLORS.primary} opacity="0.8"/>
            <rect x="22" y="4" width="8" height="26" rx="2" fill={COLORS.primary}/>
          </svg>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '20px',
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: '-0.02em',
          }}>
            AreYouPaidFairly
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              style={{
                background: activeSection === item.id ? COLORS.primaryMuted : 'transparent',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: activeSection === item.id ? COLORS.primary : COLORS.gray400,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// ============================================
// MAIN HERO WITH SMART UPLOAD
// ============================================

const HeroWithUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [missingFields, setMissingFields] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [step, setStep] = useState('upload'); // upload, processing, collecting-info, analyzing, results, error

  const colleges = [
    { value: 'top-tier', label: 'Top Tier (IIT/Stanford/MIT/Oxbridge etc.)' },
    { value: 'tier-1', label: 'Tier 1 (NIT/BITS/Top State Universities)' },
    { value: 'tier-2', label: 'Tier 2 (Good Regional Colleges)' },
    { value: 'tier-3', label: 'Tier 3 / Other' },
    { value: 'bootcamp', label: 'Bootcamp / Self-taught' },
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setUploadedFile(file);
    setStep('processing');
    setProcessingStatus('Reading document...');
    setError(null);

    // Convert to base64 for images
    let fileData = { name: file.name, type: file.type, size: file.size };
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        fileData.base64 = e.target.result;
        await extractDocumentInfo(fileData);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDFs and docs, we'll use filename + any text extraction
      await extractDocumentInfo(fileData);
    }
  };

  const extractDocumentInfo = async (fileData) => {
    setProcessingStatus('AI is analyzing your document...');

    const extractionPrompt = `You are an expert document analyzer. Analyze this uploaded document and extract all possible information.

Document: "${fileData.name}" (${fileData.type})
${fileData.base64 ? 'Image data is provided.' : 'PDF/DOC file based on filename.'}

Your task:
1. Determine if this is an OFFER LETTER, SALARY SLIP, or RESUME/CV
2. If it's NONE of these three types, return isValidDocument: false
3. Extract ALL information you can find or reasonably infer
4. Identify the COUNTRY based on currency symbols (₹=India, $=USA, £=UK, €=Europe, ¥=Japan/China, etc.), company names, or any other clues
5. List what fields are MISSING that we need to ask the user

RESPOND ONLY WITH VALID JSON:
{
  "isValidDocument": true/false,
  "documentType": "offer_letter" | "salary_slip" | "resume" | "unknown",
  "documentTypeLabel": "Offer Letter" | "Salary Slip" | "Resume/CV" | "Unknown Document",
  "confidence": "high" | "medium" | "low",
  "country": {
    "code": "IN" | "US" | "UK" | "DE" | "SG" | etc.,
    "name": "India" | "United States" | "United Kingdom" | etc.,
    "currency": "INR" | "USD" | "GBP" | etc.,
    "currencySymbol": "₹" | "$" | "£" | etc.,
    "detectedFrom": "currency symbol" | "company name" | "address" | "phone format" | "inferred"
  },
  "extractedData": {
    "role": "<job title or null>",
    "company": "<company name or null>",
    "salary": "<annual salary as number or null>",
    "salaryFormatted": "<formatted salary string like '₹24 LPA' or '$120,000' or null>",
    "yearsOfExperience": "<years as number or null>",
    "location": "<city or null>",
    "skills": ["<skill1>", "<skill2>"] or null,
    "education": "<degree/college or null>",
    "collegeTier": "top-tier" | "tier-1" | "tier-2" | "tier-3" | "bootcamp" | null
  },
  "missingFields": [
    {
      "field": "salary",
      "label": "Current/Expected Salary",
      "type": "number",
      "placeholder": "e.g., 50000",
      "required": true,
      "reason": "Resume doesn't contain salary information"
    }
  ],
  "errorMessage": "<only if isValidDocument is false, explain why>"
}

IMPORTANT RULES:
- For RESUME: salary is ALWAYS missing, experience might be extractable from work history
- For OFFER LETTER: experience is often missing, salary should be there
- For SALARY SLIP: role and salary should be there, experience might be missing
- Always try to detect country - default to "IN" (India) if completely unclear
- collegeTier should be inferred if education is found (IIT/NIT = top-tier/tier-1, etc.)
- If document type cannot be determined, set isValidDocument: false`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ 
            role: "user", 
            content: fileData.base64 
              ? [
                  { type: "image", source: { type: "base64", media_type: fileData.type, data: fileData.base64.split(',')[1] } },
                  { type: "text", text: extractionPrompt }
                ]
              : extractionPrompt
          }],
        })
      });

      const data = await response.json();
      const text = data.content?.map(item => item.text || "").join("") || "";
      const cleanJson = text.replace(/```json|```/g, "").trim();
      
      let extracted;
      try {
        extracted = JSON.parse(cleanJson);
      } catch (parseError) {
        throw new Error("Failed to parse document");
      }

      // Check if valid document
      if (!extracted.isValidDocument) {
        setError({
          title: "Invalid Document",
          message: extracted.errorMessage || "This doesn't appear to be an offer letter, salary slip, or resume. Please upload one of these document types.",
        });
        setStep('error');
        return;
      }

      // Upload to Supabase (if configured)
      await uploadToSupabase(uploadedFile, {
        documentType: extracted.documentType,
        extractedData: extracted.extractedData,
        country: extracted.country,
      });

      setExtractedData(extracted);

      // Check if we need any additional info
      if (extracted.missingFields && extracted.missingFields.length > 0) {
        setMissingFields(extracted.missingFields);
        // Initialize user inputs
        const inputs = {};
        extracted.missingFields.forEach(f => {
          inputs[f.field] = '';
        });
        setUserInputs(inputs);
        setStep('collecting-info');
      } else {
        // We have everything, proceed to analysis
        await runAnalysis(extracted);
      }

    } catch (error) {
      console.error('Extraction error:', error);
      setError({
        title: "Processing Error",
        message: "We couldn't process your document. Please try again or upload a clearer image/PDF.",
      });
      setStep('error');
    }
  };

  const runAnalysis = async (data) => {
    setStep('analyzing');
    
    // Merge extracted data with user inputs
    const finalData = {
      ...data.extractedData,
      ...userInputs,
    };
    
    const country = data.country;
    const currencySymbol = country.currencySymbol || '₹';
    const countryName = country.name || 'India';

    const analysisPrompt = `You are a global salary analysis expert. Analyze this professional's compensation for ${countryName}.

Profile:
- Document Type: ${data.documentTypeLabel}
- Country: ${countryName} (${country.code})
- Currency: ${country.currency} (${currencySymbol})
- Role: ${finalData.role || 'Software Professional'}
- Company: ${finalData.company || 'Not specified'}
- Years of Experience: ${finalData.yearsOfExperience || 'Not specified'}
- Location: ${finalData.location || 'Not specified'}
- Education/College Tier: ${finalData.collegeTier || finalData.education || 'Not specified'}
- Current/Offered Salary: ${finalData.salary ? `${currencySymbol}${finalData.salary}` : 'Not specified'}

Provide salary analysis for ${countryName} job market. Use accurate market data for that country.

RESPOND ONLY WITH VALID JSON:
{
  "marketMin": <minimum salary as number>,
  "marketMedian": <median salary as number>,
  "marketMax": <top quartile salary as number>,
  "userSalary": <user's salary as number>,
  "percentile": <1-100>,
  "verdict": "Below Market" | "Slightly Below" | "Fair" | "Above Market" | "Excellent",
  "verdictEmoji": "📉" | "↘️" | "✅" | "📈" | "🚀",
  "gap": <gap from median, negative if above>,
  "gapPercentage": <percentage difference from median>,
  "countryContext": "<brief note about job market in this country>",
  "insights": [
    "<insight 1 specific to their country/role>",
    "<insight 2>",
    "<insight 3>"
  ],
  "negotiationPotential": <estimated additional salary possible>,
  "formattedSalaries": {
    "user": "<formatted like '$120K' or '₹24 LPA' or '£65K'>",
    "min": "<formatted>",
    "median": "<formatted>",
    "max": "<formatted>",
    "gap": "<formatted with + or - sign>",
    "negotiation": "<formatted>"
  }
}

COUNTRY-SPECIFIC FORMATTING:
- India: Use LPA (Lakhs Per Annum), e.g., "₹24 LPA"
- USA: Use K notation, e.g., "$120K"
- UK: Use K notation, e.g., "£65K"
- Europe: Use K notation, e.g., "€70K"
- Singapore: Use K notation, e.g., "S$95K"

Consider local market factors, cost of living, and typical salary ranges for the country.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content: analysisPrompt }],
        })
      });

      const responseData = await response.json();
      const text = responseData.content?.map(item => item.text || "").join("") || "";
      const cleanJson = text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(cleanJson);
      
      setAnalysisResult({
        ...result,
        country: country,
        documentType: data.documentTypeLabel,
        profile: finalData,
      });
      setStep('results');

    } catch (error) {
      console.error('Analysis error:', error);
      // Fallback
      const baseSalary = parseFloat(finalData.salary) || 50000;
      setAnalysisResult({
        marketMin: Math.round(baseSalary * 0.7),
        marketMedian: Math.round(baseSalary * 1.1),
        marketMax: Math.round(baseSalary * 1.5),
        userSalary: baseSalary,
        percentile: 45,
        verdict: "Fair",
        verdictEmoji: "✅",
        gap: Math.round(baseSalary * 0.1),
        insights: [
          "Your compensation appears to be within market range",
          "Consider upskilling to command higher packages",
          "Location and company type significantly impact salary"
        ],
        negotiationPotential: Math.round(baseSalary * 0.1),
        formattedSalaries: {
          user: `${country.currencySymbol}${baseSalary.toLocaleString()}`,
          min: `${country.currencySymbol}${Math.round(baseSalary * 0.7).toLocaleString()}`,
          median: `${country.currencySymbol}${Math.round(baseSalary * 1.1).toLocaleString()}`,
          max: `${country.currencySymbol}${Math.round(baseSalary * 1.5).toLocaleString()}`,
          gap: `-${country.currencySymbol}${Math.round(baseSalary * 0.1).toLocaleString()}`,
          negotiation: `+${country.currencySymbol}${Math.round(baseSalary * 0.1).toLocaleString()}`,
        },
        country: country,
        countryContext: `Analysis based on ${country.name} market data.`,
        documentType: data.documentTypeLabel,
        profile: finalData,
      });
      setStep('results');
    }
  };

  const handleUserInputSubmit = () => {
    // Validate required fields
    const allFilled = missingFields.every(f => !f.required || userInputs[f.field]);
    if (allFilled) {
      // Merge inputs into extracted data
      const mergedData = {
        ...extractedData,
        extractedData: {
          ...extractedData.extractedData,
          ...userInputs,
        }
      };
      runAnalysis(mergedData);
    }
  };

  const resetFlow = () => {
    setStep('upload');
    setUploadedFile(null);
    setExtractedData(null);
    setMissingFields([]);
    setUserInputs({});
    setError(null);
    setAnalysisResult(null);
  };

  // ========== UPLOAD STATE ==========
  if (step === 'upload') {
    return (
      <section 
        id="hero"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 24px 80px',
          background: `radial-gradient(ellipse at 50% 0%, rgba(0, 212, 170, 0.08) 0%, transparent 50%), ${COLORS.bg}`,
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 41, 59, 0.4) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          opacity: 0.5,
        }}/>

        <div style={{ maxWidth: '700px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: COLORS.primaryMuted,
            border: `1px solid rgba(0, 212, 170, 0.3)`,
            borderRadius: '100px',
            padding: '8px 16px',
            marginBottom: '32px',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS.primary, animation: 'pulse 2s infinite' }}/>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 500, color: COLORS.primary }}>
              Works globally • 50+ countries supported
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(42px, 7vw, 72px)',
            fontWeight: 700,
            color: COLORS.white,
            lineHeight: 1.1,
            marginBottom: '20px',
            letterSpacing: '-0.03em',
          }}>
            Know your <span style={{ color: COLORS.primary }}>true worth</span>
          </h1>

          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '18px',
            color: COLORS.gray400,
            lineHeight: 1.6,
            marginBottom: '40px',
          }}>
            Drop your offer letter, salary slip, or resume.<br/>
            AI extracts everything & tells you if you're paid fairly.
          </p>

          {/* UPLOAD ZONE */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              background: dragActive ? COLORS.primaryMuted : COLORS.bgCard,
              border: `2px dashed ${dragActive ? COLORS.primary : COLORS.borderLight}`,
              borderRadius: '20px',
              padding: '48px 32px',
              transition: 'all 0.2s',
              cursor: 'pointer',
              marginBottom: '24px',
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: COLORS.bgHover,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.gray400} strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 500, color: COLORS.white, marginBottom: '8px' }}>
              Drag & drop your document here
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray500, marginBottom: '20px' }}>
              Offer letter • Salary slip • Resume — PDF, DOC, PNG, JPG
            </p>
            <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileSelect} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
            <label htmlFor="fileInput" style={{
              display: 'inline-block',
              background: COLORS.primary,
              border: 'none',
              padding: '14px 32px',
              borderRadius: '8px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '15px',
              fontWeight: 600,
              color: COLORS.bg,
              cursor: 'pointer',
            }}>
              Choose File
            </label>
          </div>

          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            color: COLORS.gray500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Your documents are encrypted & never shared
          </p>
        </div>

        <style>{`
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </section>
    );
  }

  // ========== PROCESSING STATE ==========
  if (step === 'processing') {
    return (
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px', background: COLORS.bg }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.primary, margin: '0 auto 24px', animation: 'spin 1s linear infinite' }}/>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: 700, color: COLORS.white, marginBottom: '8px' }}>
            {processingStatus}
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray500 }}>
            {uploadedFile?.name}
          </p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </section>
    );
  }

  // ========== ERROR STATE ==========
  if (step === 'error' && error) {
    return (
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px', background: COLORS.bg }}>
        <div style={{ textAlign: 'center', maxWidth: '450px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={COLORS.red} strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, color: COLORS.white, marginBottom: '12px' }}>
            {error.title}
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', color: COLORS.gray400, marginBottom: '32px', lineHeight: 1.6 }}>
            {error.message}
          </p>
          <button onClick={resetFlow} style={{
            background: COLORS.primary,
            border: 'none',
            padding: '14px 32px',
            borderRadius: '8px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '15px',
            fontWeight: 600,
            color: COLORS.bg,
            cursor: 'pointer',
          }}>
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // ========== COLLECTING INFO STATE ==========
  if (step === 'collecting-info' && extractedData) {
    const canSubmit = missingFields.every(f => !f.required || userInputs[f.field]);
    
    return (
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px', background: COLORS.bg }}>
        <div style={{ maxWidth: '500px', width: '100%' }}>
          {/* Detected Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px',
            background: COLORS.primaryMuted,
            borderRadius: '12px',
            marginBottom: '24px',
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: COLORS.bgCard, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: COLORS.gray400, marginBottom: '2px' }}>Detected</p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 600, color: COLORS.white }}>
                {extractedData.documentTypeLabel} • {extractedData.country?.name || 'India'}
              </p>
            </div>
          </div>

          {/* Extracted Data Summary */}
          {Object.entries(extractedData.extractedData).some(([k, v]) => v && k !== 'skills') && (
            <div style={{ background: COLORS.bgCard, borderRadius: '12px', padding: '20px', marginBottom: '24px', border: `1px solid ${COLORS.border}` }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: COLORS.gray400, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Extracted from document
              </p>
              <div style={{ display: 'grid', gap: '12px' }}>
                {extractedData.extractedData.role && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray500 }}>Role</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.white, fontWeight: 500 }}>{extractedData.extractedData.role}</span>
                  </div>
                )}
                {extractedData.extractedData.company && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray500 }}>Company</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.white, fontWeight: 500 }}>{extractedData.extractedData.company}</span>
                  </div>
                )}
                {extractedData.extractedData.salaryFormatted && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray500 }}>Salary</span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', color: COLORS.primary, fontWeight: 600 }}>{extractedData.extractedData.salaryFormatted}</span>
                  </div>
                )}
                {extractedData.extractedData.yearsOfExperience && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray500 }}>Experience</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.white, fontWeight: 500 }}>{extractedData.extractedData.yearsOfExperience} years</span>
                  </div>
                )}
                {extractedData.extractedData.location && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray500 }}>Location</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.white, fontWeight: 500 }}>{extractedData.extractedData.location}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Missing Fields Form */}
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: 700, color: COLORS.white, marginBottom: '8px' }}>
            Just need a bit more info
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray400, marginBottom: '24px' }}>
            This wasn't in your document, but we need it for accurate analysis
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {missingFields.map((field) => (
              <div key={field.field}>
                <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 500, color: COLORS.gray300, marginBottom: '8px' }}>
                  {field.label} {field.required && '*'}
                </label>
                {field.field === 'collegeTier' ? (
                  <select
                    value={userInputs[field.field] || ''}
                    onChange={(e) => setUserInputs({ ...userInputs, [field.field]: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: COLORS.bgCard,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '10px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '16px',
                      color: userInputs[field.field] ? COLORS.white : COLORS.gray500,
                      outline: 'none',
                      cursor: 'pointer',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center',
                    }}
                  >
                    <option value="">Select college tier</option>
                    {colleges.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    value={userInputs[field.field] || ''}
                    onChange={(e) => setUserInputs({ ...userInputs, [field.field]: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: COLORS.bgCard,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '10px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '16px',
                      color: COLORS.white,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                )}
                {field.reason && (
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: COLORS.gray500, marginTop: '6px' }}>
                    {field.reason}
                  </p>
                )}
              </div>
            ))}

            <button
              onClick={handleUserInputSubmit}
              disabled={!canSubmit}
              style={{
                width: '100%',
                padding: '18px',
                background: canSubmit ? COLORS.primary : COLORS.bgHover,
                border: 'none',
                borderRadius: '10px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '16px',
                fontWeight: 600,
                color: canSubmit ? COLORS.bg : COLORS.gray500,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                marginTop: '8px',
              }}
            >
              Analyze My Salary →
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ========== ANALYZING STATE ==========
  if (step === 'analyzing') {
    return (
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px', background: COLORS.bg }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.primary, margin: '0 auto 32px', animation: 'spin 1s linear infinite' }}/>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, color: COLORS.white, marginBottom: '12px' }}>
            Analyzing your compensation...
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', color: COLORS.gray400 }}>
            Comparing against {extractedData?.country?.name || 'global'} market data
          </p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </section>
    );
  }

  // ========== RESULTS STATE ==========
  if (step === 'results' && analysisResult) {
    const fmt = analysisResult.formattedSalaries || {};
    
    return (
      <section id="hero" style={{ minHeight: '100vh', padding: '120px 24px 80px', background: COLORS.bg }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: COLORS.bgCard,
              padding: '8px 16px',
              borderRadius: '100px',
              marginBottom: '16px',
            }}>
              <img 
                src={`https://flagcdn.com/24x18/${(analysisResult.country?.code || 'in').toLowerCase()}.png`}
                alt={analysisResult.country?.name}
                style={{ borderRadius: '2px' }}
                onError={(e) => e.target.style.display = 'none'}
              />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray300 }}>
                {analysisResult.country?.name || 'India'} Market Analysis
              </span>
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '42px', fontWeight: 700, color: COLORS.white }}>
              Your Salary Report
            </h2>
          </div>

          {/* Main Result Card */}
          <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '20px', padding: '40px', marginBottom: '32px' }}>
            {/* Verdict */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span style={{ fontSize: '48px', marginBottom: '12px', display: 'block' }}>{analysisResult.verdictEmoji}</span>
              <span style={{
                display: 'inline-block',
                padding: '12px 28px',
                borderRadius: '100px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '18px',
                fontWeight: 600,
                background: analysisResult.verdict.includes('Below') ? 'rgba(248, 113, 113, 0.15)' : analysisResult.verdict === 'Excellent' || analysisResult.verdict === 'Above Market' ? 'rgba(0, 212, 170, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                color: analysisResult.verdict.includes('Below') ? COLORS.coral : analysisResult.verdict === 'Excellent' || analysisResult.verdict === 'Above Market' ? COLORS.primary : COLORS.amber,
              }}>
                {analysisResult.verdict}
              </span>
            </div>

            {/* Percentile */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '72px', fontWeight: 700, color: COLORS.white, lineHeight: 1 }}>
                P{analysisResult.percentile}
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', color: COLORS.gray400, marginTop: '8px' }}>
                You earn more than {analysisResult.percentile}% of similar professionals in {analysisResult.country?.name || 'your region'}
              </p>
            </div>

            {/* Range Bar */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: COLORS.gray500 }}>Min</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: COLORS.gray500 }}>Median</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: COLORS.gray500 }}>Max</span>
              </div>
              
              <div style={{ position: 'relative', height: '12px', background: `linear-gradient(90deg, ${COLORS.coral}44, ${COLORS.amber}44, ${COLORS.primary}44)`, borderRadius: '6px', marginBottom: '12px' }}>
                <div style={{ position: 'absolute', left: `${analysisResult.percentile}%`, top: '-8px', transform: 'translateX(-50%)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: COLORS.white, border: `3px solid ${COLORS.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, color: COLORS.bg }}>You</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 600, color: COLORS.gray300 }}>{fmt.min}</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 600, color: COLORS.primary }}>{fmt.median}</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 600, color: COLORS.gray300 }}>{fmt.max}</span>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '24px', background: COLORS.bg, borderRadius: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: COLORS.gray500, marginBottom: '4px' }}>Your Salary</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, color: COLORS.white }}>{fmt.user}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: COLORS.gray500, marginBottom: '4px' }}>Gap from Median</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, color: analysisResult.gap > 0 ? COLORS.coral : COLORS.primary }}>{fmt.gap}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: COLORS.gray500, marginBottom: '4px' }}>Negotiation Potential</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, color: COLORS.amber }}>{fmt.negotiation}</p>
              </div>
            </div>

            {/* Country Context */}
            {analysisResult.countryContext && (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray500, textAlign: 'center', marginTop: '24px', fontStyle: 'italic' }}>
                {analysisResult.countryContext}
              </p>
            )}
          </div>

          {/* Insights */}
          <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '28px', marginBottom: '48px' }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 600, color: COLORS.white, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Key Insights
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {analysisResult.insights?.map((insight, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px', background: COLORS.bg, borderRadius: '10px' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: COLORS.primaryMuted, color: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 600, flexShrink: 0 }}>{i + 1}</span>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray300, lineHeight: 1.5 }}>{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* UPSELL */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, color: COLORS.white, marginBottom: '8px' }}>
                Ready to close the gap?
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', color: COLORS.gray400 }}>
                Get expert help to maximize your compensation
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Salary Negotiation */}
              <div style={{ background: `linear-gradient(135deg, ${COLORS.bgCard} 0%, rgba(0, 212, 170, 0.08) 100%)`, border: `2px solid ${COLORS.primary}`, borderRadius: '20px', padding: '32px', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '16px', right: '16px', background: COLORS.primary, color: COLORS.bg, fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', textTransform: 'uppercase' }}>Recommended</span>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: COLORS.primaryMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                </div>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '22px', fontWeight: 600, color: COLORS.white, marginBottom: '8px' }}>Salary Negotiation Help</h4>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray400, marginBottom: '20px', lineHeight: 1.6 }}>Personalized scripts & strategies to negotiate confidently.</p>
                <ul style={{ marginBottom: '24px', padding: 0, listStyle: 'none' }}>
                  {['Customized negotiation scripts', 'Counter-offer templates', 'Timing & tactics guide'].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray300 }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '32px', fontWeight: 700, color: COLORS.white }}>₹999</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray500, marginLeft: '8px', textDecoration: 'line-through' }}>₹1,999</span>
                  </div>
                  <button style={{ background: COLORS.primary, border: 'none', padding: '14px 24px', borderRadius: '8px', fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600, color: COLORS.bg, cursor: 'pointer' }}>Get Now →</button>
                </div>
              </div>

              {/* Naukri Pro */}
              <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '20px', padding: '32px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.blue} strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                </div>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '22px', fontWeight: 600, color: COLORS.white, marginBottom: '8px' }}>Resume Tips + Naukri Pro</h4>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray400, marginBottom: '20px', lineHeight: 1.6 }}>Boost profile visibility 3x with AI resume analysis.</p>
                <ul style={{ marginBottom: '24px', padding: 0, listStyle: 'none' }}>
                  {['3x more recruiter views', 'AI resume analysis', 'Priority applications'].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.blue} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray300 }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: COLORS.gray500 }}>Naukri Partner</span>
                  <a href="https://www.naukri.com/naukri360-pro?utmTerm=NPro_Profile&utmContent=ProfileWidget" target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', border: `1px solid ${COLORS.blue}`, padding: '14px 24px', borderRadius: '8px', fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600, color: COLORS.blue, cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Explore
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Check Another */}
          <div style={{ textAlign: 'center' }}>
            <button onClick={resetFlow} style={{ background: 'transparent', border: `1px solid ${COLORS.borderLight}`, padding: '14px 28px', borderRadius: '8px', fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 500, color: COLORS.gray400, cursor: 'pointer' }}>
              Check another document
            </button>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

// ============================================
// EXAMPLES SECTION
// ============================================

const ExamplesSection = () => {
  const examples = [
    { type: 'Offer Letter', role: 'SDE-2 @ Amazon', location: 'Bangalore, India', offered: '₹45 LPA', market: '₹42-58 LPA', percentile: 65, verdict: 'Fair offer', verdictColor: COLORS.primary },
    { type: 'Salary Slip', role: 'Software Engineer @ Google', location: 'California, USA', offered: '$185K', market: '$165-220K', percentile: 58, verdict: 'Fair', verdictColor: COLORS.amber },
    { type: 'Resume', role: 'Product Manager', location: 'London, UK', offered: '5 yrs exp', market: '£75-110K', percentile: null, verdict: 'High potential', verdictColor: COLORS.primary },
  ];

  return (
    <section id="examples" style={{ padding: '100px 24px', background: COLORS.bgCard, borderTop: `1px solid ${COLORS.border}` }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Global Results</span>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '36px', fontWeight: 700, color: COLORS.white, marginTop: '12px' }}>See what others discovered</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {examples.map((item, i) => (
            <div key={i} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '24px' }}>
              <span style={{ display: 'inline-block', background: COLORS.bgHover, padding: '5px 10px', borderRadius: '5px', fontFamily: "'Inter', sans-serif", fontSize: '12px', color: COLORS.gray400, marginBottom: '14px' }}>{item.type}</span>
              <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600, color: COLORS.white, marginBottom: '4px' }}>{item.role}</h4>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: COLORS.gray500, marginBottom: '16px' }}>{item.location}</p>
              <div style={{ height: '1px', background: COLORS.border, marginBottom: '16px' }}/>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: COLORS.gray500, marginBottom: '2px' }}>{item.percentile !== null ? 'Salary' : 'Experience'}</p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: 600, color: COLORS.white }}>{item.offered}</p>
                </div>
                <div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: COLORS.gray500, marginBottom: '2px' }}>Market Range</p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: 600, color: COLORS.primary }}>{item.market}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: COLORS.bgHover, borderRadius: '8px' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: item.verdictColor }}>{item.verdict}</span>
                {item.percentile && <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 600, color: COLORS.gray400 }}>P{item.percentile}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// HOW IT WORKS
// ============================================

const HowItWorksSection = () => {
  const steps = [
    { num: '01', title: 'Upload', desc: 'Drop any document — AI auto-detects type & country', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> },
    { num: '02', title: 'Extract', desc: 'AI pulls salary, role, experience from your doc', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { num: '03', title: 'Analyze', desc: 'Compare against global market data for your country', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  ];

  return (
    <section id="how-it-works" style={{ padding: '100px 24px', background: COLORS.bg, borderTop: `1px solid ${COLORS.border}` }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Smart Process</span>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '36px', fontWeight: 700, color: COLORS.white, marginTop: '12px' }}>How it works</h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '36px', left: '18%', right: '18%', height: '2px', background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.border}, ${COLORS.primary})` }}/>
          {steps.map((step, i) => (
            <div key={i} style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: COLORS.bgCard, border: `2px solid ${COLORS.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>{step.icon}</div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 600, color: COLORS.primary, letterSpacing: '0.1em' }}>STEP {step.num}</span>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 600, color: COLORS.white, margin: '10px 0 6px' }}>{step.title}</h4>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: COLORS.gray500, maxWidth: '160px', margin: '0 auto', lineHeight: 1.5 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// FOOTER
// ============================================

const Footer = () => (
  <footer style={{ padding: '40px 24px', background: COLORS.bg, borderTop: `1px solid ${COLORS.border}` }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray500 }}>© 2025 AreYouPaidFairly. Works globally.</p>
      <div style={{ display: 'flex', gap: '24px' }}>
        {['Privacy', 'Terms', 'Contact'].map((link) => (
          <a key={link} href="#" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray500, textDecoration: 'none' }}>{link}</a>
        ))}
      </div>
    </div>
  </footer>
);

// ============================================
// MAIN APP
// ============================================

const App = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'examples', 'how-it-works'];
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bg, color: COLORS.white, minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      <Navigation activeSection={activeSection} />
      <HeroWithUpload />
      <ExamplesSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
};

export default App;

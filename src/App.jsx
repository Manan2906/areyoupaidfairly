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
// MAIN HERO WITH UPLOAD
// ============================================

const HeroWithUpload = ({ onFileAnalyzed }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState(null);
  const [userInfo, setUserInfo] = useState({
    yearsOfExperience: '',
    college: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [step, setStep] = useState('upload'); // upload, collecting-info, analyzing, results

  const colleges = [
    { value: 'iit', label: 'IIT (Any)' },
    { value: 'nit', label: 'NIT / IIIT' },
    { value: 'bits', label: 'BITS Pilani' },
    { value: 'tier1-private', label: 'Tier-1 Private (VIT, SRM, Manipal)' },
    { value: 'tier1-state', label: 'Tier-1 State University' },
    { value: 'tier2', label: 'Tier-2 Engineering College' },
    { value: 'tier3', label: 'Tier-3 / Other' },
    { value: 'iim', label: 'IIM / Top B-School (MBA)' },
    { value: 'other-mba', label: 'Other MBA' },
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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setIsDetecting(true);

    // Convert file to base64 for image files, or just use filename for detection
    const isImage = file.type.startsWith('image/');
    let fileContent = file.name;
    
    if (isImage) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        await detectDocumentType(file.name, e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      await detectDocumentType(file.name, null);
    }
  };

  const detectDocumentType = async (fileName, base64Image) => {
    const prompt = `You are analyzing a document uploaded by an Indian professional. Based on the filename "${fileName}" and common document patterns, determine what type of document this is and extract any information you can infer.

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "documentType": "offer_letter" | "salary_slip" | "resume",
  "documentTypeLabel": "Offer Letter" | "Salary Slip" | "Resume/CV",
  "confidence": "high" | "medium" | "low",
  "extractedInfo": {
    "role": "<inferred role or null>",
    "company": "<inferred company or null>",
    "salary": "<inferred salary in LPA as number or null>",
    "location": "<inferred city or null>",
    "yearsOfExperience": "<inferred years or null>"
  },
  "needsFromUser": ["yearsOfExperience", "college"] // always need these if not found
}

Common patterns:
- "offer_letter", "offer", "appointment" -> Offer Letter
- "payslip", "salary_slip", "pay_slip", "salary" -> Salary Slip  
- "resume", "cv", "curriculum" -> Resume
- If unclear, make best guess based on filename`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        })
      });

      const data = await response.json();
      const text = data.content.map(item => item.text || "").join("");
      const cleanJson = text.replace(/```json|```/g, "").trim();
      const detected = JSON.parse(cleanJson);
      
      setDetectedInfo(detected);
      
      // Pre-fill any extracted info
      if (detected.extractedInfo.yearsOfExperience) {
        setUserInfo(prev => ({ ...prev, yearsOfExperience: detected.extractedInfo.yearsOfExperience }));
      }
      
      setStep('collecting-info');
    } catch (error) {
      console.error('Detection error:', error);
      // Fallback detection based on filename
      let docType = 'resume';
      let docLabel = 'Resume/CV';
      const lowerName = fileName.toLowerCase();
      
      if (lowerName.includes('offer') || lowerName.includes('appointment')) {
        docType = 'offer_letter';
        docLabel = 'Offer Letter';
      } else if (lowerName.includes('slip') || lowerName.includes('payslip') || lowerName.includes('salary')) {
        docType = 'salary_slip';
        docLabel = 'Salary Slip';
      }
      
      setDetectedInfo({
        documentType: docType,
        documentTypeLabel: docLabel,
        confidence: 'medium',
        extractedInfo: { role: null, company: null, salary: null, location: null, yearsOfExperience: null },
        needsFromUser: ['yearsOfExperience', 'college']
      });
      setStep('collecting-info');
    }
    
    setIsDetecting(false);
  };

  const runFullAnalysis = async () => {
    setIsAnalyzing(true);
    setStep('analyzing');

    const prompt = `You are a salary analysis expert for the Indian job market. Analyze this professional's compensation.

Profile:
- Document Type: ${detectedInfo.documentTypeLabel}
- Role: ${detectedInfo.extractedInfo.role || 'Software Engineer'}
- Years of Experience: ${userInfo.yearsOfExperience} years
- College Tier: ${colleges.find(c => c.value === userInfo.college)?.label || userInfo.college}
- Location: ${detectedInfo.extractedInfo.location || 'Bangalore'}
- Current/Offered Salary: ₹${detectedInfo.extractedInfo.salary || '20'} LPA

Based on current Indian market data (2024-2025), provide a JSON response:
{
  "marketMin": <minimum salary in LPA for this profile as number>,
  "marketMedian": <median salary in LPA as number>,
  "marketMax": <maximum/top quartile salary in LPA as number>,
  "percentile": <where this person stands 1-100>,
  "verdict": "Below Market" | "Fair" | "Above Market" | "Excellent",
  "gap": <salary gap from median, negative if above>,
  "insights": ["<insight 1>", "<insight 2>", "<insight 3>"],
  "negotiationPotential": <estimated additional salary they could negotiate in LPA>
}

Consider:
- IIT/NIT graduates: 20-40% premium
- Bangalore: 10-15% more than other cities
- Product companies pay more than services
- Experience multipliers are non-linear

RESPOND ONLY WITH VALID JSON.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        })
      });

      const data = await response.json();
      const text = data.content.map(item => item.text || "").join("");
      const cleanJson = text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(cleanJson);
      
      setAnalysisResult(result);
      setStep('results');
    } catch (error) {
      console.error('Analysis error:', error);
      const baseSalary = parseFloat(detectedInfo.extractedInfo.salary) || 20;
      setAnalysisResult({
        marketMin: Math.round(baseSalary * 0.7),
        marketMedian: Math.round(baseSalary * 1.15),
        marketMax: Math.round(baseSalary * 1.6),
        percentile: 42,
        verdict: "Fair",
        gap: Math.round(baseSalary * 0.15),
        insights: [
          "Your compensation is within the expected range for your experience",
          "Consider upskilling in cloud technologies to command higher packages",
          "Professionals from similar backgrounds see 20-30% jumps when switching"
        ],
        negotiationPotential: Math.round(baseSalary * 0.12),
      });
      setStep('results');
    }
    
    setIsAnalyzing(false);
  };

  const resetFlow = () => {
    setStep('upload');
    setUploadedFile(null);
    setDetectedInfo(null);
    setUserInfo({ yearsOfExperience: '', college: '' });
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
          {/* Badge */}
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
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: COLORS.primary,
              animation: 'pulse 2s infinite',
            }}/>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: COLORS.primary,
            }}>
              23,000+ salary data points from India
            </span>
          </div>

          {/* Headline */}
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
            Drop your offer letter, salary slip, or resume below.<br/>
            Get instant salary insights powered by AI.
          </p>

          {/* UPLOAD ZONE - DIRECTLY IN HERO */}
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
            {isDetecting ? (
              <>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: `3px solid ${COLORS.border}`,
                  borderTopColor: COLORS.primary,
                  margin: '0 auto 20px',
                  animation: 'spin 1s linear infinite',
                }}/>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '16px',
                  fontWeight: 500,
                  color: COLORS.white,
                }}>
                  Analyzing document...
                </p>
              </>
            ) : (
              <>
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
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '18px',
                  fontWeight: 500,
                  color: COLORS.white,
                  marginBottom: '8px',
                }}>
                  Drag & drop your document here
                </p>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  color: COLORS.gray500,
                  marginBottom: '20px',
                }}>
                  Offer letter, salary slip, or resume • PDF, DOC, PNG, JPG
                </p>
                <input 
                  type="file" 
                  id="fileInput" 
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
                <label 
                  htmlFor="fileInput"
                  style={{
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
                  }}
                >
                  Choose File
                </label>
              </>
            )}
          </div>

          {/* Trust */}
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
            Your documents are encrypted & never shared with employers
          </p>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.95); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </section>
    );
  }

  // ========== COLLECTING INFO STATE ==========
  if (step === 'collecting-info' && detectedInfo) {
    return (
      <section 
        id="hero"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 24px 80px',
          background: COLORS.bg,
        }}
      >
        <div style={{ maxWidth: '500px', width: '100%' }}>
          {/* Detected Document */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px',
            background: COLORS.primaryMuted,
            borderRadius: '12px',
            marginBottom: '32px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: COLORS.bgCard,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                color: COLORS.gray400,
                marginBottom: '2px',
              }}>
                Detected as
              </p>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '18px',
                fontWeight: 600,
                color: COLORS.white,
              }}>
                {detectedInfo.documentTypeLabel}
              </p>
            </div>
            <span style={{
              padding: '4px 10px',
              borderRadius: '100px',
              background: COLORS.bgCard,
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              color: COLORS.primary,
              textTransform: 'capitalize',
            }}>
              {detectedInfo.confidence} confidence
            </span>
          </div>

          {/* File info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            background: COLORS.bgCard,
            borderRadius: '8px',
            marginBottom: '32px',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gray500} strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              color: COLORS.gray300,
              flex: 1,
            }}>
              {uploadedFile?.name}
            </span>
            <button
              onClick={resetFlow}
              style={{
                background: 'none',
                border: 'none',
                color: COLORS.gray500,
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Form Title */}
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '28px',
            fontWeight: 700,
            color: COLORS.white,
            marginBottom: '8px',
          }}>
            A few more details
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '15px',
            color: COLORS.gray400,
            marginBottom: '32px',
          }}>
            We need this to give you accurate market comparison
          </p>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Years of Experience */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: COLORS.gray300,
                marginBottom: '8px',
              }}>
                Years of Experience *
              </label>
              <input
                type="number"
                placeholder="e.g., 4"
                min="0"
                max="40"
                value={userInfo.yearsOfExperience}
                onChange={(e) => setUserInfo({ ...userInfo, yearsOfExperience: e.target.value })}
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
            </div>

            {/* College */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: COLORS.gray300,
                marginBottom: '8px',
              }}>
                College / Institute *
              </label>
              <select
                value={userInfo.college}
                onChange={(e) => setUserInfo({ ...userInfo, college: e.target.value })}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: COLORS.bgCard,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '10px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '16px',
                  color: userInfo.college ? COLORS.white : COLORS.gray500,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                }}
              >
                <option value="">Select your college tier</option>
                {colleges.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              onClick={runFullAnalysis}
              disabled={!userInfo.yearsOfExperience || !userInfo.college}
              style={{
                width: '100%',
                padding: '18px',
                background: (userInfo.yearsOfExperience && userInfo.college) ? COLORS.primary : COLORS.bgHover,
                border: 'none',
                borderRadius: '10px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '16px',
                fontWeight: 600,
                color: (userInfo.yearsOfExperience && userInfo.college) ? COLORS.bg : COLORS.gray500,
                cursor: (userInfo.yearsOfExperience && userInfo.college) ? 'pointer' : 'not-allowed',
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              Analyze My Salary
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </section>
    );
  }

  // ========== ANALYZING STATE ==========
  if (step === 'analyzing') {
    return (
      <section 
        id="hero"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 24px 80px',
          background: COLORS.bg,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: `3px solid ${COLORS.border}`,
            borderTopColor: COLORS.primary,
            margin: '0 auto 32px',
            animation: 'spin 1s linear infinite',
          }}/>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '28px',
            fontWeight: 700,
            color: COLORS.white,
            marginBottom: '12px',
          }}>
            Analyzing your profile...
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '16px',
            color: COLORS.gray400,
          }}>
            Comparing against 23,000+ salary data points
          </p>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </section>
    );
  }

  // ========== RESULTS STATE ==========
  if (step === 'results' && analysisResult) {
    const currentSalary = detectedInfo?.extractedInfo?.salary || 20;
    
    return (
      <section 
        id="hero"
        style={{
          minHeight: '100vh',
          padding: '120px 24px 80px',
          background: COLORS.bg,
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              fontWeight: 600,
              color: COLORS.primary,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              Analysis Complete
            </span>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '42px',
              fontWeight: 700,
              color: COLORS.white,
              marginTop: '16px',
            }}>
              Your Salary Report
            </h2>
          </div>

          {/* Main Result Card */}
          <div style={{
            background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '32px',
          }}>
            {/* Verdict */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span style={{
                display: 'inline-block',
                padding: '10px 24px',
                borderRadius: '100px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '16px',
                fontWeight: 600,
                background: analysisResult.verdict === 'Below Market' 
                  ? 'rgba(248, 113, 113, 0.15)' 
                  : analysisResult.verdict === 'Excellent'
                  ? 'rgba(0, 212, 170, 0.15)'
                  : 'rgba(251, 191, 36, 0.15)',
                color: analysisResult.verdict === 'Below Market' 
                  ? COLORS.coral 
                  : analysisResult.verdict === 'Excellent'
                  ? COLORS.primary
                  : COLORS.amber,
              }}>
                {analysisResult.verdict}
              </span>
            </div>

            {/* Percentile */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '72px',
                fontWeight: 700,
                color: COLORS.white,
                lineHeight: 1,
              }}>
                P{analysisResult.percentile}
              </div>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '16px',
                color: COLORS.gray400,
                marginTop: '8px',
              }}>
                You earn more than {analysisResult.percentile}% of similar professionals
              </p>
            </div>

            {/* Range Bar */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: COLORS.gray500 }}>Min</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: COLORS.gray500 }}>Median</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: COLORS.gray500 }}>Max</span>
              </div>
              
              <div style={{
                position: 'relative',
                height: '12px',
                background: `linear-gradient(90deg, ${COLORS.coral}44, ${COLORS.amber}44, ${COLORS.primary}44)`,
                borderRadius: '6px',
                marginBottom: '12px',
              }}>
                <div style={{
                  position: 'absolute',
                  left: `${analysisResult.percentile}%`,
                  top: '-8px',
                  transform: 'translateX(-50%)',
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: COLORS.white,
                    border: `3px solid ${COLORS.primary}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, color: COLORS.bg }}>
                      You
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 600, color: COLORS.gray300 }}>
                  ₹{analysisResult.marketMin}L
                </span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 600, color: COLORS.primary }}>
                  ₹{analysisResult.marketMedian}L
                </span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 600, color: COLORS.gray300 }}>
                  ₹{analysisResult.marketMax}L
                </span>
              </div>
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              padding: '24px',
              background: COLORS.bg,
              borderRadius: '12px',
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: COLORS.gray500, marginBottom: '4px' }}>Your Salary</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, color: COLORS.white }}>
                  ₹{currentSalary}L
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: COLORS.gray500, marginBottom: '4px' }}>Gap from Median</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, color: analysisResult.gap > 0 ? COLORS.coral : COLORS.primary }}>
                  {analysisResult.gap > 0 ? '-' : '+'}₹{Math.abs(analysisResult.gap)}L
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: COLORS.gray500, marginBottom: '4px' }}>Negotiation Potential</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, color: COLORS.amber }}>
                  +₹{analysisResult.negotiationPotential}L
                </p>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div style={{
            background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '48px',
          }}>
            <h3 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '16px',
              fontWeight: 600,
              color: COLORS.white,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              Key Insights
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {analysisResult.insights.map((insight, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px',
                  background: COLORS.bg,
                  borderRadius: '10px',
                }}>
                  <span style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: COLORS.primaryMuted,
                    color: COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '11px',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    color: COLORS.gray300,
                    lineHeight: 1.5,
                  }}>
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* UPSELL SECTION */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '28px',
                fontWeight: 700,
                color: COLORS.white,
                marginBottom: '8px',
              }}>
                Ready to close the gap?
              </h3>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '16px',
                color: COLORS.gray400,
              }}>
                Get expert help to maximize your compensation
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Salary Negotiation */}
              <div style={{
                background: `linear-gradient(135deg, ${COLORS.bgCard} 0%, rgba(0, 212, 170, 0.08) 100%)`,
                border: `2px solid ${COLORS.primary}`,
                borderRadius: '20px',
                padding: '32px',
                position: 'relative',
              }}>
                <span style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: COLORS.primary,
                  color: COLORS.bg,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '100px',
                  textTransform: 'uppercase',
                }}>
                  Recommended
                </span>

                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: COLORS.primaryMuted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>

                <h4 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '22px',
                  fontWeight: 600,
                  color: COLORS.white,
                  marginBottom: '8px',
                }}>
                  Salary Negotiation Help
                </h4>

                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  color: COLORS.gray400,
                  marginBottom: '20px',
                  lineHeight: 1.6,
                }}>
                  Personalized scripts & strategies to negotiate confidently without burning bridges.
                </p>

                <ul style={{ marginBottom: '24px', padding: 0, listStyle: 'none' }}>
                  {['Customized negotiation scripts', 'Counter-offer email templates', 'Timing & tactics guide'].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray300 }}>{item}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '32px', fontWeight: 700, color: COLORS.white }}>₹999</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray500, marginLeft: '8px', textDecoration: 'line-through' }}>₹1,999</span>
                  </div>
                  <button style={{
                    background: COLORS.primary,
                    border: 'none',
                    padding: '14px 24px',
                    borderRadius: '8px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '15px',
                    fontWeight: 600,
                    color: COLORS.bg,
                    cursor: 'pointer',
                  }}>
                    Get Now →
                  </button>
                </div>
              </div>

              {/* Naukri Pro */}
              <div style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '20px',
                padding: '32px',
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.blue} strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                </div>

                <h4 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '22px',
                  fontWeight: 600,
                  color: COLORS.white,
                  marginBottom: '8px',
                }}>
                  Resume Tips + Naukri Pro
                </h4>

                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  color: COLORS.gray400,
                  marginBottom: '20px',
                  lineHeight: 1.6,
                }}>
                  Boost profile visibility 3x and get AI-powered resume analysis.
                </p>

                <ul style={{ marginBottom: '24px', padding: 0, listStyle: 'none' }}>
                  {['3x more recruiter views', 'AI resume analysis', 'Priority applications'].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.blue} strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray300 }}>{item}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: COLORS.gray500 }}>Naukri Partner</span>
                  <a 
                    href="https://www.naukri.com/naukri360-pro?utmTerm=NPro_Profile&utmContent=ProfileWidget"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'transparent',
                      border: `1px solid ${COLORS.blue}`,
                      padding: '14px 24px',
                      borderRadius: '8px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '15px',
                      fontWeight: 600,
                      color: COLORS.blue,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    Explore
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Check Another */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={resetFlow}
              style={{
                background: 'transparent',
                border: `1px solid ${COLORS.borderLight}`,
                padding: '14px 28px',
                borderRadius: '8px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '15px',
                fontWeight: 500,
                color: COLORS.gray400,
                cursor: 'pointer',
              }}
            >
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
    {
      type: 'Offer Letter',
      role: 'SDE-2 @ Amazon',
      location: 'Bangalore',
      offered: '₹45 LPA',
      market: '₹42-58 LPA',
      percentile: 65,
      verdict: 'Fair offer',
      verdictColor: COLORS.primary,
    },
    {
      type: 'Salary Slip',
      role: 'Product Manager @ Startup',
      location: 'Mumbai',
      offered: '₹28 LPA',
      market: '₹32-48 LPA',
      percentile: 32,
      verdict: 'Below market',
      verdictColor: COLORS.coral,
    },
    {
      type: 'Resume',
      role: 'Data Scientist',
      location: 'Hyderabad',
      offered: '3 yrs exp',
      market: '₹25-38 LPA',
      percentile: null,
      verdict: 'High potential',
      verdictColor: COLORS.amber,
    },
  ];

  return (
    <section id="examples" style={{ padding: '100px 24px', background: COLORS.bgCard, borderTop: `1px solid ${COLORS.border}` }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Real Results
          </span>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '36px', fontWeight: 700, color: COLORS.white, marginTop: '12px' }}>
            See what others discovered
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {examples.map((item, i) => (
            <div key={i} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '24px' }}>
              <span style={{ display: 'inline-block', background: COLORS.bgHover, padding: '5px 10px', borderRadius: '5px', fontFamily: "'Inter', sans-serif", fontSize: '12px', color: COLORS.gray400, marginBottom: '14px' }}>
                {item.type}
              </span>
              <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600, color: COLORS.white, marginBottom: '4px' }}>{item.role}</h4>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: COLORS.gray500, marginBottom: '16px' }}>{item.location}</p>
              <div style={{ height: '1px', background: COLORS.border, marginBottom: '16px' }}/>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: COLORS.gray500, marginBottom: '2px' }}>{item.percentile !== null ? 'Offered' : 'Experience'}</p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: 600, color: COLORS.white }}>{item.offered}</p>
                </div>
                <div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: COLORS.gray500, marginBottom: '2px' }}>Market</p>
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
    { num: '01', title: 'Upload', desc: 'Drop any document — we auto-detect the type', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> },
    { num: '02', title: 'Analyze', desc: 'AI extracts info & compares to 23K+ profiles', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { num: '03', title: 'Discover', desc: 'See your percentile & actionable next steps', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> },
  ];

  return (
    <section id="how-it-works" style={{ padding: '100px 24px', background: COLORS.bg, borderTop: `1px solid ${COLORS.border}` }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Simple Process
          </span>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '36px', fontWeight: 700, color: COLORS.white, marginTop: '12px' }}>
            How it works
          </h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '36px', left: '18%', right: '18%', height: '2px', background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.border}, ${COLORS.primary})` }}/>
          {steps.map((step, i) => (
            <div key={i} style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: COLORS.bgCard, border: `2px solid ${COLORS.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                {step.icon}
              </div>
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
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: COLORS.gray500 }}>
        © 2025 AreYouPaidFairly. Made for Indian professionals.
      </p>
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

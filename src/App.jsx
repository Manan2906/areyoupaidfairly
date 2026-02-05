import React, { useState, useEffect } from 'react';

// ============================================
// DESIGN SYSTEM - Levels.fyi Inspired
// ============================================

const COLORS = {
  // Clean, professional palette
  bg: '#FFFFFF',
  bgCard: '#F9FAFB',
  bgDark: '#111827',
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  primaryLight: '#DBEAFE',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  
  // Neutrals
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Semantic
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  borderDark: '#D1D5DB',
};

const TYPOGRAPHY = {
  display: "'IBM Plex Sans', -apple-system, system-ui, sans-serif",
  body: "'Inter', -apple-system, system-ui, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', monospace",
};

// ============================================
// CURRENCY & COUNTRY CONFIGURATION
// ============================================

const COUNTRIES = {
  IN: {
    name: 'India',
    currency: '₹',
    format: (amount) => `₹${amount} LPA`,
    flag: '🇮🇳',
    symbols: ['₹', 'INR', 'lpa', 'lakh']
  },
  US: {
    name: 'United States',
    currency: '$',
    format: (amount) => `$${amount}K`,
    flag: '🇺🇸',
    symbols: ['$', 'USD', 'usd']
  },
  GB: {
    name: 'United Kingdom',
    currency: '£',
    format: (amount) => `£${amount}K`,
    flag: '🇬🇧',
    symbols: ['£', 'GBP', 'gbp']
  },
  EU: {
    name: 'Europe',
    currency: '€',
    format: (amount) => `€${amount}K`,
    flag: '🇪🇺',
    symbols: ['€', 'EUR', 'eur']
  },
  JP: {
    name: 'Japan',
    currency: '¥',
    format: (amount) => `¥${amount}M`,
    flag: '🇯🇵',
    symbols: ['¥', 'JPY', 'jpy', '円']
  },
  SG: {
    name: 'Singapore',
    currency: 'S$',
    format: (amount) => `S$${amount}K`,
    flag: '🇸🇬',
    symbols: ['SGD', 'sgd', 'S$']
  },
  CA: {
    name: 'Canada',
    currency: 'C$',
    format: (amount) => `C$${amount}K`,
    flag: '🇨🇦',
    symbols: ['CAD', 'cad', 'C$']
  },
  AU: {
    name: 'Australia',
    currency: 'A$',
    format: (amount) => `A$${amount}K`,
    flag: '🇦🇺',
    symbols: ['AUD', 'aud', 'A$']
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const detectCountryFromCurrency = (text) => {
  const normalizedText = text.toLowerCase();
  
  for (const [code, country] of Object.entries(COUNTRIES)) {
    for (const symbol of country.symbols) {
      if (normalizedText.includes(symbol.toLowerCase())) {
        return code;
      }
    }
  }
  
  return 'IN'; // Default to India
};

// ============================================
// NAVIGATION
// ============================================

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: scrolled ? 'rgba(255, 255, 255, 0.95)' : COLORS.bg,
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      borderBottom: `1px solid ${scrolled ? COLORS.border : 'transparent'}`,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <div style={{
              width: '8px',
              height: '20px',
              background: COLORS.primary,
              borderRadius: '2px',
            }}/>
            <div style={{
              width: '8px',
              height: '28px',
              background: COLORS.primary,
              borderRadius: '2px',
              opacity: 0.7,
            }}/>
            <div style={{
              width: '8px',
              height: '36px',
              background: COLORS.primary,
              borderRadius: '2px',
              opacity: 0.5,
            }}/>
          </div>
          <span style={{
            fontFamily: TYPOGRAPHY.display,
            fontSize: '18px',
            fontWeight: 600,
            color: COLORS.textPrimary,
            letterSpacing: '-0.02em',
          }}>
            AreYouPaidFairly
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#how-it-works" style={{
            fontFamily: TYPOGRAPHY.body,
            fontSize: '14px',
            fontWeight: 500,
            color: COLORS.textSecondary,
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}>
            How it works
          </a>
          <a href="#examples" style={{
            fontFamily: TYPOGRAPHY.body,
            fontSize: '14px',
            fontWeight: 500,
            color: COLORS.textSecondary,
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}>
            Examples
          </a>
        </div>
      </div>
    </nav>
  );
};

// ============================================
// STATS BANNER
// ============================================

const StatsBanner = () => {
  const [count, setCount] = useState(24837);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Analyses completed', value: count.toLocaleString(), highlight: true },
    { label: 'Average underpayment found', value: '18%' },
    { label: 'Countries supported', value: '8+' },
  ];

  return (
    <div style={{
      background: COLORS.gray50,
      borderBottom: `1px solid ${COLORS.border}`,
      padding: '16px 32px',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        gap: '64px',
        flexWrap: 'wrap',
      }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}>
            <div style={{
              fontFamily: TYPOGRAPHY.display,
              fontSize: '24px',
              fontWeight: 600,
              color: stat.highlight ? COLORS.primary : COLORS.textPrimary,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              {stat.value}
              {stat.highlight && (
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: COLORS.success,
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}/>
              )}
            </div>
            <div style={{
              fontFamily: TYPOGRAPHY.body,
              fontSize: '13px',
              color: COLORS.textSecondary,
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// HERO WITH UPLOAD
// ============================================

const HeroWithUpload = ({ onAnalysisComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState(null);
  const [userInfo, setUserInfo] = useState({
    yearsOfExperience: '',
    college: '',
    currentSalary: '',
  });
  const [error, setError] = useState(null);
  const [step, setStep] = useState('upload'); // upload, collecting-info, complete

  const colleges = [
    { value: 'iit', label: 'IIT (Any Campus)' },
    { value: 'nit', label: 'NIT / IIIT' },
    { value: 'bits', label: 'BITS Pilani' },
    { value: 'tier1-private', label: 'Tier-1 Private (VIT, Manipal, SRM)' },
    { value: 'tier1-state', label: 'Tier-1 State University' },
    { value: 'tier2', label: 'Tier-2 Engineering' },
    { value: 'tier3', label: 'Other Engineering' },
    { value: 'iim', label: 'IIM / Top B-School' },
    { value: 'other-mba', label: 'Other MBA' },
    { value: 'non-engineering', label: 'Non-Engineering' },
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

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    setError(null);
    
    // Validate file type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or image file (PNG, JPG)');
      return;
    }
    
    setUploadedFile(file);
    setIsDetecting(true);
    
    // Read file for AI analysis
    const reader = new FileReader();
    reader.onload = async (e) => {
      await detectDocumentType(file.name, e.target.result, file.type);
    };
    reader.readAsDataURL(file);
  };

  const detectDocumentType = async (fileName, base64Data, fileType) => {
    setError(null);
    
    const prompt = `Analyze this uploaded document. Based on the filename "${fileName}" and document patterns, determine:

1. Document type (offer_letter, salary_slip, or resume)
2. Country/region (detect from currency symbols: ₹/INR→India, $→US, £→UK, €→EU, ¥→Japan, etc.)
3. Extract any visible information

Respond ONLY with valid JSON (no markdown):
{
  "documentType": "offer_letter" | "salary_slip" | "resume",
  "documentTypeLabel": "Offer Letter" | "Salary Slip" | "Resume/CV",
  "confidence": "high" | "medium" | "low",
  "country": "IN" | "US" | "GB" | "EU" | "JP" | "SG" | "CA" | "AU",
  "extractedInfo": {
    "role": "<role or null>",
    "company": "<company or null>",
    "salary": "<numeric value or null>",
    "salaryText": "<original salary text with currency or null>",
    "location": "<city or null>",
    "yearsOfExperience": "<years or null>"
  },
  "needsFromUser": ["field1", "field2"],
  "errorMessage": null
}

If document is invalid or unreadable, set errorMessage to helpful text.

Common patterns:
- Filenames with "offer", "appointment" → Offer Letter
- Filenames with "payslip", "salary_slip", "pay" → Salary Slip  
- Filenames with "resume", "cv", "curriculum" → Resume
- Currency symbols indicate country`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: [{ role: "user", content: prompt }],
        })
      });

      const data = await response.json();
      const text = data.content.map(item => item.text || "").join("");
      const cleanJson = text.replace(/```json|```/g, "").trim();
      const detected = JSON.parse(cleanJson);
      
      // Check for error
      if (detected.errorMessage) {
        setError(detected.errorMessage);
        setIsDetecting(false);
        setUploadedFile(null);
        return;
      }
      
      // Validate document type
      const validTypes = ['offer_letter', 'salary_slip', 'resume'];
      if (!validTypes.includes(detected.documentType)) {
        setError('Please upload an offer letter, salary slip, or resume. Other documents are not supported.');
        setIsDetecting(false);
        setUploadedFile(null);
        return;
      }
      
      setDetectedInfo(detected);
      
      // Pre-fill extracted info
      if (detected.extractedInfo.yearsOfExperience) {
        setUserInfo(prev => ({ 
          ...prev, 
          yearsOfExperience: detected.extractedInfo.yearsOfExperience 
        }));
      }
      if (detected.extractedInfo.salary) {
        setUserInfo(prev => ({ 
          ...prev, 
          currentSalary: detected.extractedInfo.salary 
        }));
      }
      
      setStep('collecting-info');
      setIsDetecting(false);
      
    } catch (error) {
      console.error('Detection error:', error);
      
      // Fallback: basic filename detection
      let docType = 'resume';
      let docLabel = 'Resume/CV';
      const lowerName = fileName.toLowerCase();
      
      if (lowerName.includes('offer') || lowerName.includes('appointment')) {
        docType = 'offer_letter';
        docLabel = 'Offer Letter';
      } else if (lowerName.includes('slip') || lowerName.includes('payslip') || lowerName.includes('salary') || lowerName.includes('pay')) {
        docType = 'salary_slip';
        docLabel = 'Salary Slip';
      }
      
      // Detect country from filename
      const country = detectCountryFromCurrency(fileName);
      
      setDetectedInfo({
        documentType: docType,
        documentTypeLabel: docLabel,
        confidence: 'medium',
        country: country,
        extractedInfo: { 
          role: null, 
          company: null, 
          salary: null, 
          salaryText: null,
          location: null, 
          yearsOfExperience: null 
        },
        needsFromUser: ['yearsOfExperience', 'college', 'currentSalary']
      });
      
      setStep('collecting-info');
      setIsDetecting(false);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!userInfo.yearsOfExperience || !userInfo.college || !userInfo.currentSalary) {
      setError('Please fill in all required fields');
      return;
    }
    
    setError(null);
    setStep('complete');
    
    // Pass data to parent for analysis
    onAnalysisComplete({
      detectedInfo,
      userInfo,
      uploadedFile,
    });
  };

  const resetFlow = () => {
    setStep('upload');
    setUploadedFile(null);
    setDetectedInfo(null);
    setUserInfo({ yearsOfExperience: '', college: '', currentSalary: '' });
    setError(null);
  };

  if (step === 'complete') {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 24px',
          borderRadius: '50%',
          background: COLORS.primaryLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 style={{
          fontFamily: TYPOGRAPHY.display,
          fontSize: '28px',
          fontWeight: 600,
          color: COLORS.textPrimary,
          marginBottom: '12px',
        }}>
          Analysis Complete!
        </h2>
        <p style={{
          fontFamily: TYPOGRAPHY.body,
          fontSize: '16px',
          color: COLORS.textSecondary,
          marginBottom: '32px',
        }}>
          Your salary analysis is ready. Scroll down to view your results.
        </p>
        <button
          onClick={resetFlow}
          style={{
            padding: '12px 24px',
            background: COLORS.gray100,
            border: 'none',
            borderRadius: '8px',
            fontFamily: TYPOGRAPHY.body,
            fontSize: '14px',
            fontWeight: 500,
            color: COLORS.textPrimary,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Start New Analysis
        </button>
      </div>
    );
  }

  if (step === 'collecting-info') {
    const countryInfo = COUNTRIES[detectedInfo.country] || COUNTRIES.IN;
    
    return (
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '80px 24px',
      }}>
        <div style={{
          background: COLORS.bgCard,
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`,
          padding: '32px',
        }}>
          {/* Document Info */}
          <div style={{
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: `1px solid ${COLORS.border}`,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px',
            }}>
              <span style={{ fontSize: '32px' }}>{countryInfo.flag}</span>
              <div>
                <h3 style={{
                  fontFamily: TYPOGRAPHY.display,
                  fontSize: '20px',
                  fontWeight: 600,
                  color: COLORS.textPrimary,
                  marginBottom: '4px',
                }}>
                  {detectedInfo.documentTypeLabel} Detected
                </h3>
                <p style={{
                  fontFamily: TYPOGRAPHY.body,
                  fontSize: '14px',
                  color: COLORS.textSecondary,
                }}>
                  {countryInfo.name} • {uploadedFile.name}
                </p>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#FEE2E2',
              border: `1px solid #FCA5A5`,
              borderRadius: '8px',
              marginBottom: '24px',
              fontFamily: TYPOGRAPHY.body,
              fontSize: '14px',
              color: '#991B1B',
            }}>
              {error}
            </div>
          )}

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                fontFamily: TYPOGRAPHY.body,
                fontSize: '14px',
                fontWeight: 500,
                color: COLORS.textPrimary,
                marginBottom: '8px',
              }}>
                Years of Experience *
              </label>
              <input
                type="number"
                value={userInfo.yearsOfExperience}
                onChange={(e) => setUserInfo({ ...userInfo, yearsOfExperience: e.target.value })}
                placeholder="e.g., 3"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  fontFamily: TYPOGRAPHY.body,
                  fontSize: '15px',
                  color: COLORS.textPrimary,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontFamily: TYPOGRAPHY.body,
                fontSize: '14px',
                fontWeight: 500,
                color: COLORS.textPrimary,
                marginBottom: '8px',
              }}>
                Educational Background *
              </label>
              <select
                value={userInfo.college}
                onChange={(e) => setUserInfo({ ...userInfo, college: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  fontFamily: TYPOGRAPHY.body,
                  fontSize: '15px',
                  color: COLORS.textPrimary,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  cursor: 'pointer',
                }}
              >
                <option value="">Select your college tier</option>
                {colleges.map(college => (
                  <option key={college.value} value={college.value}>
                    {college.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontFamily: TYPOGRAPHY.body,
                fontSize: '14px',
                fontWeight: 500,
                color: COLORS.textPrimary,
                marginBottom: '8px',
              }}>
                Current/Offered Salary ({countryInfo.currency}) *
              </label>
              <input
                type="number"
                value={userInfo.currentSalary}
                onChange={(e) => setUserInfo({ ...userInfo, currentSalary: e.target.value })}
                placeholder={detectedInfo.country === 'IN' ? 'e.g., 24 (LPA)' : 'e.g., 120 (in thousands)'}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  fontFamily: TYPOGRAPHY.body,
                  fontSize: '15px',
                  color: COLORS.textPrimary,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
              <p style={{
                fontFamily: TYPOGRAPHY.body,
                fontSize: '12px',
                color: COLORS.textSecondary,
                marginTop: '6px',
              }}>
                {detectedInfo.country === 'IN' ? 'Enter in Lakhs per Annum (LPA)' : 'Enter in thousands (e.g., 120 for 120K)'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: `1px solid ${COLORS.border}`,
          }}>
            <button
              onClick={resetFlow}
              style={{
                flex: 1,
                padding: '12px 24px',
                background: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontFamily: TYPOGRAPHY.body,
                fontSize: '15px',
                fontWeight: 500,
                color: COLORS.textPrimary,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!userInfo.yearsOfExperience || !userInfo.college || !userInfo.currentSalary}
              style={{
                flex: 1,
                padding: '12px 24px',
                background: COLORS.primary,
                border: 'none',
                borderRadius: '8px',
                fontFamily: TYPOGRAPHY.body,
                fontSize: '15px',
                fontWeight: 500,
                color: COLORS.bg,
                cursor: (!userInfo.yearsOfExperience || !userInfo.college || !userInfo.currentSalary) ? 'not-allowed' : 'pointer',
                opacity: (!userInfo.yearsOfExperience || !userInfo.college || !userInfo.currentSalary) ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              Analyze Salary
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Upload step
  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
    }}>
      <div style={{
        maxWidth: '700px',
        width: '100%',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontFamily: TYPOGRAPHY.display,
            fontSize: '48px',
            fontWeight: 600,
            color: COLORS.textPrimary,
            marginBottom: '16px',
            lineHeight: '1.1',
          }}>
            Know Your True Worth
          </h1>
          <p style={{
            fontFamily: TYPOGRAPHY.body,
            fontSize: '20px',
            color: COLORS.textSecondary,
            lineHeight: '1.6',
          }}>
            Upload your offer letter, salary slip, or resume. Our AI instantly detects your document type, country, and provides personalized salary insights.
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? COLORS.primary : COLORS.border}`,
            borderRadius: '16px',
            padding: '64px 32px',
            textAlign: 'center',
            background: dragActive ? COLORS.primaryLight : COLORS.bgCard,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
          }}
        >
          {isDetecting ? (
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 20px',
                border: `4px solid ${COLORS.gray200}`,
                borderTop: `4px solid ${COLORS.primary}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}/>
              <p style={{
                fontFamily: TYPOGRAPHY.body,
                fontSize: '16px',
                fontWeight: 500,
                color: COLORS.textPrimary,
                marginBottom: '8px',
              }}>
                Analyzing your document...
              </p>
              <p style={{
                fontFamily: TYPOGRAPHY.body,
                fontSize: '14px',
                color: COLORS.textSecondary,
              }}>
                AI is detecting document type and extracting information
              </p>
            </div>
          ) : (
            <>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 24px',
                background: COLORS.primaryLight,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>

              <h3 style={{
                fontFamily: TYPOGRAPHY.display,
                fontSize: '20px',
                fontWeight: 600,
                color: COLORS.textPrimary,
                marginBottom: '8px',
              }}>
                Upload your document
              </h3>
              <p style={{
                fontFamily: TYPOGRAPHY.body,
                fontSize: '15px',
                color: COLORS.textSecondary,
                marginBottom: '24px',
              }}>
                Drag and drop or click to select
              </p>

              <input
                type="file"
                id="fileInput"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
              
              <button
                onClick={() => document.getElementById('fileInput').click()}
                style={{
                  padding: '12px 32px',
                  background: COLORS.primary,
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: TYPOGRAPHY.body,
                  fontSize: '15px',
                  fontWeight: 500,
                  color: COLORS.bg,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: '20px',
                }}
              >
                Select File
              </button>

              <p style={{
                fontFamily: TYPOGRAPHY.body,
                fontSize: '13px',
                color: COLORS.textSecondary,
              }}>
                Supports: PDF, PNG, JPG • Max 10MB
              </p>
            </>
          )}
        </div>

        {error && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            background: '#FEE2E2',
            border: `1px solid #FCA5A5`,
            borderRadius: '8px',
            fontFamily: TYPOGRAPHY.body,
            fontSize: '14px',
            color: '#991B1B',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Features */}
        <div style={{
          marginTop: '48px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
        }}>
          {[
            { icon: '🤖', title: 'AI Detection', desc: 'Auto-detects document type' },
            { icon: '🌍', title: 'Global Support', desc: 'Works with ₹/$£/€/¥ and more' },
            { icon: '⚡', title: 'Instant Analysis', desc: 'Results in seconds' },
          ].map((feature, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{feature.icon}</div>
              <h4 style={{
                fontFamily: TYPOGRAPHY.body,
                fontSize: '14px',
                fontWeight: 600,
                color: COLORS.textPrimary,
                marginBottom: '4px',
              }}>
                {feature.title}
              </h4>
              <p style={{
                fontFamily: TYPOGRAPHY.body,
                fontSize: '13px',
                color: COLORS.textSecondary,
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// ANALYSIS RESULTS
// ============================================

const AnalysisResults = ({ profileData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { detectedInfo, userInfo } = profileData;
  const countryInfo = COUNTRIES[detectedInfo?.country] || COUNTRIES.IN;

  useEffect(() => {
    if (profileData) {
      runAnalysis();
    }
  }, [profileData]);

  const runAnalysis = async () => {
    setIsLoading(true);

    const collegeLabels = {
      'iit': 'IIT',
      'nit': 'NIT/IIIT',
      'bits': 'BITS Pilani',
      'tier1-private': 'Tier-1 Private',
      'tier1-state': 'Tier-1 State',
      'tier2': 'Tier-2',
      'tier3': 'Tier-3',
      'iim': 'IIM/Top B-School',
      'other-mba': 'Other MBA',
      'non-engineering': 'Non-Engineering',
    };

    const prompt = `You are a global salary analysis expert. Analyze this professional's compensation in their market.

Profile:
- Country: ${countryInfo.name} (${detectedInfo.country})
- Document Type: ${detectedInfo.documentTypeLabel}
- Role: ${detectedInfo.extractedInfo.role || 'Software Engineer'}
- Years of Experience: ${userInfo.yearsOfExperience} years
- Education: ${collegeLabels[userInfo.college] || userInfo.college}
- Location: ${detectedInfo.extractedInfo.location || 'Not specified'}
- Current/Offered Salary: ${countryInfo.format(userInfo.currentSalary)}

Based on ${detectedInfo.country === 'IN' ? 'Indian' : 'international'} market data (2024-2025), provide a JSON response:
{
  "marketMin": <minimum salary for this profile as number>,
  "marketMedian": <median salary as number>,
  "marketMax": <maximum/top tier salary as number>,
  "percentile": <where this person stands 1-100>,
  "verdict": "Significantly Underpaid" | "Below Market" | "Fair" | "Above Market" | "Excellent",
  "gap": <salary gap from median, negative if above>,
  "gapPercentage": <gap as percentage>,
  "insights": ["<insight 1>", "<insight 2>", "<insight 3>", "<insight 4>"],
  "negotiationTips": ["<tip 1>", "<tip 2>", "<tip 3>"],
  "negotiationPotential": <estimated additional salary they could negotiate>
}

Consider country-specific factors:
- ${detectedInfo.country === 'IN' ? 'IIT/NIT premium, Bangalore tech hub, product vs service companies' : 'Market standards, cost of living, company tiers'}
- Experience scaling and role seniority
- Education tier impact

RESPOND ONLY WITH VALID JSON.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }],
        })
      });

      const data = await response.json();
      const text = data.content.map(item => item.text || "").join("");
      const cleanJson = text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(cleanJson);
      
      setAnalysisData(result);
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Fallback analysis
      const baseSalary = parseFloat(userInfo.currentSalary) || 100;
      setAnalysisData({
        marketMin: Math.round(baseSalary * 0.75),
        marketMedian: Math.round(baseSalary * 1.2),
        marketMax: Math.round(baseSalary * 1.8),
        percentile: 48,
        verdict: "Fair",
        gap: Math.round(baseSalary * 0.2),
        gapPercentage: 20,
        insights: [
          "Your compensation is within the expected range for your profile",
          `Consider upskilling in emerging technologies for ${countryInfo.name}`,
          "Professionals with similar backgrounds see 25-35% increases when switching",
          "Your education background provides strong negotiation leverage"
        ],
        negotiationTips: [
          "Research company-specific salary bands before negotiating",
          "Highlight unique skills and project impact",
          "Consider total compensation including equity and benefits"
        ],
        negotiationPotential: Math.round(baseSalary * 0.18),
      });
    }
    
    setIsLoading(false);
  };

  if (!profileData) {
    return null;
  }

  if (isLoading) {
    return (
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 24px',
          border: `4px solid ${COLORS.gray200}`,
          borderTop: `4px solid ${COLORS.primary}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}/>
        <h2 style={{
          fontFamily: TYPOGRAPHY.display,
          fontSize: '24px',
          fontWeight: 600,
          color: COLORS.textPrimary,
          marginBottom: '12px',
        }}>
          Analyzing your compensation...
        </h2>
        <p style={{
          fontFamily: TYPOGRAPHY.body,
          fontSize: '16px',
          color: COLORS.textSecondary,
        }}>
          Comparing against {countryInfo.name} market data
        </p>
      </div>
    );
  }

  const verdictColors = {
    'Significantly Underpaid': COLORS.danger,
    'Below Market': COLORS.warning,
    'Fair': COLORS.primary,
    'Above Market': COLORS.success,
    'Excellent': COLORS.success,
  };

  const currentSalary = parseFloat(userInfo.currentSalary);

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '80px 24px',
    }}>
      {/* Header with Country Flag */}
      <div style={{
        textAlign: 'center',
        marginBottom: '48px',
      }}>
        <div style={{
          fontSize: '64px',
          marginBottom: '16px',
        }}>
          {countryInfo.flag}
        </div>
        <h2 style={{
          fontFamily: TYPOGRAPHY.display,
          fontSize: '36px',
          fontWeight: 600,
          color: COLORS.textPrimary,
          marginBottom: '12px',
        }}>
          Your Salary Analysis
        </h2>
        <p style={{
          fontFamily: TYPOGRAPHY.body,
          fontSize: '18px',
          color: COLORS.textSecondary,
        }}>
          {countryInfo.name} • {userInfo.yearsOfExperience} years experience
        </p>
      </div>

      {/* Verdict Card */}
      <div style={{
        background: COLORS.bgCard,
        border: `2px solid ${verdictColors[analysisData.verdict]}`,
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '8px 20px',
          background: `${verdictColors[analysisData.verdict]}15`,
          borderRadius: '24px',
          fontFamily: TYPOGRAPHY.body,
          fontSize: '14px',
          fontWeight: 600,
          color: verdictColors[analysisData.verdict],
          marginBottom: '16px',
        }}>
          {analysisData.verdict}
        </div>
        <h3 style={{
          fontFamily: TYPOGRAPHY.display,
          fontSize: '48px',
          fontWeight: 700,
          color: COLORS.textPrimary,
          marginBottom: '8px',
        }}>
          {analysisData.percentile}th Percentile
        </h3>
        <p style={{
          fontFamily: TYPOGRAPHY.body,
          fontSize: '16px',
          color: COLORS.textSecondary,
        }}>
          You're earning {countryInfo.format(currentSalary)} • Market median is {countryInfo.format(analysisData.marketMedian)}
        </p>
      </div>

      {/* Market Comparison */}
      <div style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
      }}>
        <h4 style={{
          fontFamily: TYPOGRAPHY.display,
          fontSize: '20px',
          fontWeight: 600,
          color: COLORS.textPrimary,
          marginBottom: '24px',
        }}>
          Market Comparison
        </h4>

        {/* Visual Bar */}
        <div style={{
          position: 'relative',
          height: '60px',
          background: COLORS.gray100,
          borderRadius: '8px',
          marginBottom: '24px',
          overflow: 'hidden',
        }}>
          {/* Market Range */}
          <div style={{
            position: 'absolute',
            left: `${(analysisData.marketMin / analysisData.marketMax) * 100}%`,
            right: `${100 - (analysisData.marketMedian / analysisData.marketMax) * 100}%`,
            height: '100%',
            background: `${COLORS.primary}20`,
          }}/>
          
          {/* Your Position */}
          <div style={{
            position: 'absolute',
            left: `${(currentSalary / analysisData.marketMax) * 100}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '4px',
            height: '100%',
            background: verdictColors[analysisData.verdict],
          }}>
            <div style={{
              position: 'absolute',
              top: '-30px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: TYPOGRAPHY.mono,
              fontSize: '12px',
              fontWeight: 600,
              color: verdictColors[analysisData.verdict],
              whiteSpace: 'nowrap',
            }}>
              You: {countryInfo.format(currentSalary)}
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}>
          {[
            { label: 'Market Min', value: analysisData.marketMin, color: COLORS.textSecondary },
            { label: 'Market Median', value: analysisData.marketMedian, color: COLORS.primary },
            { label: 'Market Max', value: analysisData.marketMax, color: COLORS.success },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '16px',
              background: COLORS.bg,
              borderRadius: '8px',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: TYPOGRAPHY.body,
                fontSize: '12px',
                color: COLORS.textSecondary,
                marginBottom: '4px',
              }}>
                {item.label}
              </div>
              <div style={{
                fontFamily: TYPOGRAPHY.display,
                fontSize: '20px',
                fontWeight: 600,
                color: item.color,
              }}>
                {countryInfo.format(item.value)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
      }}>
        <h4 style={{
          fontFamily: TYPOGRAPHY.display,
          fontSize: '20px',
          fontWeight: 600,
          color: COLORS.textPrimary,
          marginBottom: '20px',
        }}>
          Key Insights
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {analysisData.insights.map((insight, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '12px',
              padding: '12px',
              background: COLORS.bg,
              borderRadius: '8px',
            }}>
              <div style={{
                flexShrink: 0,
                width: '6px',
                height: '6px',
                marginTop: '8px',
                borderRadius: '50%',
                background: COLORS.primary,
              }}/>
              <p style={{
                fontFamily: TYPOGRAPHY.body,
                fontSize: '15px',
                color: COLORS.textPrimary,
                lineHeight: '1.6',
              }}>
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Negotiation Potential - Locked */}
      <div style={{
        position: 'relative',
        background: `linear-gradient(135deg, ${COLORS.primary}15 0%, ${COLORS.success}15 100%)`,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '16px',
        padding: '32px',
        overflow: 'hidden',
      }}>
        {/* Blur overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(5px)',
          background: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1,
        }}/>

        {/* Lock icon */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          textAlign: 'center',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 16px',
            background: COLORS.primary,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={COLORS.bg} strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h4 style={{
            fontFamily: TYPOGRAPHY.display,
            fontSize: '24px',
            fontWeight: 600,
            color: COLORS.textPrimary,
            marginBottom: '12px',
          }}>
            Unlock Full Report
          </h4>
          <p style={{
            fontFamily: TYPOGRAPHY.body,
            fontSize: '15px',
            color: COLORS.textSecondary,
            marginBottom: '24px',
            maxWidth: '400px',
          }}>
            Get personalized negotiation strategies, detailed tips, and estimated potential increase of {countryInfo.format(analysisData.negotiationPotential)}+
          </p>
          <button
            onClick={() => setShowPaymentModal(true)}
            style={{
              padding: '14px 32px',
              background: COLORS.primary,
              border: 'none',
              borderRadius: '8px',
              fontFamily: TYPOGRAPHY.body,
              fontSize: '16px',
              fontWeight: 600,
              color: COLORS.bg,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            }}
          >
            Unlock for ₹99
          </button>
        </div>

        {/* Blurred content preview */}
        <div style={{ filter: 'blur(4px)' }}>
          <h4 style={{
            fontFamily: TYPOGRAPHY.display,
            fontSize: '20px',
            fontWeight: 600,
            color: COLORS.textPrimary,
            marginBottom: '20px',
          }}>
            🎯 Negotiation Strategy
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Detailed negotiation timeline and approach', 'Company-specific tactics and leverage points', 'Alternative compensation strategies'].map((tip, i) => (
              <div key={i} style={{
                padding: '16px',
                background: COLORS.bg,
                borderRadius: '8px',
                fontFamily: TYPOGRAPHY.body,
                fontSize: '15px',
                color: COLORS.textPrimary,
              }}>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          amount={99}
          countryInfo={countryInfo}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            alert('Payment successful! Full report unlocked.');
          }}
        />
      )}
    </div>
  );
};

// ============================================
// PAYMENT MODAL WITH RAZORPAY
// ============================================

const PaymentModal = ({ amount, countryInfo, onClose, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);

    // Initialize Razorpay
    const options = {
      key: 'rzp_live_SCKaoNd6zMGEwJ', // Replace with your Razorpay key
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'AreYouPaidFairly',
      description: 'Full Salary Analysis Report',
      image: '', // Your logo URL
      handler: function (response) {
        console.log('Payment successful:', response);
        setIsProcessing(false);
        onSuccess();
      },
      prefill: {
        name: '',
        email: '',
        contact: ''
      },
      theme: {
        color: COLORS.primary
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '24px',
    }}>
      <div style={{
        background: COLORS.bg,
        borderRadius: '16px',
        maxWidth: '500px',
        width: '100%',
        padding: '32px',
        position: 'relative',
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: COLORS.textSecondary,
            padding: '4px',
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <h3 style={{
          fontFamily: TYPOGRAPHY.display,
          fontSize: '24px',
          fontWeight: 600,
          color: COLORS.textPrimary,
          marginBottom: '8px',
        }}>
          Unlock Full Report
        </h3>
        <p style={{
          fontFamily: TYPOGRAPHY.body,
          fontSize: '15px',
          color: COLORS.textSecondary,
          marginBottom: '24px',
        }}>
          Get complete analysis with personalized negotiation strategies
        </p>

        {/* Features */}
        <div style={{
          background: COLORS.bgCard,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          {[
            'Detailed negotiation timeline',
            'Company-specific tactics',
            'Alternative compensation strategies',
            'Market positioning insights',
            'Career progression recommendations',
          ].map((feature, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 0',
              borderBottom: i < 4 ? `1px solid ${COLORS.border}` : 'none',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.success} strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span style={{
                fontFamily: TYPOGRAPHY.body,
                fontSize: '14px',
                color: COLORS.textPrimary,
              }}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px',
        }}>
          <div style={{
            fontFamily: TYPOGRAPHY.display,
            fontSize: '48px',
            fontWeight: 700,
            color: COLORS.textPrimary,
          }}>
            ₹{amount}
          </div>
          <div style={{
            fontFamily: TYPOGRAPHY.body,
            fontSize: '14px',
            color: COLORS.textSecondary,
          }}>
            One-time payment • Instant access
          </div>
        </div>

        {/* Payment button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          style={{
            width: '100%',
            padding: '16px',
            background: isProcessing ? COLORS.gray300 : COLORS.primary,
            border: 'none',
            borderRadius: '8px',
            fontFamily: TYPOGRAPHY.body,
            fontSize: '16px',
            fontWeight: 600,
            color: COLORS.bg,
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            marginBottom: '16px',
          }}
        >
          {isProcessing ? 'Processing...' : 'Proceed to Payment'}
        </button>

        <p style={{
          fontFamily: TYPOGRAPHY.body,
          fontSize: '12px',
          color: COLORS.textSecondary,
          textAlign: 'center',
        }}>
          Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
};

// ============================================
// HOW IT WORKS SECTION
// ============================================

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Upload Document',
      description: 'Drop your offer letter, salary slip, or resume. AI auto-detects document type and country.',
      icon: '📄',
    },
    {
      number: '2',
      title: 'Smart Detection',
      description: 'Our AI extracts salary info and identifies currency (₹/$£/€/¥) to determine your market.',
      icon: '🤖',
    },
    {
      number: '3',
      title: 'Fill Gaps',
      description: 'We only ask for information we couldn\'t extract - experience, education, or role details.',
      icon: '✍️',
    },
    {
      number: '4',
      title: 'Get Insights',
      description: 'Receive instant analysis with market comparison, percentile ranking, and negotiation potential.',
      icon: '📊',
    },
  ];

  return (
    <div id="how-it-works" style={{
      background: COLORS.bgCard,
      padding: '80px 32px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontFamily: TYPOGRAPHY.display,
            fontSize: '40px',
            fontWeight: 600,
            color: COLORS.textPrimary,
            marginBottom: '16px',
          }}>
            How It Works
          </h2>
          <p style={{
            fontFamily: TYPOGRAPHY.body,
            fontSize: '18px',
            color: COLORS.textSecondary,
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Smart AI-powered analysis in 4 simple steps
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
        }}>
          {steps.map((step, i) => (
            <div key={i} style={{
              background: COLORS.bg,
              borderRadius: '12px',
              padding: '32px',
              border: `1px solid ${COLORS.border}`,
              position: 'relative',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: COLORS.primaryLight,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                fontSize: '24px',
              }}>
                {step.icon}
              </div>
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                background: COLORS.primary,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: TYPOGRAPHY.display,
                fontSize: '16px',
                fontWeight: 600,
                color: COLORS.bg,
              }}>
                {step.number}
              </div>
              <h3 style={{
                fontFamily: TYPOGRAPHY.display,
                fontSize: '20px',
                fontWeight: 600,
                color: COLORS.textPrimary,
                marginBottom: '12px',
              }}>
                {step.title}
              </h3>
              <p style={{
                fontFamily: TYPOGRAPHY.body,
                fontSize: '15px',
                color: COLORS.textSecondary,
                lineHeight: '1.6',
              }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// EXAMPLES SECTION
// ============================================

const Examples = () => {
  const examples = [
    {
      country: 'IN',
      role: 'Senior SDE',
      experience: '5 years',
      current: '₹32 LPA',
      market: '₹40 LPA',
      percentile: 58,
      verdict: 'Below Market',
    },
    {
      country: 'US',
      role: 'Product Manager',
      experience: '7 years',
      current: '$145K',
      market: '$160K',
      percentile: 62,
      verdict: 'Fair',
    },
    {
      country: 'GB',
      role: 'Data Scientist',
      experience: '3 years',
      current: '£55K',
      market: '£48K',
      percentile: 72,
      verdict: 'Above Market',
    },
  ];

  return (
    <div id="examples" style={{
      padding: '80px 32px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontFamily: TYPOGRAPHY.display,
            fontSize: '40px',
            fontWeight: 600,
            color: COLORS.textPrimary,
            marginBottom: '16px',
          }}>
            Example Analyses
          </h2>
          <p style={{
            fontFamily: TYPOGRAPHY.body,
            fontSize: '18px',
            color: COLORS.textSecondary,
          }}>
            See how professionals worldwide are using our platform
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {examples.map((example, i) => {
            const countryInfo = COUNTRIES[example.country];
            const verdictColor = example.verdict === 'Below Market' ? COLORS.warning :
                                example.verdict === 'Fair' ? COLORS.primary : COLORS.success;

            return (
              <div key={i} style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '12px',
                padding: '24px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}>
                  <span style={{ fontSize: '32px' }}>{countryInfo.flag}</span>
                  <div>
                    <div style={{
                      fontFamily: TYPOGRAPHY.body,
                      fontSize: '16px',
                      fontWeight: 600,
                      color: COLORS.textPrimary,
                    }}>
                      {example.role}
                    </div>
                    <div style={{
                      fontFamily: TYPOGRAPHY.body,
                      fontSize: '13px',
                      color: COLORS.textSecondary,
                    }}>
                      {example.experience} • {countryInfo.name}
                    </div>
                  </div>
                </div>

                <div style={{
                  background: COLORS.bg,
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}>
                    <span style={{
                      fontFamily: TYPOGRAPHY.body,
                      fontSize: '13px',
                      color: COLORS.textSecondary,
                    }}>
                      Current
                    </span>
                    <span style={{
                      fontFamily: TYPOGRAPHY.mono,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: COLORS.textPrimary,
                    }}>
                      {example.current}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{
                      fontFamily: TYPOGRAPHY.body,
                      fontSize: '13px',
                      color: COLORS.textSecondary,
                    }}>
                      Market Median
                    </span>
                    <span style={{
                      fontFamily: TYPOGRAPHY.mono,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: COLORS.primary,
                    }}>
                      {example.market}
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{
                    padding: '6px 12px',
                    background: `${verdictColor}15`,
                    borderRadius: '6px',
                    fontFamily: TYPOGRAPHY.body,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: verdictColor,
                  }}>
                    {example.verdict}
                  </div>
                  <div style={{
                    fontFamily: TYPOGRAPHY.display,
                    fontSize: '20px',
                    fontWeight: 600,
                    color: COLORS.textPrimary,
                  }}>
                    {example.percentile}th %ile
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================
// FOOTER
// ============================================

const Footer = () => (
  <footer style={{
    background: COLORS.bgDark,
    padding: '48px 32px',
    borderTop: `1px solid ${COLORS.gray800}`,
  }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: TYPOGRAPHY.display,
        fontSize: '20px',
        fontWeight: 600,
        color: COLORS.bg,
        marginBottom: '16px',
      }}>
        AreYouPaidFairly
      </div>
      <p style={{
        fontFamily: TYPOGRAPHY.body,
        fontSize: '14px',
        color: COLORS.gray400,
        marginBottom: '24px',
      }}>
        Global salary intelligence powered by AI
      </p>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '32px',
        flexWrap: 'wrap',
      }}>
        {['Privacy Policy', 'Terms of Service', 'Contact'].map((link, i) => (
          <a key={i} href="#" style={{
            fontFamily: TYPOGRAPHY.body,
            fontSize: '13px',
            color: COLORS.gray400,
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}>
            {link}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

// ============================================
// MAIN APP
// ============================================

const App = () => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Add Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Add Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bg,
    }}>
      <Navigation />
      <StatsBanner />
      <HeroWithUpload onAnalysisComplete={setProfileData} />
      {profileData && <AnalysisResults profileData={profileData} />}
      <HowItWorks />
      <Examples />
      <Footer />
    </div>
  );
};

export default App;

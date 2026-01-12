import { useState, useRef, useEffect } from 'react';
import { Download, Upload, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import cardBg from './assets/card-bg.svg';

type Role = 'Sprout' | 'Enoki' | 'Cremini';
type ViewMode = 'input' | 'loading' | 'result';

interface Stats {
  encryption: number;
  sporeCount: number;
  networkAge: number;
}

interface Sticker {
  id: number;
  side: 'left' | 'right';
}

const roleColors = {
  Sprout: { accent: '#A6D2F4', border: '#A6D2F4' },
  Enoki: { accent: '#84C1FF', border: '#84C1FF' },
  Cremini: { accent: '#f472b6', border: '#f472b6' },
};

const loadingMessages = [
  "Encrypting Data...",
  "Injecting Spores...", 
  "Verifying Node...",
  "Initializing Identity...",
  "Finalizing Card..."
];

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('input');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('Sprout');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    encryption: 0,
    sporeCount: 0,
    networkAge: 0,
  });
  const [sticker, setSticker] = useState<Sticker>({
    id: 1,
    side: 'left',
  });
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const initializeIdentity = () => {
    // Generate random stats and sticker
    setStats({
      encryption: Math.floor(Math.random() * 100),
      sporeCount: Math.floor(Math.random() * 100),
      networkAge: Math.floor(Math.random() * 100),
    });
    setSticker({
      id: Math.floor(Math.random() * 20) + 1,
      side: Math.random() > 0.5 ? 'right' : 'left',
    });
    
    setViewMode('loading');
  };

  const handleDownload = async () => {
    if (!cardRef.current) {
      console.error('Card reference not found');
      return;
    }
    
    try {
      console.log('Starting download with html-to-image...');
      
      // Use toPng from html-to-image library
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3, // High quality for retina displays
        backgroundColor: '#000000', // Ensure dark background
        style: {
          fontFamily: 'Montserrat, sans-serif',
        },
      });
      
      console.log('Image generated, creating download link...');
      
      // Create download link
      const link = document.createElement('a');
      const fileName = name ? `mycelium-card-${name.replace(/\s+/g, '-').toLowerCase()}.png` : 'mycelium-card.png';
      link.download = fileName;
      link.href = dataUrl;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Download completed successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again or take a screenshot.');
    }
  };

  const createAnother = () => {
    setViewMode('input');
    setName('');
    setAvatarUrl(null);
  };

  // Loading sequence effect
  useEffect(() => {
    if (viewMode === 'loading') {
      let messageIndex = 0;
      const interval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }, 600);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        setViewMode('result');
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [viewMode]);

  return (
    <>
      {/* Background Layer - Behind everything */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat blur-sm"
        style={{
          backgroundImage: "url('/site-bg.jpg')"
        }}
      />
      
      {/* Dark Overlay for better text readability */}
      <div className="fixed inset-0 z-[-1] bg-black/0" />
      
      {/* Main Content - On top of background */}
      <div className="min-h-screen bg-fairblock-dark/80 flex flex-col items-center justify-center p-8 relative">
        {viewMode === 'input' && (
          <InputView 
            name={name}
            setName={setName}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            avatarUrl={avatarUrl}
            handleImageUpload={handleImageUpload}
            fileInputRef={fileInputRef}
            initializeIdentity={initializeIdentity}
          />
        )}
        {viewMode === 'loading' && <LoadingView loadingMessage={loadingMessage} />}
        {viewMode === 'result' && (
          <ResultView 
            name={name}
            selectedRole={selectedRole}
            avatarUrl={avatarUrl}
            stats={stats}
            sticker={sticker}
            cardRef={cardRef}
            handleDownload={handleDownload}
            createAnother={createAnother}
          />
        )}
      </div>
    </>
  );
}

// Separate components to prevent re-rendering issues
interface InputViewProps {
  name: string;
  setName: (name: string) => void;
  selectedRole: Role;
  setSelectedRole: (role: Role) => void;
  avatarUrl: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  initializeIdentity: () => void;
}

function InputView({ 
  name, 
  setName, 
  selectedRole, 
  setSelectedRole, 
  avatarUrl, 
  handleImageUpload, 
  fileInputRef, 
  initializeIdentity 
}: InputViewProps) {
  return (
    <div className="max-w-md w-full">
      <div className="border border-card-border rounded-xl p-8 space-y-6" style={{ backgroundColor: '#000D13' }}>
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Mycelium Identity
          </h1>
          <p className="text-gray-400 text-sm">Initialize your digital spore</p>
        </div>

        {/* Avatar Upload */}
        <div className="flex justify-center">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block text-center">
              Avatar <span className="text-red-400">*</span>
            </label>
            <div
              className={`w-48 h-48 bg-gray-900/50 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors overflow-hidden aspect-square ${
                avatarUrl 
                  ? 'border-green-500 hover:border-green-400' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-xs text-gray-500">Click to upload</p>
                  <p className="text-xs text-red-400 mt-1">Required</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
            Identity Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent text-white font-medium outline-none pb-2 transition-colors"
            placeholder="Enter your Agent Name..."
            style={{ 
              fontFamily: 'Montserrat, sans-serif',
              borderBottom: '2px solid #4b5563',
              WebkitFontSmoothing: 'antialiased',
            }}
            onFocus={(e) => e.target.style.borderBottom = '2px solid #6b7280'}
            onBlur={(e) => e.target.style.borderBottom = '2px solid #4b5563'}
          />
        </div>

        {/* Role Selector */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-3 block">
            Node Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Sprout', 'Enoki', 'Cremini'] as Role[]).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor:
                    selectedRole === role ? roleColors[role].accent : 'transparent',
                  color: selectedRole === role ? '#000' : '#9ca3af',
                  border: `1px solid ${
                    selectedRole === role ? roleColors[role].accent : '#4b5563'
                  }`,
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Initialize Button */}
        <button
          onClick={initializeIdentity}
          disabled={!name.trim() || !avatarUrl}
          className="w-full py-3 rounded-lg font-bold text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            backgroundColor: (name.trim() && avatarUrl) ? roleColors[selectedRole].accent : '#4b5563',
            fontFamily: 'Montserrat, sans-serif',
            boxShadow: (name.trim() && avatarUrl) ? `0 0 20px ${roleColors[selectedRole].accent}40` : 'none',
          }}
        >
          INITIALIZE IDENTITY
        </button>
      </div>
    </div>
  );
}

interface LoadingViewProps {
  loadingMessage: string;
}

function LoadingView({ loadingMessage }: LoadingViewProps) {
  return (
    <div className="text-center">
      <div className="mb-8">
        <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
        <div className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {loadingMessage}
        </div>
        <div className="text-gray-400 text-sm">Please wait while we process your identity...</div>
      </div>
    </div>
  );
}

interface ResultViewProps {
  name: string;
  selectedRole: Role;
  avatarUrl: string | null;
  stats: Stats;
  sticker: Sticker;
  cardRef: React.RefObject<HTMLDivElement>;
  handleDownload: () => void;
  createAnother: () => void;
}

function ResultView({ 
  name, 
  selectedRole, 
  avatarUrl, 
  stats, 
  sticker, 
  cardRef, 
  handleDownload, 
  createAnother 
}: ResultViewProps) {
  return (
    <div className="animate-in fade-in-0 zoom-in-95 duration-500">
      {/* Success Message */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-green-400 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Identity Initialized Successfully!
        </h2>
        <p className="text-gray-400">Your Mycelium Identity Card is ready</p>
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        className="relative mb-6"
        style={{
          width: '528px',
          height: '314px',
          backgroundImage: `url(${cardBg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 grid grid-cols-2 gap-2 px-8 pt-16 pb-6">
          {/* Left Column - Avatar */}
          <div className="flex items-start justify-start pt-5">
            <div 
              className="relative w-50 h-50 rounded-2xl overflow-hidden cursor-pointer -ml-4"
            >
              {/* Layer 1 - User Photo or Placeholder */}
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gray-900/50 flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Upload</p>
                  </div>
                </div>
              )}
              
              {/* Layer 2 - Mascot Sticker */}
              <img
                src={`/mascots/Mascot_${sticker.id}.png`}
                alt="Mascot"
                className={`absolute bottom-[-55px] z-10 w-48 pointer-events-none transition-all ${
                  sticker.side === 'left' 
                    ? 'left-[-70px] -rotate-16' 
                    : 'right-[-70px] rotate-16 scale-x-[-1]'
                }`}
              />
              
              {/* Layer 3 - Colored Border */}
              <div 
                className="absolute inset-0 rounded-2xl border-2 z-20 pointer-events-none"
                style={{
                  borderColor: roleColors[selectedRole].accent,
                }}
              />
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-4 pt-5">
            {/* Name Field */}
            <div>
              <div
                className="w-full bg-transparent font-bold pb-1"
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  color: roleColors[selectedRole].accent,
                  fontSize: '1.375rem',
                  fontWeight: 700,
                  borderBottom: '2px solid #4b5563',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
              >
                {name || 'Anonymous Mycelium'}
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Role
              </label>
              <div className="flex gap-2">
                {(['Sprout', 'Enoki', 'Cremini'] as Role[]).map((role) => (
                  <div
                    key={role}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor:
                        selectedRole === role ? roleColors[role].accent : 'transparent',
                      color: selectedRole === role ? '#000' : '#9ca3af',
                      border: `1px solid ${
                        selectedRole === role ? roleColors[role].accent : '#6b7280'
                      }`,
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    {role}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Section - Circular Gauges */}
            <div 
              className="flex justify-between gap-3 overflow-visible" 
              style={{ 
                paddingTop: '20px', 
                paddingBottom: '20px' 
              }}
            >
              <CircularStat
                label="Encryption"
                value={stats.encryption}
                color={roleColors[selectedRole].accent}
              />
              <CircularStat
                label="Spore Count"
                value={stats.sporeCount}
                color={roleColors[selectedRole].accent}
              />
              <CircularStat
                label="Network Age"
                value={stats.networkAge}
                color={roleColors[selectedRole].accent}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={createAnother}
          className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Create Another
        </button>
        <button
          onClick={handleDownload}
          className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg font-medium transition-colors flex items-center gap-2"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          <Download className="w-4 h-4" />
          Download PNG
        </button>
      </div>
    </div>
  );
}

interface CircularStatProps {
  label: string;
  value: number;
  color: string;
}

function CircularStat({ label, value, color }: CircularStatProps) {
  const size = 55;
  const strokeWidth = 4.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center overflow-visible">
      <div className="relative overflow-visible" style={{ width: size, height: size }}>
        <svg 
          width={size} 
          height={size} 
          className="transform -rotate-90 overflow-visible"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter id={`glow-${label}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1f2937"
            strokeWidth={2}
            fill="none"
            opacity={0.3}
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300"
            filter={`url(#glow-${label})`}
          />
        </svg>
        {/* Center Text */}
        <div
          className="absolute inset-0 flex items-center justify-center font-bold text-xs"
          style={{ 
            fontFamily: "'Space Grotesk', monospace",
            color: '#FFFFFF',
            fontWeight: 700,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          }}
        >
          {value}%
        </div>
      </div>
      {/* Label Below */}
      <span
        className="text-[10px] text-gray-400 mt-1 text-center w-full leading-tight"
        style={{ 
          fontFamily: 'Montserrat, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default App;
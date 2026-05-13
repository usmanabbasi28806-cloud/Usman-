import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Video, Send, CheckCircle, Loader2, Play, X, User, Download, ExternalLink, LogOut, Mail, Lock } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [script, setScript] = useState('');
  const [status, setStatus] = useState<'idle' | 'generating' | 'done'>('idle');
  const [videoUrl, setVideoUrl] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [videoDuration, setVideoDuration] = useState<number>(1);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [language, setLanguage] = useState<'English' | 'Urdu'>('English');
  const [isVoiceClone, setIsVoiceClone] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Designated Master Admin Email
  const MASTER_ADMIN_EMAIL = 'usmanabbasi28806@gmail.com';
  const isAdmin = user?.email === MASTER_ADMIN_EMAIL;

  // Sample video for preview purposes
  const previewVideoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";

  // Generate 60+ Famous Avatars
  const famousAvatars = Array.from({ length: 64 }, (_, i) => ({
    id: `avatar-${i}`,
    name: `Persona ${i + 1}`,
    url: `https://i.pravatar.cc/300?u=heygen-${i}`
  }));

  const handleAuth = (e: FormEvent) => {
    e.preventDefault();
    if (authMode === 'register' && !authForm.name) return;
    if (!authForm.email || !authForm.password) return;
    
    setUser({ 
      name: authForm.name || authForm.email.split('@')[0], 
      email: authForm.email 
    });
  };

  const handleGoogleSignIn = () => {
    setUser({ name: 'Google User', email: 'user@gmail.com' });
  };

  const handlePhotoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
    }
  };

  // Speak sample for voice preview
  const previewVoice = (voiceName: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Hello, I am ${voiceName}. I am ready to be your AI voice.`);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceSelect = (voice: typeof famousVoices[0]) => {
    setSelectedVoice(voice);
    previewVoice(voice.name);
  };

  const handleGenerate = async () => {
    if (!photo || !script.trim()) {
      alert("Please select an avatar and enter a script!");
      return;
    }
    
    setStatus('generating');
    setGenerationProgress(0);
    
    // Smooth scroll to bottom to show loading
    const container = document.getElementById('scroll-container');
    if (container) container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });

    // Simulate progress based on duration (longer duration = slightly longer wait)
    const totalSteps = 100;
    const intervalTime = (videoDuration * 50); // Speed up for demo but link to duration
    
    for (let i = 0; i <= totalSteps; i++) {
      setGenerationProgress(i);
      await new Promise(resolve => setTimeout(resolve, intervalTime));
    }
    
    setVideoUrl(`https://heygendev.app/v/${Math.random().toString(36).substring(7)}/output.mp4`);
    setStatus('done');
    
    // Play success sound beep
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  // Generate 350+ Famous Voices
  const maleNames = ['Adam', 'James', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles'];
  const femaleNames = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen'];
  
  const famousVoices = [
    { id: 'adam-pro', name: 'Adam (ScribalTech)', gender: 'Male', quality: 'Ultra' },
    ...Array.from({ length: 350 }, (_, i) => {
      const isMale = i % 2 === 0;
      const namePool = isMale ? maleNames : femaleNames;
      const baseName = namePool[Math.floor(Math.random() * namePool.length)];
      return {
        id: `v-${i}`,
        name: `${baseName} ${101 + i}`,
        gender: isMale ? 'Male' : 'Female',
        quality: i < 50 ? 'Free' : 'HD'
      };
    })
  ];

  const [selectedVoice, setSelectedVoice] = useState(famousVoices[0]);

  const reset = () => {
    setPhoto(null);
    setScript('');
    setStatus('idle');
    setVideoUrl('');
    setIsPreviewing(false);
  };

  const logout = () => {
    setUser(null);
    reset();
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-4 font-sans text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      
      {/* Mobile Frame Simulation */}
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[400px] min-h-[700px] bg-white dark:bg-neutral-900 rounded-[40px] shadow-2xl overflow-hidden flex flex-col border border-neutral-200 dark:border-neutral-800 relative"
        id="app-container"
      >
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div
              key="auth-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col p-8 justify-center"
            >
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                  <Video className="text-white" size={32} />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">ScribalTech AI</h1>
                <p className="text-neutral-500 mt-2 text-sm">Create magic with AI Avatars</p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {authMode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                        <input
                          type="text"
                          placeholder="Full Name"
                          required={authMode === 'register'}
                          className="w-full pl-12 pr-4 py-3.5 bg-neutral-100 dark:bg-neutral-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                          value={authForm.name}
                          onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-neutral-100 dark:bg-neutral-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-neutral-100 dark:bg-neutral-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  {authMode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
                <span className="text-xs text-neutral-400 font-medium uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="w-full py-3.5 border border-neutral-200 dark:border-neutral-700 rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all active:scale-95 text-sm font-semibold"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className="mt-8 text-center text-sm text-neutral-500">
                {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="ml-2 text-blue-600 font-bold hover:underline"
                >
                  {authMode === 'login' ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="main-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col"
            >
              <div className="px-6 pt-10 pb-4 flex justify-between items-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAdmin ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
                    <User size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold truncate max-w-[150px]">
                      {isAdmin ? 'System Admin' : `ScribalTech AI`}
                    </h2>
                    <p className={`text-[10px] uppercase tracking-wider font-semibold ${isAdmin ? 'text-amber-500' : 'text-neutral-500'}`}>
                      {isAdmin ? 'Full Access Owner' : 'Full Access (Free)'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isAdmin && (
                    <button 
                      onClick={() => setIsAdminPanelOpen(true)}
                      className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                      title="Admin Panel"
                    >
                      <Lock size={20} />
                    </button>
                  )}
                  <button 
                    onClick={logout}
                    className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 flex-1 flex flex-col overflow-y-auto" id="scroll-container">
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight">ScribalTech AI</h1>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Transform your photo into a talking video.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Library (60+ Avatars)</label>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-tight"
                    >
                      Upload Custom
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 h-[180px] overflow-y-auto p-1 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800/50 scrollbar-hide">
                    {famousAvatars.map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => {
                          setPhoto(avatar.url);
                          // Play click sound
                          new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(() => {});
                        }}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          photo === avatar.url ? 'border-blue-500 scale-95 shadow-md shadow-blue-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handlePhotoSelect} 
                    className="hidden" 
                    accept="image/*"
                  />
                  
                  <AnimatePresence mode="wait">
                    {photo && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative group rounded-2xl overflow-hidden aspect-video bg-neutral-100 dark:bg-neutral-800 border-2 border-blue-500 shadow-xl"
                      >
                        <img src={photo} alt="Selected" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                          <span className="text-white text-[10px] font-bold uppercase tracking-widest">Active Avatar</span>
                        </div>
                        <button 
                          onClick={() => setPhoto(null)}
                          className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-sm"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Enter Script</label>
                  <textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder="What should your avatar say?"
                    className="w-full min-h-[120px] p-4 bg-neutral-100 dark:bg-neutral-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-sm leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Video Size (Ratio)</label>
                  <div className="flex gap-2">
                    {[
                      { label: '9:16', value: '9:16' },
                      { label: '16:9', value: '16:9' }
                    ].map((ratio) => (
                      <button
                        key={ratio.value}
                        onClick={() => setAspectRatio(ratio.value as any)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                          aspectRatio === ratio.value
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                            : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {ratio.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Video Duration (Minutes)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((min) => (
                      <button
                        key={min}
                        onClick={() => setVideoDuration(min)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                          videoDuration === min
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                            : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {min}m
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">AI Voice (350+ Library)</label>
                    <span className="text-[10px] text-blue-500 font-bold uppercase">{selectedVoice.quality} {selectedVoice.gender}</span>
                  </div>
                  <div className="h-[140px] overflow-y-auto p-1 space-y-1 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl border border-neutral-100 dark:border-neutral-800/50 scrollbar-hide">
                    {famousVoices.map((voice) => (
                      <button
                        key={voice.id}
                        onClick={() => handleVoiceSelect(voice)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          selectedVoice.id === voice.id 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                            : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                            selectedVoice.id === voice.id ? 'bg-white/20' : 'bg-neutral-100 dark:bg-neutral-700'
                          }`}>
                            {voice.gender[0]}
                          </div>
                          <span className="text-xs font-bold">{voice.name}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          selectedVoice.id === voice.id ? 'bg-white/20' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-500'
                        }`}>
                          {voice.quality}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Language</label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="w-full py-2.5 px-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-medium outline-none"
                    >
                      <option value="English">English</option>
                      <option value="Urdu">Urdu</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Voice Clone</label>
                    <button
                      onClick={() => setIsVoiceClone(!isVoiceClone)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all border ${
                        isVoiceClone 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600' 
                          : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${isVoiceClone ? 'bg-blue-500' : 'bg-neutral-300'}`} />
                      {isVoiceClone ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                <div className="mt-auto pt-4 relative">
                  <AnimatePresence mode="wait">
                    {status === 'idle' && (
                      <motion.button
                        key="generate-btn"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onClick={handleGenerate}
                        disabled={!photo || !script.trim()}
                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                          photo && script.trim() 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98]' 
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <Send size={18} />
                        <span>Generate Video</span>
                      </motion.button>
                    )}

                    {status === 'generating' && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full p-6 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex flex-col items-center justify-center gap-4 border border-neutral-200 dark:border-neutral-700"
                      >
                        <Loader2 className="animate-spin text-blue-500" size={24} />
                        <div className="w-full space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                             <span>Processing {videoDuration}m Video</span>
                             <span>{generationProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-blue-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${generationProgress}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-bold tracking-wide animate-pulse">GENERATING AI CONTENT...</span>
                      </motion.div>
                    )}

                    {status === 'done' && (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-900/30">
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                             <CheckCircle size={18} />
                             <span className="font-bold text-sm">Video Ready</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mt-4">
                            <button
                              onClick={() => setIsPreviewing(true)}
                              className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all"
                            >
                              <Play size={14} fill="currentColor" />
                              Preview
                            </button>
                            <a
                              href={previewVideoUrl}
                              download="heygen_video.mp4"
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
                            >
                              <Download size={14} />
                              Download
                            </a>
                          </div>
                        </div>
                        
                        <button
                          onClick={reset}
                          className="w-full py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-bold text-sm"
                        >
                          Create New
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Video Preview Overlay */}
              <AnimatePresence>
                {isPreviewing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-6"
                  >
                    <button 
                      onClick={() => setIsPreviewing(false)}
                      className="absolute top-10 right-6 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 backdrop-blur-md z-[60]"
                    >
                      <X size={20} />
                    </button>
                    
                    <div className={`w-full ${aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-[16/9]'} bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl relative border border-white/10`}>
                      <video 
                        src={previewVideoUrl} 
                        controls 
                        autoPlay 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <p className="mt-8 text-white font-bold text-lg tracking-tight">AI Generated Preview</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mt-2">
                       Powered by HeyGen Engine
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Admin Dashboard Overlay */}
              <AnimatePresence>
                {isAdminPanelOpen && (
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute inset-0 z-50 bg-white dark:bg-neutral-950 flex flex-col pt-12"
                  >
                    <div className="px-6 py-4 flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500 rounded-lg text-white">
                          <Lock size={18} />
                        </div>
                        <h2 className="text-lg font-bold">Admin Dashboard</h2>
                      </div>
                      <button 
                        onClick={() => setIsAdminPanelOpen(false)}
                        className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                          <p className="text-[10px] uppercase font-bold text-blue-600 mb-1">Total Users</p>
                          <p className="text-2xl font-black">1,284</p>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                          <p className="text-[10px] uppercase font-bold text-purple-600 mb-1">Videos Gen</p>
                          <p className="text-2xl font-black">42.8k</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Library Control</h3>
                        <div className="grid grid-cols-1 gap-2">
                          <button className="flex items-center justify-between p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl text-left hover:bg-neutral-200 transition-colors">
                             <div className="flex items-center gap-3">
                               <ImageIcon size={18} className="text-blue-500" />
                               <div>
                                 <p className="text-sm font-bold">Manage Avatars</p>
                                 <p className="text-[10px] text-neutral-500">64 Active Personas</p>
                               </div>
                             </div>
                             <ExternalLink size={14} className="text-neutral-400" />
                          </button>
                          <button className="flex items-center justify-between p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl text-left hover:bg-neutral-200 transition-colors">
                             <div className="flex items-center gap-3">
                               <Video size={18} className="text-purple-500" />
                               <div>
                                 <p className="text-sm font-bold">Manage Voices</p>
                                 <p className="text-[10px] text-neutral-500">351 AI Profiles</p>
                               </div>
                             </div>
                             <ExternalLink size={14} className="text-neutral-400" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                         <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 tracking-widest text-[10px]">Recent Activity</h3>
                         {[1, 2, 3].map((_, i) => (
                           <div key={i} className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
                             <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs uppercase">
                               U{i}
                             </div>
                             <div className="flex-1">
                               <p className="text-[11px] font-bold">User_{823 + i} Generated a Video</p>
                               <p className="text-[10px] text-neutral-500">{i + 1} min ago</p>
                             </div>
                           </div>
                         ))}
                      </div>
                    </div>

                    <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800">
                      <p className="text-center text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                        Owner Identity: {MASTER_ADMIN_EMAIL}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Bar Simulation */}
              <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-around bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md">
                <Play size={20} className="text-blue-600" />
                <User size={20} className="text-neutral-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Aesthetic Background */}
      <div className="fixed -z-10 top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-400 dark:bg-blue-600/30 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-400 dark:bg-purple-600/30 rounded-full blur-[150px]" />
      </div>
    </div>
  );
}

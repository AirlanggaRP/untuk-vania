
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VANIA_CONFIG, FUN_FACTS } from './constants';
import { Answer } from './types';
import FloatingHearts from './components/FloatingHearts';

const App: React.FC = () => {
  const [answer, setAnswer] = useState<Answer>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showOverlay, setShowOverlay] = useState(true);


  // Fungsi untuk mengatur play/pause dengan efek fade
  const toggleMusic = async () => {
    if (!audioRef.current || audioError) return;

    if (isPlaying) {
      // Fade out sederhana sebelum pause
      let vol = 0.3;
      const fadeOut = setInterval(() => {
        if (vol > 0.05) {
          vol -= 0.05;
          if (audioRef.current) audioRef.current.volume = vol;
        } else {
          clearInterval(fadeOut);
          audioRef.current?.pause();
          setIsPlaying(false);
        }
      }, 50);
    } else {
      try {
        audioRef.current.volume = 0;
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
          
          // Fade in musik
          let vol = 0;
          const fadeIn = setInterval(() => {
            if (vol < 0.3) {
              vol += 0.02;
              if (audioRef.current) audioRef.current.volume = vol;
            } else {
              clearInterval(fadeIn);
            }
          }, 100);
        }
      } catch (err) {
        console.error("Audio playback failed:", err);
        setAudioError(true);
      }
    }
  };

  const handleAnswer = (val: Answer) => {
    setAnswer(val);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    const hasStarted = localStorage.getItem('vania_music_started');

    if (!audioRef.current) return;

    if (hasStarted === 'true') {
      audioRef.current.volume = 0;
      audioRef.current.muted = false;

      audioRef.current.play().then(() => {
        setIsPlaying(true);

        let vol = 0;
        const fadeIn = setInterval(() => {
          if (vol < 0.3) {
            vol += 0.02;
            audioRef.current!.volume = vol;
          } else {
            clearInterval(fadeIn);
          }
        }, 100);
      });

      setShowOverlay(false);
    }
  }, []);

  const startMoment = async () => {
    if (!audioRef.current) return;

    audioRef.current.volume = 0;
    audioRef.current.muted = false;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      localStorage.setItem('vania_music_started', 'true');

      let vol = 0;
      const fadeIn = setInterval(() => {
        if (vol < 0.3) {
          vol += 0.02;
          audioRef.current!.volume = vol;
        } else {
          clearInterval(fadeIn);
        }
      }, 100);

      setShowOverlay(false);
    } catch {
      setAudioError(true);
    }
  };



  return (
    <div ref={containerRef} className="relative min-h-screen font-sans text-slate-800 bg-[#FFFDF9] selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden pb-20">
      <FloatingHearts />
      
      {/* Audio Element (Hidden) */}
      <audio 
        ref={audioRef} 
        src={VANIA_CONFIG.musicPath} 
        loop 
        preload="auto"
        onError={() => setAudioError(true)}
      />
      <AnimatePresence>
        {showOverlay && !audioError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="fixed inset-0 z-[999] bg-[#FFFDF9] flex items-center justify-center"
            onClick={startMoment}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center cursor-pointer"
            >
              <p className="font-script text-4xl text-rose-400 mb-4">
                Tap to start the moment ✨
              </p>
              <p className="text-slate-400 font-light italic text-sm">
                Sebuah cerita kecil dimulai dengan satu sentuhan
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Floating Music Control */}
      {!audioError && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
          <AnimatePresence>
            {isPlaying && (
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-serif italic text-rose-400 shadow-sm border border-rose-50"
              >
                Lagu kecil untuk perasaan ini...
              </motion.span>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMusic}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-colors duration-500 border-2 ${
              isPlaying ? 'bg-rose-500 border-rose-300 text-white' : 'bg-white border-rose-100 text-rose-400'
            }`}
          >
            {isPlaying ? (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </motion.div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
            )}
          </motion.button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="font-script text-3xl text-rose-400 mb-4 block">Halooo Vaniaaa Cantikk</span>
          <h1 className="font-serif text-5xl md:text-7xl font-light mb-6 leading-tight">
            Boleh aku jujur <br /> <span className="italic text-rose-300">sedikit saja?</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-light max-w-lg mx-auto leading-relaxed">
            Ini bukan website biasa, <br /> 
            ini tentang sebuah perasaan yang tumbuh.
          </p>
        </motion.div>

        <motion.div 
          className="absolute bottom-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-px h-16 bg-slate-200 mx-auto"></div>
        </motion.div>
      </section>

      {/* About Section & Polaroid */}
      <section className="py-24 px-6 max-w-6xl mx-auto z-10 relative flex flex-col md:flex-row items-center gap-16">
        {/* Polaroid Style Photo */}
        <motion.div
          initial={{ opacity: 0, x: -50, rotate: -5 }}
          whileInView={{ opacity: 1, x: 0, rotate: -3 }}
          viewport={{ once: true }}
          whileHover={{ rotate: 0, scale: 1.05 }}
          transition={{ duration: 0.8 }}
          className="relative group w-full max-w-sm"
        >
          <div className="bg-white p-4 pb-12 shadow-2xl rounded-sm border border-slate-100 transform transition-all duration-500">
            <div className="overflow-hidden aspect-[4/5] bg-slate-100 mb-4 rounded-sm">
              <img 
                src={VANIA_CONFIG.photoPath} 
                alt="Vania Dhiya Pramudita" 
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop";
                }}
              />
            </div>
            <p className="font-script text-2xl text-center text-slate-400 group-hover:text-rose-400 transition-colors">
              Beautiful Vania ✨
            </p>
          </div>
          {/* Decorative Sparkle */}
          <div className="absolute -top-4 -right-4 text-rose-300 text-3xl opacity-0 group-hover:opacity-100 transition-opacity">✦</div>
        </motion.div>

        {/* Content Section */}
        <div className="flex-1 space-y-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <h2 className="font-serif text-4xl mb-2">{VANIA_CONFIG.fullName}</h2>
            <p className="text-rose-400 font-medium tracking-widest text-sm uppercase">{VANIA_CONFIG.birthDate}</p>
          </motion.div>

          <div className="space-y-6">
            {VANIA_CONFIG.traits.map((trait, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-rose-50 shadow-sm hover:shadow-md transition-all group"
              >
                <h3 className="font-serif text-xl mb-2 text-rose-500 italic group-hover:translate-x-1 transition-transform">{trait.title}</h3>
                <p className="text-slate-600 font-light leading-relaxed">{trait.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fun Facts Section */}
      <section className="py-32 bg-rose-50/30">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl mb-4 text-slate-700">Hal-hal yang Bikin Aku Senyum</h2>
            <p className="text-slate-400 italic font-light">Beberapa pengakuan kecil yang selama ini hanya kusimpan sendiri...</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {FUN_FACTS.map((fact) => (
              <motion.div
                key={fact.id}
                whileHover={{ y: -10, rotate: 1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-rose-100 flex flex-col items-center text-center cursor-default group"
              >
                <span className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-500">{fact.icon}</span>
                <h4 className="font-serif text-xl mb-2 text-rose-400">{fact.title}</h4>
                <p className="text-slate-500 font-light leading-relaxed">{fact.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Serius Section */}
      <section className="py-32 px-6 max-w-2xl mx-auto text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-5 text-rose-500">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          
          <h2 className="font-serif text-3xl mb-8 text-slate-800">Sedikit Lebih Serius...</h2>
          <div className="space-y-6 text-slate-600 font-light leading-loose text-lg">
            <p>
              Vania, walaupun masih singkat mengenalmu adalah salah satu hal terbaik yang terjadi padaku tahun ini. 
              Caramu bicara, caramu memandang dunia, semuanya terasa begitu indah.
            </p>
            <p>
              Aku tidak ingin terburu-buru, tapi aku juga tidak ingin memendam rasa ini terlalu lama. 
              Aku ingin menjagamu, dan ada untukmu di setiap harimu.
            </p>
          </div>
        </motion.div>
      </section>

      {/* The Question */}
      <section className="py-40 px-6 text-center z-10 relative overflow-hidden bg-white/40">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="mb-12">
            <span className="font-script text-4xl text-rose-400 block mb-4">Jadi...</span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-slate-800">
              Kamu mau jadi <span className="italic text-rose-500 underline decoration-rose-200 underline-offset-8">pacarku</span>? kan
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer('yes')}
              className={`px-10 py-4 rounded-full font-medium transition-all duration-500 shadow-lg ${
                answer === 'yes' 
                ? 'bg-rose-500 text-white shadow-rose-200' 
                : 'bg-white border border-rose-100 text-rose-500 hover:bg-rose-50'
              }`}
            >
              YES 💗
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer('slow')}
              className={`px-10 py-4 rounded-full font-medium transition-all duration-500 shadow-md ${
                answer === 'slow'
                ? 'bg-slate-700 text-white shadow-slate-200'
                : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Kita jalan pelan-pelan dulu 😊
            </motion.button>
          </div>
        </motion.div>

        {/* Response Message */}
        <AnimatePresence>
          {answer && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-20 max-w-xl mx-auto p-10 rounded-3xl bg-white shadow-2xl shadow-rose-100 border border-rose-50"
            >
              <h3 className="font-serif text-2xl mb-4 text-rose-600">
                {answer === 'yes' ? 'Terima kasih, Vania! ✨' : 'Aku hargai kejujuranmu...'}
              </h3>
              <p className="text-slate-600 font-light leading-relaxed">
                {answer === 'yes' 
                  ? 'Kamu membuatku menjadi orang paling bahagia hari ini. Mari kita mulai perjalanan baru kita dengan penuh kasih sayang. I Love U 💗' 
                  : 'GADA YA, HARUS PENCET IYA.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer / Ending */}
      <footer className="py-20 px-6 text-center border-t border-rose-50 relative z-10 bg-white/20">
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
        >
          <p className="font-serif text-xl text-slate-400 mb-4 italic">
            "Apa pun jawabannya, aku terima tapi harus YES."
          </p>
          <p className="text-slate-300 text-xs tracking-[0.2em] uppercase font-light">
            With Love, Dari si Ganteng
          </p>
        </motion.div>
      </footer>

      {/* Decorative Fixed Elements */}
      <div className="fixed top-20 right-10 opacity-[0.03] pointer-events-none rotate-12 hidden md:block">
        <img src="https://picsum.photos/seed/flower/300/300" alt="decor" className="rounded-full grayscale" />
      </div>
      <div className="fixed bottom-20 left-10 opacity-[0.03] pointer-events-none -rotate-12 hidden md:block">
         <img src="https://picsum.photos/seed/leaf/300/300" alt="decor" className="rounded-full grayscale" />
      </div>
    </div>
  );
};

export default App;

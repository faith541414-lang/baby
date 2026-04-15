/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, RefreshCw, Calendar, Clock, Sparkles, User, Send, Upload, ArrowLeft } from 'lucide-react';
import { LOVE_MESSAGES, SPECIAL_DAYS } from './constants';
import { 
  getManilaNow, 
  getNextMonthsary, 
  getMonthsaryNumber, 
  getNextSpecialDay, 
  formatDuration 
} from './time';

// --- Components ---

function AuthGate({ children }: { children: React.ReactNode }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [passAnswer, setPassAnswer] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("is_authed") === "true";
  });
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer.toLowerCase().trim() === "my baby boy" && passAnswer === "🍑") {
      setIsAuthenticated(true);
      sessionStorage.setItem("is_authed", "true");
      setError("");
    } else {
      setError("Incorrect answers, my love. Try again? ❤️");
    }
  };

  if (isAuthenticated) return <>{children}</>;

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Petals for Login */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <Petal 
            key={i} 
            delay={Math.random() * 5} 
            left={`${Math.random() * 100}%`} 
            duration={15 + Math.random() * 10} 
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-rose-100 text-center space-y-8 relative z-10"
      >
        <div className="space-y-3">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10 text-rose-500 animate-pulse fill-rose-500" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-rose-900">Unlock Our Memories</h1>
          <p className="text-rose-400 font-medium italic">Only for my favorite person...</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.2em] ml-2">
              what you call me that makes me shy
            </label>
            <input 
              type="text" 
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Your answer..."
              className="w-full px-6 py-4 rounded-2xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all bg-rose-50/30 text-rose-900 placeholder:text-rose-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.2em] ml-2">
              show me your
            </label>
            <input 
              type="text" 
              value={passAnswer}
              onChange={(e) => setPassAnswer(e.target.value)}
              placeholder="Enter the emoji..."
              className="w-full px-6 py-4 rounded-2xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all bg-rose-50/30 text-rose-900 placeholder:text-rose-200"
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-rose-600 text-sm font-medium text-center bg-rose-50 py-2 rounded-xl"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit"
            className="w-full py-5 bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
          >
            <Sparkles className="w-6 h-6" />
            Enter Our World
          </button>
        </form>
      </motion.div>
    </div>
  );
}

interface PetalProps {
  delay: number;
  left: string;
  duration: number;
  key?: number | string;
}

const Petal = ({ delay, left, duration }: PetalProps) => (
  <div 
    className="petal"
    style={{ 
      left, 
      animationDelay: `${delay}s`, 
      animationDuration: `${duration}s`,
      width: '20px',
      height: '20px'
    }}
  >
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-rose-200/40 w-full h-full">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
    </svg>
  </div>
);

const FlowerSVG = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 text-rose-400 animate-pulse">
    <circle cx="50" cy="50" r="10" fill="currentColor" />
    {[0, 60, 120, 180, 240, 300].map((angle) => (
      <ellipse
        key={angle}
        cx="50"
        cy="30"
        rx="15"
        ry="25"
        fill="currentColor"
        fillOpacity="0.6"
        transform={`rotate(${angle} 50 50)`}
      />
    ))}
  </svg>
);

// --- Pages ---

function Home() {
  const [now, setNow] = useState(getManilaNow());
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(getManilaNow());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextMonthsaryDate = useMemo(() => getNextMonthsary(now), [now.getMonth(), now.getDate()]);
  const monthsaryNum = useMemo(() => getMonthsaryNumber(nextMonthsaryDate), [nextMonthsaryDate]);
  const mainDuration = formatDuration(nextMonthsaryDate.getTime() - now.getTime());

  const specialDaysList = useMemo(() => {
    const list = SPECIAL_DAYS.map(day => {
      const nextDate = getNextSpecialDay(now, day.month, day.day);
      return {
        ...day,
        nextDate,
        daysLeft: Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      };
    });

    list.push({
      name: `${monthsaryNum}${getOrdinal(monthsaryNum)} Monthsary`,
      month: nextMonthsaryDate.getMonth(),
      day: nextMonthsaryDate.getDate(),
      nextDate: nextMonthsaryDate,
      daysLeft: Math.ceil((nextMonthsaryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    });

    return list.sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());
  }, [now.getMonth(), now.getDate(), monthsaryNum]);

  const nextMessage = () => {
    setMessageIndex((prev) => (prev + 1) % LOVE_MESSAGES.length);
  };

  function getOrdinal(n: number) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-sans selection:bg-rose-200 selection:text-rose-900">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <Petal 
            key={i} 
            delay={Math.random() * 10} 
            left={`${Math.random() * 100}%`} 
            duration={10 + Math.random() * 20} 
          />
        ))}
      </div>

      <header className="relative z-10 pt-16 pb-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-4">
            <Link to="/bfac" className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-rose-100 rounded-full text-rose-600 font-medium hover:bg-white transition-all shadow-sm">
              <User className="w-4 h-4" />
              Use your bf account
            </Link>
          </div>
          <h2 className="font-cursive text-2xl md:text-3xl text-rose-500 mb-2">Our Love Journey</h2>
          {now.getDate() === 15 ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4 mb-8"
            >
              <h1 className="font-serif text-5xl md:text-8xl font-bold text-rose-600 animate-pulse">
                Happy Monthsary! ❤️
              </h1>
              <p className="text-rose-400 font-serif text-xl italic">Today is our special day...</p>
            </motion.div>
          ) : (
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-rose-900 mb-6 tracking-tight">
              Next Monthsary: <span className="text-rose-600 italic">{nextMonthsaryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </h1>
          )}
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-10">
            {[
              { label: 'Days', value: mainDuration.days },
              { label: 'Hours', value: mainDuration.hours },
              { label: 'Minutes', value: mainDuration.minutes },
              { label: 'Seconds', value: mainDuration.seconds },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <div className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl p-4 md:p-6 shadow-sm min-w-[80px] md:min-w-[120px]">
                  <span className="block font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-rose-800 tabular-nums">
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="mt-2 text-rose-400 font-medium uppercase tracking-widest text-xs md:text-sm">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          
          <motion.p 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-10 font-cursive text-3xl md:text-4xl text-rose-600"
          >
            Countdown to our {monthsaryNum}{getOrdinal(monthsaryNum)} Monthsary
          </motion.p>
        </motion.div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-24 space-y-24">
        <section className="flex justify-center">
          <motion.div 
            whileHover={{ y: -5 }}
            className="w-full max-w-2xl bg-white rounded-[2rem] shadow-xl shadow-rose-200/50 overflow-hidden border border-rose-50"
          >
            <div className="bg-rose-50 p-8 flex justify-center items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <Sparkles className="absolute top-4 left-4 text-rose-400" />
                <Sparkles className="absolute bottom-4 right-4 text-rose-400" />
              </div>
              <FlowerSVG />
            </div>
            
            <div className="p-8 md:p-12 text-center space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={messageIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="min-h-[180px] flex items-center justify-center"
                >
                  <p className="font-serif text-xl md:text-2xl italic leading-relaxed text-rose-800">
                    "{LOVE_MESSAGES[messageIndex]}"
                  </p>
                </motion.div>
              </AnimatePresence>
              
              <button
                onClick={nextMessage}
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-rose-600 text-white rounded-full font-semibold text-lg shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Next Message
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full animate-ping" />
              </button>
            </div>
          </motion.div>
        </section>

        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-rose-900">Special Days of Love</h3>
            <p className="text-rose-400 font-medium uppercase tracking-widest text-sm">Upcoming Celebrations</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {specialDaysList.map((day, idx) => (
              <motion.div
                key={day.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-rose-100 hover:border-rose-300 hover:bg-white transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-rose-50 rounded-xl text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="block text-rose-800 font-bold text-lg">{day.daysLeft}</span>
                    <span className="text-[10px] uppercase tracking-tighter text-rose-400 font-bold">Days Left</span>
                  </div>
                </div>
                
                <h4 className="font-serif text-xl font-bold text-rose-900 mb-1">{day.name}</h4>
                <p className="text-rose-500 font-medium text-sm">
                  {day.nextDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                
                <div className="mt-4 pt-4 border-t border-rose-50 flex items-center gap-2 text-rose-300">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest">Live Tracking</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-12 text-center border-t border-rose-100 bg-white/30 backdrop-blur-md">
        <div className="flex justify-center gap-4 mb-4">
          <Heart className="text-rose-500 fill-rose-500 w-6 h-6 animate-bounce" />
          <Heart className="text-rose-400 fill-rose-400 w-6 h-6 animate-bounce delay-100" />
          <Heart className="text-rose-300 fill-rose-300 w-6 h-6 animate-bounce delay-200" />
        </div>
        <p className="font-cursive text-2xl text-rose-600 mb-2">I love you more than all the stars in the sky.</p>
        <p className="text-rose-400 text-sm font-medium uppercase tracking-[0.3em]">Always & Forever</p>
      </footer>
    </div>
  );
}

function BfAccount() {
  const [channelId, setChannelId] = useState("");
  const [message, setMessage] = useState("");
  const [bio, setBio] = useState("");
  const [pfp, setPfp] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [onlineStatus, setOnlineStatus] = useState("online");
  const [customStatusText, setCustomStatusText] = useState("");
  const [customStatusEmoji, setCustomStatusEmoji] = useState("");
  
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingBio, setIsUpdatingBio] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => {
        setBio(data.bio);
        setPfp(data.pfp);
      });
  }, []);

  const handleSendMessage = async () => {
    if (!channelId || !message) return;
    setIsSending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId, message })
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', text: "Message sent successfully!" });
        setMessage("");
      } else {
        setStatus({ type: 'error', text: data.error || "Failed to send message." });
      }
    } catch (err) {
      setStatus({ type: 'error', text: "An error occurred." });
    }
    setIsSending(false);
  };

  const handleUpdateBio = async () => {
    setIsUpdatingBio(true);
    try {
      const res = await fetch("/api/profile/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio })
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', text: "Bio updated!" });
      }
    } catch (err) {
      setStatus({ type: 'error', text: "Failed to update bio." });
    }
    setIsUpdatingBio(false);
  };

  const handleUpdateDiscordProfile = async () => {
    setIsUpdatingProfile(true);
    setStatus(null);
    try {
      // Update Display Name if provided
      if (displayName) {
        await fetch("/api/profile/display-name", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayName })
        });
      }

      // Update Online Status
      await fetch("/api/profile/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: onlineStatus })
      });

      // Update Custom Status
      await fetch("/api/profile/custom-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: customStatusText, emoji: customStatusEmoji })
      });

      setStatus({ type: 'success', text: "Discord profile updated successfully!" });
    } catch (err) {
      setStatus({ type: 'error', text: "Failed to update some profile settings." });
    }
    setIsUpdatingProfile(false);
  };

  const handlePfpUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('pfp', file);

    try {
      const res = await fetch("/api/profile/pfp", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setPfp(data.pfp);
        setStatus({ type: 'success', text: "Profile picture updated!" });
      }
    } catch (err) {
      setStatus({ type: 'error', text: "Failed to upload image." });
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-rose-600 font-medium hover:text-rose-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Journey
          </Link>
          <h1 className="font-serif text-3xl font-bold text-rose-900">BF Account Management</h1>
        </header>

        {status && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl text-center font-medium ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {status.text}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Send Messages Section */}
          <section className="bg-white p-8 rounded-[2rem] shadow-lg border border-rose-100 space-y-6">
            <div className="flex items-center gap-3 text-rose-800">
              <Send className="w-6 h-6" />
              <h2 className="font-serif text-2xl font-bold">Send Messages</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-rose-400 uppercase tracking-wider">Channel ID</label>
                <input 
                  type="text" 
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  placeholder="Enter Discord Channel ID"
                  className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-rose-400 uppercase tracking-wider">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all resize-none"
                />
              </div>
              <button 
                onClick={handleSendMessage}
                disabled={isSending || !channelId || !message}
                className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold shadow-md hover:bg-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Send Message
              </button>
            </div>
          </section>

          {/* Discord Profile Section */}
          <section className="bg-white p-8 rounded-[2rem] shadow-lg border border-rose-100 space-y-6">
            <div className="flex items-center gap-3 text-rose-800">
              <Sparkles className="w-6 h-6" />
              <h2 className="font-serif text-2xl font-bold">Discord Profile</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-rose-400 uppercase tracking-wider">Display Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="New Display Name"
                  className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-rose-400 uppercase tracking-wider">Online Status</label>
                <select 
                  value={onlineStatus}
                  onChange={(e) => setOnlineStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all bg-white"
                >
                  <option value="online">Online</option>
                  <option value="idle">Idle</option>
                  <option value="dnd">Do Not Disturb</option>
                  <option value="invisible">Invisible</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-rose-400 uppercase tracking-wider">Custom Text</label>
                  <input 
                    type="text" 
                    value={customStatusText}
                    onChange={(e) => setCustomStatusText(e.target.value)}
                    placeholder="Status text..."
                    className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-rose-400 uppercase tracking-wider">Emoji</label>
                  <input 
                    type="text" 
                    value={customStatusEmoji}
                    onChange={(e) => setCustomStatusEmoji(e.target.value)}
                    placeholder="Emoji..."
                    className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
                  />
                </div>
              </div>
              <button 
                onClick={handleUpdateDiscordProfile}
                disabled={isUpdatingProfile}
                className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold shadow-md hover:bg-rose-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdatingProfile ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Update Discord Profile
              </button>
            </div>
          </section>

          {/* Website Profile Section */}
          <section className="bg-white p-8 rounded-[2rem] shadow-lg border border-rose-100 space-y-8">
            <div className="flex items-center gap-3 text-rose-800">
              <User className="w-6 h-6" />
              <h2 className="font-serif text-2xl font-bold">Website Profile</h2>
            </div>
            
            <div className="flex flex-col items-center space-y-6">
              <div className="relative group">
                <img 
                  src={pfp} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-rose-50 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="text-white w-8 h-8" />
                  <input type="file" className="hidden" accept="image/*" onChange={handlePfpUpload} />
                </label>
              </div>

              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-rose-400 uppercase tracking-wider">Bio</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Update boyfriend's bio..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all resize-none"
                  />
                </div>
                <button 
                  onClick={handleUpdateBio}
                  disabled={isUpdatingBio}
                  className="w-full py-3 bg-rose-100 text-rose-700 rounded-xl font-bold hover:bg-rose-200 transition-all flex items-center justify-center gap-2"
                >
                  {isUpdatingBio ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Update Bio
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthGate>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bfac" element={<BfAccount />} />
        </Routes>
      </AuthGate>
    </BrowserRouter>
  );
}

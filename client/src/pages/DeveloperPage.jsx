import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Code2,
  Award,
  Sparkles,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

export const DeveloperPage = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden select-none">
      {/* Background Decorative Ambient Light Blur */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Navigation */}
      <header className="w-full max-w-7xl mx-auto z-10">
        <Link
          to="/"
          className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-2 w-fit transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Padham Travels</span>
        </Link>
      </header>

      {/* Center Profile Card */}
      <main className="my-auto py-8 z-10 flex justify-center items-center w-full">
        <div className="max-w-xl w-full mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur shadow-2xl text-center flex flex-col items-center relative overflow-hidden">
          {/* Subtle top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />

          {/* Avatar */}
          <div className="ring-4 ring-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-3xl font-bold w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/10">
            VS
          </div>

          {/* Name & Title */}
          <h1 className="text-3xl font-bold text-white font-serif tracking-tight">
            Vinod Solanki
          </h1>
          <div className="bg-cyan-500/10 text-cyan-400 text-xs px-3.5 py-1 rounded-full font-medium mt-2.5 flex items-center gap-1.5 border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Full-Stack Web Developer</span>
          </div>

          {/* Experience & Bio Details */}
          <div className="mt-6 space-y-3 max-w-md text-slate-300">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5 flex items-center gap-3 text-left">
              <Award className="w-5 h-5 text-cyan-400 shrink-0" />
              <p className="text-xs sm:text-sm font-medium leading-snug">
                Ex-Cognizant QEA / Software Quality Engineer{" "}
                <span className="text-cyan-400 font-semibold">(2 Years Experience)</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed text-center px-2">
              Specialized in <strong className="text-slate-200">MERN Stack Architecture</strong> (React, Node.js, Express, MongoDB), responsive frontend UI/UX engineering, and robust API integrations.
            </p>
          </div>

          {/* Contact & Connect Actions */}
          <div className="w-full mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 text-center">
              Connect & Reach Out
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/918220486535"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-4 py-3 bg-slate-800/80 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 rounded-xl font-medium text-sm transition shadow-sm"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>+91 8220486535</span>
              </a>

              {/* Direct Email Button */}
              <a
                href="mailto:vinodtvm35@gmail.com"
                className="flex items-center justify-center gap-2.5 px-4 py-3 bg-slate-800/80 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 rounded-xl font-medium text-sm transition shadow-sm"
              >
                <Mail className="w-4 h-4" />
                <span>vinodtvm35@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full text-center text-xs text-slate-500 z-10 py-2 flex items-center justify-center gap-1.5">
        <Code2 className="w-3.5 h-3.5 text-cyan-400/70" />
        <span>Engineered with React 19 & Tailwind CSS</span>
      </footer>
    </div>
  );
};

export default DeveloperPage;

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Smartphone, CheckCircle2, Play, Code2, Globe } from 'lucide-react';

interface HeroProps {
  onOpenCheckout: () => void;
}

const DEMO_PREVIEWS = [
  {
    prompt: "Create a modern landing page for an artisan coffee bar with online pickup ordering",
    code: `<header className="p-4 bg-amber-950 text-amber-50">\n  <h1 className="text-xl font-bold">Roast & Vibe</h1>\n  <p className="text-xs text-amber-200">Fresh cold brew ready in 5 mins</p>\n</header>\n<main className="p-4 space-y-3">\n  <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800">\n    <span className="text-sm font-semibold">Honey Cold Brew</span>\n    <button className="mt-2 w-full py-1.5 bg-amber-500 text-black text-xs font-bold rounded-lg">Quick Order</button>\n  </div>\n</main>`,
    previewTitle: "Roast & Vibe Cafe",
    badge: "E-Commerce",
    highlight: "Built in 3 mobile prompts"
  },
  {
    prompt: "Build a sleek personal portfolio with projects showcase and WhatsApp direct inquiry",
    code: `<div className="min-h-screen bg-slate-900 text-slate-100 p-4">\n  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold">JD</div>\n  <h2 className="mt-2 text-lg font-bold">John Doe · Mobile Creator</h2>\n  <p className="text-xs text-slate-400">Building web apps entirely from my phone.</p>\n  <a href="https://wa.me/..." className="mt-4 inline-flex items-center gap-2 bg-emerald-600 px-4 py-2 rounded-xl text-xs font-bold text-white">Chat on WhatsApp</a>\n</div>`,
    previewTitle: "Mobile Portfolio",
    badge: "Portfolio & Lead Gen",
    highlight: "Published to web in 5 mins"
  },
  {
    prompt: "Build an invoice calculator that generates clean receipts to share with clients",
    code: `export default function InvoiceCalc() {\n  const [subtotal, setSubtotal] = useState(15000);\n  const tax = subtotal * 0.075;\n  return (\n    <div className="p-4 bg-slate-950 text-white rounded-2xl">\n      <p className="text-xs text-slate-400">Total Invoice Amount</p>\n      <p className="text-2xl font-bold text-emerald-400">₦{(subtotal + tax).toLocaleString()}</p>\n      <button className="mt-3 w-full py-2 bg-blue-600 rounded-lg text-xs font-semibold">Share PDF Receipt</button>\n    </div>\n  );\n}`,
    previewTitle: "Instant Invoice Generator",
    badge: "Web Application",
    highlight: "Functional interactive tool"
  }
];

export const Hero: React.FC<HeroProps> = ({ onOpenCheckout }) => {
  const [activeDemo, setActiveDemo] = useState(0);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const current = DEMO_PREVIEWS[activeDemo];

  return (
    <section id="hero" className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-radial-gradient pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Proposition & Copy */}
          <div className="lg:col-span-7 space-y-6 lg:space-y-8 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#5B9BFF]">
              <span>NO LAPTOP? NO PROBLEM. 🚀</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
              Your Smartphone Is All You Need to Start Building Software with AI.
            </h1>

            {/* Supporting Copy */}
            <div className="space-y-4 text-base sm:text-lg text-[#A1AEC2] leading-relaxed max-w-2xl">
              <p>
                Learn how to use AI Vibe Coding to create real websites, web applications, and digital products directly from your Android or iPhone — even if you've never written a single line of code.
              </p>
              <p className="text-white font-medium">
                You don't need an expensive laptop. You don't need years of programming experience.
              </p>
              <p className="text-sm sm:text-base text-[#A1AEC2]">
                You need your smartphone, an internet connection, and the right AI workflow.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenCheckout}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white bg-[#3978FF] hover:bg-[#2F65DC] active:scale-[0.98] rounded-xl transition-all shadow-xl shadow-[#3978FF]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B9BFF]"
              >
                <span>GET INSTANT ACCESS — ₦7,000</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#curriculum"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-[#F8FAFC] hover:text-[#5B9BFF] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] rounded-xl transition-all text-center"
              >
                <span>Explore the Curriculum</span>
              </a>
            </div>

            {/* Adjacency Trust signals */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#A1AEC2]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20D69A]" />
                <span>Works on Android & iOS</span>
              </div>
              <span aria-hidden="true" className="text-white/20">·</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20D69A]" />
                <span>One-Time Fee (₦7,000)</span>
              </div>
              <span aria-hidden="true" className="text-white/20">·</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20D69A]" />
                <span>Telegram Community Included</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composition with Smartphone Mockup & Live Vibe Simulator */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-[380px] sm:max-w-[420px] rounded-3xl p-3 bg-gradient-to-b from-white/10 via-white/5 to-transparent border border-white/10 shadow-2xl backdrop-blur-xl">
              
              {/* Smartphone Outer Shell */}
              <div className="relative bg-[#0D1220] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                {/* Phone Speaker Notch */}
                <div className="pt-3 pb-2 flex justify-center items-center bg-[#080B14]/80">
                  <div className="w-24 h-4 bg-black/60 rounded-full flex items-center justify-center gap-2 px-2 border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-8 h-1 rounded-full bg-white/10" />
                  </div>
                </div>

                {/* Smartphone Hero Visual Asset */}
                <div className="relative h-48 w-full overflow-hidden bg-[#080B14]">
                  <img
                    src="/src/assets/images/hero_mobile_vibe_coding_1793612375433.jpg"
                    alt="Smartphone with AI coding interface"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      // Fallback container
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1220] via-transparent to-black/30" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-semibold text-white">
                    <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-[#3978FF]" />
                      Real Mobile Workflow
                    </span>
                    <span className="text-[#20D69A] bg-[#20D69A]/10 border border-[#20D69A]/30 px-2 py-0.5 rounded text-[10px]">
                      {current.highlight}
                    </span>
                  </div>
                </div>

                {/* Interactive Vibe Coding Prompt & Preview Switcher */}
                <div className="p-4 space-y-3 bg-[#0D1220]">
                  <div className="text-xs font-semibold text-[#A1AEC2] uppercase tracking-wider flex items-center justify-between">
                    <span>Try Mobile Prompt:</span>
                    <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
                      <button
                        onClick={() => setActiveTab('preview')}
                        className={`px-2 py-1 text-[10px] font-semibold rounded ${activeTab === 'preview' ? 'bg-[#3978FF] text-white' : 'text-[#A1AEC2] hover:text-white'}`}
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => setActiveTab('code')}
                        className={`px-2 py-1 text-[10px] font-semibold rounded ${activeTab === 'code' ? 'bg-[#3978FF] text-white' : 'text-[#A1AEC2] hover:text-white'}`}
                      >
                        Code
                      </button>
                    </div>
                  </div>

                  {/* Prompt Selectors */}
                  <div className="flex flex-col gap-1.5">
                    {DEMO_PREVIEWS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveDemo(idx)}
                        className={`text-left p-2 rounded-lg text-xs transition-all border ${
                          activeDemo === idx
                            ? 'bg-[#121A2B] border-[#3978FF]/50 text-white shadow-sm'
                            : 'bg-black/20 border-white/5 text-[#A1AEC2] hover:bg-white/[0.03] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate max-w-[200px]">{item.previewTitle}</span>
                          <span className="text-[10px] text-[#5B9BFF]">{item.badge}</span>
                        </div>
                        <p className="text-[11px] text-[#A1AEC2] line-clamp-1 mt-0.5 italic">"{item.prompt}"</p>
                      </button>
                    ))}
                  </div>

                  {/* Active Simulation Display */}
                  <div className="rounded-xl border border-white/10 bg-[#080B14] p-3 text-xs min-h-[140px] flex flex-col justify-between">
                    {activeTab === 'preview' ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between pb-1.5 border-b border-white/5 text-[11px] text-[#A1AEC2]">
                          <span className="font-semibold text-white flex items-center gap-1">
                            <Globe className="w-3 h-3 text-[#20D69A]" />
                            {current.previewTitle}
                          </span>
                          <span className="text-[10px] text-[#20D69A]">Status: Live on Mobile</span>
                        </div>
                        {activeDemo === 0 && (
                          <div className="bg-[#121A2B] p-2.5 rounded-lg border border-white/5 space-y-2">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="font-bold text-amber-200">Roast & Vibe Cafe</span>
                              <span className="text-[#20D69A] font-mono">₦2,500</span>
                            </div>
                            <p className="text-[10px] text-[#A1AEC2]">Fresh cold brew handcrafted in Lagos. Tap to order via WhatsApp.</p>
                            <div className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-center rounded text-[11px]">
                              Order Online Pickup
                            </div>
                          </div>
                        )}
                        {activeDemo === 1 && (
                          <div className="bg-[#121A2B] p-2.5 rounded-lg border border-white/5 space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#3978FF] text-white text-[10px] font-bold flex items-center justify-center">JD</div>
                              <div>
                                <p className="text-[11px] font-bold text-white">John Doe</p>
                                <p className="text-[9px] text-[#A1AEC2]">Mobile AI Web Developer</p>
                              </div>
                            </div>
                            <p className="text-[10px] text-[#A1AEC2]">3 live projects delivered using phone-only workflows.</p>
                            <div className="w-full py-1.5 bg-[#20D69A] text-slate-950 font-bold text-center rounded text-[11px]">
                              Hire Me / WhatsApp
                            </div>
                          </div>
                        )}
                        {activeDemo === 2 && (
                          <div className="bg-[#121A2B] p-2.5 rounded-lg border border-white/5 space-y-2">
                            <div className="flex justify-between items-center text-[10px] text-[#A1AEC2]">
                              <span>Client Invoice #1042</span>
                              <span className="text-[#20D69A] font-semibold">Active</span>
                            </div>
                            <div className="text-base font-extrabold text-white font-mono">₦16,125.00</div>
                            <div className="w-full py-1.5 bg-[#3978FF] text-white font-semibold text-center rounded text-[11px]">
                              Download / Send Receipt
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="font-mono text-[10px] text-[#A1AEC2] overflow-x-auto whitespace-pre leading-relaxed p-1">
                        {current.code}
                      </div>
                    )}

                    <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#A1AEC2]">
                      <span className="flex items-center gap-1">
                        <Code2 className="w-3 h-3 text-[#3978FF]" /> No terminal setup needed
                      </span>
                      <button 
                        onClick={onOpenCheckout}
                        className="text-[#5B9BFF] hover:underline font-semibold"
                      >
                        Learn how →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom home indicator */}
                <div className="py-2 flex justify-center bg-[#0D1220]">
                  <div className="w-28 h-1 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

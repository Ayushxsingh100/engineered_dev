"use client";

import { useState } from "react";
import { db, isFirebaseConfigured } from "@/lib/firebaseConfig";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      if (!isFirebaseConfigured || !db) {
        // Sandbox mode — simulate
        setStatus("success");
        setMessage("Subscribed! (Sandbox mode — no email stored)");
        setEmail("");
        return;
      }

      const normalizedEmail = email.toLowerCase().trim();
      const subscriberRef = doc(db, "subscribers", normalizedEmail);

      // Check if already subscribed
      const existing = await getDoc(subscriberRef);
      if (existing.exists()) {
        setStatus("success");
        setMessage("You're already subscribed! 🎉");
        setEmail("");
        return;
      }

      // Use email as document ID — prevents duplicates atomically
      await setDoc(subscriberRef, {
        email: normalizedEmail,
        subscribedAt: Timestamp.now(),
        source: "website",
        active: true,
      });

      setStatus("success");
      setMessage("You're in! Welcome to the crew 🚀");
      setEmail("");
    } catch (err) {
      console.error("Newsletter subscription failed:", err);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-2xl text-center genz-glass p-10 sm:p-14 rounded-[2.5rem] relative overflow-hidden group">
      {/* Decorative gradient blobs */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-accent/15 blur-[60px] pointer-events-none group-hover:bg-accent/25 transition-all duration-700"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[var(--accent-secondary)]/10 blur-[50px] pointer-events-none"></div>
      
      <h2 className="text-2xl font-bold font-heading text-text-primary mb-3 tracking-tight text-balance relative z-10 flex items-center justify-center gap-2">
        Stay in the loop
        <svg className="w-6 h-6 text-accent animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      </h2>
      
      <p className="text-[14px] text-text-secondary mb-8 max-w-md mx-auto leading-relaxed font-medium text-balance relative z-10">
        Get fresh drops on system design, cloud architecture, and backend engineering straight to your inbox. No spam, just vibes.
      </p>

      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto justify-center items-stretch font-sans z-10">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={status === "loading" || status === "success"}
          className="w-full sm:flex-1 bg-background/50 border border-accent/20 rounded-full py-3 px-5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 focus:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all duration-300 disabled:opacity-50 text-[14px] font-medium backdrop-blur-sm"
          required
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="genz-btn-gradient px-6 py-3 text-[13px] font-bold rounded-full disabled:opacity-50 shrink-0 cursor-pointer flex items-center justify-center"
        >
          {status === "loading" ? (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" className="opacity-25" />
                <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" />
              </svg>
              Subscribing...
            </span>
          ) : status === "success" ? (
            <span className="flex items-center gap-1.5 justify-center">
              Subscribed
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 justify-center">
              Subscribe
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </span>
          )}
        </button>
      </form>
      
      {message && (
        <p className={`mt-4 text-[13px] font-semibold animate-in fade-in slide-in-from-bottom-2 duration-500 relative z-10 ${
          status === "error" ? "text-red-400" : "genz-gradient-text"
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}

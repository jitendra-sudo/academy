"use client";
import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";
import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  const [waNum, setWaNum] = useState("917397236970");

  useEffect(() => {
    fetch(apiUrl("/api/settings"))
      .then((r) => r.json())
      .then((d) => {
        const w = d?.data?.contact?.whatsapp;
        if (w) setWaNum(w.replace(/\D/g, ""));
      })
      .catch(() => {});
  }, []);

  return (
    <a
      href={`https://wa.me/${waNum}?text=Hi,%20I%20am%20looking%20for%20admissions`}
      target="_blank"
      rel="noreferrer"
      id="whatsapp-float-btn"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all text-white"
      aria-label="Contact on WhatsApp"
      style={{ animation: "pulse-glow 2s infinite" }}
    >
      <MessageCircle size={32} fill="currentColor" className="text-white" />
    </a>
  );
}

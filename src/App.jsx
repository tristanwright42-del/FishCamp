import { useState } from "react";
import bgImage from "./pexels-tomas-malik-793526-27244690.jpg";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qkmmgozeglmgprgdktfw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_QIrEZBfFwajwUXlz0p-klw_YjdcT2AO";
const FRONT_SHIRT_IMAGE_URL = "https://placehold.co/600x600/1e3a5f/ffffff?text=Shirt+Front";
const BACK_SHIRT_IMAGE_URL = "https://placehold.co/600x600/1e3a5f/ffffff?text=Shirt+Back";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const SHIRT_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];
const EMPTY_FORM = { full_name: "", shirt_size: "", notes: "" };

export default function App() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState("front");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (success) setSuccess(false);
    if (error) setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess(false);
    setError("");
    if (!form.full_name.trim()) { setError("Please enter your full name."); return; }
    if (!form.shirt_size) { setError("Please select a shirt size."); return; }
    setSubmitting(true);
    try {
      const { error: sbError } = await supabase.from("shirt_orders").insert([
        { full_name: form.full_name.trim(), shirt_size: form.shirt_size, notes: form.notes.trim() || null },
      ]);
      if (sbError) throw sbError;
      setSuccess(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      setError(err?.message ? `Submission failed: ${err.message}` : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 font-sans bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${bgImage})` }}>
      <header className="text-center mb-8 max-w-lg w-full">
        <div className="inline-block bg-black/50 backdrop-blur-sm rounded-2xl px-8 py-5 w-full">
          <h1 className="text-4xl font-extrabold text-amber-300 tracking-tight leading-tight">Fish Camp 2026</h1>
          <p className="mt-2 text-sm text-stone-200">Submit your name and shirt size so we can design your shirt!</p>
        </div>
      </header>
      <main className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: "rgba(15,40,25,0.82)", backdropFilter: "blur(8px)" }}>
        <section className="p-5 border-b border-stone-600">
          <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">This Year's Design</h2>
          <div className="block sm:hidden">
            <div className="flex rounded-lg overflow-hidden border border-stone-600 mb-3">
              {["front", "back"].map((tab) => (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === tab ? "bg-teal-700 text-amber-200" : "bg-transparent text-stone-400 hover:bg-stone-700"}`}>
                  {tab === "front" ? "Front" : "Back"}
                </button>
              ))}
            </div>
            <img src={activeTab === "front" ? FRONT_SHIRT_IMAGE_URL : BACK_SHIRT_IMAGE_URL} alt={`Shirt ${activeTab}`} className="w-full rounded-xl object-contain max-h-72" />
          </div>
          <div className="hidden sm:grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-2">
              <img src={FRONT_SHIRT_IMAGE_URL} alt="Shirt Front" className="w-full rounded-xl object-contain max-h-64 border border-stone-600" />
              <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Front</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src={BACK_SHIRT_IMAGE_URL} alt="Shirt Back" className="w-full rounded-xl object-contain max-h-64 border border-stone-600" />
              <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Back</span>
            </div>
          </div>
        </section>
        <section className="p-5">
          <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-4">Submit Your Order</h2>
          {success && (<div role="alert" className="mb-4 rounded-xl bg-teal-900/70 border border-teal-600 px-4 py-3 text-teal-200"><p className="text-sm font-medium">Size submitted! See you at Fish Camp!</p></div>)}
          {error && (<div role="alert" className="mb-4 rounded-xl bg-red-900/60 border border-red-700 px-4 py-3 text-red-300"><p className="text-sm font-medium">{error}</p></div>)}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="full_name" className="text-sm font-semibold text-stone-200">Full Name <span className="text-amber-400">*</span></label>
              <input id="full_name" name="full_name" type="text" autoComplete="name" placeholder="e.g. Jane Smith" value={form.full_name} onChange={handleChange} disabled={submitting}
                className="h-12 rounded-xl border border-stone-600 px-4 text-base text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 transition"
                style={{ backgroundColor: "rgba(15,40,25,0.7)" }} />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="shirt_size" className="text-sm font-semibold text-stone-200">Shirt Size <span className="text-amber-400">*</span></label>
              <select id="shirt_size" name="shirt_size" value={form.shirt_size} onChange={handleChange} disabled={submitting}
                className="h-12 rounded-xl border border-stone-600 px-4 text-base text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 transition appearance-none cursor-pointer"
                style={{ backgroundColor: "rgba(15,40,25,0.7)" }}>
                <option value="" disabled>Select a size...</option>
                {SHIRT_SIZES.map((size) => (<option key={size} value={size} style={{ backgroundColor: "#1c3324" }}>{size}</option>))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="notes" className="text-sm font-semibold text-stone-200">Special Notes <span className="text-stone-500 font-normal">(optional)</span></label>
              <textarea id="notes" name="notes" rows={3} placeholder="e.g. Prefer a fitted cut..." value={form.notes} onChange={handleChange} disabled={submitting}
                className="rounded-xl border border-stone-600 px-4 py-3 text-base text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 transition resize-none min-h-[80px]"
                style={{ backgroundColor: "rgba(15,40,25,0.7)" }} />
            </div>
            <button type="submit" disabled={submitting}
              className="h-12 rounded-xl font-bold text-base tracking-wide focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-stone-900 bg-amber-500 hover:bg-amber-600 active:bg-amber-700">
              {submitting ? "Submitting..." : "Submit My Size"}
            </button>
          </form>
        </section>
      </main>
      <footer className="mt-8 text-center text-xs text-stone-300 drop-shadow">Fish Camp 2026 · Alaska</footer>
    </div>
  );
}

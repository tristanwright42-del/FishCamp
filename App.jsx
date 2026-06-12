import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// ============================================================
//  CONFIGURATION – Replace these four values before deploying
// ============================================================
const SUPABASE_URL      = "YOUR_SUPABASE_URL_HERE";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY_HERE";
const FRONT_SHIRT_IMAGE_URL = "/shirt-front.png";
const BACK_SHIRT_IMAGE_URL  = "/shirt-back.png";
// ============================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SHIRT_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

const EMPTY_FORM = { full_name: "", shirt_size: "", notes: "" };

export default function App() {
  const [form, setForm]         = useState(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState("front"); // "front" | "back"
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear banners on any input change
    if (success) setSuccess(false);
    if (error)   setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess(false);
    setError("");

    if (!form.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!form.shirt_size) {
      setError("Please select a shirt size.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: sbError } = await supabase.from("shirt_orders").insert([
        {
          full_name:  form.full_name.trim(),
          shirt_size: form.shirt_size,
          notes:      form.notes.trim() || null,
        },
      ]);

      if (sbError) throw sbError;

      setSuccess(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      setError(
        err?.message
          ? `Submission failed: ${err.message}`
          : "Something went wrong. Please try again or contact the organizer."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 py-10 font-sans">

      {/* ── Header ── */}
      <header className="text-center mb-8 max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
          🐟 Fish Camp Alaska 🐟
        </h1>
        <p className="mt-2 text-lg text-slate-500 font-medium">
          Soldotna · Shirt Size Tracker
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Submit your name and size so we can order your shirt!
        </p>
      </header>

      {/* ── Main Card ── */}
      <main className="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* ── Shirt Images ── */}
        <section className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            This Year's Design
          </h2>

          {/* Mobile: tab toggle  |  Desktop: side-by-side */}
          <div className="block sm:hidden">
            {/* Tab buttons */}
            <div className="flex rounded-lg overflow-hidden border border-slate-200 mb-3">
              {["front", "back"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {tab === "front" ? "Front" : "Back"}
                </button>
              ))}
            </div>
            {/* Single image shown based on active tab */}
            <img
              src={activeTab === "front" ? FRONT_SHIRT_IMAGE_URL : BACK_SHIRT_IMAGE_URL}
              alt={`Shirt ${activeTab}`}
              className="w-full rounded-xl object-contain max-h-72"
            />
          </div>

          {/* Desktop: side by side */}
          <div className="hidden sm:grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-2">
              <img
                src={FRONT_SHIRT_IMAGE_URL}
                alt="Shirt Front"
                className="w-full rounded-xl object-contain max-h-64 border border-slate-100"
              />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Front</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img
                src={BACK_SHIRT_IMAGE_URL}
                alt="Shirt Back"
                className="w-full rounded-xl object-contain max-h-64 border border-slate-100"
              />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Back</span>
            </div>
          </div>
        </section>

        {/* ── Order Form ── */}
        <section className="p-5">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Submit Your Order
          </h2>

          {/* Success Banner */}
          {success && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-800"
            >
              <span className="text-xl leading-none mt-0.5">✨</span>
              <p className="text-sm font-medium">
                Size submitted successfully! See you in Soldotna!
              </p>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-800"
            >
              <span className="text-xl leading-none mt-0.5">⚠️</span>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="full_name"
                className="text-sm font-semibold text-slate-700"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Jane Smith"
                value={form.full_name}
                onChange={handleChange}
                disabled={submitting}
                className="h-12 rounded-xl border border-slate-300 px-4 text-base text-slate-800 placeholder-slate-400
                           bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           disabled:opacity-50 transition"
              />
            </div>

            {/* Shirt Size */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="shirt_size"
                className="text-sm font-semibold text-slate-700"
              >
                Shirt Size <span className="text-red-500">*</span>
              </label>
              <select
                id="shirt_size"
                name="shirt_size"
                value={form.shirt_size}
                onChange={handleChange}
                disabled={submitting}
                className="h-12 rounded-xl border border-slate-300 px-4 text-base text-slate-800
                           bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           disabled:opacity-50 transition appearance-none cursor-pointer"
              >
                <option value="" disabled>Select a size…</option>
                {SHIRT_SIZES.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="notes"
                className="text-sm font-semibold text-slate-700"
              >
                Special Notes{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="e.g. Prefer a fitted cut, or need it by a specific date…"
                value={form.notes}
                onChange={handleChange}
                disabled={submitting}
                className="rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-800 placeholder-slate-400
                           bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           disabled:opacity-50 transition resize-none min-h-[80px]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                         text-white font-bold text-base tracking-wide
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         disabled:opacity-60 disabled:cursor-not-allowed
                         transition-colors"
            >
              {submitting ? "Submitting…" : "Submit My Size 🎣"}
            </button>

          </form>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="mt-8 text-center text-xs text-slate-400">
        Fish Camp · Soldotna, Alaska · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

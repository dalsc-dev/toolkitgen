import { useState, useRef } from 'preact/hooks';
import {
  createInitialState,
  setGridMode,
  setTestedEye,
  toggleAmdSimulation,
  addMarking,
  clearMarkings,
  getStatusMessage,
  generateAmslerClinicalReport,
} from './logic';

export default function AmslerGridIsland() {
  const [state, setState] = useState(createInitialState());
  const [copied, setCopied] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const status = getStatusMessage(state);

  const handleGridClick = (e: MouseEvent) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setState((s) => addMarking(s, x, y));
  };

  const handleCopyReport = () => {
    const report = generateAmslerClinicalReport(state);
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
      {/* Hidden SVG Filter for Metamorphopsia distortion */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id="wavy-distortion">
            <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="3" result="turb" />
            <feDisplacementMap in2="turb" in="SourceGraphic" scale="22" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Control Bar: Mode & Eye Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          {/* Eye Selection */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setState((s) => setTestedEye(s, 'left'))}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                state.eye === 'left' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Left Eye
            </button>
            <button
              type="button"
              onClick={() => setState((s) => setTestedEye(s, 'right'))}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                state.eye === 'right' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Right Eye
            </button>
          </div>

          <button
            type="button"
            onClick={() => setState((s) => setGridMode(s, 'standard'))}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
              state.mode === 'standard' && !state.isSimulating
                ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Standard
          </button>
          <button
            type="button"
            onClick={() => setState((s) => setGridMode(s, 'inverted'))}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
              state.mode === 'inverted' && !state.isSimulating
                ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            High Contrast
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setState((s) => toggleAmdSimulation(s))}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
              state.isSimulating
                ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-xs'
                : 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
            }`}
          >
            {state.isSimulating ? 'Disable Distortion' : 'Simulate Distortion'}
          </button>

          {state.markings.length > 0 && (
            <button
              type="button"
              onClick={() => setState((s) => clearMarkings(s))}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Clear Marks ({state.markings.length})
            </button>
          )}
        </div>
      </div>

      {/* Grid Canvas Stage */}
      <div className="my-8 flex flex-col items-center justify-center">
        <p className="text-xs text-slate-400 mb-2 font-medium">Click on the grid to mark spots where lines look wavy, blurred, or missing.</p>
        <div
          ref={gridRef}
          onClick={handleGridClick}
          className={`w-full max-w-[380px] aspect-square rounded-2xl border-4 transition-all duration-300 relative flex items-center justify-center cursor-crosshair select-none ${
            state.mode === 'inverted' ? 'bg-black border-slate-700' : 'bg-white border-slate-800'
          }`}
          style={{
            backgroundImage:
              state.mode === 'inverted'
                ? 'linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg, #fff 2px, transparent 2px)'
                : 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)',
            backgroundSize: '20px 20px',
            backgroundPosition: 'center center',
            filter: state.isSimulating ? 'url(#wavy-distortion)' : 'none',
          }}
        >
          {/* Fixation Dot */}
          <div
            className={`w-3.5 h-3.5 rounded-full z-10 transition-colors ${
              state.mode === 'inverted' ? 'bg-rose-500' : 'bg-black'
            }`}
            title="Focus here with one eye covered"
          />

          {/* Marked Anomaly Dots */}
          {state.markings.map((m, idx) => (
            <div
              key={idx}
              className="absolute w-4 h-4 rounded-full bg-rose-500/80 border-2 border-white -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-sm"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              title={`Anomaly at ${m.x}%, ${m.y}%`}
            />
          ))}
        </div>

        {/* Live Status Indicator */}
        <div className="mt-4 flex items-center gap-2 text-xs font-bold">
          <span
            className={`w-2 h-2 rounded-full ${
              state.isSimulating
                ? 'bg-rose-500 animate-pulse'
                : state.markings.length > 0
                ? 'bg-amber-500'
                : state.mode === 'inverted'
                ? 'bg-blue-500'
                : 'bg-emerald-500'
            }`}
          />
          <span className={status.color}>{status.text}</span>
        </div>
      </div>

      {/* Export & Self-Test Instructions */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800">Export Self-Evaluation Summary</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Copy marked coordinates and observations to share with your optometrist.</p>
          </div>
          <button
            type="button"
            onClick={handleCopyReport}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-2xs ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {copied ? 'Summary Copied!' : 'Copy Summary Report'}
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed space-y-1">
          <p className="font-bold text-slate-800">How to self-test:</p>
          <ol className="list-decimal list-inside space-y-1 pl-1">
            <li>Wear your normal reading glasses (if applicable) in a well-lit room.</li>
            <li>Hold the screen approximately 14 inches (35 cm) from your face and cover your other eye.</li>
            <li>Look directly at the center dot for 10 seconds. Check if any grid lines appear wavy, curved, or absent.</li>
            <li>Tap or click on the grid to mark any distorted areas, then repeat the test for your other eye.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'preact/hooks';
import {
  createInitialState,
  setGridMode,
  toggleAmdSimulation,
  getStatusMessage,
} from './logic';

export default function AmslerGridIsland() {
  const [state, setState] = useState(createInitialState());
  const status = getStatusMessage(state);

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

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setState((s) => setGridMode(s, 'standard'))}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              state.mode === 'standard' && !state.isSimulating
                ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Standard Grid
          </button>
          <button
            type="button"
            onClick={() => setState((s) => setGridMode(s, 'inverted'))}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              state.mode === 'inverted' && !state.isSimulating
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            High Contrast
          </button>
        </div>

        <button
          type="button"
          onClick={() => setState((s) => toggleAmdSimulation(s))}
          className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
            state.isSimulating
              ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-sm'
              : 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
          }`}
        >
          <span>{state.isSimulating ? 'Disable Distortion' : 'Simulate AMD Distortion'}</span>
        </button>
      </div>

      {/* Grid Canvas Stage */}
      <div className="my-8 flex flex-col items-center justify-center">
        <div
          className={`w-full max-w-[380px] aspect-square rounded-2xl border-4 transition-all duration-300 relative flex items-center justify-center cursor-crosshair select-none ${
            state.mode === 'inverted'
              ? 'bg-black border-slate-700'
              : 'bg-white border-slate-800'
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
        </div>

        {/* Live Status Indicator */}
        <div className="mt-4 flex items-center gap-2 text-xs font-bold">
          <span
            className={`w-2 h-2 rounded-full ${
              state.isSimulating
                ? 'bg-rose-500 animate-pulse'
                : state.mode === 'inverted'
                ? 'bg-blue-500'
                : 'bg-emerald-500'
            }`}
          />
          <span className={status.color}>{status.text}</span>
        </div>
      </div>

      {/* Clinical Testing Instructions */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed space-y-1">
        <p className="font-bold text-slate-800">How to self-test:</p>
        <ol className="list-decimal list-inside space-y-1 pl-1">
          <li>Wear your normal reading glasses (if applicable) in a well-lit room.</li>
          <li>Hold the screen ~14 inches (35 cm) from your face and cover one eye.</li>
          <li>Look directly at the center dot for 10 seconds. Check if lines look wavy, blurry, or missing.</li>
          <li>Repeat with the other eye.</li>
        </ol>
      </div>
    </div>
  );
}

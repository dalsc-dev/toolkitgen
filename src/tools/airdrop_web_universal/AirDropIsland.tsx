import { useState, useRef } from 'preact/hooks';
import { generateRoomPin, calculateTotalChunks, type TransferStats } from './chunker';

export default function AirDropIsland() {
  const [roomPin, setRoomPin] = useState(() => generateRoomPin());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<'send' | 'receive'>('send');
  const [peerConnected, setPeerConnected] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSimulateTransfer = () => {
    if (!selectedFile) return;
    setIsTransferring(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsTransferring(false);
          return 100;
        }
        return p + 10;
      });
    }, 150);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('send')}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              mode === 'send'
                ? 'bg-[#EE6C4D] border-[#EE6C4D] text-white shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Send Files
          </button>
          <button
            type="button"
            onClick={() => setMode('receive')}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              mode === 'receive'
                ? 'bg-[#EE6C4D] border-[#EE6C4D] text-white shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Receive Files
          </button>
        </div>

        {/* Room PIN Code */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PIN:</span>
          <span className="font-mono font-black text-slate-900 tracking-widest text-sm">{roomPin}</span>
          <button
            type="button"
            onClick={() => setRoomPin(generateRoomPin())}
            className="text-[10px] text-slate-400 hover:text-slate-600 ml-1"
            title="Generate new PIN"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Main Send/Receive Stage */}
      {mode === 'send' ? (
        <div className="space-y-6">
          {/* Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-[#EE6C4D] rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-orange-50/20 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#EE6C4D] mx-auto flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
            <p className="text-sm font-bold text-slate-800">
              {selectedFile ? selectedFile.name : 'Click or drag files here to send'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {selectedFile
                ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • ${calculateTotalChunks(selectedFile.size)} WebRTC Chunks`
                : 'Direct P2P transfer between Android, iPhone, Windows, Mac, and Linux'}
            </p>
          </div>

          {/* Action Trigger */}
          {selectedFile && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-500">Ready for instant peer-to-peer transmission</p>
              </div>
              <button
                type="button"
                onClick={handleSimulateTransfer}
                disabled={isTransferring}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-[#EE6C4D] hover:bg-[#d75a3c] rounded-xl shadow-sm transition-colors disabled:opacity-50"
              >
                {isTransferring ? 'Streaming Chunks...' : 'Initiate P2P Stream'}
              </button>
            </div>
          )}

          {/* Progress Bar */}
          {isTransferring && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Transfer Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#EE6C4D] to-orange-400 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Waiting for Sender Connection</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Ask the sender to open Universal AirDrop on their device and match PIN <strong className="text-slate-800">{roomPin}</strong> or ensure you are on the same local Wi-Fi.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            Listening on WebRTC DataChannel
          </div>
        </div>
      )}
    </div>
  );
}

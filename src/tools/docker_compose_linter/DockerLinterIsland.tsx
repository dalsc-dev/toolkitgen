import { useState } from 'preact/hooks';
import { validateDockerCompose, type ValidationResult } from './validator';

const SAMPLE_COMPOSE = `version: '3.8'

services:
  web:
    image: nginx:1.25-alpine
    ports:
      - "8080:80"
    environment:
      - ENV=production
    restart: always

  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/app
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_PASSWORD: secretpassword
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
`;

export default function DockerLinterIsland() {
  const [content, setContent] = useState(SAMPLE_COMPOSE);
  const [result, setResult] = useState<ValidationResult>(() => validateDockerCompose(SAMPLE_COMPOSE));
  const [copied, setCopied] = useState(false);

  const handleValidate = () => {
    const res = validateDockerCompose(content);
    setResult(res);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'docker-compose.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Docker Compose YAML</span>
          <button
            type="button"
            onClick={() => {
              setContent(SAMPLE_COMPOSE);
              setResult(validateDockerCompose(SAMPLE_COMPOSE));
            }}
            className="text-xs text-[#EE6C4D] hover:underline font-semibold ml-2"
          >
            Load Sample
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            {copied ? 'Copied YAML!' : 'Copy YAML'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Download
          </button>
          <button
            type="button"
            onClick={handleValidate}
            className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl transition-all shadow-2xs"
          >
            Re-Validate
          </button>
        </div>
      </div>

      {/* Editor & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor Area (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <textarea
            value={content}
            onInput={(e: any) => {
              setContent(e.target.value);
              setResult(validateDockerCompose(e.target.value));
            }}
            rows={15}
            spellcheck={false}
            className="w-full bg-slate-950 text-slate-100 font-mono text-xs rounded-2xl p-4 border border-slate-800 outline-none focus:ring-2 focus:ring-[#EE6C4D] leading-relaxed resize-y custom-scrollbar"
            placeholder="Paste your docker-compose.yml content here..."
          />
        </div>

        {/* Validation Output (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              result.isValid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  result.isValid ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              <span className="font-bold text-xs uppercase tracking-wider">
                {result.isValid ? 'Valid Compose Structure' : 'Syntax / Validation Errors'}
              </span>
            </div>
            {result.version && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-700">
                v{result.version}
              </span>
            )}
          </div>

          {/* Errors */}
          {result.errors.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
              <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">Syntax Errors:</h4>
              <ul className="list-disc list-inside text-xs text-rose-700 space-y-1">
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Security Advisories */}
          {result.securityAdvisories.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                Security Advisories ({result.securityAdvisories.length})
              </h4>
              <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
                {result.securityAdvisories.map((adv, i) => (
                  <div key={i} className="text-xs p-2.5 rounded-xl bg-white/80 border border-amber-200/80 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Service: {adv.service}</span>
                      <span className={`text-[10px] uppercase px-1.5 py-0.2 rounded font-black ${adv.severity === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {adv.severity}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium">{adv.issue}</p>
                    <p className="text-slate-500 text-[11px] leading-tight">{adv.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Notices:</h4>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                {result.warnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Service Summary Table */}
          {result.services.length > 0 && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600">
                Parsed Services ({result.services.length})
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {result.services.map((s, i) => (
                  <div key={i} className="p-3 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{s.name}</span>
                      <span className="font-mono text-slate-500 text-[11px]">
                        {s.image || (s.build ? 'build: ' + s.build : 'custom')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      <span>Ports: {s.ports ? s.ports.join(', ') : 'none'}</span>
                      <span>•</span>
                      <span>Env vars: {s.environmentCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

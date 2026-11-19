import { useState } from 'preact/hooks';
import { validateDockerCompose, type ValidationResult } from './validator';

const SAMPLE_COMPOSE = `version: '3.8'

services:
  web:
    image: nginx:alpine
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

  const handleValidate = () => {
    const res = validateDockerCompose(content);
    setResult(res);
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

        <button
          type="button"
          onClick={handleValidate}
          className="px-5 py-2 text-xs font-bold text-white bg-[#EE6C4D] hover:bg-[#d75a3c] rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Validate YAML
        </button>
      </div>

      {/* Code Area */}
      <div>
        <textarea
          value={content}
          onInput={(e) => setContent((e.target as HTMLTextAreaElement).value)}
          rows={14}
          spellcheck={false}
          className="w-full font-mono text-xs sm:text-sm p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#EE6C4D] leading-relaxed resize-y"
          placeholder="Paste docker-compose.yml here..."
        />
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        {result.isValid ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
            <div>
              <p className="font-bold text-emerald-900">Valid Docker Compose Structure</p>
              <p className="mt-0.5 text-emerald-700">No syntax errors found. Ready for deployment with docker compose up.</p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs sm:text-sm space-y-1">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <svg className="w-5 h-5 text-rose-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              <span>Validation Errors ({result.errors.length})</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-2 text-rose-700 font-mono text-xs">
              {result.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {result.warnings.length > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs space-y-1">
            <span className="font-bold text-amber-900">Warnings &amp; Best Practices:</span>
            <ul className="list-disc list-inside space-y-0.5 pl-2 text-amber-700">
              {result.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Services Overview */}
        {result.services.length > 0 && (
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
              Parsed Services ({result.services.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {result.services.map((svc) => (
                <div key={svc.name} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{svc.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-mono">service</span>
                  </div>
                  {svc.image && (
                    <div className="text-[11px] text-slate-500 font-mono truncate" title={svc.image}>
                      image: {svc.image}
                    </div>
                  )}
                  {svc.build && (
                    <div className="text-[11px] text-slate-500 font-mono">
                      build: {svc.build}
                    </div>
                  )}
                  {svc.ports && (
                    <div className="text-[11px] text-emerald-700 font-mono">
                      ports: {svc.ports.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

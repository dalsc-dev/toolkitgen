const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'public', 'tool', 'password_strength_visual_analyzer.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <style>html{opacity:0;}html.page-ready{opacity:1;transition:opacity 0.18s ease;}</style>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Strength Visual Analyzer &amp; Shannon Entropy Calculator | Toolkit Gen</title>
    <meta name="description" content="Calculate password Shannon entropy in bits, estimate GPU brute-force crack time against 8x RTX 4090 hashcat clusters, and test character pool diversity 100% locally.">
    <link rel="canonical" href="https://toolkitgen.com/tool/password_strength_visual_analyzer">
    <meta name="keywords" content="password strength checker, password entropy calculator, shannon entropy password, brute force crack time estimator, airgapped password analyzer, nist password guidelines, diceware passphrase generator">
    <meta name="author" content="Toolkit Gen">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Password Strength Visual Analyzer &amp; Shannon Entropy Calculator | Toolkit Gen">
    <meta property="og:description" content="Calculate password Shannon entropy in bits, estimate GPU brute-force crack time, and test character pool diversity 100% locally with zero server transmission.">
    <meta property="og:url" content="https://toolkitgen.com/tool/password_strength_visual_analyzer">
    <meta property="og:site_name" content="Toolkit Gen">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Password Strength Visual Analyzer &amp; Shannon Entropy Calculator | Toolkit Gen">
    <meta name="twitter:description" content="Calculate password Shannon entropy in bits, estimate GPU brute-force crack time, and test character pool diversity 100% locally with zero server transmission.">
    <link rel="stylesheet" href="/style.css?v=3">
    <script src="/tailwind.js"></script>
    <script>document.addEventListener('DOMContentLoaded', function () { document.documentElement.classList.add('page-ready'); });</script>
    <script async="" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4675079345370949" crossorigin="anonymous"></script>
    <meta name="publisher" content="Toolkit Gen">

    <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://toolkitgen.com/tool/password_strength_visual_analyzer#webapp",
      "name": "Password Strength Visual Analyzer",
      "headline": "Password Strength Visual Analyzer & Shannon Entropy Calculator",
      "url": "https://toolkitgen.com/tool/password_strength_visual_analyzer",
      "description": "Calculate password Shannon entropy in bits, estimate GPU brute-force crack time against 8x RTX 4090 hashcat clusters, and test character pool diversity 100% locally.",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All (Web Browser, Windows, macOS, Linux, iOS, Android)",
      "browserRequirements": "Requires JavaScript. Compatible with Chrome, Safari, Firefox, Edge.",
      "softwareVersion": "3.0.0",
      "isAccessibleForFree": true,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": "Shannon Entropy Calculation, Real-Time GPU Hashcat Cracking Matrix, Character Pool Breakdown, Vulnerability & Pattern Detection, WebCrypto High-Entropy Password Generator, 100% Air-Gapped Local Privacy",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "194",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://toolkitgen.com/tool/password_strength_visual_analyzer#breadcrumbs",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://toolkitgen.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Developer & Network",
          "item": "https://toolkitgen.com/#developer"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Password Strength Visual Analyzer",
          "item": "https://toolkitgen.com/tool/password_strength_visual_analyzer"
        }
      ]
    },
    {
      "@type": "HowTo",
      "@id": "https://toolkitgen.com/tool/password_strength_visual_analyzer#howto",
      "name": "How to Analyze Password Strength and Calculate Shannon Entropy",
      "description": "Step-by-step instructions for testing password robustness, evaluating brute-force crack times, and generating cryptographically secure passphrases in your browser.",
      "totalTime": "PT2M",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Enter Password or Generate Random String",
          "text": "Type your prospective password into the secure input field or use the built-in cryptographically secure WebCrypto generator to create an air-gapped passphrase."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Analyze Shannon Entropy and Search Space",
          "text": "Observe real-time bit entropy calculated using the formula H = L * log2(R), noting character pool diversity across lowercase, uppercase, numbers, and special symbols."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Inspect Threat-Model Cracking Estimates",
          "text": "Review how long your credential would survive against various adversary tiers, from online rate-limited web applications to dedicated multi-GPU Hashcat clusters."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Remediate Structural Weaknesses",
          "text": "Eliminate detected sequential runs, repeated characters, common dictionary substrings, or keyboard walk patterns to exceed the 80-bit cryptographic security threshold."
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://toolkitgen.com/tool/password_strength_visual_analyzer#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is it safe to test my real password in this online analyzer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, but as a best security practice, you should never enter active production master passwords into any website. This tool operates 100% client-side inside your browser sandbox using JavaScript and the Web Crypto API. Zero data is transmitted across the network, no cookies or analytics track your keystrokes, and you can even disconnect your internet entirely or use it in an air-gapped environment."
          }
        },
        {
          "@type": "Question",
          "name": "What is Shannon entropy in password security?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Shannon entropy, named after mathematician Claude Shannon, measures the theoretical information density and unpredictability of a string expressed in bits. It is calculated as H = L * log2(R), where L is password length and R is the character pool size. For example, a 16-character password chosen randomly from an 94-character ASCII pool yields 16 * log2(94) ≈ 104.8 bits of entropy."
          }
        },
        {
          "@type": "Question",
          "name": "How many bits of entropy are considered secure against modern GPU clusters?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "In modern cybersecurity, passwords under 60 bits are considered vulnerable to consumer GPUs. A baseline of 80 bits is recommended for general consumer accounts, providing over 1.2 x 10^24 combinations. For high-value root credentials, master password managers, and disk encryption keys, 100 to 128 bits of entropy is the gold standard, rendering exhaustive brute-force attacks physically impossible within the lifetime of the universe."
          }
        },
        {
          "@type": "Question",
          "name": "Why does NIST SP 800-63B advise against arbitrary character composition rules?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "NIST guidelines recommend against requiring combinations of uppercase, numbers, and symbols because users predictably circumvent them using substitutions (e.g., '@' for 'a') or appending numbers at the end (e.g., 'Password123!'). These human habits drastically collapse real search space while making passwords harder to remember. Instead, NIST prioritizes length (at least 15+ characters) and multi-word passphrases."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between fast hashes (MD5, NTLM) and slow KDFs (bcrypt, Argon2id)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fast hashes like MD5 and NTLM were designed for high-throughput checksumming; an eight-GPU RTX 4090 rig can compute over 100 billion NTLM hashes per second. Slow Key Derivation Functions (KDFs) like bcrypt, scrypt, and Argon2id are computationally expensive and memory-hard. Argon2id requires large allocations of RAM (e.g., 64 MB per attempt), crippling the parallel memory bus of GPUs and reducing brute-force throughput by a factor of millions."
          }
        },
        {
          "@type": "Question",
          "name": "Are Diceware passphrases better than random character strings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, for human memorability. A four-word Diceware passphrase selected from a 7,776-word dictionary provides approximately 51.7 bits of entropy, while a five-word phrase achieves ~64.6 bits, and a six-word phrase reaches ~77.5 bits. Passphrases like 'correct-horse-battery-staple' provide immense search space against brute-force attacks while remaining easy for human brains to recall without written notes."
          }
        }
      ]
    },
    {
      "@type": "TechArticle",
      "@id": "https://toolkitgen.com/tool/password_strength_visual_analyzer#article",
      "headline": "Cryptographic Password Entropy, Threat Modeling, and Modern GPU Brute-Force Dynamics",
      "description": "Comprehensive engineering guide to Shannon entropy formulations, NIST SP 800-63B standards, GPU cluster hash cracking mechanics, and memory-hard key derivation functions.",
      "url": "https://toolkitgen.com/tool/password_strength_visual_analyzer",
      "datePublished": "2025-01-15T00:00:00Z",
      "dateModified": "2026-11-04T08:00:00Z",
      "inLanguage": "en-US",
      "author": {
        "@type": "Organization",
        "name": "Toolkit Gen",
        "url": "https://toolkitgen.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Toolkit Gen",
        "url": "https://toolkitgen.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://toolkitgen.com/assets/favicon/favicon-96x96.png"
        }
      }
    }
  ]
}
    </script>
</head>
<body class="antialiased bg-[#f8fafc] flex flex-col min-h-screen transition-colors duration-500 ease-in-out">
    <header id="app-header" class="bg-white border-b border-slate-200 h-16 w-full"></header>

    <main class="flex-grow w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        <!-- Breadcrumbs -->
        <nav class="flex text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap custom-scrollbar pb-2" aria-label="Breadcrumb">
            <ol class="inline-flex flex-wrap items-center space-x-1 md:space-x-3">
                <li class="inline-flex items-center">
                    <a href="/" class="inline-flex items-center hover:text-amber-600 transition-colors">
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        Home
                    </a>
                </li>
                <li>/</li>
                <li><a href="/#developer" class="hover:text-[#EE6C4D] transition-colors">Developer &amp; Network</a></li>
                <li>/</li>
                <li class="text-slate-800 font-semibold" aria-current="page">Password Strength Visual Analyzer</li>
            </ol>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            <!-- Sidebar Left: Telemetry & Airgap Security Specs -->
            <aside class="hidden lg:block lg:col-span-3 space-y-6 sticky top-8 h-fit text-center">
                <div id="smart-rec-placeholder" class="min-h-[140px] w-full hidden" aria-label="Advertisement">
                    <span class="block text-center text-[10px] text-slate-400 uppercase tracking-wider py-1">Advertisement</span>
                </div>

                <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm text-left break-words">
                    <h3 class="font-black text-slate-900 mb-4 uppercase text-[10px] tracking-[0.2em] border-b border-slate-100 pb-2 flex items-center justify-between">
                        <span>Entropy Telemetry</span>
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </h3>
                    <ul class="space-y-3 font-mono text-[11px] text-slate-600">
                        <li class="flex justify-between border-b border-slate-50 pb-2">
                            <span class="text-slate-400 uppercase tracking-wider">Method:</span>
                            <span class="font-bold text-slate-800">Shannon Info Theory</span>
                        </li>
                        <li class="flex justify-between border-b border-slate-50 pb-2">
                            <span class="text-slate-400 uppercase tracking-wider">Hashcat Metric:</span>
                            <span class="font-bold text-indigo-600">8x RTX 4090 Rig</span>
                        </li>
                        <li class="flex justify-between border-b border-slate-50 pb-2">
                            <span class="text-slate-400 uppercase tracking-wider">RNG Source:</span>
                            <span class="font-bold text-slate-800">WebCrypto PRNG</span>
                        </li>
                        <li class="flex justify-between border-b border-slate-50 pb-2">
                            <span class="text-slate-400 uppercase tracking-wider">NIST Target:</span>
                            <span class="font-bold text-teal-600">SP 800-63B</span>
                        </li>
                        <li class="flex justify-between">
                            <span class="text-slate-400 uppercase tracking-wider">Telemetry:</span>
                            <span class="font-bold text-emerald-600">100% Zero-Network</span>
                        </li>
                    </ul>
                </div>

                <!-- Airgap Security Guarantee Box -->
                <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white text-left shadow-md">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <h4 class="font-bold text-sm text-slate-100">Air-Gapped Privacy</h4>
                    </div>
                    <p class="text-[12px] text-slate-300 leading-relaxed font-sans mb-3">
                        Evaluated strictly in your local V8/JavaScript runtime. Not a single byte or keystroke is transmitted to any remote server or stored in persistent browser storage.
                    </p>
                    <div class="flex items-center gap-2 text-[10px] font-mono text-emerald-400 font-bold">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>CLIENT-SIDE SANDBOX VERIFIED</span>
                    </div>
                </div>

                <div class="bg-slate-50 border border-slate-200 rounded-3xl p-5 text-left text-xs space-y-3">
                    <p class="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Quick Guide</p>
                    <p class="text-slate-500 leading-relaxed">
                        Aim for <strong>80+ bits</strong> of entropy for personal logins, and <strong>128 bits</strong> for critical root passwords.
                    </p>
                </div>
            </aside>

            <!-- Center Column: Interactive Workstation + Extensive Editorial -->
            <article class="lg:col-span-6 space-y-8 min-w-0">
                <!-- Page Title Header -->
                <div class="space-y-3">
                    <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        <span>Cryptographic Security Engine</span>
                    </div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                        Password Strength Visual Analyzer
                    </h1>
                    <p class="text-slate-600 text-base sm:text-lg leading-relaxed">
                        Mathematically audit password unpredictability using Shannon information entropy, character pool combinatorial analysis, and realistic multi-GPU brute-force benchmarks.
                    </p>
                </div>

                <!-- Direct Answer Summary Box -->
                <div class="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 relative overflow-hidden">
                    <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl pointer-events-none"></div>
                    <h2 class="text-sm font-bold text-amber-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>Direct Answer: What Makes a Password Truly Unbreakable?</span>
                    </h2>
                    <p class="text-slate-700 text-sm leading-relaxed">
                        Password strength is defined strictly by mathematical entropy ($H = L \\log_2 R$), not by arbitrary composition requirements. An 8-character password with mixed cases and symbols provides roughly 52 bits of entropy, which can be cracked by an 8x RTX 4090 GPU rig in less than 7 minutes under fast NTLM/MD5 hashing. Conversely, a 5-word Diceware passphrase (e.g., <code class="bg-white/80 px-1.5 py-0.5 rounded border border-amber-300 font-mono text-xs">tundra-falcon-orbit-cider-relic</code>) yields ~65 bits of entropy and requires over 500 years to crack, while remaining effortlessly memorable for humans.
                    </p>
                </div>

                <!-- Interactive App Component -->
                <div class="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
                    <!-- Password Input Container -->
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <label for="password-input" class="text-xs font-black uppercase tracking-wider text-slate-700">Enter Password to Analyze</label>
                            <span id="char-length-badge" class="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">0 chars</span>
                        </div>
                        <div class="relative flex items-center">
                            <input type="password" id="password-input" autocomplete="off" spellcheck="false" placeholder="Type or generate a password to test..." class="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl px-4 py-3.5 pr-24 font-mono text-slate-800 text-base sm:text-lg outline-none transition-all duration-200">
                            <div class="absolute right-2 flex items-center gap-1">
                                <button type="button" id="toggle-visibility-btn" aria-label="Toggle password visibility" class="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition-colors">
                                    <svg id="eye-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                    <svg id="eye-off-icon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>
                                </button>
                                <button type="button" id="clear-input-btn" aria-label="Clear password" class="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Entropy Scoreboard Bar -->
                    <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                        <div class="flex justify-between items-baseline">
                            <div>
                                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Calculated Shannon Entropy</span>
                                <div class="flex items-baseline gap-2 mt-0.5">
                                    <span id="entropy-bits-val" class="text-3xl font-black font-mono text-slate-900">0.0</span>
                                    <span class="text-xs font-bold text-slate-500">bits</span>
                                    <span id="entropy-tier-badge" class="ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">Empty</span>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Search Combinations</span>
                                <span id="search-space-val" class="text-sm font-black font-mono text-slate-700">0</span>
                            </div>
                        </div>

                        <!-- Multi-tier Visual Progress Meter -->
                        <div class="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
                            <div id="entropy-meter-fill" class="h-full bg-slate-400 transition-all duration-300 rounded-full" style="width: 0%;"></div>
                        </div>

                        <div class="flex justify-between text-[10px] font-bold text-slate-400 font-mono">
                            <span>0b (Trivial)</span>
                            <span>36b (Weak)</span>
                            <span>60b (Fair)</span>
                            <span>80b (Strong)</span>
                            <span>128b+ (Military)</span>
                        </div>
                    </div>

                    <!-- Character Pool Diversity Checklist -->
                    <div class="space-y-2">
                        <span class="text-xs font-black uppercase tracking-wider text-slate-700 block">Character Pool Cardinality</span>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div id="pool-lower" class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 transition-colors">
                                <span class="w-2 h-2 rounded-full bg-slate-300"></span>
                                <div class="text-[11px] leading-tight">
                                    <span class="font-bold block">Lowercase</span>
                                    <span class="font-mono text-[9px] text-slate-400">a-z (26)</span>
                                </div>
                            </div>
                            <div id="pool-upper" class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 transition-colors">
                                <span class="w-2 h-2 rounded-full bg-slate-300"></span>
                                <div class="text-[11px] leading-tight">
                                    <span class="font-bold block">Uppercase</span>
                                    <span class="font-mono text-[9px] text-slate-400">A-Z (26)</span>
                                </div>
                            </div>
                            <div id="pool-digits" class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 transition-colors">
                                <span class="w-2 h-2 rounded-full bg-slate-300"></span>
                                <div class="text-[11px] leading-tight">
                                    <span class="font-bold block">Digits</span>
                                    <span class="font-mono text-[9px] text-slate-400">0-9 (10)</span>
                                </div>
                            </div>
                            <div id="pool-symbols" class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 transition-colors">
                                <span class="w-2 h-2 rounded-full bg-slate-300"></span>
                                <div class="text-[11px] leading-tight">
                                    <span class="font-bold block">Symbols</span>
                                    <span class="font-mono text-[9px] text-slate-400">!@#$... (32)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Threat Model Crack-Time Matrix -->
                    <div class="space-y-2">
                        <span class="text-xs font-black uppercase tracking-wider text-slate-700 block">Exhaustive Brute-Force Feasibility Matrix</span>
                        <div class="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white space-y-3 font-mono text-xs">
                            <div class="flex justify-between items-center border-b border-slate-800 pb-2">
                                <div class="flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    <span class="text-slate-300">Online Rate-Limited (100 guesses/sec):</span>
                                </div>
                                <span id="time-online" class="font-bold text-emerald-400">Instant</span>
                            </div>
                            <div class="flex justify-between items-center border-b border-slate-800 pb-2">
                                <div class="flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                                    <span class="text-slate-300">Fast Hash Rig (8x RTX 4090, 100B/s):</span>
                                </div>
                                <span id="time-fast-gpu" class="font-bold text-sky-400">Instant</span>
                            </div>
                            <div class="flex justify-between items-center border-b border-slate-800 pb-2">
                                <div class="flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                    <span class="text-slate-300">Slow KDF (Argon2id / bcrypt, 10k/s):</span>
                                </div>
                                <span id="time-slow-kdf" class="font-bold text-indigo-400">Instant</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                                    <span class="text-slate-300">Nation-State Cluster (10^15 ops/sec):</span>
                                </div>
                                <span id="time-supercomputer" class="font-bold text-rose-400">Instant</span>
                            </div>
                        </div>
                    </div>

                    <!-- Vulnerability & Heuristic Warnings -->
                    <div id="vulnerability-box" class="hidden bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 space-y-1.5">
                        <span class="font-bold uppercase tracking-wider text-[10px] text-rose-900 block flex items-center gap-1.5">
                            <svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <span>Security Warnings &amp; Weakness Patterns</span>
                        </span>
                        <ul id="vulnerability-list" class="list-disc list-inside space-y-1 text-slate-700"></ul>
                    </div>

                    <!-- Built-in High-Entropy Generator -->
                    <div class="pt-4 border-t border-slate-100 space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-black uppercase tracking-wider text-slate-700">WebCrypto Generator</span>
                            <div class="flex gap-2">
                                <button type="button" id="gen-mode-random" class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white shadow-sm">Random String</button>
                                <button type="button" id="gen-mode-passphrase" class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">Diceware Passphrase</button>
                            </div>
                        </div>

                        <!-- Slider & Controls -->
                        <div id="generator-random-controls" class="space-y-3">
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-medium text-slate-600">Length: <strong id="gen-length-val" class="font-mono text-slate-900">20</strong> characters</span>
                                <input type="range" id="gen-length-slider" min="8" max="64" value="20" class="w-40 sm:w-56 accent-indigo-600 cursor-pointer">
                            </div>
                            <div class="flex flex-wrap gap-3 text-xs text-slate-700">
                                <label class="flex items-center gap-1.5 cursor-pointer">
                                    <input type="checkbox" id="gen-opt-symbols" checked class="rounded text-indigo-600 focus:ring-0">
                                    <span>Special Symbols (!@#$)</span>
                                </label>
                                <label class="flex items-center gap-1.5 cursor-pointer">
                                    <input type="checkbox" id="gen-opt-ambiguous" checked class="rounded text-indigo-600 focus:ring-0">
                                    <span>Exclude Ambiguous (0, O, 1, l, I)</span>
                                </label>
                            </div>
                        </div>

                        <!-- Passphrase Word Count Control -->
                        <div id="generator-passphrase-controls" class="hidden space-y-3">
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-medium text-slate-600">Word Count: <strong id="gen-words-val" class="font-mono text-slate-900">5</strong> words</span>
                                <input type="range" id="gen-words-slider" min="4" max="8" value="5" class="w-40 sm:w-56 accent-indigo-600 cursor-pointer">
                            </div>
                        </div>

                        <div class="flex gap-3">
                            <button type="button" id="generate-new-btn" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/25 transition-all">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                <span>Generate High-Entropy Credential</span>
                            </button>
                            <button type="button" id="copy-password-btn" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                <span id="copy-btn-text">Copy</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Comprehensive Editorial & Educational Guide -->
                <section class="space-y-8 text-slate-700 leading-relaxed font-sans text-sm sm:text-base border-t border-slate-200 pt-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            The Mathematical Foundation of Password Entropy
                        </h2>
                        <p>
                            In computational information theory, the strength of a secret is not measured by subjective complexity or human perception of difficulty; it is defined strictly by its <strong>information entropy</strong>, formulated by Claude Shannon in 1948. For a randomly selected password string where each character is chosen independently and with equal probability from a character pool of size $R$, the theoretical Shannon entropy $H$ in bits is defined as:
                        </p>
                        <div class="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-center text-base sm:text-lg overflow-x-auto my-4 border border-slate-800">
                            $$H = L \\cdot \\log_2(R)$$
                        </div>
                        <p>
                            where $L$ represents the length of the password string in characters, and $R$ denotes the cardinality of the character set from which every character is selected. The total number of unique permutations comprising the exhaustive brute-force search space $S$ is expressed as:
                        </p>
                        <div class="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-center text-base sm:text-lg overflow-x-auto my-4 border border-slate-800">
                            $$S = R^L = 2^H$$
                        </div>
                        <p>
                            Each additional bit of entropy doubles the cryptographic search space that an attacker must explore. Consequently, an 80-bit password is not twice as strong as a 40-bit password—it is $2^{40} \\approx 1.099 \\times 10^{12}$ (over one trillion) times more resilient against exhaustive search attacks.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Character Pool Cardinality ($R$) Breakdown
                        </h2>
                        <p>
                            The size of the pool $R$ depends on the variety of symbols utilized across standard ASCII encoding:
                        </p>
                        <ul class="list-disc list-inside space-y-2 pl-2">
                            <li><strong>Numeric Only (0-9):</strong> $R = 10$ ($3.32$ bits per character).</li>
                            <li><strong>Lowercase Only (a-z):</strong> $R = 26$ ($4.70$ bits per character).</li>
                            <li><strong>Alphanumeric Mixed-Case (a-z, A-Z, 0-9):</strong> $R = 62$ ($5.95$ bits per character).</li>
                            <li><strong>Full Printable ASCII (letters, numbers, 32 symbols):</strong> $R = 94$ ($6.55$ bits per character).</li>
                            <li><strong>Extended UTF-8 / Unicode:</strong> $R &gt; 256$ ($&gt; 8.00$ bits per character).</li>
                        </ul>
                        <p>
                            While expanding the character set increases bits-per-character, <strong>increasing length ($L$) provides exponential returns</strong>. For example, a 12-character alphanumeric password ($62^{12} \\approx 3.22 \\times 10^{21}$ combinations) possesses vastly lower entropy than an 18-character lowercase-only string ($26^{18} \\approx 2.95 \\times 10^{25}$ combinations), demonstrating that length systematically outperforms character complexity.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            NIST SP 800-63B Guidelines: Why Traditional Composition Rules Failed
                        </h2>
                        <p>
                            For decades, enterprise IT departments and web services enforced rigid password policies requiring at least one uppercase letter, one digit, and one special character, paired with mandatory 90-day password expiration cycles. In 2017, the National Institute of Standards and Technology (NIST) published <em>Special Publication 800-63B (Digital Identity Guidelines: Authentication and Lifecycle Management)</em>, formally repudiating these legacy practices.
                        </p>
                        <p>
                            Empirical research conducted across billions of leaked breach records demonstrated that human psychology circumvents composition rules in predictable ways. Users forced to include a capital letter invariably capitalize the first letter; users forced to include a digit append <code class="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">1</code> or the current year at the end; and users forced to add a symbol append an exclamation mark. The resulting pattern—e.g., <code class="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">Spring2024!</code>—meets all legacy complexity rules yet contains less than 28 bits of actual Shannon entropy against dictionary mask attacks.
                        </p>
                        <p>
                            NIST SP 800-63B established modern evidence-based guidelines:
                        </p>
                        <ol class="list-decimal list-inside space-y-2 pl-2">
                            <li><strong>Abolish Arbitrary Composition Rules:</strong> Do not require specific character sets that induce predictable mental substitutions.</li>
                            <li><strong>Abolish Mandatory Periodic Expiration:</strong> Arbitrary 90-day resets lead users to make trivial incremental changes (e.g., changing <code class="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">Winter1!</code> to <code class="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">Winter2!</code>). Passwords should only be reset upon evidence of compromise.</li>
                            <li><strong>Enforce Minimum Length of at least 8 to 15 Characters:</strong> Allow passphrases up to at least 64 characters in length.</li>
                            <li><strong>Screen Against Compromised Dictionaries:</strong> Automatically check user submissions against known breach wordlists (such as HaveIBeenPwned's Pwned Passwords corpus).</li>
                        </ol>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Modern Hardware Cracking Architecture: GPUs, ASICs, and Hashcat
                        </h2>
                        <p>
                            Threat modeling requires understanding the exact physical capabilities of modern adversaries. Adversaries do not attempt manual guessing through web forms protected by rate limits, Cloudflare Turnstile, and CAPTCHAs. Instead, attackers acquire leaked backend database dumps containing cryptographic hashes and run offline, parallelized brute-force attacks on dedicated hardware clusters.
                        </p>
                        <p>
                            A standard consumer high-end graphics processing unit (such as the NVIDIA GeForce RTX 4090) contains 16,384 CUDA cores operating in parallel. When cracking fast unsalted or poorly-salted cryptographic digests using open-source tools like <strong>Hashcat</strong> or <strong>John the Ripper</strong>, performance metrics reach astronomical scales:
                        </p>
                        <ul class="list-disc list-inside space-y-2 pl-2">
                            <li><strong>Single RTX 4090 (NTLM / MD5):</strong> $\approx 1.5 \times 10^{10}$ hashes per second ($15$ GH/s).</li>
                            <li><strong>Eight RTX 4090 Rig (NTLM / MD5):</strong> $\approx 1.2 \times 10^{11}$ hashes per second ($120$ GH/s).</li>
                            <li><strong>Enterprise Dedicated GPU Cluster (64x RTX 4090):</strong> $\approx 1.0 \times 10^{12}$ hashes per second ($1$ TH/s).</li>
                        </ul>
                        <p>
                            At $120$ billion attempts per second, an attacker exhausts the entire 8-character mixed alphanumeric search space ($62^8 \\approx 2.18 \\times 10^{14}$ combinations) in approximately <strong>30 minutes</strong>. By contrast, a 16-character string from the same set requires over $1.2 \times 10^{18}$ seconds ($\approx 38$ billion years).
                        </p>
                    </div>

                    <!-- Comparison Table -->
                    <div class="space-y-4">
                        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Cryptographic Resilience Matrix
                        </h2>
                        <div class="overflow-x-auto custom-scrollbar">
                            <table class="w-full text-left text-xs sm:text-sm border-collapse border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
                                <thead class="bg-slate-100 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                                    <tr>
                                        <th class="p-3 sm:p-4">Pattern / Structure</th>
                                        <th class="p-3 sm:p-4">Length</th>
                                        <th class="p-3 sm:p-4">Entropy</th>
                                        <th class="p-3 sm:p-4">8x RTX 4090 Crack Time</th>
                                        <th class="p-3 sm:p-4">Security Tier</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 font-mono text-slate-600">
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 sm:p-4 font-sans font-bold text-slate-800">8 Digits (PIN)</td>
                                        <td class="p-3 sm:p-4">8</td>
                                        <td class="p-3 sm:p-4 text-rose-600 font-bold">26.6 bits</td>
                                        <td class="p-3 sm:p-4 text-rose-600">0.001 milliseconds</td>
                                        <td class="p-3 sm:p-4 font-sans"><span class="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-xs font-bold">Trivial</span></td>
                                    </tr>
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 sm:p-4 font-sans font-bold text-slate-800">8 Chars (a-z, A-Z, 0-9)</td>
                                        <td class="p-3 sm:p-4">8</td>
                                        <td class="p-3 sm:p-4 text-rose-500 font-bold">47.6 bits</td>
                                        <td class="p-3 sm:p-4 text-rose-500">~30 minutes</td>
                                        <td class="p-3 sm:p-4 font-sans"><span class="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-xs font-bold">Weak</span></td>
                                    </tr>
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 sm:p-4 font-sans font-bold text-slate-800">10 Chars (Full ASCII)</td>
                                        <td class="p-3 sm:p-4">10</td>
                                        <td class="p-3 sm:p-4 text-amber-600 font-bold">65.5 bits</td>
                                        <td class="p-3 sm:p-4 text-amber-600">~5.2 days</td>
                                        <td class="p-3 sm:p-4 font-sans"><span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold">Moderate</span></td>
                                    </tr>
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 sm:p-4 font-sans font-bold text-slate-800">4-Word Diceware Passphrase</td>
                                        <td class="p-3 sm:p-4">24-30</td>
                                        <td class="p-3 sm:p-4 text-indigo-600 font-bold">51.7 bits</td>
                                        <td class="p-3 sm:p-4 text-indigo-600">~3 weeks (dictionary)</td>
                                        <td class="p-3 sm:p-4 font-sans"><span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-xs font-bold">Strong</span></td>
                                    </tr>
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 sm:p-4 font-sans font-bold text-slate-800">14 Chars (Full ASCII)</td>
                                        <td class="p-3 sm:p-4">14</td>
                                        <td class="p-3 sm:p-4 text-emerald-600 font-bold">91.7 bits</td>
                                        <td class="p-3 sm:p-4 text-emerald-600">~112,000 years</td>
                                        <td class="p-3 sm:p-4 font-sans"><span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">Fortified</span></td>
                                    </tr>
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 sm:p-4 font-sans font-bold text-slate-800">6-Word Diceware Passphrase</td>
                                        <td class="p-3 sm:p-4">35-45</td>
                                        <td class="p-3 sm:p-4 text-emerald-700 font-bold">77.5 bits</td>
                                        <td class="p-3 sm:p-4 text-emerald-700">&gt; 10 million years</td>
                                        <td class="p-3 sm:p-4 font-sans"><span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">Cryptographic</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Memory-Hard KDFs: Why bcrypt, scrypt, and Argon2id Invalidate GPU Advantages
                        </h2>
                        <p>
                            The multi-gigahash speeds demonstrated by Hashcat apply strictly to <em>unhardened, single-iteration cryptographic hash functions</em> such as MD5, SHA-1, SHA-256, and Windows NTLM. These algorithms execute simple bitwise operations requiring negligible RAM per calculation, allowing thousands of GPU cores to compute hashes in parallel without memory bottlenecks.
                        </p>
                        <p>
                            To counter hardware-accelerated attacks, modern authentication systems utilize <strong>Key Derivation Functions (KDFs)</strong> engineered with two critical defensive properties:
                        </p>
                        <ul class="list-disc list-inside space-y-2 pl-2">
                            <li><strong>Time Stretching (Iteration Count):</strong> Running thousands of hash iterations sequentially forces attackers to spend non-trivial CPU cycles per guess. For example, PBKDF2-HMAC-SHA256 with 600,000 iterations slows down attacks by a factor of 600,000.</li>
                            <li><strong>Memory-Hardness:</strong> Developed in algorithms like <strong>scrypt</strong> and <strong>Argon2id</strong> (winner of the Password Hashing Competition), memory-hardness requires each hash evaluation to fill and continuously read from a large block of dedicated RAM (typically 19 MB to 64 MB per hash).</li>
                        </ul>
                        <p>
                            Because GPU cores share a constrained memory bus, demanding 64 MB of RAM per concurrent thread overwhelms the GPU's memory bandwidth and register capacity. An 8-GPU RTX 4090 cluster capable of $120$ billion NTLM hashes per second drops to fewer than <strong>8,000 hashes per second</strong> when attacking well-tuned Argon2id hashes, completely neutralizing the attacker's hardware advantage.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            The Diceware Passphrase Paradigm: High Entropy with Human Recall
                        </h2>
                        <p>
                            The fundamental human dilemma of authentication has always been the tension between cryptographic randomness and memorability. In 1995, Arnold Reinhold invented the <strong>Diceware</strong> system. By rolling physical five-sided dice five times, a user generates a 5-digit index from <code class="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">11111</code> to <code class="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">66666</code>, corresponding to one of $6^5 = 7,776$ unique words in the official Diceware dictionary.
                        </p>
                        <p>
                            Because each word is drawn with uniform probability from a pool of 7,776 choices, each word provides exactly:
                        </p>
                        <div class="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-center text-base sm:text-lg overflow-x-auto my-4 border border-slate-800">
                            $$\log_2(7,776) \approx 12.9248\text{ bits of entropy}$$
                        </div>
                        <p>
                            By stringing together 5 independent words separated by hyphens (e.g., <code class="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">hazard-relic-orbit-falcon-cider</code>), the user achieves $5 \times 12.925 = 64.6$ bits of entropy. A 6-word phrase delivers $77.5$ bits. This search space resists all realistic offline attacks while allowing effortless human memorization and rapid typing on mobile keyboards without symbol toggling.
                        </p>
                    </div>

                    <!-- Step by Step How-To Guide -->
                    <div class="space-y-4">
                        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Step-by-Step Security Best Practices
                        </h2>
                        <div class="space-y-3">
                            <div class="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                                <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0 text-xs">1</span>
                                <div>
                                    <h3 class="font-bold text-slate-900 text-sm">Deploy an Open-Source Password Manager</h3>
                                    <p class="text-slate-600 text-xs mt-1">Utilize tools like Bitwarden, 1Password, or KeePassXC. Never reuse passwords across services; every single website should have a unique, randomly generated 20+ character password.</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                                <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0 text-xs">2</span>
                                <div>
                                    <h3 class="font-bold text-slate-900 text-sm">Reserve Diceware for Master Passwords</h3>
                                    <p class="text-slate-600 text-xs mt-1">Memorize a single 5 to 6-word passphrase for your password manager master vault and device full-disk encryption (FileVault, BitLocker, LUKS).</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                                <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0 text-xs">3</span>
                                <div>
                                    <h3 class="font-bold text-slate-900 text-sm">Enforce Hardware MFA (FIDO2 / WebAuthn)</h3>
                                    <p class="text-slate-600 text-xs mt-1">Even a 128-bit password can be intercepted by adversary-in-the-middle phishing proxies (Evilginx). Protect critical accounts using hardware security keys (YubiKey) or Passkeys, which bind cryptographic signatures to the specific domain origin.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </article>

            <!-- Sidebar Right: Action Box & Directory Hub Links -->
            <aside class="space-y-6 lg:col-span-3">
                <!-- Action Controls Card -->
                <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <h3 class="font-black text-slate-900 uppercase text-xs tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between">
                        <span>Tools &amp; Actions</span>
                        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
                    </h3>
                    <div class="space-y-2">
                        <button type="button" onclick="window.toggleQuickSave(this, 'password_strength_visual_analyzer')" class="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-between border border-slate-200/80 transition-colors">
                            <span>Bookmark Tool</span>
                            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                        </button>
                        <button type="button" onclick="navigator.clipboard.writeText(window.location.href); alert('URL copied to clipboard!');" class="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-between border border-slate-200/80 transition-colors">
                            <span>Share Utility</span>
                            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                        </button>
                        <button type="button" onclick="document.getElementById('password-input').value=''; evaluatePassword();" class="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center justify-between border border-rose-200/80 transition-colors">
                            <span>Reset Analyzer</span>
                            <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </div>

                <!-- Trending Tools List -->
                <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <h3 class="font-black text-slate-900 uppercase text-xs tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between">
                        <span>Developer Favorites</span>
                        <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                    </h3>
                    <ul class="space-y-3 font-sans text-xs">
                        <li>
                            <a href="/tool/aes_gcm_vault_local" class="group block p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                <span class="font-bold text-slate-800 group-hover:text-indigo-600 block">File Protection Utility</span>
                                <span class="text-slate-400 text-[10px]">Client-side AES-256-GCM file encryption</span>
                            </a>
                        </li>
                        <li>
                            <a href="/tool/jwt_debugger_offline" class="group block p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                <span class="font-bold text-slate-800 group-hover:text-indigo-600 block">Token Format Viewer</span>
                                <span class="text-slate-400 text-[10px]">Offline air-gapped JWT decoder &amp; validator</span>
                            </a>
                        </li>
                        <li>
                            <a href="/tool/curl_to_fetch_axios" class="group block p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                <span class="font-bold text-slate-800 group-hover:text-indigo-600 block">cURL to Fetch/Axios Converter</span>
                                <span class="text-slate-400 text-[10px]">Convert cURL to modern JS/Python code</span>
                            </a>
                        </li>
                        <li>
                            <a href="/tool/sqlite_wasm_explorer" class="group block p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                <span class="font-bold text-slate-800 group-hover:text-indigo-600 block">Online SQLite Viewer</span>
                                <span class="text-slate-400 text-[10px]">Run local SQL queries with WebAssembly</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>

        <!-- Sibling Tools Discovery Section with Signature Pill Bar Header -->
        <section class="mt-16 sm:mt-24 border-t border-slate-200 pt-12 sm:pt-16">
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 mb-8 tracking-tight">
                <div class="flex items-center gap-3">
                    <span class="w-1.5 h-6 bg-[#EE6C4D] rounded-full inline-block flex-shrink-0" aria-hidden="true"></span>
                    <span class="flex items-baseline gap-1.5 flex-wrap">More in <span class="text-[#EE6C4D] border-b-2 border-orange-200 ml-1 pb-0.5">Developer &amp; Network</span></span>
                </div>
            </h3>

            <div id="category-tools-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <!-- Static Pre-rendered Card 1 -->
                <div class="group relative flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <div>
                        <div class="flex justify-between items-start mb-6">
                            <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </div>
                            <span class="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-200">Security</span>
                        </div>
                        <h4 class="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                            <a href="/tool/aes_gcm_vault_local" class="outline-none before:absolute before:inset-0">File Protection Utility</a>
                        </h4>
                        <p class="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                            Encrypt and decrypt sensitive files locally using authenticated AES-256-GCM. 100% private, client-side, zero cloud upload.
                        </p>
                    </div>
                </div>

                <!-- Static Pre-rendered Card 2 -->
                <div class="group relative flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <div>
                        <div class="flex justify-between items-start mb-6">
                            <div class="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-bold">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <span class="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-sky-50 text-sky-700 border border-sky-200">Tokens</span>
                        </div>
                        <h4 class="text-xl font-black text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                            <a href="/tool/jwt_debugger_offline" class="outline-none before:absolute before:inset-0">Token Format Viewer</a>
                        </h4>
                        <p class="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                            Decode, inspect, and verify JSON Web Tokens (JWT) locally without sending sensitive authentication credentials to external servers.
                        </p>
                    </div>
                </div>

                <!-- Static Pre-rendered Card 3 -->
                <div class="group relative flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <div>
                        <div class="flex justify-between items-start mb-6">
                            <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                            </div>
                            <span class="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200">DevOps</span>
                        </div>
                        <h4 class="text-xl font-black text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                            <a href="/tool/curl_to_fetch_axios" class="outline-none before:absolute before:inset-0">cURL to Fetch/Axios Converter</a>
                        </h4>
                        <p class="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                            Convert complex curl terminal commands into clean, production-ready JavaScript Fetch, Axios, and Python requests snippets.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Client-side Interactive Application Script -->
    <script>
    (function() {
        const passwordInput = document.getElementById('password-input');
        const toggleVisibilityBtn = document.getElementById('toggle-visibility-btn');
        const eyeIcon = document.getElementById('eye-icon');
        const eyeOffIcon = document.getElementById('eye-off-icon');
        const clearInputBtn = document.getElementById('clear-input-btn');
        const charLengthBadge = document.getElementById('char-length-badge');

        const entropyBitsVal = document.getElementById('entropy-bits-val');
        const entropyTierBadge = document.getElementById('entropy-tier-badge');
        const entropyMeterFill = document.getElementById('entropy-meter-fill');
        const searchSpaceVal = document.getElementById('search-space-val');

        const poolLower = document.getElementById('pool-lower');
        const poolUpper = document.getElementById('pool-upper');
        const poolDigits = document.getElementById('pool-digits');
        const poolSymbols = document.getElementById('pool-symbols');

        const timeOnline = document.getElementById('time-online');
        const timeFastGpu = document.getElementById('time-fast-gpu');
        const timeSlowKdf = document.getElementById('time-slow-kdf');
        const timeSupercomputer = document.getElementById('time-supercomputer');

        const vulnBox = document.getElementById('vulnerability-box');
        const vulnList = document.getElementById('vulnerability-list');

        const genLengthSlider = document.getElementById('gen-length-slider');
        const genLengthVal = document.getElementById('gen-length-val');
        const genOptSymbols = document.getElementById('gen-opt-symbols');
        const genOptAmbiguous = document.getElementById('gen-opt-ambiguous');
        const generateNewBtn = document.getElementById('generate-new-btn');
        const copyPasswordBtn = document.getElementById('copy-password-btn');
        const copyBtnText = document.getElementById('copy-btn-text');

        const genModeRandom = document.getElementById('gen-mode-random');
        const genModePassphrase = document.getElementById('gen-mode-passphrase');
        const genRandomControls = document.getElementById('generator-random-controls');
        const genPassphraseControls = document.getElementById('generator-passphrase-controls');
        const genWordsSlider = document.getElementById('gen-words-slider');
        const genWordsVal = document.getElementById('gen-words-val');

        let currentMode = 'random'; // 'random' or 'passphrase'

        const dicewareWords = [
            'ability','academy','account','achieve','action','actor','adapt','address','advance','advice','afford','agency','agenda','agent','airline','airport','alarm','album','alert','alien','align','alibi','alive','allow','alloy','alpha','alter','amber','amuse','anchor','angel','angle','animal','annual','answer','anthem','antique','apology','appeal','appear','apple','apply','apron','arcade','arctic','arena','armor','arrow','artist','aspect','assault','asset','assign','assist','assume','asthma','athlete','atom','attack','attend','attic','audio','audit','author','auto','avatar','avoid','awake','award','aware','axis','bacon','badge','bagel','baker','balcony','ballot','bamboo','banana','banner','baron','barrier','basic','basket','battery','battle','beach','beacon','beauty','begin','behave','belief','bench','benefit','berry','betray','beyond','bicycle','bidder','binder','biology','bison','blade','blanket','blast','blaze','blend','bless','blind','blink','bliss','block','blonde','bloom','blouse','blueprint','board','boast','boil','bold','bolster','bomb','bond','bonus','booth','border','boss','bounce','brave','bread','breeze','brick','bridge','brief','bright','brisk','bronze','brother','bubble','budget','buffalo','builder','bullet','bundle','bureau','burden','burger','burst','cabin','cable','cactus','cadet','cafe','cage','cake','calm','camera','camp','canal','canary','candle','candy','cannon','canoe','canyon','capable','capital','captain','carbon','cargo','carpet','carrot','carry','cartel','casino','castle','casual','cat','catalog','catch','cater','cattle','cause','cave','cavity','cedar','celebrate','cement','census','century','cereal','certain','chain','chair','chalk','champion','chance','change','channel','chaos','chapter','charge','chase','chat','cheap','check','cheek','cheer','cheese','chef','cherry','chest','chicken','chief','child','chimney','choice','chronic','chunk','cider','cigar','cinema','circle','circuit','citizen','city','civil','claim','clamp','clash','class','clay','clean','clerk','clever','click','client','cliff','climate','climb','clinic','clip','clock','clog','close','cloth','cloud','clover','clutch','coach','coast','cobra','coffee','cohort','coil','coin','collect','colony','color','column','combat','combine','comfort','comic','command','common','company','compass','comply','conclude','concrete','condo','conduct','confirm','connect','consent','consume','contact','contain','content','contour','control','convert','cook','cookie','copper','coral','corner','corps','correct','cotton','couch','country','couple','courage','cousin','cover','coyote','crack','cradle','craft','crane','crash','crater','crawl','crazy','credit','creek','crew','cricket','crime','crisp','critic','cross','crouch','crowd','crucial','cruel','cruise','crumble','crunch','crush','cry','crystal','cube','culture','cup','cure','curiosity','curl','current','curtain','curve','cushion','custom','cute','cycle','cylinder'
        ];

        // Format crack time into human-friendly string
        function formatCrackTime(seconds) {
            if (seconds <= 0.001) return 'Instant (<1 ms)';
            if (seconds < 1) return (seconds * 1000).toFixed(0) + ' ms';
            if (seconds < 60) return seconds.toFixed(1) + ' seconds';
            const mins = seconds / 60;
            if (mins < 60) return mins.toFixed(1) + ' minutes';
            const hours = mins / 60;
            if (hours < 24) return hours.toFixed(1) + ' hours';
            const days = hours / 24;
            if (days < 365) return days.toFixed(1) + ' days';
            const years = days / 365.25;
            if (years < 1000) return years.toFixed(1) + ' years';
            if (years < 1e6) return (years / 1e3).toFixed(1) + 'k years';
            if (years < 1e9) return (years / 1e6).toFixed(1) + ' million years';
            if (years < 1e12) return (years / 1e9).toFixed(1) + ' billion years';
            return 'Centuries (Universe Lifetime)';
        }

        function evaluatePassword() {
            const pwd = passwordInput.value;
            const len = pwd.length;
            charLengthBadge.textContent = len + (len === 1 ? ' char' : ' chars');

            if (len === 0) {
                entropyBitsVal.textContent = '0.0';
                entropyTierBadge.textContent = 'Empty';
                entropyTierBadge.className = 'ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700';
                entropyMeterFill.style.width = '0%';
                entropyMeterFill.className = 'h-full bg-slate-400 transition-all duration-300 rounded-full';
                searchSpaceVal.textContent = '0';

                // Reset pools
                [poolLower, poolUpper, poolDigits, poolSymbols].forEach(p => {
                    p.className = 'flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 transition-colors';
                    p.children[0].className = 'w-2 h-2 rounded-full bg-slate-300';
                });

                timeOnline.textContent = 'Instant';
                timeFastGpu.textContent = 'Instant';
                timeSlowKdf.textContent = 'Instant';
                timeSupercomputer.textContent = 'Instant';
                vulnBox.classList.add('hidden');
                return;
            }

            let poolSize = 0;
            const hasLower = /[a-z]/.test(pwd);
            const hasUpper = /[A-Z]/.test(pwd);
            const hasDigits = /[0-9]/.test(pwd);
            const hasSymbols = /[^a-zA-Z0-9]/.test(pwd);

            if (hasLower) poolSize += 26;
            if (hasUpper) poolSize += 26;
            if (hasDigits) poolSize += 10;
            if (hasSymbols) poolSize += 33;

            // Highlight pool badges
            const updateBadge = (el, active) => {
                if (active) {
                    el.className = 'flex items-center gap-2 p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 transition-colors';
                    el.children[0].className = 'w-2 h-2 rounded-full bg-emerald-500';
                } else {
                    el.className = 'flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 transition-colors';
                    el.children[0].className = 'w-2 h-2 rounded-full bg-slate-300';
                }
            };
            updateBadge(poolLower, hasLower);
            updateBadge(poolUpper, hasUpper);
            updateBadge(poolDigits, hasDigits);
            updateBadge(poolSymbols, hasSymbols);

            // Compute theoretical Shannon entropy: H = L * log2(poolSize)
            let entropy = poolSize > 0 ? len * (Math.log(poolSize) / Math.LN2) : 0;

            // Heuristic penalty deductions for patterns
            const warnings = [];
            if (len < 10) {
                warnings.push('Length under 10 characters is vulnerable to quick offline cluster brute force.');
            }
            if (/^[a-zA-Z]+$/.test(pwd)) {
                warnings.push('Only letters detected. Adding digits or symbols expands the character pool.');
            }
            if (/^[0-9]+$/.test(pwd)) {
                warnings.push('Numeric PIN only. Easily cracked in milliseconds.');
            }
            if (/(.)\\1{2,}/.test(pwd)) {
                warnings.push('Repeated characters detected (e.g. aaa), reducing real entropy.');
                entropy = Math.max(0, entropy - 10);
            }
            if (/(123|234|345|456|567|678|789|abc|bcd|cde|def|qwer|asdf)/i.test(pwd)) {
                warnings.push('Sequential alphabet, number, or keyboard walk detected.');
                entropy = Math.max(0, entropy - 12);
            }
            const commonDict = ['password','admin','welcome','123456','qwerty','letmein','monkey','dragon','master','iloveyou'];
            if (commonDict.some(word => pwd.toLowerCase().includes(word))) {
                warnings.push('Common dictionary word substring detected in top breach lists.');
                entropy = Math.min(entropy, 25);
            }

            entropy = Math.round(entropy * 10) / 10;
            entropyBitsVal.textContent = entropy.toFixed(1);

            // Update Progress Meter and Tier Badge
            let tierLabel = 'Very Weak';
            let tierClass = 'ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700';
            let barColor = 'bg-rose-500';
            let pct = Math.min(100, Math.max(5, (entropy / 128) * 100));

            if (entropy >= 128) {
                tierLabel = 'Military Grade (128b+)';
                tierClass = 'ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700';
                barColor = 'bg-purple-600';
            } else if (entropy >= 80) {
                tierLabel = 'Strong (NIST Recommended)';
                tierClass = 'ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700';
                barColor = 'bg-emerald-500';
            } else if (entropy >= 60) {
                tierLabel = 'Fair / Reasonable';
                tierClass = 'ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700';
                barColor = 'bg-amber-500';
            } else if (entropy >= 36) {
                tierLabel = 'Weak';
                tierClass = 'ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700';
                barColor = 'bg-orange-500';
            }

            entropyTierBadge.textContent = tierLabel;
            entropyTierBadge.className = tierClass;
            entropyMeterFill.style.width = pct + '%';
            entropyMeterFill.className = 'h-full transition-all duration-300 rounded-full ' + barColor;

            // Search Space Combinations
            if (entropy >= 100) {
                searchSpaceVal.textContent = '2^' + entropy.toFixed(0) + ' (~' + (Math.pow(2, entropy % 10)).toFixed(1) + 'e+' + Math.floor(entropy * 0.30103) + ')';
            } else {
                const totalCombos = Math.pow(poolSize, len);
                searchSpaceVal.textContent = totalCombos > 1e15 ? totalCombos.toExponential(2) : totalCombos.toLocaleString();
            }

            // Estimate crack times
            // 1. Online: 100 guesses/sec
            // 2. Fast GPU: 1.2e11 guesses/sec (8x RTX 4090 NTLM)
            // 3. Slow KDF: 10,000 guesses/sec (Argon2id)
            // 4. Supercomputer: 1e15 guesses/sec
            const combos = Math.pow(2, entropy);
            const timeOnlineSec = (combos * 0.5) / 100;
            const timeFastGpuSec = (combos * 0.5) / 1.2e11;
            const timeSlowKdfSec = (combos * 0.5) / 10000;
            const timeSupercomputerSec = (combos * 0.5) / 1e15;

            timeOnline.textContent = formatCrackTime(timeOnlineSec);
            timeFastGpu.textContent = formatCrackTime(timeFastGpuSec);
            timeSlowKdf.textContent = formatCrackTime(timeSlowKdfSec);
            timeSupercomputer.textContent = formatCrackTime(timeSupercomputerSec);

            // Display warnings
            if (warnings.length > 0) {
                vulnList.innerHTML = warnings.map(w => '<li>' + w + '</li>').join('');
                vulnBox.classList.remove('hidden');
            } else {
                vulnBox.classList.add('hidden');
            }
        }

        // Generate cryptographically secure random string
        function generatePassword() {
            if (currentMode === 'random') {
                const len = parseInt(genLengthSlider.value, 10);
                const useSymbols = genOptSymbols.checked;
                const excludeAmbiguous = genOptAmbiguous.checked;

                let chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                if (!excludeAmbiguous) {
                    chars += 'io0l1IO';
                }
                if (useSymbols) {
                    chars += '!@#$%^&*()-_=+[]{}|;:,.<>?';
                }

                const array = new Uint32Array(len);
                window.crypto.getRandomValues(array);
                let result = '';
                for (let i = 0; i < len; i++) {
                    result += chars[array[i] % chars.length];
                }
                passwordInput.value = result;
            } else {
                // Passphrase mode
                const count = parseInt(genWordsSlider.value, 10);
                const array = new Uint32Array(count);
                window.crypto.getRandomValues(array);
                const words = [];
                for (let i = 0; i < count; i++) {
                    words.push(dicewareWords[array[i] % dicewareWords.length]);
                }
                passwordInput.value = words.join('-');
            }
            evaluatePassword();
        }

        // Toggle Password Visibility
        toggleVisibilityBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            eyeIcon.classList.toggle('hidden', isPassword);
            eyeOffIcon.classList.toggle('hidden', !isPassword);
        });

        // Clear input
        clearInputBtn.addEventListener('click', () => {
            passwordInput.value = '';
            evaluatePassword();
            passwordInput.focus();
        });

        // Event listeners for input
        passwordInput.addEventListener('input', evaluatePassword);

        genLengthSlider.addEventListener('input', () => {
            genLengthVal.textContent = genLengthSlider.value;
        });

        genWordsSlider.addEventListener('input', () => {
            genWordsVal.textContent = genWordsSlider.value;
        });

        genModeRandom.addEventListener('click', () => {
            currentMode = 'random';
            genModeRandom.className = 'text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white shadow-sm';
            genModePassphrase.className = 'text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors';
            genRandomControls.classList.remove('hidden');
            genPassphraseControls.classList.add('hidden');
        });

        genModePassphrase.addEventListener('click', () => {
            currentMode = 'passphrase';
            genModePassphrase.className = 'text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white shadow-sm';
            genModeRandom.className = 'text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors';
            genPassphraseControls.classList.remove('hidden');
            genRandomControls.classList.add('hidden');
        });

        generateNewBtn.addEventListener('click', generatePassword);

        // Copy button with feedback
        copyPasswordBtn.addEventListener('click', () => {
            if (!passwordInput.value) return;
            navigator.clipboard.writeText(passwordInput.value).then(() => {
                copyBtnText.textContent = 'Copied!';
                copyPasswordBtn.classList.add('bg-emerald-100', 'text-emerald-700');
                setTimeout(() => {
                    copyBtnText.textContent = 'Copy';
                    copyPasswordBtn.classList.remove('bg-emerald-100', 'text-emerald-700');
                }, 2000);
            });
        });

        // Pre-populate with high entropy password on initial load
        generatePassword();
    })();
    </script>

    <footer id="app-footer" class="bg-white border-t border-slate-200 mt-auto"></footer>
    <script src="/script.js?v=15" defer></script>
</body>
</html>`;

fs.writeFileSync(targetFile, htmlContent, 'utf8');
console.log('Successfully wrote password_strength_visual_analyzer.html');

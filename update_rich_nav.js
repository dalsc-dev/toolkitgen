const fs = require('fs');
const path = require('path');

const files = [
    path.join(__dirname, 'public', 'index.html'),
    path.join(__dirname, 'public', 'tool', 'index.html'),
    path.join(__dirname, 'public', 'script.js')
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');

    // Regex to match the previously generated dropdowns.
    // If it's the first time running (no dropdown yet), it matches the <a> tag.
    // So we match the <div class="relative group flex-shrink-0">...Trending...</div> block entirely.
    
    // It's safer to just look for the anchor or the whole group.
    // Let's use a very flexible regex that matches the whole group for Trending
    const trendingRegex = /<div class="relative group flex-shrink-0">\s*<a href="\\?\/#featured"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
    
    const trendingDropdown = `
        <div class="relative group flex-shrink-0">
            <a href="/#featured" class="nav-link text-sm font-bold text-gray-600 group-hover:text-[#EE6C4D] transition outline-none focus:ring-2 focus:ring-[#EE6C4D] rounded py-2">Trending</a>
            <div class="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto absolute top-full left-1/2 -translate-x-1/2 pt-4 z-[9999] transition-opacity duration-200">
                <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/40 border border-slate-100 p-3 w-80 flex flex-col gap-1.5">
                    <h4 class="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1 px-2">Top Tools</h4>
                    
                    <a href="/tool/zfs_capacity_calc" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition group/item">
                        <div class="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-500 group-hover/item:bg-white group-hover/item:shadow-sm transition-all">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                        </div>
                        <div>
                            <h5 class="text-xs font-bold text-slate-800 group-hover/item:text-[#EE6C4D] transition-colors">ZFS RAID Calculator</h5>
                            <p class="text-[10px] text-slate-500 line-clamp-1">Storage pool capacity planning</p>
                        </div>
                    </a>

                    <a href="/tool/prompt_template_builder" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition group/item">
                        <div class="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 text-purple-500 group-hover/item:bg-white group-hover/item:shadow-sm transition-all">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <div>
                            <h5 class="text-xs font-bold text-slate-800 group-hover/item:text-[#EE6C4D] transition-colors">AI Prompt Builder</h5>
                            <p class="text-[10px] text-slate-500 line-clamp-1">Design advanced LLM prompts</p>
                        </div>
                    </a>

                    <a href="/tool/fire_retirement_heatmap" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition group/item">
                        <div class="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-500 group-hover/item:bg-white group-hover/item:shadow-sm transition-all">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        </div>
                        <div>
                            <h5 class="text-xs font-bold text-slate-800 group-hover/item:text-[#EE6C4D] transition-colors">FIRE Retirement Planner</h5>
                            <p class="text-[10px] text-slate-500 line-clamp-1">Visual independence roadmap</p>
                        </div>
                    </a>

                    <a href="/tool/visual_acuity_snellen" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition group/item">
                        <div class="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0 text-rose-500 group-hover/item:bg-white group-hover/item:shadow-sm transition-all">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </div>
                        <div>
                            <h5 class="text-xs font-bold text-slate-800 group-hover/item:text-[#EE6C4D] transition-colors">Online Eye Chart</h5>
                            <p class="text-[10px] text-slate-500 line-clamp-1">Check vision acuity on screen</p>
                        </div>
                    </a>

                </div>
            </div>
        </div>`;

    const hubRegex = /<div class="relative group flex-shrink-0">\s*<a href="\\?\/#my-hub"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
    const hubDropdown = `
        <div class="relative group flex-shrink-0">
            <a href="/#my-hub" class="nav-link text-sm font-bold text-gray-600 group-hover:text-[#EE6C4D] transition outline-none focus:ring-2 focus:ring-[#EE6C4D] rounded py-2">My Hub</a>
            <div class="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto absolute top-full left-1/2 -translate-x-1/2 pt-4 z-[9999] transition-opacity duration-200">
                <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/40 border border-slate-100 p-3 w-72 flex flex-col gap-1">
                    <h4 class="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1 px-2">Curated Hubs</h4>

                    <a href="/hubs/startup" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition group/item border border-transparent hover:border-slate-100">
                        <div class="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-500 group-hover/item:bg-white group-hover/item:shadow-sm transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <div>
                            <h5 class="text-xs font-bold text-slate-800 group-hover/item:text-[#EE6C4D] transition-colors">Startup & VC</h5>
                            <p class="text-[10px] text-slate-500">Cap tables, valuations</p>
                        </div>
                    </a>

                    <a href="/hubs/freelance" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition group/item border border-transparent hover:border-slate-100">
                        <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500 group-hover/item:bg-white group-hover/item:shadow-sm transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <div>
                            <h5 class="text-xs font-bold text-slate-800 group-hover/item:text-[#EE6C4D] transition-colors">Freelance & Creator</h5>
                            <p class="text-[10px] text-slate-500">Invoices, royalties</p>
                        </div>
                    </a>

                    <a href="/hubs/wellness" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition group/item border border-transparent hover:border-slate-100">
                        <div class="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0 text-rose-500 group-hover/item:bg-white group-hover/item:shadow-sm transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        </div>
                        <div>
                            <h5 class="text-xs font-bold text-slate-800 group-hover/item:text-[#EE6C4D] transition-colors">Wellness & Focus</h5>
                            <p class="text-[10px] text-slate-500">Sleep debt, meditations</p>
                        </div>
                    </a>

                </div>
            </div>
        </div>`;

    const toolsRegex = /<div class="relative group flex-shrink-0">\s*<a href="\\?\/tool"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
    const toolsDropdown = `
        <div class="relative group flex-shrink-0">
            <a href="/tool" class="flex items-center gap-1.5 px-2 py-2 text-sm text-slate-600 group-hover:text-[#EE6C4D] font-bold transition-colors outline-none focus:ring-2 focus:ring-[#EE6C4D] rounded">
                All Tools<span id="tool-count" class="bg-orange-100 text-[#EE6C4D] text-[10px] px-1.5 py-0.5 rounded-full border border-orange-200">...</span>
            </a>
            <div class="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto absolute top-full left-1/2 -translate-x-1/2 pt-3 z-[9999] transition-opacity duration-200">
                <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/40 border border-slate-100 p-4 w-[480px]">
                    <div class="grid grid-cols-2 gap-2">
                        <a href="/tool#ai" class="flex flex-col gap-1.5 p-3 rounded-xl hover:bg-slate-50 transition group/item border border-transparent hover:border-slate-100">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 group-hover/item:bg-white group-hover/item:shadow-sm transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                                </div>
                                <h5 class="text-xs font-bold text-slate-800 group-hover/item:text-[#EE6C4D] transition-colors">AI & Automation</h5>
                            </div>
                            <p class="text-[10px] text-slate-500 leading-relaxed line-clamp-2">System prompts, formatters, tokens</p>
                        </a>

                        <a href="/tool#finance" class="flex flex-col gap-1.5 p-3 rounded-xl hover:bg-slate-50 transition group/item border border-transparent hover:border-slate-100">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover/item:bg-white group-hover/item:shadow-sm transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <h5 class="text-xs font-bold text-slate-800 group-hover/item:text-[#EE6C4D] transition-colors">Finance & Quant</h5>
                            </div>
                            <p class="text-[10px] text-slate-500 leading-relaxed line-clamp-2">Valuations, amortizations, FIRE plans</p>
                        </a>

                        <a href="/tool#health" class="flex flex-col gap-1.5 p-3 rounded-xl hover:bg-slate-50 transition group/item border border-transparent hover:border-slate-100">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 group-hover/item:bg-white group-hover/item:shadow-sm transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                </div>
                                <h5 class="text-xs font-bold text-slate-800 group-hover/item:text-[#EE6C4D] transition-colors">Clinical Health</h5>
                            </div>
                            <p class="text-[10px] text-slate-500 leading-relaxed line-clamp-2">Vision tests, macros, vitals</p>
                        </a>

                        <a href="/tool#devops" class="flex flex-col gap-1.5 p-3 rounded-xl hover:bg-slate-50 transition group/item border border-transparent hover:border-slate-100">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-500 group-hover/item:bg-white group-hover/item:shadow-sm transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                </div>
                                <h5 class="text-xs font-bold text-slate-800 group-hover/item:text-[#EE6C4D] transition-colors">DevOps & Eng</h5>
                            </div>
                            <p class="text-[10px] text-slate-500 leading-relaxed line-clamp-2">RAID calcs, subnetters, regex</p>
                        </a>
                    </div>
                    
                    <div class="mt-3 pt-3 border-t border-slate-100">
                        <a href="/tool" class="flex items-center justify-between w-full p-3 rounded-xl bg-slate-50 hover:bg-[#EE6C4D] hover:text-white text-slate-700 transition-colors group/btn outline-none focus:ring-2 focus:ring-[#EE6C4D] focus:ring-offset-2">
                            <span class="text-xs font-bold">Explore Full Directory (160+ Tools)</span>
                            <svg class="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>`;

    if (file.endsWith('script.js')) {
        content = content.replace(trendingRegex, trendingDropdown.trim().replace(/"/g, '\\"').replace(/\n/g, '\\n'));
        content = content.replace(hubRegex, hubDropdown.trim().replace(/"/g, '\\"').replace(/\n/g, '\\n'));
        content = content.replace(toolsRegex, toolsDropdown.trim().replace(/"/g, '\\"').replace(/\n/g, '\\n'));
    } else {
        content = content.replace(trendingRegex, trendingDropdown.trim());
        content = content.replace(hubRegex, hubDropdown.trim());
        content = content.replace(toolsRegex, toolsDropdown.trim());
    }

    fs.writeFileSync(file, content);
});

console.log('Rich Nav mega menus updated in HTML and script.js files.');

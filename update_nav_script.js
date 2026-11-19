const fs = require('fs');
const path = require('path');

const files = [
    path.join(__dirname, 'public', 'script.js')
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');

    // 1. Trending
    const trendingRegex = /<a href="\/#featured"[\s\S]*?class="nav-link[^"]*">Trending<\/a>/;
    const trendingDropdown = `
        <div class="relative group flex-shrink-0">
            <a href="/#featured" class="nav-link text-sm font-bold text-gray-600 group-hover:text-[#EE6C4D] transition outline-none focus:ring-2 focus:ring-[#EE6C4D] rounded py-2">Trending</a>
            <div class="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto absolute top-full left-1/2 -translate-x-1/2 pt-4 z-[9999] transition-opacity duration-200">
                <div class="bg-white rounded-xl shadow-xl border border-slate-100 p-2 w-56 flex flex-col gap-1">
                    <a href="/tool/zfs_capacity_calc" class="block px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#EE6C4D] rounded-lg transition text-left">ZFS RAID Calculator</a>
                    <a href="/tool/prompt_template_builder" class="block px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#EE6C4D] rounded-lg transition text-left">AI Prompt Builder</a>
                    <a href="/tool/fire_retirement_heatmap" class="block px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#EE6C4D] rounded-lg transition text-left">FIRE Retirement Planner</a>
                    <a href="/tool/visual_acuity_snellen" class="block px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#EE6C4D] rounded-lg transition text-left">Online Eye Chart</a>
                </div>
            </div>
        </div>`;
    content = content.replace(trendingRegex, trendingDropdown.trim().replace(/\n/g, '\\n'));

    // 2. My Hub
    const hubRegex = /<a href="\/#my-hub"[\s\S]*?class="nav-link[^"]*">\s*My\s*Hub<\/a>/;
    const hubDropdown = `
        <div class="relative group flex-shrink-0">
            <a href="/#my-hub" class="nav-link text-sm font-bold text-gray-600 group-hover:text-[#EE6C4D] transition outline-none focus:ring-2 focus:ring-[#EE6C4D] rounded py-2">My Hub</a>
            <div class="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto absolute top-full left-1/2 -translate-x-1/2 pt-4 z-[9999] transition-opacity duration-200">
                <div class="bg-white rounded-xl shadow-xl border border-slate-100 p-2 w-48 flex flex-col gap-1">
                    <a href="/hubs/startup" class="block px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#EE6C4D] rounded-lg transition text-left">Startup & VC</a>
                    <a href="/hubs/freelance" class="block px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#EE6C4D] rounded-lg transition text-left">Freelance & Creator</a>
                    <a href="/hubs/wellness" class="block px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#EE6C4D] rounded-lg transition text-left">Wellness & Focus</a>
                </div>
            </div>
        </div>`;
    content = content.replace(hubRegex, hubDropdown.trim().replace(/\n/g, '\\n'));

    // 3. All Tools
    const toolsRegex = /<a href="\/tool"[\s\S]*?class="flex items-center[^"]*">\s*All Tools[\s\S]*?<\/a>/;
    const toolsDropdown = `
        <div class="relative group flex-shrink-0">
            <a href="/tool" class="flex items-center gap-1.5 px-2 py-2 text-sm text-slate-600 group-hover:text-[#EE6C4D] font-bold transition-colors outline-none focus:ring-2 focus:ring-[#EE6C4D] rounded">
                All Tools<span id="tool-count" class="bg-orange-100 text-[#EE6C4D] text-[10px] px-1.5 py-0.5 rounded-full border border-orange-200">...</span>
            </a>
            <div class="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto absolute top-full left-1/2 -translate-x-1/2 pt-3 z-[9999] transition-opacity duration-200">
                <div class="bg-white rounded-xl shadow-xl border border-slate-100 p-2 w-44 flex flex-col gap-1">
                    <a href="/tool#ai" class="block px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#EE6C4D] rounded-lg transition text-left">AI & Automation</a>
                    <a href="/tool#finance" class="block px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#EE6C4D] rounded-lg transition text-left">Finance & Quant</a>
                    <a href="/tool#health" class="block px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#EE6C4D] rounded-lg transition text-left">Clinical Health</a>
                    <a href="/tool#devops" class="block px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#EE6C4D] rounded-lg transition text-left">DevOps & Engineering</a>
                    <a href="/tool#creator" class="block px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#EE6C4D] rounded-lg transition text-left">Creator Suite</a>
                    <div class="border-t border-slate-100 my-1"></div>
                    <a href="/tool" class="block px-3 py-2 text-xs font-bold text-[#EE6C4D] hover:bg-slate-50 rounded-lg transition text-center">View Directory</a>
                </div>
            </div>
        </div>`;
    content = content.replace(toolsRegex, toolsDropdown.trim().replace(/\n/g, '\\n'));

    // 4. Saved Tools
    const savedRegex = /<button id="nav-favorites-btn"[\s\S]*?<\/button>/;
    const savedDropdown = `
        <div class="relative group flex-shrink-0">
            <button id="nav-favorites-btn" aria-label="View Saved Tools" class="flex items-center gap-1.5 text-sm font-bold text-gray-600 group-hover:text-[#EE6C4D] transition outline-none focus:ring-2 focus:ring-[#EE6C4D] rounded px-3 py-2">
                <svg class="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                </svg>
                <span class="hidden xl:inline">Saved</span> <span id="saved-tools-count" class="hidden bg-orange-100 text-[#EE6C4D] text-[9px] px-1.5 py-0.5 rounded-full font-black">0</span>
            </button>
            <div class="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto absolute top-full right-0 pt-2 z-[9999] transition-opacity duration-200">
                <div class="bg-white rounded-xl shadow-xl border border-slate-100 p-3 w-64 flex flex-col">
                    <h4 class="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2 px-1">Your Favorites</h4>
                    <div id="nav-saved-dropdown-list" class="flex flex-col gap-1 max-h-64 overflow-y-auto custom-scrollbar">
                        <p class="text-xs text-slate-500 italic p-2 text-center">No saved tools yet.</p>
                    </div>
                </div>
            </div>
        </div>`;
    content = content.replace(savedRegex, savedDropdown.trim().replace(/\n/g, '\\n'));

    fs.writeFileSync(file, content);
});

console.log('Nav dropdowns updated in script.js html strings.');

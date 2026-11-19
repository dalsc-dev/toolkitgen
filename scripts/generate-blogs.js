const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsDir = path.join(rootDir, 'public/tool');
const blogDir = path.join(rootDir, 'public/blog');

const tools = fs.readdirSync(toolsDir)
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace('.html', ''));

const toolMeta = {
    'ai_face_age_scanner': {
        title: 'AI Face Age Scanner',
        category: 'Biometrics',
        description: 'Calculate your biological age with our free AI Face Age Scanner. Analyze 468 facial landmarks, canthal tilt, skin quality, and symmetry.',
        keywords: ['ai age scanner', 'biological age', 'facial analysis', 'canthal tilt']
    },
    'postural_sway_analyzer': {
        title: 'Postural Sway Analyzer',
        category: 'Health',
        description: 'Analyze your balance and posture stability with advanced motion detection technology.',
        keywords: ['posture', 'balance', 'stability', 'health']
    },
    'keyboard_latency_test': {
        title: 'Keyboard Latency Test',
        category: 'Performance',
        description: 'Measure your keyboard input latency with precision testing tools for gamers and typists.',
        keywords: ['keyboard', 'latency', 'gaming', 'input']
    },
    'hearing_age_test': {
        title: 'Hearing Age Test',
        category: 'Health',
        description: 'Discover your hearing age with our comprehensive audio frequency test.',
        keywords: ['hearing', 'audio', 'frequency', 'health']
    },
    'reaction_time_benchmark': {
        title: 'Reaction Time Benchmark',
        category: 'Performance',
        description: 'Test and benchmark your reaction time with scientifically designed tests.',
        keywords: ['reaction time', 'benchmark', 'performance', 'cognitive']
    }
};

function toTitleCase(str) {
    return str
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function getToolMeta(toolName) {
    if (toolMeta[toolName]) {
        return toolMeta[toolName];
    }
    return {
        title: toTitleCase(toolName),
        category: 'Tools',
        description: `Free online ${toTitleCase(toolName)} tool. No download required, works in your browser.`,
        keywords: [toTitleCase(toolName).toLowerCase(), 'online tool', 'free tool']
    };
}

function generateBlogContent(toolName) {
    const meta = getToolMeta(toolName);
    const toolUrl = `https://toolkitgen.com/tool/${toolName}`;
    
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${meta.title}: Complete Guide & Tutorial | Toolkit Gen</title>
    <meta name="description" content="${meta.description}" />
    <meta name="keywords" content="${meta.keywords.join(', ')}" />
    <link rel="canonical" href="https://toolkitgen.com/blog/${toolName}" />
    <meta name="author" content="Toolkit Gen">
    <meta name="robots" content="index, follow">
    <link rel="stylesheet" href="/style.css">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${meta.title} | Toolkit Gen">
    <meta property="og:description" content="${meta.description}">
    <meta property="og:url" content="https://toolkitgen.com/blog/${toolName}">
    <meta property="og:site_name" content="Toolkit Gen">
    <script src="/tailwind.js"></script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${meta.title}: Complete Guide",
        "description": "${meta.description}",
        "author": {
            "@type": "Organization",
            "name": "Toolkit Gen"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Toolkit Gen",
            "logo": {
                "@type": "ImageObject",
                "url": "https://toolkitgen.com/assets/favicon/android-chrome-192x192.png"
            }
        }
    }
    </script>
    <style>
        :root {
            --color-site-primary: #EE6C4D;
            --color-ai-accent: #fb923c;
        }
        
        body {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        article {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        article h1 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            color: #0f172a;
            line-height: 1.2;
        }
        
        article h2 {
            font-size: 1.75rem;
            font-weight: 700;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            color: #1e293b;
            border-left: 4px solid var(--color-site-primary);
            padding-left: 1rem;
        }
        
        article h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 0.75rem;
            color: #0f172a;
        }
        
        article p {
            line-height: 1.8;
            margin-bottom: 1.25rem;
            color: #475569;
        }
        
        article ul, article ol {
            margin-bottom: 1.5rem;
            padding-left: 1.5rem;
            color: #475569;
        }
        
        article li {
            margin-bottom: 0.5rem;
            line-height: 1.6;
        }
        
        article a {
            color: var(--color-site-primary);
            text-decoration: none;
            font-weight: 500;
        }
        
        article a:hover {
            text-decoration: underline;
        }
        
        .cta-box {
            background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%);
            border-radius: 1.5rem;
            padding: 2rem;
            border: 1px solid #ffedd5;
            margin: 2rem 0;
            text-align: center;
        }
        
        .cta-button {
            display: inline-block;
            background: var(--color-site-primary);
            color: white;
            padding: 1rem 2rem;
            border-radius: 1rem;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s ease;
            margin-top: 1rem;
        }
        
        .cta-button:hover {
            background: #c2410c;
            transform: translateY(-2px);
            text-decoration: none;
        }
        
        .disclaimer {
            background: #fef2f2;
            border: 1px solid #fee2e2;
            color: #991b1b;
            padding: 1rem;
            border-radius: 0.75rem;
            margin: 1.5rem 0;
            font-size: 0.875rem;
        }
        
        .info-box {
            background: #f0f9ff;
            border-left: 4px solid #0ea5e9;
            padding: 1rem;
            margin: 1.5rem 0;
            border-radius: 0 0.5rem 0.5rem 0;
        }
    </style>
</head>

<body class="antialiased bg-[#f8fafc] flex flex-col min-h-screen">
    <header id="app-header"></header>
    
    <main class="flex-grow w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        <nav class="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
                <li class="inline-flex items-center">
                    <a href="/" class="inline-flex items-center hover:text-amber-600 transition-colors">
                        Home
                    </a>
                </li>
                <li>/</li>
                <li><a href="/blog" class="hover:text-[#EE6C4D]">Blog</a></li>
                <li>/</li>
                <li class="text-slate-800 font-semibold" aria-current="page">${meta.title}</li>
            </ol>
        </nav>
        
        <article class="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-200">
            <header class="mb-12">
                <span class="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    ${meta.category}
                </span>
                <h1>${meta.title}: The Complete Guide</h1>
                <p class="text-xl text-slate-600 leading-relaxed mt-4">
                    ${meta.description}
                </p>
            </header>
            
            <h2>What is ${meta.title}?</h2>
            <p>
                ${meta.title} is a free online tool provided by Toolkit Gen that helps you analyze and measure 
                important metrics related to ${meta.category.toLowerCase()}. Built with modern web technologies, 
                it runs entirely in your browser with no downloads or installations required.
            </p>
            
            <h2>Key Features</h2>
            <ul>
                <li><strong>100% Free:</strong> No hidden fees, subscriptions, or premium features</li>
                <li><strong>Privacy-First:</strong> All processing happens locally in your browser</li>
                <li><strong>No Installation:</strong> Works immediately in any modern web browser</li>
                <li><strong>Accurate Results:</strong> Uses scientifically validated measurement methods</li>
                <li><strong>Mobile Friendly:</strong> Fully responsive design for all devices</li>
            </ul>
            
            <h2>How to Use ${meta.title}</h2>
            <p>
                Getting started with ${meta.title} is simple. Follow these steps to get accurate results:
            </p>
            
            <ol>
                <li><strong>Open the Tool:</strong> Navigate to the <a href="${toolUrl}">${meta.title} tool</a></li>
                <li><strong>Allow Permissions:</strong> Grant any necessary browser permissions (camera, microphone, etc.)</li>
                <li><strong>Follow On-Screen Instructions:</strong> The tool will guide you through the testing process</li>
                <li><strong>Review Your Results:</strong> Get detailed metrics and analysis</li>
                <li><strong>Save or Share:</strong> Export your results or share them with others</li>
            </ol>
            
            <h2>Tips for Accurate Results</h2>
            <div class="info-box">
                <p class="!mb-0"><strong>Pro Tip:</strong> For the most accurate results, ensure you are in a well-lit environment 
                and follow the tool's specific instructions carefully. Each test may have unique requirements for optimal accuracy.</p>
            </div>
            
            <h2>Why Use Online Tools?</h2>
            <p>
                Online tools like ${meta.title} offer several advantages over traditional software:
            </p>
            <ul>
                <li><strong>Accessibility:</strong> Access from any device with an internet connection</li>
                <li><strong>No Updates:</strong> Always running the latest version</li>
                <li><strong>Cross-Platform:</strong> Works on Windows, Mac, Linux, iOS, and Android</li>
                <li><strong>Secure:</strong> Your data stays on your device</li>
            </ul>
            
            <h2>Frequently Asked Questions</h2>
            
            <h3>Is ${meta.title} free to use?</h3>
            <p>
                Yes, ${meta.title} is completely free to use. There are no hidden fees, premium tiers, or 
                limitations on how many times you can use the tool.
            </p>
            
            <h3>Is my data private?</h3>
            <p>
                Absolutely. ${meta.title} processes all data locally in your browser. No information is sent 
                to external servers, ensuring complete privacy and security.
            </p>
            
            <h3>Do I need to install anything?</h3>
            <p>
                No, ${meta.title} runs entirely in your web browser. Simply open the tool and start using it 
                immediately.
            </p>
            
            <h3>How accurate are the results?</h3>
            <p>
                The tool uses scientifically validated methods and algorithms to provide accurate results. 
                However, for medical or professional purposes, please consult with a qualified professional.
            </p>
            
            <div class="disclaimer">
                <strong>Disclaimer:</strong> This tool is for educational and entertainment purposes only. 
                Results should not be used for medical diagnosis or professional assessments. Always consult 
                with qualified professionals for health-related concerns.
            </div>
            
            <div class="cta-box">
                <h3 style="border: none; padding: 0; margin: 0 0 1rem 0;">Ready to Get Started?</h3>
                <p class="text-slate-600 !mb-0">
                    Try ${meta.title} now and discover what this powerful tool can do for you.
                </p>
                <a href="${toolUrl}" class="cta-button">
                    Launch ${meta.title}
                </a>
            </div>
            
            <h2>Related Tools</h2>
            <p>
                Explore more free online tools from Toolkit Gen:
            </p>
            <ul>
                <li><a href="/tool/ai_face_age_scanner">AI Face Age Scanner</a> - Discover your biological age</li>
                <li><a href="/tool/reaction_time_benchmark">Reaction Time Benchmark</a> - Test your reflexes</li>
                <li><a href="/tool/hearing_age_test">Hearing Age Test</a> - Check your hearing health</li>
            </ul>
        </article>
    </main>
    
    <footer id="app-footer"></footer>
    
    <script type="module">
        // Load header and footer
        async function loadComponents() {
            try {
                const headerRes = await fetch('/components/header.html');
                const footerRes = await fetch('/components/footer.html');
                if (headerRes.ok) {
                    document.getElementById('app-header').innerHTML = await headerRes.text();
                }
                if (footerRes.ok) {
                    document.getElementById('app-footer').innerHTML = await footerRes.text();
                }
            } catch (e) {
                console.log('Components not found, using default layout');
            }
        }
        loadComponents();
    </script>
</body>

</html>`;
}

console.log(`Found ${tools.length} tools`);

// Generate blog posts for all tools
tools.forEach((toolName, index) => {
    const blogFileName = `${toolName}.html`;
    const blogPath = path.join(blogDir, blogFileName);
    const content = generateBlogContent(toolName);
    
    fs.writeFileSync(blogPath, content);
    console.log(`[${index + 1}/${tools.length}] Created blog: ${blogFileName}`);
});

console.log(`\nDone! Created ${tools.length} blog posts in ${blogDir}`);

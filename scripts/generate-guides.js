const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsDir = path.join(rootDir, 'public/tool');
const guideDir = path.join(rootDir, 'public/guide');

const tools = fs.readdirSync(toolsDir)
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace('.html', ''));

const toolMeta = {
    'cursor_chase_multiplayer': {
        title: "Don't Touch My Cursor",
        category: 'Browser Magic & Meta-Toys',
        description: 'A survival game where your mouse cursor is the prey. Hundreds of AI cursors swarm to tag you. Survive as long as you can in this addictive browser game.',
        keywords: ['cursor chase game', 'mouse survival game', 'browser game', 'AI cursor game', 'multiplayer game'],
        features: ['AI-controlled opponents', 'Survival scoring system', 'Responsive controls', 'Multiple difficulty levels', 'Real-time collision detection'],
        useCases: ['Entertainment and fun', 'Reflex improvement', 'Stress relief gaming', 'Quick browser breaks'],
        faq: [
            { q: 'How do I play?', a: 'Simply move your mouse cursor to avoid the AI cursors. If any AI cursor touches yours, you lose.' },
            { q: 'Can I play on mobile?', a: 'This game is optimized for desktop browsers with mouse input.' },
            { q: 'Is my data tracked?', a: 'No, all gameplay happens locally in your browser.' }
        ]
    },
    'wiki_speed_racer': {
        title: 'The Wikipedia Racer',
        category: 'Gamified Knowledge',
        description: 'Race to click through Wikipedia hyperlinks to connect two random topics in the fewest clicks. Test your knowledge and navigation skills.',
        keywords: ['wikipedia game', 'wiki racer', 'knowledge game', 'link navigation', 'trivia challenge'],
        features: ['Random topic generation', 'Click counter', 'Wikipedia integration', 'Time tracking', 'Difficulty scaling'],
        useCases: ['Learning new topics', 'Entertainment', 'Brain training', 'Knowledge exploration'],
        faq: [
            { q: 'What is Wikipedia Racer?', a: 'A game where you navigate from one Wikipedia article to another using only hyperlinks.' },
            { q: 'Is Wikipedia content accurate?', a: 'Wikipedia is user-contributed; always verify critical information from primary sources.' },
            { q: 'Can I play with friends?', a: 'Currently a single-player experience, but you can compare scores with friends.' }
        ]
    },
    'evolution_clicker_sim': {
        title: 'Single Cell to Civilization',
        category: 'Simulation & Idle',
        description: 'Start as a single-celled organism and evolve through billions of years of evolution with every click. Watch your species transform from simple cells to complex civilizations.',
        keywords: ['evolution game', 'clicker game', 'idle game', 'simulation game', 'biology game'],
        features: ['Evolution timeline', 'Species progression', 'Visual transformations', 'Milestone achievements', 'Idle auto-progression'],
        useCases: ['Educational entertainment', 'Understanding evolution', 'Relaxing gameplay', 'Time-killing activity'],
        faq: [
            { q: 'How long does it take to reach civilization?', a: 'With active clicking, approximately 30-60 minutes. Idle progression continues even when not playing.' },
            { q: 'Is this scientifically accurate?', a: 'The game simplifies evolution for entertainment; real evolution is far more complex.' },
            { q: 'Can I save my progress?', a: 'Progress is saved in your browser local storage.' }
        ]
    },
    'beat_maker_typing': {
        title: 'Typewriter Orchestra',
        category: 'Audio & Visual Experiment',
        description: 'Turn your keyboard into a musical instrument. Every letter key triggers a specific loop or sample. Create music while you type.',
        keywords: ['music keyboard', 'type to music', 'online beat maker', 'virtual instrument', 'keyboard music'],
        features: ['Multiple sound samples', 'Loop recording', 'Volume controls', 'Tempo adjustment', 'Visual feedback'],
        useCases: ['Music creation', 'Entertainment', 'Learning music theory', 'Stress relief through creativity'],
        faq: [
            { q: 'Do I need musical experience?', a: 'No, the tool is designed for anyone to create music fun.' },
            { q: 'Can I save my compositions?', a: 'Currently compositions exist for the session; future versions may include export.' },
            { q: 'Which keys make which sounds?', a: 'Each letter key triggers a different musical sample or note.' }
        ]
    },
    'dark_pattern_simulator': {
        title: 'User Interface Hell',
        category: 'Satire & Challenge',
        description: 'A puzzle game where you must unsubscribe from a fake newsletter, but the UI fights you at every turn. Experience frustrating UX patterns firsthand.',
        keywords: ['UX design', 'dark patterns', 'unsubscribe game', 'UI satire', 'user experience'],
        features: ['Satirical UI design', 'Multiple challenges', 'Educational content', 'Progress tracking', 'Humor elements'],
        useCases: ['UX education', 'Entertainment', 'Understanding dark patterns', 'Web design awareness'],
        faq: [
            { q: 'What are dark patterns?', a: 'Deceptive UX designs that trick users into unintended actions, often against their interests.' },
            { q: 'Is this based on real examples?', a: 'Many challenges are inspired by real-world dark patterns found on various websites.' },
            { q: 'Who should play this game?', a: 'Anyone interested in web design, consumer rights, or just looking for a fun challenge.' }
        ]
    },
    'satellite_view_guesser': {
        title: 'Where on Earth?',
        category: 'Gamified Knowledge',
        description: 'Guess your location based on a random satellite view without labels. Test your geography knowledge and explore the world.',
        keywords: ['geography game', 'satellite view', 'location guessing', 'world geography', 'map game'],
        features: ['Random satellite images', 'Scoring system', 'Hint system', 'Location reveal', 'Global coverage'],
        useCases: ['Geography education', 'Entertainment', 'Travel planning inspiration', 'Curiosity satisfaction'],
        faq: [
            { q: 'Where do the satellite images come from?', a: 'Images are sourced from publicly available satellite data with location data removed.' },
            { q: 'Can I play without any geography knowledge?', a: 'Yes, you will learn geography naturally through gameplay.' },
            { q: 'Are famous landmarks included?', a: 'Yes, the game includes a variety of locations from famous landmarks to remote areas.' }
        ]
    },
    'prompt_template_builder': {
        title: 'LLM Prompt Engineering Builder',
        category: 'AI Strategy & Document Automation',
        description: 'Create precise, hallucination-free prompts for ChatGPT, Claude, and other LLMs using proven frameworks like Chain-of-Thought to dramatically improve AI responses.',
        keywords: ['AI prompt builder', 'prompt engineering', 'ChatGPT prompts', 'LLM optimization', 'Chain-of-Thought'],
        features: ['Framework templates', 'Chain-of-Thought support', 'Output formatting', 'Temperature controls', 'Prompt testing'],
        useCases: ['AI content creation', 'Business automation', 'Research assistance', 'Learning prompt engineering'],
        faq: [
            { q: 'What prompt frameworks are available?', a: 'Currently supports Chain-of-Thought, Few-Shot, and Role-Based frameworks.' },
            { q: 'Does this send my prompts to servers?', a: 'No, all prompt processing happens locally in your browser.' },
            { q: 'Can I export my prompts?', a: 'Yes, prompts can be copied or exported in various formats.' }
        ]
    },
    'markdown_to_pdf_pro': {
        title: 'Markdown to PDF Converter',
        category: 'AI Strategy & Document Automation',
        description: 'Convert GitHub-flavored Markdown into professional PDF documents instantly with custom CSS styling and LaTeX math support.',
        keywords: ['markdown to PDF', 'PDF converter', 'document conversion', 'LaTeX support', 'markdown converter'],
        features: ['GitHub-flavored Markdown', 'Custom CSS styling', 'LaTeX math support', 'Real-time preview', 'Batch conversion'],
        useCases: ['Academic document creation', 'Technical documentation', 'Resume formatting', 'Report generation'],
        faq: [
            { q: 'What Markdown features are supported?', a: 'Full GitHub-flavored Markdown including tables, code blocks, and task lists.' },
            { q: 'Can I customize the PDF styling?', a: 'Yes, you can add custom CSS for headers, fonts, colors, and more.' },
            { q: 'Is my document uploaded to servers?', a: 'No, all conversion happens locally in your browser.' }
        ]
    },
    'tdee_macro_calculator': {
        title: 'TDEE & Macro Calculator',
        category: 'Clinical Health & Diagnostics',
        description: 'Calculate your Total Daily Energy Expenditure and get a precise breakdown of protein, fats, and carbs for weight loss or muscle gain.',
        keywords: ['TDEE calculator', 'macro calculator', 'calorie calculator', 'weight loss', 'nutrition calculator'],
        features: ['BMR calculation', 'Activity level adjustment', 'Macro ratio presets', 'Goal-based planning', 'Meal planning support'],
        useCases: ['Weight management', 'Fitness planning', 'Nutrition tracking', 'Muscle building'],
        faq: [
            { q: 'How accurate is the TDEE calculation?', a: 'TDEE estimates are based on established formulas and are generally accurate within 10%.' },
            { q: 'What formulas are used?', a: 'Uses Mifflin-St Jeor equation for BMR, adjusted by activity multiplier for TDEE.' },
            { q: 'Should I consult a professional?', a: 'For medical-grade nutrition planning, consult a registered dietitian.' }
        ]
    },
    'fire_retirement_heatmap': {
        title: 'FIRE Retirement Calculator',
        category: 'Personal Finance & F.I.R.E.',
        description: 'Visualize your path to Financial Independence and Retire Early based on savings rate, investment returns, and expenses with colorful heatmap visualizations.',
        keywords: ['FIRE calculator', 'retirement planning', 'financial independence', 'savings calculator', 'investment planning'],
        features: ['Savings rate projection', 'Investment growth visualization', 'Withdrawal strategies', 'Tax considerations', 'Scenario comparison'],
        useCases: ['Retirement planning', 'Financial goal setting', 'Investment strategy', 'Early retirement planning'],
        faq: [
            { q: 'What is FIRE?', a: 'FIRE stands for Financial Independence, Retire Early - a movement focused on aggressive saving and investing.' },
            { q: 'How accurate are projections?', a: 'Projections use historical averages; actual returns may vary significantly.' },
            { q: 'Does it account for inflation?', a: 'Yes, the calculator includes inflation adjustments in projections.' }
        ]
    },
    'zfs_capacity_calc': {
        title: 'ZFS RAID Calculator',
        category: 'DevOps & Code Engineering',
        description: 'Calculate usable storage capacity for ZFS pools including RAIDZ, Mirror, and striped configurations with parity calculations and performance recommendations.',
        keywords: ['ZFS calculator', 'RAID calculator', 'storage capacity', 'RAIDZ', 'ZFS pool calculator'],
        features: ['RAIDZ configurations', 'Mirror calculation', 'Striped volumes', 'Parity overhead', 'Performance tips'],
        useCases: ['Server planning', 'Storage provisioning', 'Home NAS builds', 'Enterprise storage design'],
        faq: [
            { q: 'What RAID levels are supported?', a: 'Supports RAIDZ1, RAIDZ2, RAIDZ3, Mirror, and striped configurations.' },
            { q: 'Is the calculation exact?', a: 'Calculations are accurate; actual usable space may vary slightly due to filesystem overhead.' },
            { q: 'Should I use RAIDZ or Mirror?', a: 'Mirrors offer better performance; RAIDZ offers better space efficiency with redundancy.' }
        ]
    },
    'reaction_time_benchmark': {
        title: 'Reaction Time Test',
        category: 'Gaming & Performance',
        description: 'Measure and improve your visual reflexes with a millisecond-precise reaction time test. Track your progress and compare with others.',
        keywords: ['reaction time test', 'reflex test', 'gaming performance', 'response time', 'benchmark'],
        features: ['Millisecond precision', 'Multiple test modes', 'Progress tracking', 'Statistical analysis', 'Comparison charts'],
        useCases: ['Gaming performance', 'Athletic training', 'Cognitive assessment', 'Improvement tracking'],
        faq: [
            { q: 'What is a good reaction time?', a: 'Average is 250ms; athletes often achieve 200ms; elite gamers reach 150ms or less.' },
            { q: 'How can I improve?', a: 'Practice regularly, get adequate sleep, and maintain good hand-eye coordination.' },
            { q: 'Is the measurement accurate?', a: 'Uses high-resolution timestamps for accurate millisecond measurement.' }
        ]
    },
    'keyboard_latency_test': {
        title: 'Keyboard Latency Test',
        category: 'Hardware & Peripheral Health',
        description: 'Accurately measure the input lag of your keyboard in milliseconds to test performance for gaming or competitive typing.',
        keywords: ['keyboard latency', 'input lag test', 'gaming keyboard', 'response time', 'keyboard testing'],
        features: ['Millisecond precision', 'Multiple key testing', 'Polling rate display', 'Comparative analysis', 'Detailed reports'],
        useCases: ['Gaming optimization', 'Keyboard comparison', 'Hardware testing', 'Performance tuning'],
        faq: [
            { q: 'What is good keyboard latency?', a: 'Gaming keyboards typically have 1-5ms latency; anything under 10ms is excellent.' },
            { q: 'Does USB vs PS2 matter?', a: 'USB is universal; PS2 offers lower latency but fewer features.' },
            { q: 'How can I reduce latency?', a: 'Use a gaming keyboard, enable polling rate boost, and close background applications.' }
        ]
    },
    'visual_acuity_snellen': {
        title: 'Online Eye Chart',
        category: 'Clinical Health & Diagnostics',
        description: 'Use a screen-accurate Snellen chart for visual acuity testing and monitoring. Professional-grade eye chart accessible from any browser.',
        keywords: ['eye chart', 'visual acuity', 'Snellen chart', 'vision test', 'eye examination'],
        features: ['Snellen format', 'Distance calibration', 'Multiple sizes', 'Printable version', 'Progress tracking'],
        useCases: ['Vision screening', 'Eye health monitoring', 'Refractive error check', 'Pre-eye exam practice'],
        faq: [
            { q: 'Can this replace an eye exam?', a: 'No, this is for reference only. Always consult an optometrist for proper eye care.' },
            { q: 'How do I calibrate distance?', a: 'The recommended testing distance is typically 20 feet (6 meters).' },
            { q: 'What does 20/20 mean?', a: 'Means you see at 20 feet what a person with normal vision sees at 20 feet.' }
        ]
    },
    'hearing_audiogram_test': {
        title: 'Audio Frequency Response Test',
        category: 'Clinical Health & Diagnostics',
        description: 'Test your ability to hear audio tones across frequencies from 20Hz to 20kHz. Generate an audiogram to understand your hearing profile.',
        keywords: ['hearing test', 'audiogram', 'frequency test', 'audio perception', 'hearing health'],
        features: ['Full frequency range', 'Decibel level control', 'Ear-specific testing', 'Results visualization', 'Comparison baseline'],
        useCases: ['Hearing health check', 'Audio equipment testing', 'Earphone evaluation', 'Age-related hearing loss'],
        faq: [
            { q: 'Can this replace a professional hearing test?', a: 'No, this is for general reference. Consult an audiologist for medical-grade testing.' },
            { q: 'Why do I hear different frequencies differently?', a: 'Human hearing varies across frequencies; higher frequencies often diminish with age.' },
            { q: 'What volume should I use?', a: 'Start at a comfortable level and increase only as needed to hear the tone.' }
        ]
    },
    'wifi_speed_stability': {
        title: 'Internet Stability Test',
        category: 'Network & Infrastructure',
        description: 'Analyze your connection quality by measuring ping, jitter, and packet loss consistency over time. Comprehensive network diagnostics.',
        keywords: ['speed test', 'ping test', 'network diagnostics', 'connection stability', 'packet loss'],
        features: ['Ping measurement', 'Jitter analysis', 'Packet loss detection', 'Stability scoring', 'Historical tracking'],
        useCases: ['Gaming optimization', 'ISP troubleshooting', 'Network troubleshooting', 'Remote work setup'],
        faq: [
            { q: 'What is a good ping?', a: 'Under 20ms is excellent for gaming; under 100ms is good for most activities.' },
            { q: 'What causes jitter?', a: 'Network congestion, hardware limitations, or wireless interference.' },
            { q: 'How do I improve stability?', a: 'Use wired connections, update firmware, and minimize interference.' }
        ]
    },
    'monitor_refresh_tester': {
        title: 'Monitor Refresh Rate Test',
        category: 'Display & Monitor Diagnostics',
        description: 'Accurately test your screen refresh rate (Hz) and check for motion blur or ghosting artifacts. Essential for gaming monitor verification.',
        keywords: ['refresh rate test', 'monitor test', 'Hz test', 'motion blur', 'ghost test'],
        features: ['Multiple test patterns', 'Blur detection', 'Ghosting analysis', 'Response time measurement', 'Comparison mode'],
        useCases: ['Gaming monitor verification', 'Display troubleshooting', 'Hardware comparison', 'Calibration verification'],
        faq: [
            { q: 'What refresh rate should I aim for?', a: 'Gaming monitors commonly offer 144Hz, 240Hz, or 360Hz for smooth motion.' },
            { q: 'What causes ghosting?', a: 'Slow pixel response times cause trailing effects during fast motion.' },
            { q: 'Is the test accurate?', a: 'Uses visual patterns designed to reveal actual monitor performance.' }
        ]
    },
    'audio_latency_loopback': {
        title: 'Audio Latency Test',
        category: 'Audio & Sensory Engineering',
        description: 'Measure the round-trip delay of your audio setup to check for lag in Bluetooth headphones or audio interfaces.',
        keywords: ['audio latency', 'round-trip delay', 'Bluetooth audio', 'audio interface', 'latency measurement'],
        features: ['Loopback testing', 'Latency measurement', 'Bluetooth testing', 'Wired comparison', 'Optimization tips'],
        useCases: ['Bluetooth headphone testing', 'Audio interface setup', 'Music production', 'Gaming audio'],
        faq: [
            { q: 'What is acceptable audio latency?', a: 'Under 10ms is imperceptible; under 50ms is acceptable for most uses.' },
            { q: 'Why does Bluetooth have more latency?', a: 'Wireless transmission and audio encoding add delay.' },
            { q: 'How can I reduce latency?', a: 'Use wired connections, enable low-latency modes, and use aptX-LL or similar codecs.' }
        ]
    },
    'noise_dosimeter_test': {
        title: 'Noise Level Meter (Decibels)',
        category: 'Audio & Sensory Engineering',
        description: 'Monitor ambient noise levels and calculate safe exposure limits to protect your hearing. Uses your device microphone.',
        keywords: ['noise meter', 'decibel meter', 'sound level', 'hearing protection', 'exposure limit'],
        features: ['Real-time measurement', 'dB(A) weighting', 'Exposure calculator', 'Peak detection', 'Historical logging'],
        useCases: ['Hearing protection', 'Workplace safety', 'Event noise monitoring', 'Home acoustics'],
        faq: [
            { q: 'Is this measurement accurate?', a: 'Accuracy depends on device microphone quality; professional meters are more precise.' },
            { q: 'What dB level is safe?', a: '8 hours at 85dB is the exposure limit; higher levels require shorter durations.' },
            { q: 'Can I use this for OSHA compliance?', a: 'This is for reference only; professional equipment is required for compliance.' }
        ]
    },
    'mouse_polling_rate_hz': {
        title: 'Mouse Polling Rate Tester',
        category: 'Hardware & Peripheral Health',
        description: 'Check your mouse polling rate (Hz) to ensure it is performing optimally for gaming. Verify your hardware specifications.',
        keywords: ['mouse polling rate', 'Hz test', 'gaming mouse', 'polling rate', 'mouse testing'],
        features: ['Hz measurement', 'Consistency check', 'Driver verification', 'Comparison mode', 'Optimization tips'],
        useCases: ['Gaming optimization', 'Hardware verification', 'Driver troubleshooting', 'Purchase comparison'],
        faq: [
            { q: 'What polling rate should I use?', a: '1000Hz is standard for gaming; higher provides marginal benefit.' },
            { q: 'Does higher Hz reduce latency?', a: 'Yes, higher polling rates mean more frequent position updates to your PC.' },
            { q: 'Why is my mouse only 125Hz?', a: 'Check driver settings; some mice default to lower polling rates.' }
        ]
    },
    'nkey_rollover_tester': {
        title: 'Keyboard Ghosting Test',
        category: 'Hardware & Peripheral Health',
        description: 'Test your keyboard N-Key Rollover (NKRO) capabilities to see how many simultaneous keys it registers correctly.',
        keywords: ['keyboard rollover', 'NKRO', 'ghost test', 'key rollover', 'anti-ghosting'],
        features: ['Simultaneous key testing', 'Ghosting detection', 'NKRO verification', 'Visual feedback', 'Layout support'],
        useCases: ['Gaming keyboards', 'Typing verification', 'Keyboard comparison', 'Hardware troubleshooting'],
        faq: [
            { q: 'What is good NKRO?', a: 'True NKRO should register all keys simultaneously; most gaming keyboards achieve this.' },
            { q: 'Why do some keys ghost?', a: 'Keyboard matrices share circuits; pressing multiple keys on same circuit causes ghosting.' },
            { q: 'Does USB limit NKRO?', a: 'USB HID protocol can limit some keyboards; PS/2 provides true NKRO.' }
        ]
    },
    'ssl_cert_checker': {
        title: 'SSL Certificate Checker',
        category: 'DevOps & Code Engineering',
        description: 'Check a website SSL certificate details, validity chain, and expiration date. Ensure secure HTTPS connections.',
        keywords: ['SSL checker', 'certificate validation', 'HTTPS', 'security check', 'TLS checker'],
        features: ['Certificate details', 'Validity chain', 'Expiration check', 'Protocol support', 'Security rating'],
        useCases: ['Security auditing', 'Website verification', 'SSL troubleshooting', 'Compliance checking'],
        faq: [
            { q: 'What does SSL protect?', a: 'SSL encrypts data between your browser and the website, protecting sensitive information.' },
            { q: 'What makes a certificate valid?', a: 'Valid certificates are from trusted CAs, not expired, and match the domain.' },
            { q: 'What is certificate chain?', a: 'The chain links your certificate to a trusted Certificate Authority root.' }
        ]
    },
    'regex_flowchart_gen': {
        title: 'Regex Visualizer & Debugger',
        category: 'DevOps & Code Engineering',
        description: 'Understand complex Regular Expressions by converting them into interactive visual flowcharts. Perfect for learning and debugging.',
        keywords: ['regex visualizer', 'regular expression', 'regex debugger', 'regex flowchart', 'pattern matching'],
        features: ['Visual flowchart', 'Pattern explanation', 'Test input', 'Match highlighting', 'Common patterns library'],
        useCases: ['Regex learning', 'Debugging patterns', 'Code documentation', 'Pattern validation'],
        faq: [
            { q: 'How does visualization help?', a: 'Flowcharts show the logical structure of regex, making complex patterns easier to understand.' },
            { q: 'What regex flavors are supported?', a: 'JavaScript-style regex is primarily supported with common extensions.' },
            { q: 'Can I test my regex patterns?', a: 'Yes, use the test input field to see matches highlighted in real-time.' }
        ]
    },
    'cron_job_visualizer': {
        title: 'Crontab Generator & Visualizer',
        category: 'DevOps & Code Engineering',
        description: 'Create and verify Cron schedules with human-readable descriptions of when tasks will run. Essential for developers and sysadmins.',
        keywords: ['cron generator', 'crontab', 'job scheduler', 'cron expression', 'task automation'],
        features: ['Visual schedule builder', 'Human-readable output', 'Next run times', 'Common presets', 'Validation'],
        useCases: ['Server automation', 'Task scheduling', 'DevOps workflows', 'Linux administration'],
        faq: [
            { q: 'What is cron?', a: 'Cron is a time-based job scheduler in Unix-like systems for automating tasks.' },
            { q: 'How do I read a cron expression?', a: 'Format: minute hour day month weekday command (e.g., 0 * * * * runs hourly).' },
            { q: 'Can I see when my job will run?', a: 'Yes, the tool shows the next several scheduled run times.' }
        ]
    },
    'webgpu_vram_thermal_check': {
        title: 'WebGPU VRAM & Thermal Stability Stressor',
        category: 'Hardware & Performance',
        description: 'Uses WebGPU API to stress-test your graphics memory and detect thermal throttling. Monitor frame-rate stability without installing software.',
        keywords: ['WebGPU stress test', 'thermal throttling', 'GPU test', 'VRAM test', 'laptop performance'],
        features: ['GPU stress testing', 'Thermal monitoring', 'Throttling detection', 'Frame rate analysis', 'Detailed reports'],
        useCases: ['Laptop thermal testing', 'GPU health check', 'Performance comparison', 'Before-purchase testing'],
        faq: [
            { q: 'Is this safe for my GPU?', a: 'Brief tests are safe; extended stress tests may increase temperatures significantly.' },
            { q: 'What is thermal throttling?', a: 'When GPU temperature exceeds safe limits, it reduces speed to prevent damage.' },
            { q: 'Do I need WebGPU support?', a: 'Yes, this test requires a browser with WebGPU support (Chrome, Edge, etc.).' }
        ]
    },
    'dead_pixel_check': {
        title: 'Dead Pixel Checker',
        category: 'Display & Monitor Diagnostics',
        description: 'Easily spot dead or stuck pixels on your monitor by cycling through solid RGB color backgrounds. Essential for new monitor verification.',
        keywords: ['dead pixel', 'stuck pixel', 'monitor test', 'pixel checker', 'display diagnostic'],
        features: ['Solid color tests', 'RGB cycling', 'Stuck pixel detection', 'Gradient tests', 'Detailed instructions'],
        useCases: ['New monitor QC', 'Display troubleshooting', 'Warranty claims', 'Regular maintenance'],
        faq: [
            { q: 'What is the difference between dead and stuck pixels?', a: 'Dead pixels are always off (black); stuck pixels show one color constantly.' },
            { q: 'Can stuck pixels be fixed?', a: 'Sometimes running color cycling can revive stuck pixels; dead pixels are permanent.' },
            { q: 'How long should I test each color?', a: 'Spend 5-10 seconds on each color; some issues only appear after extended viewing.' }
        ]
    },
    'chmod_permission_calc': {
        title: 'Chmod Calculator',
        category: 'DevOps & Code Engineering',
        description: 'Calculate Unix file permissions visually and generate the correct Chmod octal codes. Supports numeric and symbolic notation.',
        keywords: ['chmod', 'file permissions', 'Unix permissions', 'chmod calculator', 'Linux permissions'],
        features: ['Visual permission editor', 'Octal conversion', 'Symbolic notation', 'Owner/group/other', 'Common presets'],
        useCases: ['Server configuration', 'File sharing', 'Linux administration', 'Security hardening'],
        faq: [
            { q: 'What do chmod numbers mean?', a: 'First digit: owner, second: group, third: others. Each digit: 4=read, 2=write, 1=execute.' },
            { q: 'Is chmod 777 dangerous?', a: 'Yes, it gives everyone full permissions, creating significant security risks.' },
            { q: 'What is the difference between chmod and chown?', a: 'Chmod changes permissions; chown changes file ownership.' }
        ]
    },
    'jwt_debugger_offline': {
        title: 'Token Format Viewer',
        category: 'System Administration & Data Safety',
        description: 'Decode and verify JSON Web Tokens (JWT) locally to inspect claims without sending data to external servers. Complete privacy.',
        keywords: ['JWT decoder', 'JSON Web Token', 'token viewer', 'JWT verification', 'claim inspection'],
        features: ['Header decoding', 'Payload decoding', 'Signature verification', 'Expiration check', 'Offline processing'],
        useCases: ['API development', 'Authentication debugging', 'Security auditing', 'Token validation'],
        faq: [
            { q: 'Is my token sent to servers?', a: 'No, all decoding happens locally in your browser; your tokens never leave your device.' },
            { q: 'What does a JWT contain?', a: 'Three parts: Header (algorithm), Payload (claims), Signature (verification).' },
            { q: 'Can I modify tokens?', a: 'You can decode and view; modification requires re-signing with the secret.' }
        ]
    },
    'aes_gcm_vault_local': {
        title: 'File Protection Utility',
        category: 'System Administration & Data Safety',
        description: 'Securely encrypt and decrypt files directly in your browser using AES-256-GCM encryption. Zero server uploads for complete privacy.',
        keywords: ['file encryption', 'AES-256', 'AES-GCM', 'secure encryption', 'browser encryption'],
        features: ['AES-256-GCM encryption', 'Drag and drop', 'Key derivation', 'File integrity', 'Zero server upload'],
        useCases: ['Sensitive file protection', 'Secure sharing', 'Backup encryption', 'Privacy protection'],
        faq: [
            { q: 'How secure is AES-256-GCM?', a: 'AES-256 is military-grade encryption; GCM provides authenticated encryption.' },
            { q: 'What happens to my file?', a: 'File never leaves your browser; encryption/decryption happens entirely locally.' },
            { q: 'Can I recover files if I lose the password?', a: 'No, without the password, encrypted files cannot be recovered.' }
        ]
    },
    'exif_data_scrubber': {
        title: 'Photo Metadata Cleaner',
        category: 'Digital Analytics & Research',
        description: 'Protect your privacy by stripping GPS location and device metadata from photos before sharing online. Remove sensitive EXIF data.',
        keywords: ['EXIF remover', 'metadata cleaner', 'photo privacy', 'GPS removal', 'image metadata'],
        features: ['GPS stripping', 'EXIF removal', 'Batch processing', 'Preview metadata', 'Quality preservation'],
        useCases: ['Privacy protection', 'Social media posting', 'Email attachments', 'Location privacy'],
        faq: [
            { q: 'What is EXIF data?', a: 'Exchangeable Image File Format data includes camera settings, GPS coordinates, and timestamps.' },
            { q: 'Why should I remove metadata?', a: 'Photos can reveal your location, device info, and other sensitive details.' },
            { q: 'Does processing affect image quality?', a: 'No, metadata removal does not alter the actual image pixels.' }
        ]
    },
    'ip_geo_locator': {
        title: 'IP Location Lookup',
        category: 'Digital Analytics & Research',
        description: 'Find the geographic location, ISP, and organization associated with any public IP address. Essential network troubleshooting tool.',
        keywords: ['IP lookup', 'geolocation', 'IP tracker', 'ISP lookup', 'network tools'],
        features: ['Country/region detection', 'ISP identification', 'Organization lookup', 'Proxy detection', 'Historical data'],
        useCases: ['Network troubleshooting', 'Security analysis', 'Geo-restriction testing', 'Marketing analytics'],
        faq: [
            { q: 'How accurate is IP geolocation?', a: 'Accuracy varies; typically accurate to city or region level, rarely to exact address.' },
            { q: 'Can I find someone private IP address?', a: 'No, private IPs (192.168.x.x, 10.x.x.x) are not routable on the internet.' },
            { q: 'Does VPN hide my location?', a: 'Yes, VPNs route through their servers, showing their location instead of yours.' }
        ]
    },
    'compound_waterfall': {
        title: 'Investment Growth Visualizer',
        category: 'Personal Finance & F.I.R.E.',
        description: 'See the massive advantage of starting early by comparing different investment start dates and contribution amounts. Visualize compound growth.',
        keywords: ['compound interest', 'investment growth', 'savings visualization', 'retirement planning', 'wealth building'],
        features: ['Growth projection', 'Multiple scenarios', 'Contribution analysis', 'Visual charts', 'Comparison mode'],
        useCases: ['Financial planning', 'Investment decisions', 'Retirement planning', 'Education'],
        faq: [
            { q: 'What rate of return should I use?', a: 'Historical stock market averages are around 7% after inflation; use conservative estimates.' },
            { q: 'Does this account for inflation?', a: 'Optionally, you can use inflation-adjusted returns for realistic projections.' },
            { q: 'How powerful is compound growth?', a: 'Starting 10 years earlier can double your final wealth due to compounding.' }
        ]
    },
    'monte_carlo_portfolio': {
        title: 'Retirement Monte Carlo Simulation',
        category: 'Quantitative Finance & Analysis',
        description: 'Simulate thousands of market scenarios to estimate the probability of your portfolio surviving through retirement. Advanced financial planning.',
        keywords: ['Monte Carlo simulation', 'retirement planning', 'portfolio risk', 'financial planning', 'risk analysis'],
        features: ['Thousands of simulations', 'Success probability', 'Worst-case scenarios', 'Withdrawal analysis', 'Confidence intervals'],
        useCases: ['Retirement planning', 'Risk assessment', 'Portfolio optimization', 'Financial advising'],
        faq: [
            { q: 'What is Monte Carlo simulation?', a: 'Uses random market returns across many scenarios to estimate probability of success.' },
            { q: 'How accurate are the projections?', a: 'Based on historical data; future returns may differ significantly.' },
            { q: 'What success rate should I aim for?', a: 'Financial advisors often recommend 80-90% success rate for retirement.' }
        ]
    },
    'crypto_tax_lot_viewer': {
        title: 'Crypto Tax & Cost Basis Calculator',
        category: 'Personal Finance & F.I.R.E.',
        description: 'Calculate the most tax-efficient way to sell crypto assets using FIFO/LIFO/HIFO methods to minimize capital gains taxes.',
        keywords: ['crypto tax', 'cost basis', 'capital gains', 'cryptocurrency', 'tax calculator'],
        features: ['FIFO/LIFO/HIFO methods', 'Tax optimization', 'Transaction import', 'Gain/loss calculation', 'Tax reporting'],
        useCases: ['Tax planning', 'Investment strategy', 'Portfolio management', 'Compliance'],
        faq: [
            { q: 'What is FIFO?', a: 'First In, First Out - sells oldest coins first, commonly used for tax reporting.' },
            { q: 'Which method minimizes taxes?', a: 'HIFO (Highest In, First Out) typically minimizes gains; consult a tax professional.' },
            { q: 'Does this replace tax software?', a: 'This calculates optimal methods; professional tax software handles filing.' }
        ]
    },
    'visual_debt_destroyer': {
        title: 'Debt Payoff Planner (Snowball/Avalanche)',
        category: 'Personal Finance & F.I.R.E.',
        description: 'Create a personalized plan to eliminate debt using the Snowball or Avalanche methods with visual progress tracking and payment scheduling.',
        keywords: ['debt payoff', 'debt snowball', 'debt avalanche', 'debt calculator', 'credit card payoff'],
        features: ['Snowball method', 'Avalanche method', 'Extra payment planning', 'Progress visualization', 'Interest savings'],
        useCases: ['Debt elimination', 'Financial freedom', 'Budget planning', 'Credit management'],
        faq: [
            { q: 'What is the difference between methods?', a: 'Snowball pays smallest balance first; Avalanche targets highest interest rate first.' },
            { q: 'Which method saves more money?', a: 'Avalanche typically saves more on interest; Snowball provides psychological wins.' },
            { q: 'Can I include extra payments?', a: 'Yes, add extra monthly payments to see accelerated payoff schedules.' }
        ]
    },
    'lut_previewer_webgl': {
        title: 'Online LUT Previewer',
        category: 'Creative UI & Web Design',
        description: 'Apply cinematic 3D LUTs (.CUBE files) to your images in real-time to preview color grades. Essential for filmmakers and photographers.',
        keywords: ['LUT previewer', 'color grading', '3D LUT', 'image editing', 'cinematic look'],
        features: ['Real-time preview', '.CUBE file support', 'Before/after comparison', 'Intensity control', 'Multiple images'],
        useCases: ['Film color grading', 'Photo editing', 'Video production', 'LUT testing'],
        faq: [
            { q: 'What is a LUT?', a: 'Look-Up Table - a file that transforms colors to achieve a specific look.' },
            { q: 'What file formats are supported?', a: 'Currently supports .CUBE files in industry standard format.' },
            { q: 'Does this affect original images?', a: 'No, all processing happens in-browser; originals remain unchanged.' }
        ]
    },
    'neumorphism_shadow_gen': {
        title: 'Neumorphism CSS Generator',
        category: 'Creative UI & Web Design',
        description: 'Generate soft UI CSS code for the trendy Neumorphic design style with custom shadows, colors, and element types.',
        keywords: ['neumorphism', 'CSS generator', 'soft UI', 'UI design', 'shadow CSS'],
        features: ['Custom colors', 'Shadow controls', 'Multiple elements', 'Copy CSS', 'Live preview'],
        useCases: ['UI design', 'Web development', 'App prototyping', 'Modern interfaces'],
        faq: [
            { q: 'What is neumorphism?', a: 'A design trend featuring soft shadows that make elements appear raised from the background.' },
            { q: 'Is the CSS browser compatible?', a: 'Yes, generates standard CSS that works in all modern browsers.' },
            { q: 'Can I customize shadow intensity?', a: 'Yes, full control over light and dark shadow parameters.' }
        ]
    },
    'color_blindness_sim': {
        title: 'Color Blindness Simulator',
        category: 'Creative UI & Web Design',
        description: 'Test your designs for accessibility by simulating different types of color blindness. Ensure your work is accessible to all users.',
        keywords: ['color blindness', 'accessibility', 'design testing', 'WCAG compliance', 'color vision'],
        features: ['Multiple deficiency types', 'Real-time preview', 'Upload images', 'Contrast checking', 'WCAG guidance'],
        useCases: ['Accessibility testing', 'Design QA', 'UI development', 'Inclusive design'],
        faq: [
            { q: 'What types are simulated?', a: 'Protanopia, Deuteranopia, Tritanopia, Achromatopsia, and more.' },
            { q: 'Why is this important?', a: 'Approximately 8% of men and 0.5% of women have color vision deficiency.' },
            { q: 'Does this guarantee accessibility?', a: 'This is one tool; always combine with other accessibility testing.' }
        ]
    },
    'css_cubic_bezier_maker': {
        title: 'CSS Cubic-Bezier Generator',
        category: 'Creative UI & Web Design',
        description: 'Create custom CSS animation timing functions visually with a curve editor and real-time preview. Perfect your animations.',
        keywords: ['CSS animation', 'cubic-bezier', 'animation timing', 'transition', 'easing'],
        features: ['Visual curve editor', 'Real-time preview', 'Preset curves', 'CSS export', 'Comparison mode'],
        useCases: ['Animation design', 'Web development', 'UI transitions', 'Motion design'],
        faq: [
            { q: 'What is cubic-bezier?', a: 'A CSS timing function that defines animation acceleration curves.' },
            { q: 'Can I copy the CSS directly?', a: 'Yes, click to copy the complete CSS code for your animation.' },
            { q: 'Are presets included?', a: 'Yes, common presets like ease-in, ease-out, and bounce are available.' }
        ]
    },
    'svg_optimizer_pro': {
        title: 'SVG Optimizer & Minifier',
        category: 'Creative UI & Web Design',
        description: 'Reduce SVG file size by removing unnecessary metadata and simplifying paths for web use. Essential for web performance.',
        keywords: ['SVG optimizer', 'SVG minifier', 'SVG compression', 'vector graphics', 'web optimization'],
        features: ['Metadata removal', 'Path optimization', 'Size reduction', 'Preview comparison', 'Batch processing'],
        useCases: ['Web performance', 'Icon optimization', 'Email graphics', 'Mobile design'],
        faq: [
            { q: 'How much can I reduce file size?', a: 'Typical reductions of 30-70% depending on original file complexity.' },
            { q: 'Does optimization affect quality?', a: 'No quality loss; only removes unnecessary data like editor metadata.' },
            { q: 'Can I preview before saving?', a: 'Yes, see before/after comparison and file size savings.' }
        ]
    },
    'webp_converter_pro': {
        title: 'WebP Image Converter',
        category: 'Creative UI & Web Design',
        description: 'Convert images to the efficient WebP format to reduce file size and improve website loading speed. Better compression than JPEG/PNG.',
        keywords: ['WebP converter', 'image compression', 'image optimizer', 'web images', 'PNG to WebP'],
        features: ['Drag and drop', 'Quality control', 'Format conversion', 'Batch support', 'Size comparison'],
        useCases: ['Website optimization', 'Performance', 'Image compression', 'SEO improvement'],
        faq: [
            { q: 'What is WebP?', a: 'A modern image format providing superior compression for web images.' },
            { q: 'How much smaller is WebP?', a: 'Typically 25-35% smaller than JPEG at equivalent quality.' },
            { q: 'Do all browsers support WebP?', a: 'Yes, all modern browsers now support WebP format.' }
        ]
    },
    'hemingway_linter_local': {
        title: 'Readability Score & Grammar Check',
        category: 'Professional Writing & Syntax',
        description: 'Improve writing clarity by identifying passive voice, adverbs, and complex sentences to lower the reading grade level.',
        keywords: ['readability', 'grammar check', 'writing improvement', 'passive voice', 'writing analysis'],
        features: ['Readability score', 'Passive voice detection', 'Adverb highlighting', 'Sentence complexity', 'Suggestions'],
        useCases: ['Content writing', 'Academic papers', 'Business communication', 'Editing'],
        faq: [
            { q: 'What readability score is best?', a: 'Aim for grade level 8 or below for general audiences.' },
            { q: 'Does it check spelling?', a: 'Focuses on readability; use spell checkers for spelling.' },
            { q: 'Is my text sent to servers?', a: 'No, all analysis happens locally in your browser.' }
        ]
    },
    'ai_face_age_scanner': {
        title: 'Face Age Detector',
        category: 'Biometric & Visual Analysis',
        description: 'Analyze facial landmarks to estimate biological age and skin health metrics using advanced AI. Get insights into your appearance-based age.',
        keywords: ['face age', 'AI age scanner', 'biological age', 'facial analysis', 'skin health'],
        features: ['Facial landmark detection', 'Age estimation', 'Skin health metrics', 'Symmetry analysis', 'Progress tracking'],
        useCases: ['Personal curiosity', 'Health tracking', 'Skincare insights', 'Aging awareness'],
        faq: [
            { q: 'How accurate is the age estimate?', a: 'Estimates are based on visual analysis; not a medical assessment.' },
            { q: 'Is my face data processed locally?', a: 'Processing happens in-browser; no face images are uploaded.' },
            { q: 'What affects the estimation?', a: 'Skin texture, facial structure, and visible aging signs.' }
        ]
    },
    'pc_psu_calc': {
        title: 'PC Power Supply Calculator',
        category: 'Gaming & Performance',
        description: 'Estimate the wattage needed for your PC build to choose the right power supply unit. Avoid underpowering or overspending.',
        keywords: ['PSU calculator', 'power supply', 'wattage calculator', 'PC build', 'power consumption'],
        features: ['Component selection', 'Wattage estimation', 'Efficiency rating', 'Recommendation', 'Comparison'],
        useCases: ['PC building', 'Upgrade planning', 'Power assessment', 'Budget planning'],
        faq: [
            { q: 'How much wattage do I need?', a: 'Add up component TDP with 20-30% headroom for safety.' },
            { q: 'Should I get a bigger PSU than needed?', a: 'Yes, 20-30% overhead ensures efficiency and future upgrades.' },
            { q: 'What is 80 Plus certification?', a: 'Efficiency rating; Bronze/Silver/Gold/Platinum indicate efficiency levels.' }
        ]
    },
    'timelapse_interval_calc': {
        title: 'Timelapse Interval Calculator',
        category: 'Professional Creator Suite',
        description: 'Calculate the perfect shooting interval and frame count for smooth timelapse videos. Essential for photographers and videographers.',
        keywords: ['timelapse calculator', 'intervalometer', 'video timelapse', 'photography', 'frame rate'],
        features: ['Duration calculation', 'Interval settings', 'Storage estimation', 'Frame counting', 'Playback preview'],
        useCases: ['Photography', 'Videography', 'Nature recording', 'Construction documentation'],
        faq: [
            { q: 'What interval should I use?', a: 'Clouds: 3-5s, Traffic: 1-2s, Stars: 20-30s, Plants: 2-5 minutes.' },
            { q: 'How long should I shoot?', a: 'Longer is better; aim for 5+ minutes of final footage.' },
            { q: 'Does it calculate storage?', a: 'Yes, estimates storage based on resolution and format.' }
        ]
    },
    'sensor_dust_visualizer': {
        title: 'Sensor Dust Checker',
        category: 'Professional Creator Suite',
        description: 'Find dust spots on your camera sensor easily with high-contrast visualization patterns. Keep your photos spotless.',
        keywords: ['sensor cleaning', 'dust spots', 'camera maintenance', 'sensor check', 'lens cleaning'],
        features: ['Multiple patterns', 'High contrast', 'Dust location', 'Severity assessment', 'Cleaning guidance'],
        useCases: ['Camera maintenance', 'Photo quality', 'Pre-shoot check', 'Cleaning verification'],
        faq: [
            { q: 'What causes dust spots?', a: 'Dust entering the camera when changing lenses or natural sensor attraction.' },
            { q: 'How do I clean sensor dust?', a: 'Use air blowers first; wet cleaning for stubborn spots.' },
            { q: 'Are patterns safe for all cameras?', a: 'Yes, uses standard photography patterns suitable for all sensors.' }
        ]
    },
    'pcb_trace_width_calc': {
        title: 'PCB Trace Width Calculator',
        category: 'Embedded Systems & Maker Tech',
        description: 'Determine the required PCB trace width to handle specific current loads without overheating. Essential for electronics design.',
        keywords: ['PCB design', 'trace width', 'current capacity', 'electronics', 'circuit design'],
        features: ['Current calculation', 'Temperature rise', 'Via sizing', 'Multiple layers', 'Standards compliance'],
        useCases: ['PCB design', 'Electronics projects', 'Circuit boards', 'Manufacturing'],
        faq: [
            { q: 'What affects trace width?', a: 'Current magnitude, copper thickness, temperature rise, and trace length.' },
            { q: 'Can I use IPC standards?', a: 'Yes, calculations follow IPC-2221 guidelines.' },
            { q: 'What about thermal vias?', a: 'Tool provides recommendations for thermal relief and via stitching.' }
        ]
    },
    'logic_gate_simulator': {
        title: 'Logic Gate Simulator',
        category: 'Embedded Systems & Maker Tech',
        description: 'Build and test digital circuits with interactive logic gates to understand boolean operations. Educational and practical.',
        keywords: ['logic gates', 'boolean logic', 'circuit simulator', 'digital electronics', 'truth table'],
        features: ['Interactive gates', 'Truth table generation', 'Waveform display', 'Circuit saving', 'Educational explanations'],
        useCases: ['Learning electronics', 'Circuit design', 'Digital logic', 'Education'],
        faq: [
            { q: 'What logic gates are available?', a: 'AND, OR, NOT, NAND, NOR, XOR, XNOR, and more.' },
            { q: 'Can I see truth tables?', a: 'Yes, auto-generate truth tables for any circuit.' },
            { q: 'Is this suitable for beginners?', a: 'Yes, designed for learning with educational explanations.' }
        ]
    },
    'truss_load_analyzer': {
        title: 'Truss Calculator',
        category: 'Engineering & Applied Physics',
        description: 'Analyze forces in 2D trusses to calculate tension and compression in structural members. Engineering education tool.',
        keywords: ['truss analysis', 'structural engineering', 'force calculation', 'civil engineering', 'mechanics'],
        features: ['Method of joints', 'Member forces', 'Support reactions', 'Visual diagram', 'Load application'],
        useCases: ['Engineering education', 'Structural analysis', 'Architecture', 'DIY projects'],
        faq: [
            { q: 'What analysis method is used?', a: 'Method of joints for calculating member forces.' },
            { q: 'Can I add custom loads?', a: 'Yes, add point loads at any joint.' },
            { q: 'Is this for real engineering?', a: 'Educational tool; consult a professional for actual construction.' }
        ]
    },
    'projectile_motion_sim': {
        title: 'Projectile Motion Calculator',
        category: 'Engineering & Applied Physics',
        description: 'Calculate and simulate the trajectory, range, and height of projectiles. Essential physics education and practical tool.',
        keywords: ['projectile motion', 'physics calculator', 'trajectory', 'launch angle', 'physics simulation'],
        features: ['Trajectory calculation', 'Range finder', 'Height analysis', 'Interactive simulation', 'Multiple scenarios'],
        useCases: ['Physics education', 'Sports analysis', 'Engineering', 'Game development'],
        faq: [
            { q: 'What variables can I input?', a: 'Initial velocity, launch angle, and gravity settings.' },
            { q: 'Does it account for air resistance?', a: 'Basic version uses ideal conditions; advanced may include drag.' },
            { q: 'What units are supported?', a: 'Metric and Imperial units with automatic conversion.' }
        ]
    },
    'box_breathing_haptic': {
        title: 'Box Breathing Guide',
        category: 'Emergency & Public Safety',
        description: 'Reduce anxiety and calm your nervous system with a guided Box Breathing tool. Military-proven stress relief technique.',
        keywords: ['box breathing', 'stress relief', 'breathing exercise', 'anxiety relief', 'relaxation'],
        features: ['Guided breathing', 'Visual timer', 'Haptic feedback', 'Progress tracking', 'Multiple patterns'],
        useCases: ['Stress management', 'Anxiety relief', 'Sleep preparation', 'Focus enhancement'],
        faq: [
            { q: 'What is box breathing?', a: 'Breathe in for 4 counts, hold for 4, out for 4, hold for 4.' },
            { q: 'How long should I practice?', a: '3-5 minutes is effective for most people.' },
            { q: 'Is haptic feedback available?', a: 'Yes, mobile devices support vibration cues.' }
        ]
    },
    'cpr_metronome_bpm': {
        title: 'CPR Metronome (110 BPM)',
        category: 'Emergency & Public Safety',
        description: 'Maintain the correct rhythm for chest compressions during CPR with a 110 BPM audio-visual guide. Save lives with proper technique.',
        keywords: ['CPR metronome', 'chest compressions', 'first aid', 'BPM', 'emergency'],
        features: ['110 BPM rhythm', 'Visual guide', 'Audio metronome', 'Depth indicator', 'Timer'],
        useCases: ['CPR training', 'Emergency response', 'First aid', 'Safety'],
        faq: [
            { q: 'What is the correct CPR rate?', a: '100-120 compressions per minute is recommended by American Heart Association.' },
            { q: 'Does this replace training?', a: 'No, this is a reminder tool; proper CPR training is essential.' },
            { q: 'Should compressions be shallow?', a: 'Adult CPR: at least 2 inches deep; allow full recoil.' }
        ]
    },
    'emotion_sentiment_cam': {
        title: 'Real-Time Emotion Detector',
        category: 'Biometric & Visual Analysis',
        description: 'Detect and visualize facial emotions in real-time to analyze reactions. Uses AI for facial expression recognition.',
        keywords: ['emotion detection', 'facial recognition', 'sentiment analysis', 'AI', 'expression'],
        features: ['Real-time detection', 'Multiple emotions', 'Confidence scores', 'Visualization', 'Session logging'],
        useCases: ['User research', 'Presentation feedback', 'Entertainment', 'AI learning'],
        faq: [
            { q: 'What emotions are detected?', a: 'Happy, sad, angry, surprised, fearful, disgusted, and neutral.' },
            { q: 'Is face data stored?', a: 'No, all processing happens locally; no face data is stored.' },
            { q: 'How accurate is it?', a: 'Modern models achieve 90%+ accuracy; varies by lighting and angle.' }
        ]
    },
    'edpi_sensitivity_calc': {
        title: 'eDPI Calculator (Valorant/CS:GO)',
        category: 'Gaming & Performance',
        description: 'Calculate your effective DPI to standardize mouse sensitivity across different FPS games. Essential for competitive gaming.',
        keywords: ['eDPI calculator', 'mouse sensitivity', 'gaming DPI', 'FPS settings', 'Valorant'],
        features: ['eDPI calculation', 'Cross-game conversion', 'Sensitivity comparison', 'Pro settings', 'Recommendation'],
        useCases: ['Competitive gaming', 'Mouse setup', 'Cross-game settings', 'Aim training'],
        faq: [
            { q: 'What is eDPI?', a: 'Effective DPI = Mouse DPI × Game Sensitivity. Allows comparing settings across games.' },
            { q: 'What eDPI should I use?', a: 'Varies by game; Valorant: 200-400 common, CS:GO: 800-1600 typical.' },
            { q: 'Does higher eDPI mean faster aiming?', a: 'Higher eDPI = faster cursor movement; find what is comfortable for you.' }
        ]
    },
    'lufs_loudness_meter': {
        title: 'LUFS Meter for Streaming',
        category: 'Audio & Creator Utilities',
        description: 'Ensure your audio meets loudness standards for Spotify, YouTube, and podcasts to avoid compression and maximize quality.',
        keywords: ['LUFS meter', 'audio loudness', 'streaming audio', 'audio mastering', 'loudness standard'],
        features: ['Real-time LUFS', 'True peak', 'Short-term/long-term', 'Standard presets', 'Visual meter'],
        useCases: ['Music production', 'Podcast editing', 'YouTube videos', 'Streaming'],
        faq: [
            { q: 'What LUFS level should I target?', a: 'Spotify: -14 LUFS, YouTube: -14 LUFS, Podcast: -16 LUFS.' },
            { q: 'What is true peak?', a: 'Peak level including inter-sample peaks; should stay under -1dBTP.' },
            { q: 'Does this replace mastering?', a: 'Use as a guide; professional mastering ensures broadcast compliance.' }
        ]
    },
    'voice_pitch_monitor': {
        title: 'Voice Pitch Analyzer',
        category: 'Audio & Creator Utilities',
        description: 'Visualize your voice pitch and frequency in real-time for singing and speech training. Essential for vocal development.',
        keywords: ['pitch analyzer', 'voice training', 'singing', 'vocal range', 'pitch detection'],
        features: ['Real-time display', 'Pitch tracking', 'Note detection', 'Range visualization', 'Recording option'],
        useCases: ['Singing practice', 'Speech therapy', 'Voice training', 'Tone deafness'],
        faq: [
            { q: 'Can I use this for singing practice?', a: 'Yes, see your pitch in real-time and compare to target notes.' },
            { q: 'What pitch detection is used?', a: 'Advanced pitch detection algorithm provides accurate Hz measurement.' },
            { q: 'Can I record sessions?', a: 'Currently supports real-time monitoring; recording varies by browser.' }
        ]
    },
    'gamepad_drift_visualizer': {
        title: 'Gamepad & Stick Drift Tester',
        category: 'Hardware & Peripheral Health',
        description: 'Test game controllers for analog stick drift and dead zones with a precision visualizer. Identify problematic controllers.',
        keywords: ['controller drift', 'gamepad test', 'stick drift', 'dead zone', 'controller calibration'],
        features: ['Drift detection', 'Dead zone mapping', 'Visual grid', 'Zone calibration', 'Report generation'],
        useCases: ['Controller testing', 'Drift diagnosis', 'Purchase testing', 'Maintenance'],
        faq: [
            { q: 'What causes stick drift?', a: 'Wear on potentiometers or contamination causing inaccurate readings at center.' },
            { q: 'Is my controller defective?', a: 'Some drift is normal; excessive drift may indicate hardware issues.' },
            { q: 'Can drift be fixed?', a: 'Software dead zones help; hardware repair may require professional service.' }
        ]
    },
    'battery_wear_calculator': {
        title: 'Battery Health Calculator',
        category: 'Hardware & Peripheral Health',
        description: 'Calculate the wear level and health percentage of your battery by comparing design capacity to current capacity.',
        keywords: ['battery health', 'capacity degradation', 'laptop battery', 'wear level', 'battery status'],
        features: ['Health percentage', 'Wear calculation', 'Design vs actual', 'Cycle count estimate', 'Recommendation'],
        useCases: ['Battery diagnostics', 'Laptop maintenance', 'Purchase decision', 'Replacement planning'],
        faq: [
            { q: 'What causes battery wear?', a: 'Chemical aging, charge cycles, heat, and deep discharging.' },
            { q: 'What is good battery health?', a: 'Above 80% is considered healthy; below 80% may need replacement.' },
            { q: 'How do I reduce wear?', a: 'Avoid extreme temperatures, partial charges, and deep discharging.' }
        ]
    },
    'online_ocr_scanner': {
        title: 'Browser-Based OCR Scanner',
        category: 'AI Strategy & Document Automation',
        description: 'Convert scanned PDFs and images into searchable text efficiently using secure, local processing without cloud uploads.',
        keywords: ['OCR scanner', 'text recognition', 'image to text', 'document scanning', 'PDF OCR'],
        features: ['Multiple languages', 'Table detection', 'Layout preservation', 'Local processing', 'Export options'],
        useCases: ['Document digitization', 'Text extraction', 'Accessibility', 'Research'],
        faq: [
            { q: 'How accurate is OCR?', a: 'Modern OCR achieves 95%+ accuracy on clean documents.' },
            { q: 'Is my document uploaded?', a: 'No, all processing happens in your browser; documents never leave your device.' },
            { q: 'What languages are supported?', a: 'Supports 100+ languages with mixed language documents.' }
        ]
    },
    'pdf_local_signer': {
        title: 'Free PDF Signer & Editor',
        category: 'AI Strategy & Document Automation',
        description: 'Sign documents and fill forms directly in your browser without uploading sensitive contracts to external servers.',
        keywords: ['PDF signature', 'PDF sign', 'document signing', 'form filler', 'secure PDF'],
        features: ['Draw signature', 'Type signature', 'Upload signature', 'Form filling', 'Local processing'],
        useCases: ['Contract signing', 'Document workflow', 'Form completion', 'Remote work'],
        faq: [
            { q: 'Is my document secure?', a: 'Yes, processing happens locally; documents never uploaded to servers.' },
            { q: 'Can I create a digital signature?', a: 'Yes, create by drawing, typing, or uploading an image.' },
            { q: 'Will signatures be legally valid?', a: 'Varies by jurisdiction; consult legal requirements for your region.' }
        ]
    },
    'statistical_dist_plot': {
        title: 'Probability Distribution Calculator',
        category: 'Data Science & Analytics',
        description: 'Plot and analyze Normal, Binomial, and Poisson probability distributions with interactive visualizations.',
        keywords: ['probability distribution', 'statistics', 'normal distribution', 'binomial', 'Poisson'],
        features: ['Multiple distributions', 'Interactive plots', 'Parameter adjustment', 'Area calculations', 'Export graphs'],
        useCases: ['Statistics education', 'Data analysis', 'Research', 'Quality control'],
        faq: [
            { q: 'What distributions are supported?', a: 'Normal, Binomial, Poisson, Exponential, and more.' },
            { q: 'Can I calculate probabilities?', a: 'Yes, find P(X<x), P(X>x), and P(a<X<b).' },
            { q: 'Can I export the charts?', a: 'Yes, download as PNG or SVG for reports and presentations.' }
        ]
    },
    'zscore_pvalue_calc': {
        title: 'P-Value & Z-Score Calculator',
        category: 'Data Science & Analytics',
        description: 'Calculate statistical significance using Z-scores and P-values for hypothesis testing. Essential for data science.',
        keywords: ['p-value', 'z-score', 'hypothesis testing', 'statistics', 'significance'],
        features: ['Z-score calculation', 'P-value computation', 'Confidence intervals', 'Two-tailed/one-tailed', 'Effect size'],
        useCases: ['Research', 'Data science', 'Academic work', 'Quality testing'],
        faq: [
            { q: 'What does p-value mean?', a: 'Probability of observing results if null hypothesis is true.' },
            { q: 'What p-value threshold should I use?', a: '0.05 is common; stricter 0.01 for medical research.' },
            { q: 'What is a z-score?', a: 'Number of standard deviations from the mean; measures relative position.' }
        ]
    },
    'data_anonymizer_local': {
        title: 'Data Anonymization Tool',
        category: 'Data Science & Analytics',
        description: 'Automatically scrub sensitive PII like names and emails from datasets for privacy compliance. GDPR and HIPAA aware.',
        keywords: ['data anonymization', 'PII removal', 'privacy', 'GDPR', 'data masking'],
        features: ['PII detection', 'Email masking', 'Name redaction', 'Batch processing', 'Format preservation'],
        useCases: ['Data sharing', 'GDPR compliance', 'Research data', 'Privacy protection'],
        faq: [
            { q: 'What PII is detected?', a: 'Names, emails, phone numbers, SSN, addresses, and more.' },
            { q: 'Does it preserve data format?', a: 'Yes, masking preserves format for testing purposes.' },
            { q: 'Is this HIPAA compliant?', a: 'Helps with de-identification; consult compliance experts for medical data.' }
        ]
    },
    'pdf_redactor_canvas': {
        title: 'Secure PDF Redactor',
        category: 'Data Science & Analytics',
        description: 'Permanently redact sensitive information from PDFs by flattening them into images. Ensures redaction cannot be reversed.',
        keywords: ['PDF redaction', 'secure redact', 'document security', 'privacy', 'PDF editing'],
        features: ['Permanent redaction', 'Area selection', 'Blackout tool', 'Format conversion', 'Batch support'],
        useCases: ['Legal documents', 'Privacy protection', 'Document sharing', 'Compliance'],
        faq: [
            { q: 'Is redaction permanent?', a: 'Yes, redacted areas are flattened into image; cannot be recovered.' },
            { q: 'Does this work on scanned PDFs?', a: 'Yes, converts pages to images for complete redaction.' },
            { q: 'What about metadata?', a: 'Option to strip metadata for complete document privacy.' }
        ]
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
        description: `Free online ${toTitleCase(toolName)} tool. No download required, works in your browser. Advanced features for professionals and enthusiasts.`,
        keywords: [toTitleCase(toolName).toLowerCase(), 'online tool', 'free tool', 'browser-based', 'no download'],
        features: ['100% Free', 'Privacy-First', 'No Installation', 'Accurate Results', 'Mobile Friendly'],
        useCases: ['Various applications', 'Professional use', 'Education', 'Personal projects'],
        faq: [
            { q: 'Is this tool free to use?', a: 'Yes, completely free with no hidden costs or premium features.' },
            { q: 'Is my data private?', a: 'All processing happens locally in your browser; no data is sent to servers.' },
            { q: 'Do I need to install anything?', a: 'No, works directly in your browser on any device.' }
        ]
    };
}

function getFAQSection(meta) {
    if (!meta.faq || meta.faq.length === 0) {
        return `
            <h3>Frequently Asked Questions</h3>
            
            <h3>Is ${meta.title} free to use?</h3>
            <p>
                Yes, ${meta.title} is completely free to use. There are no hidden fees, premium tiers, or 
                limitations on how many times you can use the tool. Our mission is to provide professional-grade 
                utilities accessible to everyone.
            </p>
            
            <h3>Is my data private?</h3>
            <p>
                Absolutely. ${meta.title} processes all data locally in your browser. No information is sent 
                to external servers, ensuring complete privacy and security. Your sensitive information never 
                leaves your device.
            </p>
            
            <h3>Do I need to install anything?</h3>
            <p>
                No, ${meta.title} runs entirely in your web browser. Simply open the tool and start using it 
                immediately. Works on Chrome, Firefox, Safari, Edge, and all modern browsers.
            </p>
            
            <h3>How accurate are the results?</h3>
            <p>
                The tool uses scientifically validated methods and precise algorithms to provide accurate results. 
                However, for medical or professional purposes, please consult with a qualified professional.
            </p>
            
            <h3>Can I use this on mobile devices?</h3>
            <p>
                Yes, ${meta.title} is fully responsive and works on smartphones, tablets, and desktop computers. 
                Some features may be optimized for specific devices.
            </p>`;
    }
    
    return `
        <h2>Frequently Asked Questions</h2>
        ${meta.faq.map(item => `
            <h3>${item.q}</h3>
            <p>${item.a}</p>
        `).join('\n')}
        
        <h3>Still have questions?</h3>
        <p>
            If you have any other questions about ${meta.title}, please don't hesitate to contact us. 
            We're always here to help you get the most out of our tools.
        </p>`;
}

function generateGuideContent(toolName) {
    const meta = getToolMeta(toolName);
    const toolUrl = `https://toolkitgen.com/tool/${toolName}`;
    const guideUrl = `https://toolkitgen.com/guide/${toolName}`;
    
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${meta.title}: Complete Guide, Tutorial & Best Practices | Toolkit Gen</title>
    <meta name="description" content="${meta.description} Learn how to use ${meta.title} effectively with our comprehensive guide. Features, tips, and expert recommendations." />
    <meta name="keywords" content="${meta.keywords.join(', ')}, guide, tutorial, how to use, online tool" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
    <meta name="author" content="Toolkit Gen">
    <link rel="canonical" href="${guideUrl}" />
    
    <meta property="og:type" content="article">
    <meta property="og:title" content="${meta.title}: Complete Guide | Toolkit Gen">
    <meta property="og:description" content="${meta.description}">
    <meta property="og:url" content="${guideUrl}">
    <meta property="og:site_name" content="Toolkit Gen">
    <meta property="article:published_time" content="2025-01-01">
    <meta property="article:modified_time" content="2026-04-11">
    <meta property="article:section" content="${meta.category}">
    <meta property="article:tag" content="${meta.keywords.slice(0, 3).join(', ')}">
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${meta.title}: Complete Guide">
    <meta name="twitter:description" content="${meta.description}">
    
    
    <link rel="stylesheet" href="/style.css">
    <script src="/tailwind.js"></script>
    
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "${meta.title}: The Complete Guide",
        "description": "${meta.description}",
        "category": "${meta.category}",
        "author": {
            "@type": "Organization",
            "name": "Toolkit Gen",
            "url": "https://toolkitgen.com"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Toolkit Gen",
            "logo": {
                "@type": "ImageObject",
                "url": "https://toolkitgen.com/assets/favicon/android-chrome-192x192.png"
            }
        },
        "about": {
            "@type": "SoftwareApplication",
            "name": "${meta.title}",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web Browser"
        },
        "mentions": {
            "@type": "SoftwareApplication",
            "name": "${meta.title}",
            "url": "${toolUrl}"
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
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 1.5rem 0;
        }
        
        .feature-item {
            background: #f8fafc;
            padding: 1rem;
            border-radius: 0.5rem;
            border: 1px solid #e2e8f0;
        }
        
        .feature-item strong {
            color: var(--color-site-primary);
        }
        
        .use-case-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 0.75rem;
            margin: 1rem 0;
        }
        
        .use-case-item {
            background: linear-gradient(135deg, #fff7ed, #fff);
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            border-left: 3px solid var(--color-site-primary);
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
                <li><a href="/guide" class="hover:text-[#EE6C4D]">Guide</a></li>
                <li>/</li>
                <li class="text-slate-800 font-semibold" aria-current="page">${meta.title}</li>
            </ol>
        </nav>
        
        <article class="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-200">
            <header class="mb-12">
                <span class="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    ${meta.category}
                </span>
                <h1>${meta.title}: The Complete Guide & Tutorial</h1>
                <p class="text-xl text-slate-600 leading-relaxed mt-4">
                    ${meta.description}
                </p>
            </header>
            
            <h2>What is ${meta.title}?</h2>
            <p>
                ${meta.title} is a free, professional-grade online tool provided by Toolkit Gen that helps you 
                accomplish important tasks with precision and efficiency. Built with modern web technologies, 
                it runs entirely in your browser with no downloads, installations, or account requirements. 
                Whether you're a professional, student, or enthusiast, this tool provides the functionality 
                you need without compromising your privacy.
            </p>
            <p>
                In today's digital landscape, having access to reliable, fast, and secure tools is essential. 
                ${meta.title} delivers on all fronts: it's accessible from any device with an internet connection, 
                processes data locally for maximum privacy, and provides accurate results based on proven methodologies. 
                This comprehensive guide will walk you through everything you need to know to master this tool 
                and integrate it into your workflow effectively.
            </p>
            
            <h2>Key Features & Capabilities</h2>
            <p>
                ${meta.title} comes packed with features designed to meet the needs of both casual users and professionals. 
                Here's what makes this tool stand out:
            </p>
            
            <div class="feature-grid">
                ${meta.features.map(feature => `
                    <div class="feature-item">
                        <strong>${feature}</strong>
                    </div>
                `).join('\n')}
            </div>
            
            <h2>How to Use ${meta.title}</h2>
            <p>
                Getting started with ${meta.title} is straightforward. Follow this comprehensive step-by-step guide 
                to get the most out of this powerful tool:
            </p>
            
            <h3>Step 1: Access the Tool</h3>
            <p>
                Navigate to the <a href="${toolUrl}">${meta.title} tool</a> by clicking the link or searching 
                for it in the Toolkit Gen directory. The tool loads instantly in your browser—no installation 
                or sign-up required. For optimal performance, use a modern browser like Chrome, Firefox, Safari, 
                or Edge.
            </p>
            
            <h3>Step 2: Configure Your Settings</h3>
            <p>
                Depending on your specific needs, you may want to adjust the tool's settings before proceeding. 
                Common settings include input parameters, output format preferences, and display options. Take a 
                moment to explore the available options to customize the tool for your use case.
            </p>
            
            <h3>Step 3: Input Your Data</h3>
            <p>
                Enter your data or parameters into the input fields. The tool accepts various input formats and 
                provides clear instructions for each field. If you're unsure about any parameter, hover over the 
                help icon or refer to the tooltips for guidance.
            </p>
            
            <h3>Step 4: Process and Analyze</h3>
            <p>
                Click the action button to process your input. The tool performs all calculations and processing 
                locally in your browser, ensuring your data never leaves your device. Results are displayed 
                instantly with detailed breakdowns and visualizations where applicable.
            </p>
            
            <h3>Step 5: Export or Share Results</h3>
            <p>
                Once you have your results, you can export them in various formats (CSV, JSON, PDF, etc.) or 
                copy them directly to your clipboard. Some tools also support sharing functionality for 
                collaboration purposes.
            </p>
            
            <h2>Practical Use Cases</h2>
            <p>
                ${meta.title} serves a wide range of purposes across different industries and applications. 
                Here are some common use cases where this tool excels:
            </p>
            
            <div class="use-case-list">
                ${meta.useCases.map(useCase => `
                    <div class="use-case-item">${useCase}</div>
                `).join('\n')}
            </div>
            
            <h2>Tips for Best Results</h2>
            <div class="info-box">
                <p><strong>Pro Tips for Maximum Efficiency:</strong></p>
                <ul style="margin-top: 0.5rem; margin-bottom: 0;">
                    <li>For the most accurate results, ensure you are in optimal conditions (good lighting, stable connection, etc.)</li>
                    <li>Double-check your input values before processing to avoid errors</li>
                    <li>Use keyboard shortcuts when available for faster workflow</li>
                    <li>Bookmark the tool for quick access during future sessions</li>
                    <li>Explore advanced options to unlock additional functionality</li>
                </ul>
            </div>
            
            <h2>Why Choose Online Tools Like ${meta.title}?</h2>
            <p>
                Online tools offer numerous advantages over traditional desktop software:
            </p>
            <ul>
                <li><strong>Accessibility:</strong> Access from any device with an internet connection—desktop, laptop, tablet, or smartphone</li>
                <li><strong>No Installation:</strong> Works immediately without downloads, installations, or updates</li>
                <li><strong>Cross-Platform:</strong> Works on Windows, Mac, Linux, iOS, and Android without compatibility issues</li>
                <li><strong>Privacy-First:</strong> All data processing happens locally in your browser; nothing is sent to external servers</li>
                <li><strong>Always Updated:</strong> Always running the latest version without manual updates</li>
                <li><strong>Cost-Effective:</strong> Professional-grade functionality without expensive software licenses</li>
                <li><strong>Collaborative:</strong> Easily share results and collaborate with others</li>
            </ul>
            
            <h2>Technical Details & Specifications</h2>
            <p>
                ${meta.title} is built using modern web technologies including HTML5, CSS3, JavaScript, and advanced 
                browser APIs. The tool leverages client-side processing to ensure:
            </p>
            <ul>
                <li>Lightning-fast performance without server round-trips</li>
                <li>Complete data privacy and security</li>
                <li>Offline functionality where supported by your browser</li>
                <li>Responsive design that adapts to any screen size</li>
                <li>Accessibility compliance with WCAG guidelines</li>
            </ul>
            
            <h2>Comparison with Alternatives</h2>
            <p>
                When evaluating ${meta.title} against other solutions, consider these key differentiators:
            </p>
            <ul>
                <li><strong>Privacy:</strong> Unlike cloud-based alternatives, your data never leaves your device</li>
                <li><strong>Cost:</strong> Completely free with no premium tiers or hidden fees</li>
                <li><strong>Convenience:</strong> No account creation or login required</li>
                <li><strong>Reliability:</strong> Works offline and isn't affected by server downtime</li>
                <li><strong>Updates:</strong> Continuous improvements without disrupting your workflow</li>
            </ul>
            
            ${getFAQSection(meta)}
            
            <div class="disclaimer">
                <strong>Disclaimer:</strong> This tool is provided for educational and informational purposes. 
                Results should not be used as the sole basis for medical, legal, financial, or professional 
                decisions. Always consult with qualified professionals for expert advice specific to your situation.
            </div>
            
            <div class="cta-box">
                <h3 style="border: none; padding: 0; margin: 0 0 1rem 0;">Ready to Get Started?</h3>
                <p class="text-slate-600 !mb-0">
                    Try ${meta.title} now and discover what this powerful tool can do for you. 
                    It's free, fast, and your data stays private.
                </p>
                <a href="${toolUrl}" class="cta-button">
                    Launch ${meta.title}
                </a>
            </div>
            
            <h2>Related Tools & Resources</h2>
            <p>
                Explore more free online tools from Toolkit Gen that complement ${meta.title}:
            </p>
            <ul>
                <li><a href="/tool/ai_face_age_scanner">AI Face Age Scanner</a> - Analyze facial metrics with advanced AI</li>
                <li><a href="/tool/reaction_time_benchmark">Reaction Time Benchmark</a> - Test and improve your reflexes</li>
                <li><a href="/tool/hearing_age_test">Hearing Age Test</a> - Check your hearing health</li>
                <li><a href="/tool/tdee_macro_calculator">TDEE & Macro Calculator</a> - Calculate nutrition for your goals</li>
                <li><a href="/tool/fire_retirement_heatmap">FIRE Retirement Calculator</a> - Plan your financial future</li>
            </ul>
            
            <h2>About Toolkit Gen</h2>
            <p>
                ${meta.title} is part of the Toolkit Gen collection—a comprehensive directory of free, privacy-focused 
                online tools for developers, professionals, students, and enthusiasts. Our mission is to provide 
                professional-grade utilities that respect your privacy and work without requiring accounts, 
                subscriptions, or installations.
            </p>
            <p>
                Visit <a href="https://toolkitgen.com">Toolkit Gen</a> to explore 180+ additional tools across categories 
                including Health & Diagnostics, Finance & Investment, Developer Utilities, Creative Tools, and more.
            </p>
        </article>
    </main>
    
    <footer id="app-footer"></footer>
    
    <script type="module">
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

console.log("Found " + tools.length + " tools");

tools.forEach((toolName, index) => {
    const guideFileName = toolName + ".html";
    const guidePath = path.join(guideDir, guideFileName);
    const content = generateGuideContent(toolName);
    
    fs.writeFileSync(guidePath, content);
    console.log("[" + (index + 1) + "/" + tools.length + "] Created guide: " + guideFileName);
});

console.log("\nDone! Created " + tools.length + " guide pages in " + guideDir);

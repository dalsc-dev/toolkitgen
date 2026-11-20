import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const toolsDir = path.join(rootDir, 'src', 'content', 'tools');

const UPGRADES = {
  // 1. wifi_dead_zone_logger
  wifi_dead_zone_logger: {
    name: "Manual AR Wi-Fi Heatmap Planner & Signal Drop Estimator",
    title: "Wi-Fi Heatmap Planner & Signal Drop Estimator | Toolkit Gen",
    description: "Map domestic Wi-Fi coverage by plotting estimated signal drop across floor plans. Modern web browsers cannot read raw Wi-Fi RSSI or BSSID directly due to OS isolation.",
    quickAnswer: "Calculate domestic Wi-Fi signal attenuation and chart dead zones through visual distance estimation and browser downlink telemetry. Web browsers cannot access raw Wi-Fi chipsets or RSSI dBm values directly due to operating system security isolation.",
    howTo: [
      { name: "Camera and Distance Setup", text: "Launch the visual planner and grant camera access to project markers into your physical workspace." },
      { name: "Map Signal Attenuation", text: "Walk toward rooms experiencing signal drops while logging estimated downlinks and physical obstructions like drywall, concrete, or metal." },
      { name: "Evaluate Attenuation Table", text: "Cross-reference signal drops with the material attenuation table to identify physical barriers absorbing 2.4GHz and 5GHz frequencies." },
      { name: "Export Layout Findings", text: "Export your obstruction list and layout observations to reposition your router or configure a dedicated mesh backhaul node." }
    ],
    faq: [
      { q: "Can web browsers measure exact Wi-Fi signal strength in dBm?", a: "No. The W3C and major browser vendors intentionally do not expose raw Wi-Fi RSSI (received signal strength indicator) or BSSID (access point MAC address) to web applications to prevent geographic location fingerprinting. Browsers only expose estimated connection downlink metrics via navigator.connection." },
      { q: "Why does 5 GHz Wi-Fi drop through walls faster than 2.4 GHz?", a: "According to electromagnetic propagation physics, higher frequencies attenuate faster when penetrating solid matter. While 5 GHz provides wider channel widths and higher throughput, solid materials like concrete, brick, and tile absorb 5 GHz waves at nearly double the decibel loss of 2.4 GHz waves." },
      { q: "How does domestic material attenuation cause dead zones?", a: "Drywall and interior wood doors typically cause 2 to 5 dB of signal loss. In contrast, masonry, brick, reinforced concrete, and metal-backed mirrors cause 15 to 30 dB of loss, which can attenuate over 95% of radio frequency energy, producing an immediate dead zone behind the barrier." },
      { q: "What is the difference between an extender and a mesh Wi-Fi system?", a: "A basic Wi-Fi extender repeats incoming wireless packets on the same frequency band, immediately cutting available throughput by 50% due to half-duplex communication. A mesh system uses dedicated wireless or Ethernet backhaul channels, enabling seamless roaming and full bandwidth across nodes." }
    ]
  },

  // 2. magnetometer_metal_find
  magnetometer_metal_find: {
    name: "Magnetic Compass Anomaly & Stud Locator",
    title: "Magnetic Compass Anomaly & Stud Locator | Toolkit Gen",
    description: "Locate ferromagnetic wall studs and magnetic anomalies using device compass sensors. Identifies field disturbances on mobile devices with magnetometer sensors.",
    quickAnswer: "Detect magnetic field disturbances and locate ferromagnetic wall studs using device compass orientation sensors. Mobile browsers read heading flux anomalies to identify structural nails, screws, and conduits behind drywall without requiring native app installations.",
    howTo: [
      { name: "Calibrate Compass Sensor", text: "Hold your smartphone flat and move it in a figure-eight pattern for 5 seconds to calibrate internal orientation and magnetometer sensors." },
      { name: "Establish Ambient Baseline", text: "Hold the phone in open air away from metal objects to establish the baseline ambient magnetic heading and flux reading." },
      { name: "Slowly Sweep Wall Surface", text: "Glide the back of the smartphone smoothly across the drywall surface. Watch for sudden spikes in the magnetic flux deviation needle." },
      { name: "Mark Stud Centers", text: "Ferromagnetic drywall screws and structural steel studs cause localized magnetic disturbances. Mark the peak deflection point on the wall." }
    ],
    faq: [
      { q: "Can a smartphone actually detect studs in a drywall?", a: "Yes, provided the smartphone has an internal magnetometer sensor and the wall contains ferromagnetic metals (such as steel studs or steel drywall screws driven into wooden studs). The phone detects localized distortions in the Earth's ambient magnetic field." },
      { q: "Does this web tool measure absolute magnetic microteslas (µT)?", a: "Standard mobile web browsers provide access to DeviceOrientation and DeviceMotion events, which reflect compass orientation and heading delta. Direct absolute microtesla (µT) access via the Generic Sensor API requires experimental browser flags and HTTPS on Android." },
      { q: "Why is figure-eight calibration necessary before scanning?", a: "Smartphone compass sensors suffer from soft-iron and hard-iron bias caused by internal phone components, battery currents, and speaker magnets. The figure-eight motion allows the sensor fusion firmware to subtract local magnetic bias." },
      { q: "Can this tool find non-ferrous metals like copper pipes or PVC?", a: "No. Magnetic field sensors only interact with ferromagnetic materials (iron, steel, nickel, cobalt). Non-ferrous materials such as copper plumbing, aluminum conduits, and plastic PVC pipes do not distort magnetic fields and require specialized dielectric wall scanners." }
    ]
  },

  // 3. usb_c_pd_negotiator_sniffer
  usb_c_pd_negotiator_sniffer: {
    name: "USB-C Power Delivery Sniffer & Protocol Simulator",
    title: "USB-C Power Delivery Sniffer & Protocol Simulator | Toolkit Gen",
    description: "Inspect USB-C Power Delivery contracts, VBUS voltages, and packet logs in your browser using Web Serial analyzer hardware or an interactive protocol simulator.",
    quickAnswer: "Inspect USB-C Power Delivery contracts, power data objects (PDOs), and VBUS negotiation packets directly in your browser. Connect compatible Web Serial hardware analyzers or test power profiles interactively in simulated protocol mode.",
    howTo: [
      { name: "Choose Mode", text: "Select Live Web Serial Hardware mode if you have a serial protocol analyzer, or choose Interactive Protocol Simulator mode to test power profiles." },
      { name: "Connect Serial Analyzer", text: "In hardware mode, click Connect Serial Device and select your USB-C analyzer COM port at 115200 baud." },
      { name: "Audit Power Data Objects (PDOs)", text: "Inspect Source Capabilities advertisements, Fixed Supply voltages (5V, 9V, 15V, 20V), and PPS (Programmable Power Supply) step increments." },
      { name: "Inspect Contract Logs", text: "Verify Request packets, Accept acknowledgments, and PS_RDY transitions to ensure compliant power negotiation." }
    ],
    faq: [
      { q: "Can a browser sniff USB-C Power Delivery packets without extra hardware?", a: "No. Standard computer USB controller chips do not expose raw CC-pin (Configuration Channel) BMC packets to the host operating system. To capture live PD packets, you need an external hardware analyzer (such as a Power-Z or open-source serial sniffer) connected via Web Serial." },
      { q: "What is an EPR (Extended Power Range) USB-C contract?", a: "USB PD 3.1 Extended Power Range (EPR) increases maximum USB-C power delivery from 100W (20V at 5A) up to 240W (48V at 5A). EPR requires electronically marked 240W cables and specific EPR handshake negotiation." },
      { q: "How do USB-C E-marker chips report cable wattage ratings?", a: "Electronically marked cables contain a small SOP' responder microchip powered by VCONN on the CC2 line. During initial discovery, the host queries the cable with a Discover Identity command, and the cable replies with maximum supported voltage and current (3A vs 5A)." },
      { q: "Which browsers support the Web Serial API?", a: "The Web Serial API is supported in Chromium-based desktop browsers (Google Chrome, Microsoft Edge, Opera) on Windows, macOS, Linux, and ChromeOS. It is not supported in Mozilla Firefox, Apple Safari, or mobile browsers." }
    ]
  },

  // 4. pwm_flicker_eye_health_scanner
  pwm_flicker_eye_health_scanner: {
    name: "Screen Flicker & Rolling Shutter Banding Detector",
    title: "Screen Flicker & Rolling Shutter Banding Detector | Toolkit Gen",
    description: "Detect visible OLED and LCD screen flicker and pulse-width modulation (PWM) using camera rolling shutter banding. Visual screening tool, not a photodiode meter.",
    quickAnswer: "Identify pulse-width modulation (PWM) display flicker by observing rolling shutter dark interference bands through your camera. Provides a rapid visual presence test to detect screen flicker without needing dedicated laboratory photodiode equipment.",
    howTo: [
      { name: "Prepare Display Screen", text: "Open a solid white image or blank document on the screen you wish to inspect and lower display brightness to 25% to 50%." },
      { name: "Align Smartphone Camera", text: "Point your smartphone camera at the target screen at a distance of 4 to 8 inches (10 to 20 cm) and focus carefully." },
      { name: "Observe Rolling Shutter Banding", text: "Look for traveling horizontal black and gray bars across the camera viewfinder. Thick, visible bands indicate active pulse-width modulation." },
      { name: "Compare at 100% Brightness", text: "Increase screen brightness to 100%. If the dark bands disappear or become uniform, the display uses PWM duty-cycle dimming at lower brightness levels." }
    ],
    faq: [
      { q: "How does camera rolling shutter detect display flicker?", a: "CMOS camera sensors read pixel rows sequentially from top to bottom (rolling shutter). When a display uses PWM to dim its backlight by flashing rapidly on and off, the sensor captures illuminated rows when the backlight is ON and dark bands when the backlight is OFF." },
      { q: "Can a smartphone camera measure exact PWM flicker frequency in kHz?", a: "No. Smartphone camera rolling shutter frame rates and exposure times are typically limited to between 1/30s and 1/8000s, which can visually reveal flicker up to approximately 480Hz. Precise measurement of high-frequency (e.g. 1920Hz to 3840Hz) flicker requires an optical photodiode connected to an oscilloscope." },
      { q: "Why does low-frequency PWM cause headaches and eye strain?", a: "Even when screen flicker is too fast to be consciously perceived, the human retina and pupillary sphincter muscles continuously respond to rapid light pulses. This causes micro-contractions in eye muscles, resulting in asthenopia (eye strain), migraines, and visual fatigue." },
      { q: "What display technologies eliminate PWM flicker?", a: "Displays with DC dimming (analog voltage regulation) or flicker-free LED backlights adjust LED current amplitude rather than pulsing power. High-frequency PWM displays (over 2160Hz) are also significantly more comfortable than low-frequency 240Hz PWM panels." }
    ]
  },

  // 5. nfc_data_ghost_eraser
  nfc_data_ghost_eraser: {
    name: "NDEF Tag Content Overwriter & Sanitizer",
    title: "NDEF Tag Content Overwriter & Sanitizer | Toolkit Gen",
    description: "Sanitize and overwrite readable NDEF records on NFC tags using Web NFC in Chrome on Android. Overwrites user records; cannot format locked hardware sectors.",
    quickAnswer: "Sanitize NFC tags by overwriting active NDEF payload records with blank zero-byte data using the Web NFC API. Supported in Chrome on Android over HTTPS; cannot format write-locked tags or overwrite proprietary manufacturer memory sectors.",
    howTo: [
      { name: "Verify Android Chrome Compatibility", text: "Ensure you are using Google Chrome or Microsoft Edge on an Android device with NFC enabled in system settings." },
      { name: "Initialize Tag Scanner", text: "Tap 'Scan & Sanitize Tag' and grant the browser permission to access near-field communication hardware." },
      { name: "Hold Tag Against NFC Coil", text: "Hold the NFC tag firmly against the upper rear portion of your Android phone until a haptic vibration confirms detection." },
      { name: "Verify Overwrite Confirmation", text: "The tool writes an empty NDEF payload to overwrite previous URL, text, or credential records stored on the tag." }
    ],
    faq: [
      { q: "Does Web NFC work on iPhone or desktop browsers?", a: "No. The W3C Web NFC specification is implemented exclusively in Chromium-based browsers on Android (Chrome 89+). Apple iOS restricts NFC tag access to native iOS apps via CoreNFC, and desktop operating systems lack standardized consumer NFC reader integrations." },
      { q: "Can this tool erase hardware write-locked NFC tags?", a: "No. Standard NFC chips (such as NXP NTAG213, NTAG215, NTAG216) feature physical one-time-programmable (OTP) lock bytes. Once those lock bits are set, the chip's internal logic permanently prevents further writes at the silicon level." },
      { q: "What is the difference between NDEF records and raw tag memory?", a: "NDEF (NFC Data Exchange Format) is a standardized data container specification for URLs, vCards, and plain text readable by all smartphones. Raw memory includes manufacturer configuration blocks, password protection bytes, and proprietary memory pages." },
      { q: "Can I use this tool to reset Nintendo Amiibo tags?", a: "No. Amiibo figures and NTAG215 clones have encrypted key sectors and permanent lock bits written during manufacture. While you can overwrite unlocked NDEF records on standard NFC stickers, proprietary locked amiibo data cannot be cleared." }
    ]
  },

  // 6. hrtf_spatial_audio_profiler
  hrtf_spatial_audio_profiler: {
    name: "Spatial Audio HRTF Simulator & Virtual Surround Calibrator",
    title: "Spatial Audio HRTF Simulator & Virtual Surround Calibrator | Toolkit Gen",
    description: "Simulate 3D spatial audio positioning and binaural room impulse responses using head-related transfer function models in the Web Audio API.",
    quickAnswer: "Simulate 3D spatial audio cues and headphone surround localization using head-related transfer function (HRTF) algorithms in the Web Audio API. Provides algorithmic sound positioning to test stereo imaging and pinna filtering effects.",
    howTo: [
      { name: "Wear Stereo Headphones", text: "Put on standard over-ear or in-ear stereo headphones. Disable any external virtual surround sound DSP processing in your OS." },
      { name: "Calibrate Head Dimensions", text: "Adjust the estimated interaural time difference (ITD) slider to match your head circumference and ear spacing." },
      { name: "Position Virtual Sound Source", text: "Drag the 3D sound node across azimuth (horizontal angle), elevation (vertical angle), and distance coordinates." },
      { name: "Evaluate Binaural Localization", text: "Listen to the simulated frequency coloration and interaural time delays to test your acoustic soundstage localization." }
    ],
    faq: [
      { q: "How does HRTF simulate 3D audio in ordinary stereo headphones?", a: "Head-Related Transfer Functions (HRTF) model the precise acoustic filtering that occurs as sound waves bounce off your shoulders, head, and ear pinna folds before entering the ear canal. By applying these frequency-dependent filters and microsecond time delays, stereo headphones can convincingly place sounds in 3D space." },
      { q: "Can a browser camera scan real ear pinna geometry accurately?", a: "No. High-accuracy custom HRTF generation requires multi-camera photogrammetry or laser scanning to build an exact 3D mesh of the outer ear, followed by boundary element method (BEM) acoustic simulations. Browser tools use parametric approximations based on head radius." },
      { q: "What is the difference between generic HRTF and personalized SOFA files?", a: "Generic HRTF profiles (like the KEMAR acoustic dummy head standardized in the W3C Web Audio PannerNode) use average human measurements. Personalized SOFA (Spatially Oriented Format for Acoustics) files contain measured impulse responses tailored to an individual's unique ear anatomy." },
      { q: "Why do some spatial audio profiles sound muffled or unnatural?", a: "If the simulated HRTF filter curves mismatch your personal pinna geometry, your brain interprets the unexpected notch filters as muffled sound rather than elevated or behind-the-head acoustic cues." }
    ]
  },

  // 7. spatial_audio_seal_tester
  spatial_audio_seal_tester: {
    name: "Acoustic Earbud Seal & Sub-Bass Isolation Test",
    title: "Acoustic Earbud Seal & Sub-Bass Isolation Test | Toolkit Gen",
    description: "Evaluate in-ear monitor (IEM) acoustic fit and sub-bass seal integrity using psychoacoustic 20Hz-60Hz audio sweeps and stereo phase cancellation tones.",
    quickAnswer: "Test the acoustic seal and sub-bass isolation of in-ear monitors (IEMs) using calibrated 20Hz-60Hz audio sweeps and phase cancellation. Weak sub-bass or phase imbalance indicates an inadequate ear tip seal that compromises frequency response.",
    howTo: [
      { name: "Insert In-Ear Monitors", text: "Fit your earbuds with your preferred ear tips (silicone or memory foam) and insert them firmly into your ear canals." },
      { name: "Set Moderate Volume", text: "Adjust system audio to a comfortable, moderate listening volume. Never test sub-bass tones at maximum volume." },
      { name: "Play 30Hz-50Hz Sub-Bass Tone", text: "Activate the sub-bass test tone. A proper acoustic seal produces a deep, visceral rumble inside both ears. If the tone sounds tinny or faint, the seal is broken." },
      { name: "Test Stereo Phase Cancellation", text: "Switch to out-of-phase mode. An airtight bilateral seal will make the audio sensation feel completely hollow and centered inside your head." }
    ],
    faq: [
      { q: "Why is an airtight earbud seal essential for sub-bass response?", a: "In-ear monitor drivers operate inside a tiny, sealed acoustic chamber formed between the ear tip and the eardrum. If there is even a microscopic air leak, low-frequency air pressure escapes, causing sub-bass frequencies below 100Hz to attenuate by up to 20 to 30 dB." },
      { q: "How does a psychoacoustic phase cancellation test detect acoustic leaks?", a: "By playing identical low-frequency tones with inverted phase (180 degrees out of phase) between the left and right channels, an acoustic leak in one ear disrupts phase balance, causing sound to perceptually localize toward the unsealed ear." },
      { q: "What are the telltale symptoms of an inadequate earbud seal?", a: "Symptoms include thin, tinny audio reproduction, lack of bass impact below 80Hz, excessive penetration of ambient background noise, and earbuds slipping out during jaw movement." },
      { q: "How do silicone ear tips compare with memory foam tips for acoustic sealing?", a: "Medical-grade silicone tips provide long-term durability and easy cleaning, but require a precise canal diameter match. Memory foam tips expand to fill irregular ear canal contours, providing superior sub-bass isolation at the cost of slight high-frequency dampening." }
    ]
  },

  // 8. web_bluetooth_scan
  web_bluetooth_scan: {
    name: "Bluetooth LE Device Scanner & GATT Explorer",
    title: "Bluetooth LE Device Scanner & GATT Explorer | Toolkit Gen",
    description: "Discover nearby Bluetooth Low Energy peripherals and explore available GATT services and characteristics using Web Bluetooth in supported Chromium browsers.",
    quickAnswer: "Scan for nearby Bluetooth Low Energy (BLE) peripherals and inspect GATT services and characteristics in real time. Runs via the Web Bluetooth API in Chrome and Edge on desktop and Android with user-granted Bluetooth permissions.",
    howTo: [
      { name: "Verify Browser Support", text: "Open this tool in Google Chrome, Microsoft Edge, or Opera on Windows, macOS, Linux, ChromeOS, or Android." },
      { name: "Request Bluetooth Device", text: "Click 'Scan for BLE Devices' to prompt the browser security dialog. Select the peripheral you wish to pair with." },
      { name: "Connect to GATT Server", text: "Establish an authenticated GATT connection to inspect generic access, battery service, device information, and custom UUIDs." },
      { name: "Read and Subscribe Characteristics", text: "Read readable characteristic values or subscribe to notifications to observe live incoming telemetry data." }
    ],
    faq: [
      { q: "Which web browsers support the Web Bluetooth API?", a: "The Web Bluetooth API is supported in Google Chrome, Microsoft Edge, and Chromium-based browsers on macOS, Windows 10/11, Linux, ChromeOS, and Android. It is not supported in Mozilla Firefox, Apple Safari on iOS or macOS, or Chromium iOS." },
      { q: "Can a website scan for Bluetooth devices silently in the background?", a: "No. The W3C Web Bluetooth specification strictly mandates user-initiated interaction. A browser permission picker always appears, requiring the user to explicitly select and authorize the specific device before any communication can occur." },
      { q: "What are GATT services and characteristics?", a: "GATT (Generic Attribute Profile) organizes Bluetooth LE data into Services (logical groupings identified by 16-bit or 128-bit UUIDs, e.g. Battery Service 0x180F) and Characteristics (specific data points with read, write, or notify permissions)." },
      { q: "Why doesn't Web Bluetooth work on Apple Safari or iOS?", a: "Apple has declined to implement Web Bluetooth in Safari due to security and privacy concerns regarding device fingerprinting and potential hardware exploitation from malicious websites." }
    ]
  },

  // 9. ble_rssi_meter
  ble_rssi_meter: {
    name: "Bluetooth RSSI Signal Strength & Beacon Tracker",
    title: "Bluetooth RSSI Signal Strength & Beacon Tracker | Toolkit Gen",
    description: "Track relative signal strength (RSSI) from advertising Bluetooth LE beacons in supported Chromium browsers to estimate proximity and locate nearby devices.",
    quickAnswer: "Monitor live Bluetooth Low Energy advertisement RSSI values to approximate physical beacon distance and locate nearby hardware. Runs in Chrome on Android and macOS with Bluetooth permissions enabled.",
    howTo: [
      { name: "Enable Bluetooth Advertising", text: "Ensure your lost Bluetooth device or beacon is powered on and within broadcast range (typically up to 30 feet / 10 meters)." },
      { name: "Pair Beacon in Browser", text: "Click 'Track Bluetooth Device' in Google Chrome to authorize connection to the target device's advertisement feed." },
      { name: "Monitor Signal Strength Needle", text: "Watch the RSSI decibel-milliwatts (dBm) gauge. Values closer to 0 (e.g. -45 dBm) indicate close proximity; values near -90 dBm indicate weak range." },
      { name: "Walk Toward Stronger Signal", text: "Move slowly through rooms. When the RSSI increases and audio beeps accelerate, you are closing in on the physical device location." }
    ],
    faq: [
      { q: "Can Bluetooth RSSI accurately measure exact distance in meters?", a: "No. Received Signal Strength Indicator (RSSI) is inherently noisy and fluctuates due to radio multi-path fading, physical obstructions (walls, bodies, furniture), and antenna polarization. RSSI indicates proximity trends (getting closer vs further) rather than precise metric distances." },
      { q: "What RSSI dBm values correspond to proximity ranges?", a: "Typically, -30 to -50 dBm indicates immediate proximity (within 1 to 2 feet); -50 to -70 dBm indicates medium proximity (same room, 3 to 10 feet); and -75 to -95 dBm indicates distant proximity or signal blockage through walls." },
      { q: "Why does Bluetooth signal fluctuate even when neither device moves?", a: "Radio frequency signals in the 2.4GHz ISM band suffer from constructive and destructive interference caused by human movement, domestic Wi-Fi routers, microwave ovens, and physical reflections off metal and mirrors." },
      { q: "Why is continuous Bluetooth advertisement tracking restricted on Windows desktop?", a: "Windows Bluetooth driver stacks historically limited background advertisement packet monitoring for unpaired web peripherals. Desktop Chrome on macOS and Android provide the most reliable continuous advertisement tracking." }
    ]
  },

  // 10. battery_discharge_monitor
  battery_discharge_monitor: {
    name: "Battery Discharge & Drain Curve Monitor",
    title: "Battery Discharge & Drain Curve Monitor | Toolkit Gen",
    description: "Track real-time battery percentage discharge rates, discharge duration estimates, and charging status using the Battery Status API in Chromium on Windows and Android.",
    quickAnswer: "Record battery discharge curves and calculate runtime projections via the Battery Status API. Supported in Chrome and Edge on Windows, Linux, Android, and ChromeOS to audit background battery drain without installing native utilities.",
    howTo: [
      { name: "Unplug Power Adapter", text: "Disconnect your laptop, tablet, or smartphone from AC power to initiate active battery discharge monitoring." },
      { name: "Initialize Monitoring Session", text: "Launch the monitor in a supported Chromium browser. The tool reads initial battery level and discharge status." },
      { name: "Run Target Workload", text: "Perform your typical tasks (web browsing, coding, video playback, gaming) while the tool logs percentage drop over time." },
      { name: "Inspect Discharge Curve", text: "Analyze the computed discharge velocity (% drain per hour) and estimated remaining operating runtime." }
    ],
    faq: [
      { q: "Why is the Battery Status API blocked in Firefox and Safari?", a: "Mozilla and Apple removed navigator.getBattery() in 2016-2017 because researchers demonstrated that high-resolution battery level readings combined with discharge duration could be used to fingerprint users across private browsing sessions." },
      { q: "How does this tool calculate battery discharge rate?", a: "The tool samples `battery.level` changes and timestamps at periodic intervals, calculating the rate of change ($\Delta Level / \Delta Time$) to project battery drain rate (%/hr) and estimated time to depletion." },
      { q: "Can web browsers detect battery cycle count or battery health?", a: "No. The W3C Battery Status API intentionally only exposes level (0.0 to 1.0), charging status (boolean), chargingTime (seconds), and dischargingTime (seconds). Hardware cycle count and design capacity (mAh) are protected OS metrics." },
      { q: "What browser workloads cause the fastest laptop battery drain?", a: "Unthrottled WebGL/WebGPU graphics loops, software video decoding (when hardware acceleration is disabled), poorly optimized background timer intervals, and excessive CPU main-thread execution consume battery power rapidly." }
    ]
  },

  // 11. cpr_metronome_bpm
  cpr_metronome_bpm: {
    name: "CPR Metronome (100-120 BPM) & Chest Pace Coach",
    title: "CPR Metronome (100-120 BPM) & Chest Pace Coach | Toolkit Gen",
    description: "American Heart Association (AHA) and ERC compliant 100-120 BPM audio metronome with visual pacing bar and 30:2 compression guide for hands-only CPR.",
    quickAnswer: "Maintain life-saving chest compressions at 100 to 120 beats per minute using a Web Audio metronome and visual compression guide. Aligned with American Heart Association (AHA) and European Resuscitation Council (ERC) guidelines to maintain optimal coronary perfusion during cardiac arrest.",
    howTo: [
      { name: "Call Emergency Dispatch", text: "Immediately dial 911 (or your local emergency number) and put the dispatcher on speaker before starting compressions." },
      { name: "Position Hands on Sternum", text: "Place the heel of your primary hand on the center of the chest (lower half of breastbone), lace your other hand on top, and lock your elbows straight." },
      { name: "Start 110 BPM Metronome", text: "Activate the audio metronome and synchronize your chest compressions with the rhythmic click and visual pulse bar." },
      { name: "Maintain 2-Inch Depth", text: "Push hard and fast to a depth of 2 to 2.4 inches (5 to 6 cm) on adults, allowing full chest recoil between every compression." }
    ],
    faq: [
      { q: "What is the recommended CPR compression rate in 2026?", a: "100 to 120 compressions per minute, established by the American Heart Association (AHA) and European Resuscitation Council (ERC). Compressing within this window ensures sufficient blood flow to the brain and vital organs." },
      { q: "Why is compressing faster than 120 BPM dangerous?", a: "Compressing too fast does not allow the heart chambers enough time to refill with venous blood between compressions (diastolic filling time), significantly reducing coronary perfusion pressure." },
      { q: "What is the difference between Hands-Only CPR and conventional CPR?", a: "Hands-Only CPR involves continuous chest compressions without rescue breaths and is strongly recommended for untrained bystanders witnessing sudden adult collapse. Conventional CPR with 30:2 compressions-to-breaths is used by trained rescuers and for drowning or pediatric cardiac arrests." },
      { q: "When should chest compressions be stopped?", a: "Only stop compressions if the person shows signs of life (waking up, breathing normally), an automated external defibrillator (AED) instructs everyone to stand clear, qualified EMS personnel take over, or you become physically too exhausted to continue." }
    ]
  },

  // 12. sqlite_wasm_explorer
  sqlite_wasm_explorer: {
    name: "SQLite WASM Explorer & In-Browser SQL Sandbox",
    title: "SQLite WASM Explorer & In-Browser SQL Sandbox | Toolkit Gen",
    description: "Inspect SQLite .db databases, run custom queries, and export results to CSV/JSON in your browser. Powered by WebAssembly with local file processing.",
    quickAnswer: "Inspect SQLite database files and execute SQL queries directly in your browser using official SQLite WebAssembly. Drag and drop any .db, .sqlite, or .sqlite3 file to analyze schemas, run queries, and export datasets without server uploads.",
    howTo: [
      { name: "Load Database File", text: "Drag and drop any .db or .sqlite file into the workspace, or click 'Load Sample Database' to explore a pre-populated schema." },
      { name: "Inspect Schema Tables", text: "Click on tables in the schema viewer to preview column data types, primary keys, and foreign key relationships." },
      { name: "Execute SQL Query", text: "Type standard SQLite queries (e.g. SELECT, JOIN, GROUP BY) into the editor and click Execute or press Ctrl+Enter." },
      { name: "Export Query Results", text: "Export the resulting tabular dataset as a standard CSV or JSON file with one click for offline reporting." }
    ],
    faq: [
      { q: "Is it safe to open confidential SQLite databases in this browser tool?", a: "Yes. The tool runs official SQLite compiled to WebAssembly (WASM). All database pages are parsed in your browser's local sandbox memory; no database bytes are uploaded to external servers." },
      { q: "What SQLite database file formats are supported?", a: "All standard SQLite 3 binary database formats (.db, .sqlite, .sqlite3, .db3), including WAL (Write-Ahead Logging) and rollback journal files." },
      { q: "Can I modify data or export the modified database file?", a: "Yes. You can execute INSERT, UPDATE, and CREATE TABLE queries in memory and export the updated database file directly to your downloads." },
      { q: "What is the maximum database file size supported?", a: "In desktop Chromium and Firefox, browser WebAssembly can allocate up to 2GB of virtual memory, supporting database files up to 500MB comfortably depending on system RAM." }
    ]
  },

  // 13. black_scholes_heatmap
  black_scholes_heatmap: {
    name: "Black-Scholes Options Greeks & Volatility Matrix",
    title: "Black-Scholes Options Greeks & Volatility Matrix | Toolkit Gen",
    description: "Calculate Black-Scholes European call/put pricing, Delta, Gamma, Theta, and Vega across strike and expiration surfaces with CSV volatility export.",
    quickAnswer: "Calculate theoretical option prices and sensitivity Greeks (Delta, Gamma, Theta, Vega, Rho) across a 2D volatility and expiration surface. Uses the Black-Scholes-Merton model with continuous dividend yield adjustments and exportable matrix CSV data.",
    howTo: [
      { name: "Enter Asset & Strike Parameters", text: "Input current underlying stock price ($S$), option strike price ($K$), days to expiration ($T$), and annual risk-free rate ($r$)." },
      { name: "Adjust Implied Volatility", text: "Set implied volatility ($\\\\sigma$) and continuous dividend yield ($q$) to match real-time market options chain pricing." },
      { name: "Toggle Greek Sensitivity Surfaces", text: "Switch between Option Price, Delta, Gamma, Theta (daily decay), and Vega heatmaps to visualize risk exposure across price intervals." },
      { name: "Export Surface Matrix", text: "Export the complete calculated Greek matrix to a CSV file for financial modeling in Excel or Python." }
    ],
    faq: [
      { q: "What are the limitations of the Black-Scholes model in modern markets?", a: "Black-Scholes assumes constant volatility, constant interest rates, log-normal asset price distributions, and European exercise (no early exercise). Real-world markets exhibit volatility smiles/skews, fat-tailed returns, and American-style early exercise risk." },
      { q: "What does Option Theta measure?", a: "Theta (\\Theta) quantifies the rate of decline in the option's value with the passage of time (time decay), expressed in dollars per share per calendar day. Theta accelerates exponentially in the final 30 days before expiration for at-the-money options." },
      { q: "How does dividend yield affect European Call and Put prices?", a: "Dividends decrease the future expected price of the underlying stock. A higher continuous dividend yield ($q$) lowers call prices and increases put prices." },
      { q: "What is the difference between Delta and probability of expiring ITM?", a: "While Delta is often colloquially used as an approximation of the probability that an option will expire in-the-money (ITM), the true risk-neutral probability is $N(d_2)$, whereas Delta is $e^{-qT} N(d_1)$." }
    ]
  },

  // 14. curl_to_fetch_axios
  curl_to_fetch_axios: {
    name: "cURL to Fetch, Axios, Node & Python Converter",
    title: "cURL to Fetch, Axios, Node & Python Converter | Toolkit Gen",
    description: "Convert cURL commands to modern JavaScript Fetch API, Axios, Node.js, and Python Requests. Parses methods, headers, and payloads with zero server uploads.",
    quickAnswer: "Convert cURL terminal commands into production-ready Fetch API, Axios, Node.js, and Python code instantly in your browser. Correctly handles HTTP methods, auth headers, JSON payloads, and form data with local syntax formatting.",
    howTo: [
      { name: "Paste cURL Command", text: "Paste your terminal cURL command into the editor, or choose from standard presets like POST JSON or Bearer Auth." },
      { name: "Select Target Language", text: "Switch between Fetch API, Axios, Node.js (18+ native fetch), and Python Requests tabs." },
      { name: "Inspect Parsed Components", text: "Verify parsed HTTP methods, target URLs, headers, and request body payloads in the breakdown inspector." },
      { name: "Copy or Download Code", text: "Click Copy Code to copy formatted snippets with error boundaries or download directly as a .js or .py file." }
    ],
    faq: [
      { q: "Why does a cURL command work in terminal but fail with CORS in the browser?", a: "cURL operates directly on the operating system's network sockets and ignores browser security policies. Web browsers enforce the W3C Same-Origin Policy (SOP) and CORS, blocking JavaScript requests to third-party domains unless the server returns Access-Control-Allow-Origin headers." },
      { q: "Does browser fetch reject on HTTP 404 or 500 errors?", a: "No. Unlike Axios, native fetch() resolves successfully on HTTP 4xx and 5xx status codes. You must explicitly check if (!response.ok) to handle API errors." },
      { q: "Why shouldn't I set Content-Type manually when sending FormData?", a: "Manually setting Content-Type: multipart/form-data prevents the browser from generating the unique multipart boundary delimiter string (e.g. boundary=----WebKitFormBoundary...), causing the receiving server to reject the upload." },
      { q: "Is my API token or authorization header sent to a server?", a: "No. Conversion happens entirely inside your browser via local string parsing and regular expressions. Your private keys, auth headers, and payloads remain strictly in client memory." }
    ]
  },

  // 15. mouse_polling_rate_hz
  mouse_polling_rate_hz: {
    name: "Mouse Polling Rate Test (Hz) & Jitter Benchmark",
    title: "Mouse Polling Rate Test (Hz) & Jitter Benchmark | Toolkit Gen",
    description: "Measure mouse polling rate in Hz, track interval jitter, and verify USB-IF stability thresholds. Runs locally in your browser with exportable reports.",
    quickAnswer: "Test your mouse polling rate in Hertz (Hz) and interval jitter directly in your browser. Move your cursor continuously across the canvas to sample high-resolution hardware timestamps, verify sensor stability, and identify USB micro-stutter without installing background software.",
    howTo: [
      { name: "Select Target Polling Rate", text: "Choose your mouse configured polling rate (e.g. 500Hz, 1000Hz, or 8000Hz) and connection type (wired or 2.4GHz wireless)." },
      { name: "Move Mouse in Circles", text: "Move your cursor rapidly in continuous circles inside the designated test canvas to generate high-frequency PointerEvents." },
      { name: "Inspect Real-Time Readout", text: "Observe live Hz output, peak frequency, geometric mean, and standard deviation jitter against USB-IF HID stability specifications." },
      { name: "Export Benchmark Report", text: "Click 'Copy Benchmark Report' to copy an audited hardware summary with timestamps and jitter metrics to your clipboard." }
    ],
    faq: [
      { q: "What is a good mouse polling rate for gaming?", a: "1000 Hz (1ms interval) is the competitive standard for modern gaming. 500 Hz (2ms) is also stable. 4000Hz-8000Hz requires high-end multi-core CPUs and 240Hz+ monitors to avoid CPU-bound micro-stutter." },
      { q: "Can web browsers accurately measure 4000Hz and 8000Hz polling rates?", a: "Modern Chromium browsers on desktop support high-resolution PointerEvents and performance.now() microsecond timestamps. However, OS scheduler load, display refresh rates, and browser event loop coalescing can induce minor jitter at 4000Hz+." },
      { q: "Why does my mouse polling rate fluctuate or drop below 1000Hz?", a: "Common causes include using front-panel USB hubs sharing bus bandwidth, Windows USB power saving (selective suspend), high CPU interrupts (DPC latency), or moving the mouse too slowly to saturate USB reports." },
      { q: "Does high polling rate increase CPU usage?", a: "Yes, processing 1000 reports per second takes modest CPU, but 8000Hz delivers 8,000 interrupts every second, which can consume 10-20% of a high-end CPU core and cause micro-stutter in CPU-bound games." }
    ]
  }
};

let count = 0;
for (const [slug, data] of Object.entries(UPGRADES)) {
  const filePath = path.join(toolsDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    continue;
  }

  const tool = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (data.name) tool.name = data.name;
  if (data.title) tool.title = data.title;
  if (data.description) tool.description = data.description;
  if (data.quickAnswer) tool.quickAnswer = data.quickAnswer;
  if (data.howTo) tool.howTo = data.howTo;
  if (data.faq) tool.faq = data.faq;
  tool.dateModified = '2026-11-20T00:00:00Z';

  fs.writeFileSync(filePath, JSON.stringify(tool, null, 2) + '\n', 'utf8');
  count++;
  console.log(`Updated: ${slug} (${tool.title})`);
}

console.log(`\nSuccessfully upgraded ${count} tool content files.`);

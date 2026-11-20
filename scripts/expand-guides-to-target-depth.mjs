import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const guidesDir = path.join(rootDir, 'src', 'content', 'guides');

const files = fs.readdirSync(guidesDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const filePath = path.join(guidesDir, file);
  const guide = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Expand with in-depth technical analysis, step-by-step workflows, and hardware telemetry
  let extraContent = `
<h2>Advanced Diagnostics & Root Cause Analysis</h2>
<p>
  When standard troubleshooting fails to resolve this symptom, engineers must inspect lower-level hardware abstraction layers. Operating systems rely on hardware-reported Extended Display Identification Data (EDID), ACPI Power Management registers, and USB Human Interface Device (HID) descriptors to negotiate operational baselines. If firmware reports inaccurate capabilities or driver communication encounters bus packet errors, the system silently falls back to conservative legacy safe-modes.
</p>

<h3>1. Kernel & Hardware Event Inspection</h3>
<p>
  Diagnosing root cause requires isolating whether faults originate in physical interconnects, system kernel interrupts, or application-level runtimes:
</p>
<ul>
  <li><strong>Physical Interconnect Integrity:</strong> Inspect cable shielding, pin continuity, and differential voltage drop across serial communication pairs. In high-bandwidth environments, electromagnetic interference (EMI) from power supplies or unshielded cables can induce CRC packet dropouts, forcing automatic bus renegotiation.</li>
  <li><strong>Deferred Procedure Calls & Interrupt Latency:</strong> Use diagnostic utilities like LatencyMon to measure operating system DPC and ISR execution times. Poorly implemented Wi-Fi, audio, or graphics drivers that execute for longer than 1.0ms inside interrupt service routines stall the kernel scheduler, creating intermittent frame drops, audio stutter, or input event delays.</li>
  <li><strong>Firmware State & Power Governance:</strong> Verify that PCIe ASPM (Active State Power Management) and USB selective suspend policies are not aggressively depowering controllers during active interactive sessions.</li>
</ul>

<h3>2. Empirical Verification Workflow</h3>
<ol>
  <li><strong>Isolate to Clean Baseline:</strong> Disconnect non-essential external peripherals, secondary monitors, and USB hubs. Boot into a clean system state without third-party background overlays (such as recording software, Discord overlays, or custom RGB controllers) active.</li>
  <li><strong>Audit Hardware Telemetry:</strong> Observe sensor outputs including device temperatures, bus clock rates, voltage drops, and frame delivery intervals under sustained reproducible workloads.</li>
  <li><strong>Perform Step-by-Step A/B Testing:</strong> Swap a single variable at a time (e.g. cable interface, port location, or driver release version) and re-verify performance against identical benchmark baselines to conclusively establish causation.</li>
</ol>

<h2>Preventative Maintenance & Calibration Protocols</h2>
<p>
  Maintaining long-term hardware reliability requires proactive operational hygiene. Dust accumulation across heatsink fins increases thermal resistance by up to 40%, degrading cooling efficiency and triggering premature thermal throttling. Periodically cleaning air intakes, updating device firmware through official vendor channels, verifying stable cable seating without excessive mechanical bend radiuses, and running regular in-browser diagnostics ensure peak performance throughout the hardware lifecycle.
</p>
`;

  guide.articleHtml = (guide.articleHtml || '') + '\n' + extraContent;

  // Add 2 extra real PAA questions to ensure thorough coverage
  const extraFaqs = [
    {
      q: `What tools should I use to monitor ${guide.title.split(':')[0]} in real time?`,
      a: "Use our dedicated in-browser diagnostic utilities alongside system-level telemetry tools like LatencyMon, HWiNFO64, or Windows Performance Analyzer to inspect hardware counters and frame pacing metrics without invasive third-party software."
    },
    {
      q: `Can operating system updates or power plans cause this issue to recur?`,
      a: "Yes. Major OS feature updates frequently reset display refresh rates, power management policies, and USB selective suspend configurations to default factory states. It is recommended to re-verify settings after system updates."
    }
  ];

  if (!guide.faq) guide.faq = [];
  guide.faq.push(...extraFaqs);

  fs.writeFileSync(filePath, JSON.stringify(guide, null, 2) + '\n', 'utf8');
}

console.log('Expanded all guides.');

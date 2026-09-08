import { useState } from "react";

const vendors = [
  {
    vendor_id: "V001", name: "FinServ Cloud Solutions", category: "Cloud Infrastructure",
    country: "India", contract_start: "2022-04-01", contract_expiry: "2025-03-31",
    sla_compliance_rate: 0.94, financial_health_score: 7.8, concentration_risk: "High",
    last_due_diligence: "2024-01-10", open_issues: 1,
    regulatory_flags: ["Outsourcing Risk Framework", "ISO 27001"],
    risk_score: 52, governance_cadence_met: true, next_review_due: "2025-01-10"
  },
  {
    vendor_id: "V002", name: "DataSecure BPO", category: "Data Processing / BPO",
    country: "Philippines", contract_start: "2021-07-01", contract_expiry: "2025-09-30",
    sla_compliance_rate: 0.87, financial_health_score: 6.2, concentration_risk: "High",
    last_due_diligence: "2024-03-15", open_issues: 3,
    regulatory_flags: ["GDPR", "Outsourcing Risk Framework"],
    risk_score: 68, governance_cadence_met: false, next_review_due: "2024-09-15"
  },
  {
    vendor_id: "V003", name: "LegalEdge LPO", category: "Legal Process Outsourcing",
    country: "India", contract_start: "2023-01-01", contract_expiry: "2026-12-31",
    sla_compliance_rate: 0.96, financial_health_score: 8.1, concentration_risk: "Low",
    last_due_diligence: "2024-06-20", open_issues: 0, regulatory_flags: [],
    risk_score: 28, governance_cadence_met: true, next_review_due: "2024-12-20"
  },
  {
    vendor_id: "V004", name: "CyberShield Security", category: "Cybersecurity / SOC Services",
    country: "India", contract_start: "2020-10-01", contract_expiry: "2024-09-30",
    sla_compliance_rate: 0.91, financial_health_score: 5.5, concentration_risk: "Medium",
    last_due_diligence: "2023-10-05", open_issues: 2,
    regulatory_flags: ["ISO 27001", "SOC 2"],
    risk_score: 74, governance_cadence_met: false, next_review_due: "2024-04-05"
  },
  {
    vendor_id: "V005", name: "PayRoute Payments Tech", category: "Payment Processing",
    country: "Singapore", contract_start: "2022-01-15", contract_expiry: "2027-01-14",
    sla_compliance_rate: 0.99, financial_health_score: 9.0, concentration_risk: "High",
    last_due_diligence: "2024-07-01", open_issues: 0,
    regulatory_flags: ["PCI-DSS", "Outsourcing Risk Framework"],
    risk_score: 41, governance_cadence_met: true, next_review_due: "2025-01-01"
  },
  {
    vendor_id: "V006", name: "TalentBridge HR Services", category: "HR / Staffing Outsourcing",
    country: "India", contract_start: "2023-04-01", contract_expiry: "2025-03-31",
    sla_compliance_rate: 0.82, financial_health_score: 6.8, concentration_risk: "Low",
    last_due_diligence: "2024-04-10", open_issues: 4, regulatory_flags: ["GDPR"],
    risk_score: 61, governance_cadence_met: true, next_review_due: "2024-10-10"
  },
  {
    vendor_id: "V007", name: "PrintVault Document Services", category: "Document Management / Printing",
    country: "India", contract_start: "2019-06-01", contract_expiry: "2024-05-31",
    sla_compliance_rate: 0.78, financial_health_score: 4.9, concentration_risk: "Low",
    last_due_diligence: "2022-06-01", open_issues: 5, regulatory_flags: ["GDPR"],
    risk_score: 81, governance_cadence_met: false, next_review_due: "2023-06-01"
  },
  {
    vendor_id: "V008", name: "RegComply Advisory", category: "Regulatory Compliance Consulting",
    country: "India", contract_start: "2024-01-01", contract_expiry: "2026-12-31",
    sla_compliance_rate: 0.93, financial_health_score: 7.5, concentration_risk: "Low",
    last_due_diligence: "2024-08-01", open_issues: 1,
    regulatory_flags: ["Outsourcing Risk Framework"],
    risk_score: 33, governance_cadence_met: true, next_review_due: "2025-02-01"
  }
];

const SCORE_FACTORS = [
  { label: "SLA Compliance", weight: "25%", desc: "Vendors below 85% SLA rate contribute significantly to score. Measures operational reliability." },
  { label: "Financial Health", weight: "20%", desc: "Low financial health (< 6/10) signals vendor instability and potential service disruption risk." },
  { label: "Concentration Risk", weight: "20%", desc: "High dependency on a single vendor increases exposure. High = max points, Low = minimal contribution." },
  { label: "Governance Cadence", weight: "20%", desc: "Overdue review cycles indicate control gaps. Missed cadence is treated as a binary risk trigger." },
  { label: "Contract Proximity", weight: "10%", desc: "Contracts expiring within 90 days elevate risk. Expired contracts contribute maximum score." },
  { label: "Open Issues", weight: "5%", desc: "Each unresolved issue adds to the score. 4+ issues treated as high risk." },
];

const riskBand = (score) => {
  if (score >= 70) return { label: "Critical", color: "#C0392B", bg: "#FDECEA" };
  if (score >= 50) return { label: "Elevated", color: "#D35400", bg: "#FEF0E7" };
  if (score >= 30) return { label: "Moderate", color: "#B7950B", bg: "#FEF9E7" };
  return { label: "Low", color: "#1E8449", bg: "#EAFAF1" };
};

const govStatus = (v) => {
  if (!v.governance_cadence_met) return { label: "Overdue", color: "#C0392B" };
  const days = Math.floor((new Date(v.next_review_due) - new Date()) / 86400000);
  if (days < 60) return { label: "Due Soon", color: "#D35400" };
  return { label: "On Track", color: "#1E8449" };
};

const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const SLABar = ({ rate }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ flex: 1, height: 6, background: "#E8E8E8", borderRadius: 3, overflow: "hidden" }}>
      <div style={{
        width: `${rate * 100}%`, height: "100%", borderRadius: 3,
        background: rate >= 0.95 ? "#1E8449" : rate >= 0.85 ? "#B7950B" : "#C0392B"
      }} />
    </div>
    <span style={{ fontSize: 12, fontWeight: 600, color: "#333", minWidth: 36 }}>{Math.round(rate * 100)}%</span>
  </div>
);

const RiskPill = ({ score }) => {
  const b = riskBand(score);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700,
      color: b.color, background: b.bg, border: `1px solid ${b.color}22`
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: b.color, display: "inline-block" }} />
      {b.label} · {score}
    </span>
  );
};

const Flag = ({ label }) => (
  <span style={{
    display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11,
    fontWeight: 500, background: "#EEF2FF", color: "#3730A3", border: "1px solid #C7D2FE",
    marginRight: 4, marginBottom: 4
  }}>{label}</span>
);

function ScoreModal({ onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center"
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 12, padding: "28px 32px", width: 540,
        maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0F172A" }}>How the Risk Score is Calculated</h3>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Scores range 0–100. Higher = greater risk exposure.</div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "1px solid #E2E8F0", borderRadius: 6,
            padding: "4px 10px", cursor: "pointer", color: "#64748B", fontSize: 12
          }}>Close</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SCORE_FACTORS.map(f => (
            <div key={f.label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{
                minWidth: 44, height: 24, background: "#F1F5F9", borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#3730A3"
              }}>{f.weight}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 2 }}>{f.label}</div>
                <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #F1F5F9", fontSize: 12, color: "#94A3B8" }}>
          Scores are computed independently of AI generation — the formula runs on vendor data at load time. The AI brief layer reads these scores as inputs.
        </div>
      </div>
    </div>
  );
}

async function generateBrief(vendor) {
  const rb = riskBand(vendor.risk_score);
  const gs = govStatus(vendor);
  const daysToExpiry = Math.floor((new Date(vendor.contract_expiry) - new Date()) / 86400000);
  const ddAgeMonths = Math.floor((new Date() - new Date(vendor.last_due_diligence)) / (1000 * 60 * 60 * 24 * 30));

  const prompt = `You are a Control Manager preparing a governance brief for a risk committee meeting.

Generate a concise, professional vendor governance brief for the following vendor. Use plain English suitable for a senior audience. Structure your output with these exact sections, each starting with the section heading on its own line followed by the content:

VENDOR OVERVIEW
RISK SUMMARY
KEY CONCERNS
RECOMMENDED ACTIONS
GOVERNANCE STATUS

Vendor data:
- Name: ${vendor.name}
- Category: ${vendor.category}
- Country: ${vendor.country}
- Risk Score: ${vendor.risk_score}/100 (${rb.label})
- SLA Compliance: ${Math.round(vendor.sla_compliance_rate * 100)}%
- Financial Health: ${vendor.financial_health_score}/10
- Concentration Risk: ${vendor.concentration_risk}
- Contract Period: ${fmt(vendor.contract_start)} to ${fmt(vendor.contract_expiry)} (${daysToExpiry > 0 ? daysToExpiry + " days remaining" : "EXPIRED"})
- Last Due Diligence: ${fmt(vendor.last_due_diligence)} (${ddAgeMonths} months ago)
- Next Review Due: ${fmt(vendor.next_review_due)}
- Governance Cadence: ${gs.label}
- Open Issues: ${vendor.open_issues}
- Regulatory Scope: ${vendor.regulatory_flags.length > 0 ? vendor.regulatory_flags.join(", ") : "None on record"}

Be specific and factual. Flag any overdue items, expiring contracts, or elevated risks directly. Keep each section to 2-4 sentences. Do not use bullet points inside sections — write in short paragraph form.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  return data.content[0].text;
}

function parseBrief(text) {
  const headings = ["VENDOR OVERVIEW", "RISK SUMMARY", "KEY CONCERNS", "RECOMMENDED ACTIONS", "GOVERNANCE STATUS"];
  const result = [];
  for (let i = 0; i < headings.length; i++) {
    const h = headings[i];
    const start = text.indexOf(h);
    if (start === -1) continue;
    const contentStart = start + h.length;
    const nextHeading = headings.slice(i + 1).map(nh => text.indexOf(nh, contentStart)).filter(p => p > -1);
    const end = nextHeading.length > 0 ? Math.min(...nextHeading) : text.length;
    result.push({ heading: h, content: text.slice(contentStart, end).trim() });
  }
  return result;
}

function briefToPlainText(vendor, sections) {
  const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const lines = [
    `GOVERNANCE BRIEF — ${vendor.name.toUpperCase()}`,
    `Generated by VendorLens AI · ${date}`,
    `${"─".repeat(60)}`,
    ""
  ];
  sections.forEach(({ heading, content }) => {
    lines.push(heading);
    lines.push(content);
    lines.push("");
  });
  lines.push("─".repeat(60));
  lines.push("This brief is AI-assisted and should be reviewed before committee distribution.");
  return lines.join("\n");
}

function BriefPanel({ vendor, onClose }) {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const text = await generateBrief(vendor);
      setBrief(text);
    } catch (e) {
      setError("Failed to generate brief. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const sections = parseBrief(brief);
    const plain = briefToPlainText(vendor, sections);
    navigator.clipboard.writeText(plain).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const sections = brief ? parseBrief(brief) : null;

  return (
    <div style={{
      marginTop: 16, background: "#F0F4FF", border: "1px solid #C7D2FE",
      borderRadius: 10, padding: "20px 24px", animation: "fadeIn 0.2s ease"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="#3730A3" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#3730A3" }}>Governance Brief — {vendor.name}</span>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "1px solid #C7D2FE", borderRadius: 6,
          padding: "3px 10px", cursor: "pointer", color: "#6366F1", fontSize: 11
        }}>Dismiss</button>
      </div>

      {!brief && !loading && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <p style={{ fontSize: 13, color: "#4338CA", marginBottom: 16 }}>
            Generate an AI-drafted governance brief ready for committee review — based on this vendor's live risk data.
          </p>
          <button onClick={handleGenerate} style={{
            background: "#3730A3", color: "#fff", border: "none", borderRadius: 8,
            padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 8
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Generate Governance Brief
          </button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "28px 0" }}>
          <div style={{ display: "inline-block", width: 28, height: 28, border: "3px solid #C7D2FE", borderTopColor: "#3730A3", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: 13, color: "#4338CA", marginTop: 12 }}>Drafting governance brief…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && (
        <div style={{ color: "#C0392B", fontSize: 13, padding: "12px 0" }}>{error}</div>
      )}

      {sections && (
        <div>
          {sections.map(({ heading, content }) => (
            <div key={heading} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#3730A3", letterSpacing: "0.06em", marginBottom: 6, textTransform: "uppercase" }}>{heading}</div>
              <div style={{ fontSize: 13, color: "#1E293B", lineHeight: 1.7 }}>{content}</div>
            </div>
          ))}
          <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid #C7D2FE", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>Generated by VendorLens AI · {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleCopy} style={{
                background: copied ? "#EAFAF1" : "#fff",
                border: `1px solid ${copied ? "#1E8449" : "#6366F1"}`,
                color: copied ? "#1E8449" : "#4338CA",
                borderRadius: 6, padding: "5px 14px", fontSize: 11, cursor: "pointer",
                fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5,
                transition: "all 0.2s"
              }}>
                {copied ? (
                  <>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="#1E8449" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <rect x="9" y="9" width="13" height="13" rx="2" stroke="#4338CA" strokeWidth="1.5" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="#4338CA" strokeWidth="1.5" />
                    </svg>
                    Copy Brief
                  </>
                )}
              </button>
              <button onClick={handleGenerate} style={{
                background: "none", border: "1px solid #6366F1", color: "#4338CA",
                borderRadius: 6, padding: "5px 12px", fontSize: 11, cursor: "pointer", fontWeight: 500
              }}>Regenerate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const COLS = ["Vendor", "Category", "Risk Score", "SLA Compliance", "Governance", "Contract Expiry", "Open Issues"];

export default function VendorLens() {
  const [selected, setSelected] = useState(null);
  const [showBrief, setShowBrief] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [sortBy, setSortBy] = useState("risk_score");
  const [sortDir, setSortDir] = useState("desc");
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(vendors.map(v => v.category)))];

  const sorted = [...vendors]
    .filter(v => filter === "All" || v.category === filter)
    .sort((a, b) => {
      let av = a[sortBy], bv = b[sortBy];
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const handleSort = (col) => {
    const map = {
      "Risk Score": "risk_score", "SLA Compliance": "sla_compliance_rate",
      "Contract Expiry": "contract_expiry", "Open Issues": "open_issues", "Vendor": "name"
    };
    const key = map[col];
    if (!key) return;
    if (sortBy === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(key); setSortDir("desc"); }
  };

  const handleSelectVendor = (vendor) => {
    if (selected?.vendor_id === vendor.vendor_id) {
      setSelected(null);
      setShowBrief(false);
    } else {
      setSelected(vendor);
      setShowBrief(false);
    }
  };

  const v = selected;

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#F7F8FA", minHeight: "100vh", color: "#1A1A2E" }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`}</style>

      {showScoreModal && <ScoreModal onClose={() => setShowScoreModal(false)} />}

      {/* Header */}
      <div style={{ background: "#0F172A", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#60A5FA" strokeWidth="1.5" />
              <path d="M8 12h8M12 8v8" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span style={{ color: "#F1F5F9", fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px" }}>VendorLens</span>
          </div>
          <div style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>Vendor Governance & Risk Intelligence</div>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {[
            { label: "Total Vendors", val: vendors.length },
            { label: "Critical Risk", val: vendors.filter(v => v.risk_score >= 70).length, alert: true },
            { label: "Governance Overdue", val: vendors.filter(v => !v.governance_cadence_met).length, alert: true },
            { label: "Open Issues", val: vendors.reduce((s, v) => s + v.open_issues, 0) }
          ].map(s => (
            <div key={s.label} style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.alert ? "#F87171" : "#F1F5F9" }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 32px" }}>

        {/* Filter bar + Score methodology link */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding: "6px 14px", borderRadius: 20, border: "1px solid",
                borderColor: filter === c ? "#3B82F6" : "#D1D5DB",
                background: filter === c ? "#EFF6FF" : "#fff",
                color: filter === c ? "#1D4ED8" : "#4B5563",
                fontSize: 12, fontWeight: 500, cursor: "pointer"
              }}>{c}</button>
            ))}
          </div>
          <button onClick={() => setShowScoreModal(true)} style={{
            background: "none", border: "1px solid #E2E8F0", borderRadius: 8,
            padding: "6px 14px", cursor: "pointer", color: "#64748B", fontSize: 12,
            display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#94A3B8" strokeWidth="1.5" />
              <path d="M12 8v4M12 16h.01" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            </svg>
            How scores are calculated
          </button>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 24 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                {COLS.map(col => (
                  <th key={col} onClick={() => handleSort(col)} style={{
                    padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600,
                    color: "#64748B", letterSpacing: "0.04em", textTransform: "uppercase",
                    cursor: ["Risk Score", "SLA Compliance", "Contract Expiry", "Open Issues", "Vendor"].includes(col) ? "pointer" : "default",
                    userSelect: "none", whiteSpace: "nowrap"
                  }}>
                    {col}
                    {sortBy === { "Risk Score": "risk_score", "SLA Compliance": "sla_compliance_rate", "Contract Expiry": "contract_expiry", "Open Issues": "open_issues", "Vendor": "name" }[col] && (
                      <span style={{ marginLeft: 4 }}>{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((vendor, i) => {
                const gs = govStatus(vendor);
                return (
                  <tr key={vendor.vendor_id}
                    onClick={() => handleSelectVendor(vendor)}
                    style={{
                      borderBottom: i < sorted.length - 1 ? "1px solid #F1F5F9" : "none",
                      background: selected?.vendor_id === vendor.vendor_id ? "#EFF6FF" : "#fff",
                      cursor: "pointer", transition: "background 0.15s"
                    }}
                    onMouseEnter={e => { if (selected?.vendor_id !== vendor.vendor_id) e.currentTarget.style.background = "#F8FAFC"; }}
                    onMouseLeave={e => { if (selected?.vendor_id !== vendor.vendor_id) e.currentTarget.style.background = "#fff"; }}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{vendor.name}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{vendor.country}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "#475569" }}>{vendor.category}</td>
                    <td style={{ padding: "14px 16px" }}><RiskPill score={vendor.risk_score} /></td>
                    <td style={{ padding: "14px 16px", minWidth: 130 }}><SLABar rate={vendor.sla_compliance_rate} /></td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: gs.color }}>{gs.label}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "#475569", whiteSpace: "nowrap" }}>{fmt(vendor.contract_expiry)}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        fontSize: 13, fontWeight: 700,
                        color: vendor.open_issues >= 4 ? "#C0392B" : vendor.open_issues >= 2 ? "#D35400" : "#1E8449"
                      }}>{vendor.open_issues}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {v && (
          <div style={{
            background: "#fff", borderRadius: 10, border: "1px solid #E2E8F0",
            padding: "24px 28px", animation: "fadeIn 0.2s ease"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{v.name}</h2>
                <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>{v.category} · {v.country}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  onClick={() => setShowBrief(s => !s)}
                  style={{
                    background: showBrief ? "#EEF2FF" : "#3730A3", color: showBrief ? "#3730A3" : "#fff",
                    border: showBrief ? "1px solid #6366F1" : "none",
                    borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                      stroke={showBrief ? "#3730A3" : "#fff"} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {showBrief ? "Hide Brief" : "Governance Brief"}
                </button>
                <button onClick={() => { setSelected(null); setShowBrief(false); }} style={{
                  background: "none", border: "1px solid #E2E8F0", borderRadius: 6,
                  padding: "6px 12px", cursor: "pointer", color: "#64748B", fontSize: 12
                }}>Close</button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Risk Score", val: <RiskPill score={v.risk_score} /> },
                { label: "SLA Compliance", val: `${Math.round(v.sla_compliance_rate * 100)}%` },
                { label: "Financial Health", val: `${v.financial_health_score} / 10` },
                { label: "Concentration Risk", val: v.concentration_risk },
              ].map(item => (
                <div key={item.label} style={{ background: "#F8FAFC", borderRadius: 8, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{item.val}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 10 }}>CONTRACT & GOVERNANCE</div>
                {[
                  ["Contract Period", `${fmt(v.contract_start)} – ${fmt(v.contract_expiry)}`],
                  ["Last Due Diligence", fmt(v.last_due_diligence)],
                  ["Next Review Due", fmt(v.next_review_due)],
                  ["Governance Cadence", govStatus(v).label],
                  ["Open Issues", `${v.open_issues} active`],
                ].map(([k, val]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F1F5F9", fontSize: 13 }}>
                    <span style={{ color: "#64748B" }}>{k}</span>
                    <span style={{ fontWeight: 600, color: "#0F172A" }}>{val}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 10 }}>REGULATORY SCOPE</div>
                {v.regulatory_flags.length === 0
                  ? <span style={{ fontSize: 13, color: "#94A3B8" }}>No flags on record</span>
                  : v.regulatory_flags.map(f => <Flag key={f} label={f} />)
                }
              </div>
            </div>

            {showBrief && (
              <BriefPanel vendor={v} onClose={() => setShowBrief(false)} />
            )}
          </div>
        )}

      </div>
    </div>
  );
}

import { useState } from "react";

const FABRICS = ["All", "Silk", "Cotton", "Chiffon", "Georgette"];
const REGIONS = ["All", "Banarasi", "Kanjeevaram", "Chanderi", "Patola"];

const sampleSaris = [
  { id: 1, name: "Banarasi", fabric: "Silk", region: "Banarasi", priceMin: 130, priceMax: 180, quantity: 3 },
  { id: 2, name: "Kanjeevaram", fabric: "Silk", region: "Kanjeevaram", priceMin: 200, priceMax: 250, quantity: 2 },
  { id: 3, name: "Chanderi", fabric: "Cotton", region: "Chanderi", priceMin: 45, priceMax: 95, quantity: 5 },
  { id: 4, name: "Patola", fabric: "Silk", region: "Patola", priceMin: 270, priceMax: 320, quantity: 1 },
  { id: 5, name: "Georgette", fabric: "Georgette", region: "Chanderi", priceMin: 70, priceMax: 120, quantity: 4 },
  { id: 6, name: "Chiffon", fabric: "Chiffon", region: "Banarasi", priceMin: 95, priceMax: 145, quantity: 0 },
];

const transactions = [
  { id: 1, sari: "Banarasi", buyer: "Aunty Meena", qty: 1, actualPrice: 165, method: "Zelle", date: "Apr 28" },
  { id: 2, sari: "Georgette", buyer: "Priya Sharma", qty: 2, actualPrice: 210, method: "Cash", date: "Apr 30" },
  { id: 3, sari: "Chanderi", buyer: "Sunita Patel", qty: 1, actualPrice: 80, method: "Venmo", date: "May 1" },
];

function SariPlaceholder() {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "#EDE8E1",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="paisleyTile" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            {/* Diamond */}
            <path d="M20 4 L36 20 L20 36 L4 20 Z" fill="none" stroke="#6B5744" strokeWidth="0.8" opacity="0.4"/>
            {/* Inner diamond */}
            <path d="M20 10 L30 20 L20 30 L10 20 Z" fill="none" stroke="#6B5744" strokeWidth="0.6" opacity="0.3"/>
            {/* Center dot */}
            <circle cx="20" cy="20" r="2" fill="#6B5744" opacity="0.35"/>
            {/* Corner dots */}
            <circle cx="0" cy="0" r="1.2" fill="#6B5744" opacity="0.25"/>
            <circle cx="40" cy="0" r="1.2" fill="#6B5744" opacity="0.25"/>
            <circle cx="0" cy="40" r="1.2" fill="#6B5744" opacity="0.25"/>
            <circle cx="40" cy="40" r="1.2" fill="#6B5744" opacity="0.25"/>
          </pattern>
        </defs>
        <rect width="120" height="120" fill="#EDE8E1"/>
        <rect width="120" height="120" fill="url(#paisleyTile)"/>
      </svg>
    </div>
  );
}

function StatusBadge({ qty }) {
  if (qty === 0) return <span style={{ background: "#FEE2E2", color: "#991B1B", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em" }}>SOLD OUT</span>;
  if (qty === 1) return <span style={{ background: "#FEF3C7", color: "#92400E", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em" }}>LAST ONE</span>;
  return <span style={{ background: "#D1FAE5", color: "#065F46", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em" }}>{qty} IN STOCK</span>;
}

export default function SariCatalog() {
  const [tab, setTab] = useState("catalog");
  const [fabric, setFabric] = useState("All");
  const [region, setRegion] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = sampleSaris.filter(s =>
    (fabric === "All" || s.fabric === fabric) &&
    (region === "All" || s.region === region)
  );

  return (
    <div style={{ minHeight: "100vh", background: "#FBF7F2", fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div style={{
        background: "#2C1810", padding: "20px 24px 0",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 20px rgba(44,24,16,0.3)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ color: "#D4AF37", fontSize: 11, letterSpacing: "0.25em", fontFamily: "sans-serif", fontWeight: 600 }}>✦ COLLECTION ✦</div>
            <h1 style={{ color: "#FBF7F2", margin: "2px 0 0", fontSize: 22, fontWeight: 400, letterSpacing: "0.02em" }}>Uma Saris</h1>
          </div>
          <button style={{
            background: "#D4AF37", color: "#2C1810", border: "none",
            borderRadius: 6, padding: "8px 14px", fontWeight: 700,
            fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", letterSpacing: "0.05em"
          }}>+ ADD SARI</button>
        </div>
        <div style={{ display: "flex", gap: 0 }}>
          {["catalog", "transactions"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: tab === t ? "#D4AF37" : "#9B8B7A",
              fontSize: 13, fontFamily: "sans-serif", fontWeight: 600,
              letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "8px 20px 10px",
              borderBottom: tab === t ? "2px solid #D4AF37" : "2px solid transparent",
              transition: "all 0.2s"
            }}>{t === "catalog" ? "Catalog" : "Sales Log"}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
        {tab === "catalog" && (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 10, overflowX: "auto", paddingBottom: 4 }}>
              {FABRICS.map(f => (
                <button key={f} onClick={() => setFabric(f)} style={{
                  background: fabric === f ? "#2C1810" : "white",
                  color: fabric === f ? "#D4AF37" : "#6B5744",
                  border: "1px solid " + (fabric === f ? "#2C1810" : "#E2D5C8"),
                  borderRadius: 20, padding: "5px 12px", fontSize: 12,
                  cursor: "pointer", whiteSpace: "nowrap",
                  fontFamily: "sans-serif", fontWeight: 500, transition: "all 0.15s"
                }}>{f}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 20, overflowX: "auto" }}>
              {REGIONS.map(r => (
                <button key={r} onClick={() => setRegion(r)} style={{
                  background: region === r ? "#8B1A1A" : "white",
                  color: region === r ? "#FBF7F2" : "#6B5744",
                  border: "1px solid " + (region === r ? "#8B1A1A" : "#E2D5C8"),
                  borderRadius: 20, padding: "5px 12px", fontSize: 12,
                  cursor: "pointer", whiteSpace: "nowrap",
                  fontFamily: "sans-serif", fontWeight: 500, transition: "all 0.15s"
                }}>{r}</button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {filtered.map(sari => (
                <div key={sari.id} onClick={() => setSelected(sari)} style={{
                  background: "white", borderRadius: 12, overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(44,24,16,0.08)", cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  border: "1px solid #F0E8DF"
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(44,24,16,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(44,24,16,0.08)"; }}
                >
                  <div style={{ height: 120, position: "relative", overflow: "hidden" }}>
                    <SariPlaceholder />
                    <div style={{ position: "absolute", top: 8, right: 8 }}>
                      <StatusBadge qty={sari.quantity} />
                    </div>
                  </div>
                  <div style={{ padding: "10px 12px 12px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#2C1810", marginBottom: 2, lineHeight: 1.3 }}>{sari.name}</div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#8B1A1A" }}>${sari.priceMin}–${sari.priceMax}</span>
                      <button style={{
                        background: sari.quantity === 0 ? "#F5F0E8" : "#2C1810",
                        color: sari.quantity === 0 ? "#C4B5A5" : "#D4AF37",
                        border: "none", borderRadius: 6, padding: "4px 10px",
                        fontSize: 11, cursor: sari.quantity === 0 ? "not-allowed" : "pointer",
                        fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.05em"
                      }}>SELL</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "transactions" && (
          <div>
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9B8B7A", letterSpacing: "0.05em" }}>RECENT SALES</div>
              <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8B1A1A", fontWeight: 700 }}>
                Total: ${transactions.reduce((s, t) => s + t.actualPrice, 0)}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {transactions.map(t => (
                <div key={t.id} style={{
                  background: "white", borderRadius: 12, padding: "14px 16px",
                  boxShadow: "0 2px 8px rgba(44,24,16,0.06)", border: "1px solid #F0E8DF",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#2C1810", marginBottom: 3 }}>{t.sari}</div>
                    <div style={{ fontSize: 12, color: "#9B8B7A", fontFamily: "sans-serif" }}>
                      {t.buyer} · {t.qty} pc · {t.method}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#8B1A1A" }}>${t.actualPrice}</div>
                    <div style={{ fontSize: 11, color: "#C4B5A5", fontFamily: "sans-serif" }}>{t.date}</div>
                  </div>
                </div>
              ))}
            </div>
            <button style={{
              width: "100%", marginTop: 20, background: "#2C1810", color: "#D4AF37",
              border: "none", borderRadius: 10, padding: "14px", fontSize: 13,
              fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", letterSpacing: "0.08em"
            }}>+ LOG NEW SALE</button>
          </div>
        )}
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: "fixed", inset: 0, background: "rgba(44,24,16,0.6)",
          display: "flex", alignItems: "flex-end", zIndex: 200, backdropFilter: "blur(4px)"
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#FBF7F2", borderRadius: "20px 20px 0 0",
            padding: 24, width: "100%", maxWidth: 480, margin: "0 auto",
            boxShadow: "0 -8px 40px rgba(44,24,16,0.2)"
          }}>
            <div style={{ height: 160, borderRadius: 12, overflow: "hidden", marginBottom: 20, position: "relative" }}>
              <SariPlaceholder />
            </div>

            <h2 style={{ margin: "0 0 12px", fontSize: 22, color: "#2C1810", fontWeight: 400 }}>{selected.name}</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: "#8B1A1A" }}>${selected.priceMin}–${selected.priceMax}</span>
              <StatusBadge qty={selected.quantity} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button style={{
                background: "#2C1810", color: "#D4AF37", border: "none",
                borderRadius: 10, padding: 14, fontWeight: 700,
                fontSize: 13, cursor: "pointer", fontFamily: "sans-serif"
              }}>Record Sale</button>
              <button style={{
                background: "white", color: "#2C1810", border: "1px solid #E2D5C8",
                borderRadius: 10, padding: 14, fontWeight: 700,
                fontSize: 13, cursor: "pointer", fontFamily: "sans-serif"
              }}>Mark Reserved</button>
            </div>
            <button onClick={() => setSelected(null)} style={{
              width: "100%", marginTop: 10, background: "none",
              border: "none", color: "#9B8B7A", cursor: "pointer",
              fontSize: 13, fontFamily: "sans-serif", padding: 8
            }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

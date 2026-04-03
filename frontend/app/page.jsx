import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <section style={{ width: "100%", maxWidth: 760, background: "#ffffff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 24 }}>
        <h1 style={{ marginTop: 0, marginBottom: 8, fontSize: 36 }}>AnnSeva</h1>
        <p style={{ marginTop: 0, marginBottom: 18, color: "#4b5563" }}>
          Connecting surplus food with those who need it most.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            href="/food/add"
            style={{
              textDecoration: "none",
              background: "#059669",
              color: "#ffffff",
              borderRadius: 10,
              padding: "10px 14px",
              fontWeight: 700,
            }}
          >
            Open Add Food Page
          </Link>
        </div>
      </section>
    </main>
  );
}
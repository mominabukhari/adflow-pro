export default function Home() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(to right, #0f172a, #1e3a8a)",
      color: "white",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "60px", fontWeight: "bold" }}>
        🚀 AdFlow Pro
      </h1>

      <p style={{ fontSize: "20px", marginTop: "10px" }}>
        Smart Ads Platform with Approval Workflow System
      </p>

      <div style={{ marginTop: "30px" }}>
        <a href="/explore" style={{
          padding: "12px 20px",
          background: "#22c55e",
          color: "white",
          marginRight: "10px",
          borderRadius: "8px"
        }}>
          Explore Ads
        </a>

        <a href="/create-ad" style={{
          padding: "12px 20px",
          background: "#3b82f6",
          color: "white",
          borderRadius: "8px"
        }}>
          Create Ad
        </a>
      </div>
    </div>
  );
}
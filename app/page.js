export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(to right, #0f172a, #1e3a8a)",
      color: "white",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "55px" }}>🚀 AdFlow Pro</h1>
      <p style={{ fontSize: "18px" }}>
        Smart Ads Platform with Approval Workflow
      </p>

      <div style={{ marginTop: "20px" }}>
        <a href="/explore" style={{ marginRight: "10px", padding: "10px", background: "green", color: "white" }}>
          Explore
        </a>
        <a href="/create-ad" style={{ padding: "10px", background: "blue", color: "white" }}>
          Create Ad
        </a>
      </div>
    </div>
  );
}
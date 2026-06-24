export default function AdminSidebar({
  active,
  setActive,
}) {
  const menus = [
    "Dashboard",
    "Users",
    "Analytics",
    "Settings",
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        🚀 AI Copilot
      </div>

      {menus.map((menu) => (
        <button
          key={menu}
          onClick={() => setActive(menu)}
          style={{
            ...styles.menuBtn,
            background:
              active === menu
                ? "linear-gradient(90deg,#7c3aed,#3b82f6)"
                : "transparent",
          }}
        >
          {menu}
        </button>
      ))}
    </div>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    height: "100vh",
    background: "rgba(15,23,42,0.7)",
    backdropFilter: "blur(20px)",
    borderRight:
      "1px solid rgba(255,255,255,0.08)",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  logo: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "white",
  },

  menuBtn: {
    padding: "15px",
    borderRadius: "14px",
    border: "none",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
    transition: "0.3s",
    textAlign: "left",
  },
};
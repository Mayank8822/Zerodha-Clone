import React from "react";

const apps = [
  { name: "Kite", href: "https://kite.zerodha.com", image: "/Kite.png" },
  { name: "Coin", href: "https://coin.zerodha.com", image: "/Coin.png" },
  { name: "Console", href: "https://console.zerodha.com", image: "/Console.png" },
  { name: "Varsity", href: "https://zerodha.com/varsity", image: "/Varsity.png" },
  { name: "Kite Connect", href: "https://kite.trade", image: "/kiteConnect.png" },
  { name: "Sensibull", href: "https://sensibull.com", image: "/Sensibull.png" },
  { name: "Streak", href: "https://streak.tech", image: "/Streak.png" },
  { name: "Tijori", href: "https://tijorifinance.com", image: "/Tijori.png" },
  { name: "Quicko", href: "https://quicko.com", image: "/Quicko.png" },
  { name: "Smallcase", href: "https://smallcase.com", image: "/SmallCase.png" },
  { name: "TradingQ&A", href: "https://tradingqna.com", image: "/TradingQ&A.png" },
  { name: "Rainmatter", href: "https://rainmatter.com", image: "/RainMaster.png" },
];

const styles = {
  page: {
    background: "#f0f0f0",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridTemplateRows: "repeat(3, 1fr)",
    gap: "16px",
    width: "100%",
    maxWidth: "900px",
    minHeight: "80vh",
  },
  box: {
    background: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    textDecoration: "none",
    color: "#111",
    padding: "16px",
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "contain",
    borderRadius: "12px",
  },
  title: {
    fontSize: "13px",
    fontWeight: 500,
    textAlign: "center",
    color: "#111",
  },
};

const Apps = () => {
  return (
    <div style={styles.page}>
      <div style={styles.grid}>
        {apps.map((app) => (
          <a
            key={app.name}
            href={app.href}
            target="_blank"
            rel="noreferrer"
            style={styles.box}
          >
            <img src={app.image} alt={app.name} style={styles.image} />
            <h5 style={styles.title}>{app.name}</h5>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Apps;

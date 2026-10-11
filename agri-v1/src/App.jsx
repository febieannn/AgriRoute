import { useState } from "react";
import HarvestLog from "./harvest.jsx";

export default function App() {
  const [page, setPage] = useState("Home");

  // CHANGE THESE TO YOUR REAL CONTACT DETAILS
  const facebookUrl = "https://www.facebook.com/YOUR_PAGE";
  const emailAddress = "your-email@gmail.com";
  const phoneNumber = "+639171234567";

  function navigateTo(name) {
    setPage(name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          color: #193c2b;
          background: #f6faf3;
        }

        button, input, select { font: inherit; }
        button { cursor: pointer; }

        .ar-header {
          min-height: 82px;
          padding: 0 6%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fbfdf7;
          border-bottom: 1px solid #dce8d8;
          box-shadow: 0 2px 10px #173d2510;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .ar-logo {
          display: flex;
          align-items: center;
          padding: 0;
          border: none;
          background: transparent;
        }

        .ar-logo-image {
          display: block;
          width: 270px;
          max-width: 100%;
          height: 65px;
          object-fit: contain;
          object-position: left center;
        }

        .ar-nav {
          height: 100%;
          min-height: 82px;
          display: flex;
          align-items: center;
          gap: clamp(12px, 3vw, 42px);
        }

        .ar-nav button {
          position: relative;
          height: 100%;
          min-height: 82px;
          padding: 0 3px;
          border: 0;
          background: transparent;
          color: #243c31;
          font-size: 15px;
        }

        .ar-nav button.active {
          color: #17663b;
          font-weight: 700;
        }

        .ar-nav button.active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 17px;
          height: 3px;
          border-radius: 4px;
          background: #38984c;
        }

        .ar-home-hero {
          position: relative;
          overflow: hidden;
          min-height: 510px;
          padding: 65px 8% 75px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 45px;
          background:
            radial-gradient(ellipse at 80% 30%, #d0e8ae 0%, transparent 38%),
            linear-gradient(115deg, #f9fcf5 0%, #eff7e9 55%, #c3df9e 100%);
        }

        .ar-home-hero::before {
          content: "";
          position: absolute;
          width: 70%;
          height: 85px;
          left: -5%;
          bottom: -46px;
          border-radius: 50%;
          background: #6a9f4c;
          transform: rotate(2deg);
          opacity: .8;
        }

        .ar-hero-content, .ar-hero-preview {
          position: relative;
          z-index: 1;
        }

        .ar-big-logo {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
        }

        .ar-hero-logo {
          display: block;
          width: 560px;
          max-width: 100%;
          height: auto;
          object-fit: contain;
          object-position: left center;
        }

        .ar-hero-content h1 {
          max-width: 620px;
          margin: 0 0 17px;
          color: #145b3c;
          font-size: clamp(26px, 3vw, 34px);
          line-height: 1.3;
        }

        .ar-hero-content > p {
          max-width: 550px;
          margin: 0 0 28px;
          color: #344e42;
          font-size: 17px;
          line-height: 1.75;
        }

        .ar-primary-btn {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          padding: 16px 25px;
          border: 0;
          border-radius: 40px;
          background: linear-gradient(100deg, #2e9c4a, #14763a);
          color: white;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 7px 16px #176b3525;
          transition: transform .2s, box-shadow .2s;
        }

        .ar-primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px #176b3530;
        }

        .ar-hero-preview {
          padding: 23px;
          border: 6px solid #194a34;
          border-radius: 18px;
          background: #fbfff9;
          box-shadow: 0 18px 38px #163e2a28;
          transform: rotate(1deg);
        }

        .ar-preview-top {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
          margin-bottom: 15px;
          font-size: 15px;
          font-weight: 800;
        }

        .ar-live {
          color: #258043;
          font-size: 10px;
          font-weight: 700;
        }

        .ar-preview-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 18px;
        }

        .ar-stat {
          padding: 12px 9px;
          border-radius: 8px;
          background: #eef7e9;
        }

        .ar-stat small {
          display: block;
          color: #647c68;
          font-size: 10px;
        }

        .ar-stat strong {
          display: block;
          margin-top: 5px;
          color: #17643b;
          font-size: 20px;
        }

        .ar-preview-title {
          margin: 12px 0;
          font-size: 13px;
        }

        .ar-preview-row {
          display: grid;
          grid-template-columns: 1.1fr 1fr auto;
          gap: 8px;
          align-items: center;
          padding: 10px 0;
          border-top: 1px solid #e6eee1;
          font-size: 11px;
        }

        .ar-preview-status {
          padding: 5px 7px;
          border-radius: 5px;
          background: #d9efd3;
          color: #236a37;
          font-size: 10px;
          font-weight: 700;
        }

        .ar-features {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 22px;
          padding: 42px 6% 48px;
          background: #f7fbf4;
          text-align: center;
        }

        .ar-feature { padding: 12px 8px; }

        .ar-feature-icon {
          display: grid;
          place-items: center;
          width: 70px;
          height: 70px;
          margin: 0 auto 14px;
          border-radius: 50%;
          background: #dcefd1;
          font-size: 32px;
        }

        .ar-feature h3 {
          margin: 0 0 9px;
          color: #195a37;
          font-size: 19px;
        }

        .ar-feature p {
          margin: 0;
          color: #4b6354;
          font-size: 14px;
          line-height: 1.7;
        }

        .ar-closing {
          position: relative;
          overflow: hidden;
          padding: 33px 20px;
          background: #205737;
          color: white;
          text-align: center;
        }

        .ar-closing p {
          margin: 0;
          font-size: clamp(20px, 3vw, 25px);
          font-style: italic;
          line-height: 1.5;
        }

        .ar-closing small {
          display: block;
          margin-top: 12px;
          color: #b9dda1;
        }

        /* GENERAL PAGES */
        .ar-simple-page {
          min-height: 65vh;
          padding: 70px 20px;
          text-align: center;
        }

        .ar-simple-page h1 { color: #17643b; }
        .ar-simple-page p {
          color: #5d7263;
          line-height: 1.8;
        }

        /* CONTACT US PAGE */
        .ar-contact-page {
          min-height: 75vh;
          padding: 65px 7% 80px;
          text-align: center;
          background:
            radial-gradient(ellipse at top right, #d9edc9, transparent 45%),
            #f6faf3;
        }

        .ar-contact-label {
          display: inline-block;
          padding: 8px 16px;
          margin-bottom: 14px;
          border-radius: 30px;
          background: #e2f2d9;
          color: #26743e;
          font-size: 13px;
          font-weight: 700;
        }

        .ar-contact-page h1 {
          margin: 0 0 14px;
          color: #145b3c;
          font-size: clamp(32px, 5vw, 46px);
        }

        .ar-contact-intro {
          max-width: 600px;
          margin: 0 auto;
          color: #587061;
          font-size: 16px;
          line-height: 1.8;
        }

        .ar-contact-cards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          max-width: 1050px;
          margin: 45px auto 0;
          text-align: center;
        }

        .ar-contact-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px 22px;
          border: 1px solid #e0eadb;
          border-radius: 20px;
          background: #ffffff;
          box-shadow: 0 10px 30px #173d250b;
          transition: transform .2s, box-shadow .2s;
        }

        .ar-contact-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px #173d2518;
        }

        .ar-contact-icon {
          display: grid;
          place-items: center;
          width: 76px;
          height: 76px;
          margin-bottom: 18px;
          border-radius: 22px;
          font-size: 35px;
        }

        .ar-contact-icon.facebook {
          background: #e8efff;
        }

        .ar-contact-icon.gmail {
          background: #fff0eb;
        }

        .ar-contact-icon.phone {
          background: #e4f5e4;
        }

        .ar-contact-card h2 {
          margin: 0 0 10px;
          color: #205737;
          font-size: 22px;
        }

        .ar-contact-card p {
          min-height: 48px;
          margin: 0 0 20px;
          overflow-wrap: anywhere;
          color: #687d6d;
          font-size: 14px;
          line-height: 1.7;
        }

        .ar-contact-link {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          min-height: 46px;
          margin-top: auto;
          padding: 12px 16px;
          border: none;
          border-radius: 30px;
          color: white;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: filter .2s;
        }

        .ar-contact-link:hover { filter: brightness(.92); }

        .ar-contact-link.facebook { background: #1877f2; }
        .ar-contact-link.gmail { background: #d94b3d; }
        .ar-contact-link.phone { background: #238342; }

        .ar-contact-note {
          max-width: 650px;
          margin: 35px auto 0;
          padding: 18px;
          border-radius: 12px;
          background: #eaf4e4;
          color: #42644a;
          font-size: 14px;
          line-height: 1.8;
        }

        .ar-footer {
          padding: 20px;
          background: #16442c;
          color: #dcebd9;
          text-align: center;
          font-size: 12px;
        }

        @media (max-width: 800px) {
          .ar-home-hero {
            grid-template-columns: 1fr;
            padding: 45px 6% 65px;
          }

          .ar-hero-preview {
            max-width: 600px;
            width: 100%;
          }

          .ar-features { grid-template-columns: repeat(2, 1fr); }

          .ar-contact-cards {
            grid-template-columns: 1fr;
            max-width: 430px;
          }

          .ar-contact-card p { min-height: auto; }
        }

        @media (max-width: 520px) {
          .ar-header {
            padding: 10px 15px;
            flex-wrap: wrap;
            gap: 8px;
          }


          .ar-nav {
            width: 100%;
            min-height: 42px;
            height: 42px;
            justify-content: space-between;
            gap: 8px;
          }

          .ar-nav button {
            min-height: 42px;
            font-size: 12px;
          }

          .ar-nav button.active::after { bottom: 0; }

          .ar-hero-logo {
            width: 100%;
            max-width: 360px;
          }

          .ar-hero-content > p { font-size: 15px; }

          .ar-hero-preview {
            padding: 14px;
            border-width: 4px;
          }

          .ar-features {
            gap: 8px;
            padding: 28px 10px;
          }

          .ar-feature h3 { font-size: 16px; }
          .ar-feature p { font-size: 13px; }
          .ar-feature-icon { width: 58px; height: 58px; }

          .ar-preview-row {
            grid-template-columns: 1fr;
            gap: 5px;
          }

          .ar-contact-page { padding: 45px 18px 55px; }
          .ar-contact-cards { gap: 16px; }
          .ar-contact-card { padding: 25px 20px; }
        }
      `}</style>

      {/* NAVIGATION BAR */}
      <header className="ar-header">
        <button
          className="ar-logo"
          onClick={() => navigateTo("Home")}
          aria-label="Go to Home"
        >
          <img
            src="/agriroute-logo.png"
            alt="AgriRoute Logo"
            className="ar-logo-image"
          />
        </button>

        <nav className="ar-nav" aria-label="Main navigation">
          {["Home", "Harvest Log", "About", "Contact"].map((item) => (
            <button
              key={item}
              className={page === item ? "active" : ""}
              onClick={() => navigateTo(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>

      {/* HOME PAGE */}
      {page === "Home" && (
        <main>
          <section className="ar-home-hero">
            <div className="ar-hero-content">
              <div className="ar-big-logo">
                <img
                  src="/agriroute-logo.png"
                  alt="AgriRoute Logo"
                  className="ar-hero-logo"
                />
              </div>

              <h1>Smarter Harvests. Stronger Communities.</h1>

              <p>
                AgriRoute helps local farmers track their harvests,
                manage deliveries, and keep their records organized —
                all in one simple system.
              </p>

              <button
                className="ar-primary-btn"
                onClick={() => navigateTo("Harvest Log")}
              >
                Go to Harvest Log <span>→</span>
              </button>
            </div>

            <div className="ar-hero-preview">
              <div className="ar-preview-top">
                <span>Harvest Overview</span>
                <span className="ar-live">● SAMPLE DATA</span>
              </div>

              <div className="ar-preview-stats">
                <div className="ar-stat">
                  <small>Harvest batches</small>
                  <strong>04</strong>
                </div>
                <div className="ar-stat">
                  <small>In transit</small>
                  <strong>01</strong>
                </div>
                <div className="ar-stat">
                  <small>Delivered</small>
                  <strong>02</strong>
                </div>
              </div>

              <h3 className="ar-preview-title">
                Current Harvests &amp; Shipment Status
              </h3>

              <div className="ar-preview-row">
                <strong>Jose Mercado</strong>
                <span>Tomatoes · 500 kg</span>
                <span className="ar-preview-status">Packed</span>
              </div>

              <div className="ar-preview-row">
                <strong>Maria Cruz</strong>
                <span>Rice · 2,100 kg</span>
                <span
                  className="ar-preview-status"
                  style={{ background: "#fff0bd", color: "#775700" }}
                >
                  On the Way
                </span>
              </div>

              <div className="ar-preview-row">
                <strong>Maria Cruz</strong>
                <span>Corn · 2,000 kg</span>
                <span className="ar-preview-status">Delivered</span>
              </div>

              <button
                className="ar-primary-btn"
                style={{ width: "100%", marginTop: 14, borderRadius: 8 }}
                onClick={() => navigateTo("Harvest Log")}
              >
                + Record a Harvest
              </button>
            </div>
          </section>

          <section className="ar-features">
            <article className="ar-feature">
              <div className="ar-feature-icon">🌿</div>
              <h3>Track Harvests</h3>
              <p>Easily log and monitor your harvest batches.</p>
            </article>

            <article className="ar-feature">
              <div className="ar-feature-icon">🚚</div>
              <h3>Manage Deliveries</h3>
              <p>Keep track of buyers, quantities, and delivery status.</p>
            </article>

            <article className="ar-feature">
              <div className="ar-feature-icon">📋</div>
              <h3>Organize Records</h3>
              <p>View harvest records and shipment reports anytime.</p>
            </article>

            <article className="ar-feature">
              <div className="ar-feature-icon">👨‍🌾</div>
              <h3>Support Local Farmers</h3>
              <p>Build a stronger and more connected community.</p>
            </article>
          </section>

          <section className="ar-closing">
            <p>
              Together for a more productive
              <br />
              and sustainable future.
            </p>
            <small>🌱 ─────────── 🌱</small>
          </section>
        </main>
      )}

      {/* HARVEST LOG PAGE */}
      {page === "Harvest Log" && <HarvestLog />}

      {/* ABOUT PAGE */}
      {page === "About" && (
        <main className="ar-simple-page">
          <h1>About AgriRoute</h1>
          <p>
            AgriRoute helps farming cooperatives record harvests,
            monitor deliveries, and organize their agricultural records.
          </p>

          <button
            className="ar-primary-btn"
            onClick={() => navigateTo("Harvest Log")}
          >
            Explore Harvest Log →
          </button>
        </main>
      )}

      {/* CONTACT PAGE */}
      {page === "Contact" && (
        <main className="ar-contact-page">
          <span className="ar-contact-label">WE'RE HERE TO HELP</span>

          <h1>Contact Us</h1>

          <p className="ar-contact-intro">
            Have questions about AgriRoute, harvest records, or delivery
            coordination? Get in touch with us using any of the options below.
          </p>

          <section className="ar-contact-cards">
            {/* FACEBOOK */}
            <article className="ar-contact-card">
              <div className="ar-contact-icon facebook">📘</div>

              <h2>Facebook</h2>

              <p>
                Visit our Facebook page to connect with our team and send
                us a message.
              </p>

              <a
                className="ar-contact-link facebook"
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Facebook →
              </a>
            </article>

            {/* GMAIL */}
            <article className="ar-contact-card">
              <div className="ar-contact-icon gmail">✉️</div>

              <h2>Gmail</h2>

              <p>
                Send us an email for questions, feedback, or assistance.
              </p>

              <a
                className="ar-contact-link gmail"
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Email Us →
              </a>
            </article>

            {/* PHONE */}
            <article className="ar-contact-card">
              <div className="ar-contact-icon phone">📞</div>

              <h2>Phone</h2>

              <p>
                Call us directly if you need assistance with your harvest
                records or deliveries.
              </p>

              <a
                className="ar-contact-link phone"
                href={`tel:${phoneNumber.replace(/[^\d+]/g, "")}`}
              >
                Call Us →
              </a>
            </article>
          </section>

          <div className="ar-contact-note">
            <strong>AgriRoute Support 🌱</strong>
            <br />
            We're committed to helping farmers keep their harvest records
            organized and their deliveries on track.
          </div>

          <button
            className="ar-primary-btn"
            style={{ marginTop: 30 }}
            onClick={() => navigateTo("Home")}
          >
            ← Back to Home
          </button>
        </main>
      )}

      {/* FOOTER */}
      <footer className="ar-footer">
        © {new Date().getFullYear()} AgriRoute · Local Cooperative Harvest Log
      </footer>
    </>
  );
}
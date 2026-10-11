
import { useMemo, useState } from "react";

const STORAGE_KEY = "agriroute-harvest-records-v1";

const sampleRecords = [
  {
    id: 1,
    farmer: "Jose Mercado",
    phone: "09171234567",
    email: "jose@example.com",
    crop: "Tomatoes",
    quantity: 500,
    buyer: "SM Market",
    status: "Packed",
    loggedAt: "09:00"
  },
  {
    id: 2,
    farmer: "Maria Cruz",
    phone: "09181234567",
    email: "maria@example.com",
    crop: "Rice",
    quantity: 2100,
    buyer: "Puregold",
    status: "On the Way",
    loggedAt: "09:00"
  },
  {
    id: 3,
    farmer: "Maria Cruz",
    phone: "09181234567",
    email: "maria@example.com",
    crop: "Corn",
    quantity: 2000,
    buyer: "Puregold",
    status: "Delivered",
    loggedAt: "09:00"
  },
  {
    id: 4,
    farmer: "Jose Cruz",
    phone: "09191234567",
    email: "josecruz@example.com",
    crop: "Tomatoes",
    quantity: 2100,
    buyer: "Puregold",
    status: "Delivered",
    loggedAt: "09:00"
  }
];

const emptyForm = {
  farmer: "",
  phone: "",
  email: "",
  crop: "Tomatoes",
  quantity: "",
  buyer: ""
};

const statuses = ["Packed", "On the Way", "Delivered"];

function loadRecords() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : sampleRecords;
    }
  } catch (error) {
    console.error("Could not load harvest records:", error);
  }

  return sampleRecords;
}

export default function HarvestLog() {
  const [records, setRecords] = useState(loadRecords);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [qrRecord, setQrRecord] = useState(null);
  const [notice, setNotice] = useState("");

  function saveRecords(nextRecords) {
    setRecords(nextRecords);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextRecords)
      );
    } catch (error) {
      console.error("Could not save harvest records:", error);
      setNotice("Unable to save data in this browser.");
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function addHarvest(event) {
    event.preventDefault();

    const quantity = Number(form.quantity);
    const phone = form.phone.trim();
    const email = form.email.trim();

    if (
      !form.farmer.trim() ||
      !phone ||
      !form.buyer.trim()
    ) {
      setNotice(
        "Please enter the farmer name, contact number, and buyer."
      );
      return;
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) {
      setNotice("Please enter a valid contact number.");
      return;
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setNotice("Please enter a valid email address.");
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setNotice("Please enter a quantity greater than zero.");
      return;
    }

    const newRecord = {
      id: Date.now(),
      farmer: form.farmer.trim(),
      phone,
      email,
      crop: form.crop,
      quantity,
      buyer: form.buyer.trim(),
      status: "Packed",
      loggedAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })
    };

    saveRecords([newRecord, ...records]);
    setForm(emptyForm);
    setFilter("All");
    setSearch("");
    setNotice("Harvest batch and farmer contact added successfully.");
  }

  function changeStatus(id, status) {
    const updated = records.map((record) =>
      record.id === id ? { ...record, status } : record
    );

    saveRecords(updated);
    setNotice("Shipment status updated successfully.");
  }

  function deleteHarvest(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this harvest record?"
    );

    if (!confirmed) return;

    saveRecords(records.filter((record) => record.id !== id));
    setNotice("Harvest record deleted.");
  }

  function resetSampleData() {
    const confirmed = window.confirm(
      "Replace your current records with the sample records?"
    );

    if (!confirmed) return;

    saveRecords(sampleRecords);
    setSearch("");
    setFilter("All");
    setNotice("Sample records restored.");
  }

  const counts = useMemo(
    () => ({
      All: records.length,
      Packed: records.filter((r) => r.status === "Packed").length,
      "On the Way": records.filter(
        (r) => r.status === "On the Way"
      ).length,
      Delivered: records.filter(
        (r) => r.status === "Delivered"
      ).length
    }),
    [records]
  );

  const totalQuantity = records.reduce(
    (sum, record) => sum + Number(record.quantity || 0),
    0
  );

  const visibleRecords = useMemo(() => {
    const term = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch = [
        record.farmer,
        record.phone,
        record.email,
        record.crop,
        record.buyer,
        record.status
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );

      const matchesFilter =
        filter === "All" || record.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [records, search, filter]);

  function downloadCSV() {
    const columns = [
      "Farmer Name",
      "Contact Number",
      "Email Address",
      "Crop Type",
      "Quantity (kg)",
      "Buyer",
      "Logged Time",
      "Status"
    ];

    const rows = records.map((r) => [
      r.farmer,
      r.phone || "",
      r.email || "",
      r.crop,
      r.quantity,
      r.buyer,
      r.loggedAt,
      r.status
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [columns, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "agriroute-harvest-records.csv";
    link.click();

    URL.revokeObjectURL(url);
    setNotice("Harvest records exported to CSV.");
  }

  function openSummary(record) {
    setQrRecord(record);
  }

  const qrText = qrRecord
    ? [
        "AgriRoute Harvest Summary",
        `Farmer: ${qrRecord.farmer}`,
        `Contact Number: ${qrRecord.phone || "Not provided"}`,
        `Email: ${qrRecord.email || "Not provided"}`,
        `Crop: ${qrRecord.crop}`,
        `Quantity: ${qrRecord.quantity} kg`,
        `Buyer: ${qrRecord.buyer}`,
        `Status: ${qrRecord.status}`,
        `Logged: ${qrRecord.loggedAt}`
      ].join("\n")
    : "";

  const qrUrl = qrRecord
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrText)}`
    : "";

  return (
    <>
      <style>{`
        .hl-page {
          max-width: 1500px;
          margin: 0 auto;
          padding: 35px clamp(14px, 4vw, 48px) 55px;
          color: #1d392a;
          background: #f5f8f3;
          min-height: 75vh;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }

        .hl-page * { box-sizing: border-box; }

        .hl-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 24px;
        }

        .hl-eyebrow {
          margin: 0 0 7px;
          color: #32804a;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .hl-heading h1 {
          margin: 0;
          color: #174c31;
          font-size: clamp(25px, 3.2vw, 36px);
          line-height: 1.3;
        }

        .hl-heading p:last-child {
          margin: 9px 0 0;
          color: #6b7c6e;
          font-size: 14px;
          line-height: 1.6;
        }

        .hl-total-badge {
          padding: 11px 15px;
          border: 1px solid #d8e8d1;
          border-radius: 9px;
          background: #e9f4e4;
          color: #22623a;
          font-size: 13px;
          font-weight: 700;
        }

        .hl-panel {
          margin-bottom: 22px;
          padding: clamp(16px, 2.5vw, 25px);
          border: 1px solid #dfe8dc;
          border-radius: 13px;
          background: white;
          box-shadow: 0 5px 20px #24492b08;
        }

        .hl-panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
        }

        .hl-panel-heading h2 {
          margin: 0;
          color: #183f2b;
          font-size: 20px;
        }

        .hl-panel-heading p {
          margin: 5px 0 0;
          color: #7b8c7e;
          font-size: 12px;
          line-height: 1.6;
        }

        .hl-form {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .hl-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #344f3e;
          font-size: 12px;
          font-weight: 700;
        }

        .hl-field input,
        .hl-field select,
        .hl-search,
        .hl-filter {
          width: 100%;
          min-width: 0;
          min-height: 43px;
          padding: 10px 12px;
          border: 1px solid #d5e0d2;
          border-radius: 7px;
          outline: none;
          color: #263d2e;
          background: #fcfefb;
          font-size: 13px;
        }

        .hl-field input:focus,
        .hl-field select:focus,
        .hl-search:focus,
        .hl-filter:focus {
          border-color: #4d9b5b;
          box-shadow: 0 0 0 3px #4d9b5b18;
        }

        .hl-primary,
        .hl-secondary,
        .hl-danger,
        .hl-qr-button {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 15px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s;
        }

        .hl-primary {
          border: 1px solid #248044;
          background: #248044;
          color: white;
        }

        .hl-primary:hover { background: #176333; }

        .hl-secondary {
          border: 1px solid #d7e4d3;
          background: #f5faf2;
          color: #285b37;
        }

        .hl-secondary:hover { background: #e9f4e4; }

        .hl-danger {
          border: 1px solid #efd6d3;
          background: #fff8f7;
          color: #a63c35;
        }

        .hl-danger:hover { background: #ffebea; }

        .hl-form .hl-primary {
          grid-column: 1 / -1;
          min-height: 45px;
        }

        .hl-notice {
          margin: 15px 0 0;
          padding: 11px 13px;
          border-radius: 7px;
          background: #edf7e8;
          color: #28683a;
          font-size: 13px;
          line-height: 1.5;
        }

        .hl-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 22px;
        }

        .hl-stat-card {
          padding: 18px;
          border: 1px solid #dfe8dc;
          border-radius: 11px;
          background: white;
        }

        .hl-stat-card span {
          display: block;
          color: #6b7c6e;
          font-size: 12px;
        }

        .hl-stat-card strong {
          display: block;
          margin-top: 8px;
          color: #1d6138;
          font-size: 25px;
        }

        .hl-stat-card small {
          display: block;
          margin-top: 5px;
          color: #879588;
          font-size: 11px;
        }

        .hl-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 17px;
        }

        .hl-toolbar-left {
          display: flex;
          flex: 1;
          min-width: 220px;
          gap: 10px;
        }

        .hl-search { flex: 1; }

        .hl-filter {
          width: auto;
          min-width: 145px;
        }

        .hl-toolbar-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .hl-filter-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .hl-tab {
          padding: 8px 12px;
          border: 1px solid #dfe8dc;
          border-radius: 20px;
          background: white;
          color: #526958;
          font-size: 12px;
          cursor: pointer;
        }

        .hl-tab.active {
          border-color: #267a41;
          background: #e7f3e1;
          color: #1e6537;
          font-weight: 700;
        }

        .hl-table-wrap {
          overflow-x: auto;
          border: 1px solid #e4ebe1;
          border-radius: 8px;
        }

        .hl-table {
          width: 100%;
          min-width: 1250px;
          border-collapse: collapse;
          text-align: left;
          font-size: 12px;
        }

        .hl-table th {
          padding: 14px 12px;
          background: #eef5e9;
          color: #365441;
          font-weight: 700;
          white-space: nowrap;
        }

        .hl-table td {
          padding: 13px 12px;
          border-top: 1px solid #e8eee5;
          color: #415748;
          white-space: nowrap;
          vertical-align: middle;
        }

        .hl-table tbody tr:hover { background: #fbfdf9; }

        .hl-farmer {
          color: #1d432c;
          font-weight: 700;
        }

        .hl-contact {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 150px;
        }

        .hl-contact a {
          color: #267444;
          text-decoration: none;
          font-size: 12px;
        }

        .hl-contact a:hover { text-decoration: underline; }

        .hl-contact small {
          color: #819083;
          font-size: 11px;
        }

        .hl-status {
          max-width: 140px;
          padding: 7px 9px;
          border: 1px solid transparent;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .hl-status.packed,
        .hl-status.delivered {
          background: #e0f1d9;
          color: #246a36;
        }

        .hl-status.on-the-way {
          background: #fff0bd;
          color: #755600;
        }

        .hl-qr-button {
          min-height: 32px;
          padding: 7px 9px;
          border: 1px solid #dce8d7;
          background: #f8fcf6;
          color: #28623a;
        }

        .hl-empty {
          padding: 40px 15px !important;
          color: #7b8c7e !important;
          text-align: center;
          white-space: normal !important;
        }

        .hl-footnote {
          margin: 15px 0 0;
          color: #7b8c7e;
          font-size: 11px;
          line-height: 1.6;
        }

        .hl-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: grid;
          place-items: center;
          padding: 20px;
          background: #102b1f9c;
          overflow-y: auto;
        }

        .hl-modal {
          width: 100%;
          max-width: 420px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 24px;
          border-radius: 14px;
          background: white;
          text-align: center;
          box-shadow: 0 20px 60px #0003;
        }

        .hl-modal h2 {
          margin: 0 0 8px;
          color: #1c5d36;
          font-size: 22px;
        }

        .hl-modal > p {
          color: #637667;
          font-size: 13px;
          line-height: 1.6;
        }

        .hl-modal img {
          display: block;
          width: 220px;
          height: 220px;
          max-width: 100%;
          margin: 15px auto;
          border: 1px solid #e1e9de;
          border-radius: 6px;
        }

        .hl-qr-details {
          padding: 12px;
          border-radius: 8px;
          background: #f3f8ef;
          color: #385641;
          font-size: 12px;
          line-height: 1.9;
          text-align: left;
          overflow-wrap: anywhere;
        }

        .hl-qr-details a {
          color: #267444;
        }

        .hl-modal-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }

        @media (max-width: 850px) {
          .hl-form { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .hl-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 520px) {
          .hl-page { padding: 24px 12px 35px; }
          .hl-form { grid-template-columns: 1fr; }
          .hl-form .hl-primary { grid-column: auto; }
          .hl-stats { gap: 8px; }
          .hl-stat-card { padding: 13px; }
          .hl-stat-card strong { font-size: 21px; }
          .hl-toolbar-left { flex-direction: column; min-width: 100%; }
          .hl-filter { width: 100%; }
          .hl-toolbar-actions { width: 100%; }
          .hl-toolbar-actions button { flex: 1; }
          .hl-panel-heading h2 { font-size: 18px; }
        }

        @media print {
          body * { visibility: hidden; }
          .hl-modal, .hl-modal * { visibility: visible; }
          .hl-modal-backdrop {
            position: absolute;
            background: white;
          }
          .hl-modal { box-shadow: none; }
          .hl-modal-actions { display: none; }
        }
      `}</style>

      <main className="hl-page">
        <header className="hl-heading">
          <div>
            <p className="hl-eyebrow">
              AGRiROUTE · COOPERATIVE DASHBOARD
            </p>
            <h1>Local Cooperative Harvest Log</h1>
            <p>
              Record harvest batches, farmer contact details,
              and monitor shipment progress.
            </p>
          </div>

          <div className="hl-total-badge">
            🌱 {records.length} harvest record
            {records.length === 1 ? "" : "s"}
          </div>
        </header>

        <section className="hl-stats">
          <article className="hl-stat-card">
            <span>Total Batches</span>
            <strong>{counts.All}</strong>
            <small>Recorded harvest entries</small>
          </article>

          <article className="hl-stat-card">
            <span>Total Quantity</span>
            <strong>{totalQuantity.toLocaleString()}</strong>
            <small>Kilograms recorded</small>
          </article>

          <article className="hl-stat-card">
            <span>On the Way</span>
            <strong>{counts["On the Way"]}</strong>
            <small>Shipments in transit</small>
          </article>

          <article className="hl-stat-card">
            <span>Delivered</span>
            <strong>{counts.Delivered}</strong>
            <small>Completed deliveries</small>
          </article>
        </section>

        <section className="hl-panel">
          <div className="hl-panel-heading">
            <div>
              <h2>Log New Harvest Batch</h2>
              <p>
                Enter the farmer's contact details and harvest
                information. The contact number is required.
              </p>
            </div>
          </div>

          <form className="hl-form" onSubmit={addHarvest}>
            <label className="hl-field">
              Farmer Name
              <input
                name="farmer"
                value={form.farmer}
                onChange={handleChange}
                placeholder="e.g. Jose Mercado"
                maxLength={100}
                autoComplete="name"
                required
              />
            </label>

            <label className="hl-field">
              Contact Number
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 09171234567"
                maxLength={20}
                autoComplete="tel"
                aria-label="Farmer contact number"
                required
              />
            </label>

            <label className="hl-field">
              Email Address (Optional)
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. farmer@email.com"
                maxLength={150}
                autoComplete="email"
              />
            </label>

            <label className="hl-field">
              Crop Type
              <select
                name="crop"
                value={form.crop}
                onChange={handleChange}
              >
                <option>Tomatoes</option>
                <option>Rice</option>
                <option>Corn</option>
                <option>Carrots</option>
                <option>Potatoes</option>
                <option>Leafy Greens</option>
                <option>Bananas</option>
                <option>Other</option>
              </select>
            </label>

            <label className="hl-field">
              Quantity (kg)
              <input
                name="quantity"
                type="number"
                min="0.1"
                step="0.1"
                value={form.quantity}
                onChange={handleChange}
                placeholder="500"
                required
              />
            </label>

            <label className="hl-field">
              Recipient / Buyer
              <input
                name="buyer"
                value={form.buyer}
                onChange={handleChange}
                placeholder="e.g. SM Market"
                maxLength={100}
                required
              />
            </label>

            <button className="hl-primary" type="submit">
              ＋ Add Harvest to Table
            </button>
          </form>

          {notice && (
            <p className="hl-notice" role="status">
              {notice}
            </p>
          )}
        </section>

        <section className="hl-panel">
          <div className="hl-panel-heading">
            <div>
              <h2>Current Harvests & Shipment Status</h2>
              <p>
                View farmer contact information and update each
                shipment as it moves from packing to delivery.
              </p>
            </div>
          </div>

          <div className="hl-toolbar">
            <div className="hl-toolbar-left">
              <input
                className="hl-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="⌕ Search name, phone, email, crop..."
                aria-label="Search harvest records"
              />

              <select
                className="hl-filter"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                aria-label="Filter shipment status"
              >
                <option value="All">All statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="hl-toolbar-actions">
              <button
                className="hl-secondary"
                type="button"
                onClick={downloadCSV}
              >
                ↓ Export CSV
              </button>

              <button
                className="hl-secondary"
                type="button"
                onClick={resetSampleData}
              >
                ↻ Reset Samples
              </button>
            </div>
          </div>

          <div className="hl-filter-tabs">
            {["All", ...statuses].map((status) => (
              <button
                key={status}
                type="button"
                className={`hl-tab ${filter === status ? "active" : ""}`}
                onClick={() => setFilter(status)}
              >
                {status} ({counts[status]})
              </button>
            ))}
          </div>

          <div className="hl-table-wrap">
            <table className="hl-table">
              <thead>
                <tr>
                  <th>Farmer Name</th>
                  <th>Contact Information</th>
                  <th>Crop Type</th>
                  <th>Quantity (kg)</th>
                  <th>Buyer</th>
                  <th>Logged Time</th>
                  <th>Shipment Status</th>
                  <th>Summary QR</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {visibleRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="hl-farmer">
                      {record.farmer}
                    </td>

                    <td>
                      <div className="hl-contact">
                        {record.phone ? (
                          <a href={`tel:${record.phone}`}>
                            ☎ {record.phone}
                          </a>
                        ) : (
                          <small>No phone provided</small>
                        )}

                        {record.email ? (
                          <a href={`mailto:${record.email}`}>
                            ✉ {record.email}
                          </a>
                        ) : (
                          <small>No email provided</small>
                        )}
                      </div>
                    </td>

                    <td>{record.crop}</td>

                    <td>
                      {Number(record.quantity).toLocaleString()}
                    </td>

                    <td>{record.buyer}</td>

                    <td>{record.loggedAt || "—"}</td>

                    <td>
                      <select
                        aria-label={`Status for ${record.farmer}`}
                        className={`hl-status ${record.status.toLowerCase().replaceAll(" ", "-")}`}
                        value={record.status}
                        onChange={(event) =>
                          changeStatus(record.id, event.target.value)
                        }
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <button
                        className="hl-qr-button"
                        type="button"
                        onClick={() => openSummary(record)}
                      >
                        ▦ Summary QR
                      </button>
                    </td>

                    <td>
                      <button
                        className="hl-danger"
                        type="button"
                        onClick={() => deleteHarvest(record.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {visibleRecords.length === 0 && (
                  <tr>
                    <td colSpan="9" className="hl-empty">
                      No harvest records match your search.
                      Try another keyword or change the status filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="hl-footnote">
            Harvest information and contact details are stored in this
            browser using localStorage. Export a CSV backup regularly.
            Contact details are visible to people who can access this
            dashboard, so use real personal information only when
            authorized.
          </p>
        </section>
      </main>

      {qrRecord && (
        <div
          className="hl-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setQrRecord(null);
            }
          }}
        >
          <section
            className="hl-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hl-qr-title"
          >
            <h2 id="hl-qr-title">Harvest Summary QR</h2>

            <p>
              Scan this QR code to read the summary for this harvest
              batch, including the farmer's contact information.
            </p>

            <img
              src={qrUrl}
              alt="QR code containing the harvest summary and contact details"
            />

            <div className="hl-qr-details">
              <strong>Farmer:</strong> {qrRecord.farmer}
              <br />

              <strong>Contact Number:</strong>{" "}
              {qrRecord.phone || "Not provided"}
              <br />

              <strong>Email:</strong>{" "}
              {qrRecord.email || "Not provided"}
              <br />

              <strong>Crop:</strong> {qrRecord.crop}
              <br />

              <strong>Quantity:</strong>{" "}
              {Number(qrRecord.quantity).toLocaleString()} kg
              <br />

              <strong>Buyer:</strong> {qrRecord.buyer}
              <br />

              <strong>Status:</strong> {qrRecord.status}
              <br />

              <strong>Logged:</strong> {qrRecord.loggedAt || "—"}
            </div>

            <div className="hl-modal-actions">
              <button
                className="hl-primary"
                type="button"
                onClick={() => window.print()}
              >
                Print Summary
              </button>

              <button
                className="hl-secondary"
                type="button"
                onClick={() => setQrRecord(null)}
              >
                Close
              </button>
            </div>

            <p className="hl-footnote">
              QR generation requires an internet connection. The QR
              contains personal contact details, so share it only
              with authorized recipients.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
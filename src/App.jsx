import { useEffect, useMemo, useState } from 'react';

const FABRICS = ['All', 'Silk', 'Cotton', 'Chiffon', 'Georgette'];
const REGIONS = ['All', 'Banarasi', 'Kanjeevaram', 'Chanderi', 'Patola'];
const PAYMENT_METHODS = ['Cash', 'Venmo', 'Zelle', 'UPI'];

const STORAGE_KEYS = {
  saris: 'uma-saris-catalog',
  sales: 'uma-saris-sales',
};

const sampleSaris = [
  { id: 1, name: 'Banarasi', fabric: 'Silk', region: 'Banarasi', priceMin: 130, priceMax: 180, quantity: 3, reserved: false, imageData: '' },
  { id: 2, name: 'Kanjeevaram', fabric: 'Silk', region: 'Kanjeevaram', priceMin: 200, priceMax: 250, quantity: 2, reserved: false, imageData: '' },
  { id: 3, name: 'Chanderi', fabric: 'Cotton', region: 'Chanderi', priceMin: 45, priceMax: 95, quantity: 5, reserved: false, imageData: '' },
  { id: 4, name: 'Patola', fabric: 'Silk', region: 'Patola', priceMin: 270, priceMax: 320, quantity: 1, reserved: false, imageData: '' },
  { id: 5, name: 'Georgette', fabric: 'Georgette', region: 'Chanderi', priceMin: 70, priceMax: 120, quantity: 4, reserved: false, imageData: '' },
  { id: 6, name: 'Chiffon', fabric: 'Chiffon', region: 'Banarasi', priceMin: 95, priceMax: 145, quantity: 0, reserved: false, imageData: '' },
];

const sampleSales = [
  { id: 1, sariId: 1, sari: 'Banarasi', buyer: 'Aunty Meena', qty: 1, actualPrice: 165, method: 'Zelle', date: '2026-04-28' },
  { id: 2, sariId: 5, sari: 'Georgette', buyer: 'Priya Sharma', qty: 2, actualPrice: 210, method: 'Cash', date: '2026-04-30' },
  { id: 3, sariId: 3, sari: 'Chanderi', buyer: 'Sunita Patel', qty: 1, actualPrice: 80, method: 'Venmo', date: '2026-05-01' },
];

function SariPlaceholder() {
  return (
    <div className="placeholder-wrap">
      <svg viewBox="0 0 120 120" width="100%" height="100%" className="placeholder-svg" aria-hidden="true">
        <defs>
          <pattern id="paisleyTile" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 4 L36 20 L20 36 L4 20 Z" fill="none" stroke="#6B5744" strokeWidth="0.8" opacity="0.4" />
            <path d="M20 10 L30 20 L20 30 L10 20 Z" fill="none" stroke="#6B5744" strokeWidth="0.6" opacity="0.3" />
            <circle cx="20" cy="20" r="2" fill="#6B5744" opacity="0.35" />
            <circle cx="0" cy="0" r="1.2" fill="#6B5744" opacity="0.25" />
            <circle cx="40" cy="0" r="1.2" fill="#6B5744" opacity="0.25" />
            <circle cx="0" cy="40" r="1.2" fill="#6B5744" opacity="0.25" />
            <circle cx="40" cy="40" r="1.2" fill="#6B5744" opacity="0.25" />
          </pattern>
        </defs>
        <rect width="120" height="120" fill="#EDE8E1" />
        <rect width="120" height="120" fill="url(#paisleyTile)" />
      </svg>
    </div>
  );
}

function SariImage({ sari }) {
  if (sari.imageData) {
    return <img src={sari.imageData} alt={sari.name} className="sari-image" />;
  }

  return <SariPlaceholder />;
}

function StatusBadge({ sari }) {
  const status = sari.quantity === 0 ? 'SOLD OUT' : sari.reserved ? 'RESERVED' : 'AVAILABLE';

  if (status === 'SOLD OUT') {
    return <span className="badge sold-out">SOLD OUT</span>;
  }

  if (status === 'RESERVED') {
    return <span className="badge reserved">RESERVED</span>;
  }

  return <span className="badge available">AVAILABLE</span>;
}

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    if (!value) {
      return fallback;
    }
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function formatSaleDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

function nextId(list) {
  if (!list.length) {
    return 1;
  }

  return Math.max(...list.map((item) => item.id)) + 1;
}

function AddSariModal({ isOpen, onClose, onSave, editTarget = null }) {
  const [form, setForm] = useState({
    name: '',
    fabric: 'Silk',
    region: 'Banarasi',
    priceMin: '',
    priceMax: '',
    quantity: '',
    imageData: '',
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (editTarget) {
      setForm({
        name: editTarget.name,
        fabric: editTarget.fabric,
        region: editTarget.region,
        priceMin: String(editTarget.priceMin),
        priceMax: String(editTarget.priceMax),
        quantity: String(editTarget.quantity),
        imageData: editTarget.imageData || '',
      });
    } else {
      setForm({
        name: '',
        fabric: 'Silk',
        region: 'Banarasi',
        priceMin: '',
        priceMax: '',
        quantity: '',
        imageData: '',
      });
    }
  }, [isOpen, editTarget]);

  if (!isOpen) {
    return null;
  }

  const onFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, imageData: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  };

  const submit = (event) => {
    event.preventDefault();

    const priceMin = Number(form.priceMin);
    const priceMax = Number(form.priceMax);
    const quantity = Number(form.quantity);

    if (!form.name.trim() || Number.isNaN(priceMin) || Number.isNaN(priceMax) || Number.isNaN(quantity)) {
      return;
    }

    if (priceMin > priceMax || quantity < 0) {
      return;
    }

    onSave({
      name: form.name.trim(),
      fabric: form.fabric,
      region: form.region,
      priceMin,
      priceMax,
      quantity,
      reserved: false,
      imageData: form.imageData,
    });

    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(event) => event.stopPropagation()}>
        <h2 className="modal-title">{editTarget ? 'Edit Sari' : 'Add New Sari'}</h2>
        <form onSubmit={submit} className="form-grid">
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="e.g. Banarasi"
            />
          </label>
          <label>
            Fabric
            <select value={form.fabric} onChange={(event) => setForm((prev) => ({ ...prev, fabric: event.target.value }))}>
              {FABRICS.filter((item) => item !== 'All').map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Region
            <select value={form.region} onChange={(event) => setForm((prev) => ({ ...prev, region: event.target.value }))}>
              {REGIONS.filter((item) => item !== 'All').map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Min Price ($)
            <input
              required
              type="number"
              min="0"
              value={form.priceMin}
              onChange={(event) => setForm((prev) => ({ ...prev, priceMin: event.target.value }))}
            />
          </label>
          <label>
            Max Price ($)
            <input
              required
              type="number"
              min="0"
              value={form.priceMax}
              onChange={(event) => setForm((prev) => ({ ...prev, priceMax: event.target.value }))}
            />
          </label>
          <label>
            Quantity
            <input
              required
              type="number"
              min="0"
              value={form.quantity}
              onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
            />
          </label>
          <label>
            Optional Photo
            <input type="file" accept="image/*" onChange={onFile} />
          </label>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{editTarget ? 'Update Sari' : 'Save Sari'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SaleModal({ isOpen, saris, selectedSariId, onClose, onSave, editTarget = null }) {
  const [form, setForm] = useState({
    sariId: selectedSariId || '',
    buyer: '',
    qty: '1',
    actualPrice: '',
    method: 'Cash',
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (editTarget) {
      setForm({
        sariId: String(editTarget.sariId),
        buyer: editTarget.buyer,
        qty: String(editTarget.qty),
        actualPrice: String(editTarget.actualPrice),
        method: editTarget.method,
        date: editTarget.date,
      });
    } else {
      setForm({
        sariId: selectedSariId || String(saris.find((item) => item.quantity > 0)?.id || ''),
        buyer: '',
        qty: '1',
        actualPrice: '',
        method: 'Cash',
        date: new Date().toISOString().slice(0, 10),
      });
    }
  }, [isOpen, saris, selectedSariId, editTarget]);

  if (!isOpen) {
    return null;
  }

  const availableSaris = editTarget
    ? saris
    : saris.filter((item) => item.quantity > 0);
  const sari = saris.find((item) => String(item.id) === String(form.sariId));
  const maxQty = sari
    ? sari.quantity + (editTarget && editTarget.sariId === sari.id ? editTarget.qty : 0)
    : 1;

  const submit = (event) => {
    event.preventDefault();

    const qty = Number(form.qty);
    const actualPrice = Number(form.actualPrice);

    if (!form.buyer.trim() || !form.sariId || Number.isNaN(qty) || Number.isNaN(actualPrice) || qty <= 0 || !form.date) {
      return;
    }

    if (!sari || qty > sari.quantity) {
      return;
    }

    onSave({
      sariId: Number(form.sariId),
      sari: sari.name,
      buyer: form.buyer.trim(),
      qty,
      actualPrice,
      method: form.method,
      date: form.date,
    });

    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(event) => event.stopPropagation()}>
        <h2 className="modal-title">{editTarget ? 'Edit Sale' : 'Log New Sale'}</h2>
        <form onSubmit={submit} className="form-grid">
          <label>
            Sari
            <select
              required
              value={form.sariId}
              onChange={(event) => setForm((prev) => ({ ...prev, sariId: event.target.value }))}
            >
              <option value="">Select sari</option>
              {availableSaris.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.quantity} in stock)
                </option>
              ))}
            </select>
          </label>
          <label>
            Buyer Name
            <input
              required
              value={form.buyer}
              onChange={(event) => setForm((prev) => ({ ...prev, buyer: event.target.value }))}
              placeholder="e.g. Priya Sharma"
            />
          </label>
          <label>
            Quantity
            <input
              required
              type="number"
              min="1"
              max={maxQty}
              value={form.qty}
              onChange={(event) => setForm((prev) => ({ ...prev, qty: event.target.value }))}
            />
          </label>
          <label>
            Actual Sale Price ($)
            <input
              required
              type="number"
              min="1"
              value={form.actualPrice}
              onChange={(event) => setForm((prev) => ({ ...prev, actualPrice: event.target.value }))}
            />
          </label>
          <label>
            Payment Method
            <select value={form.method} onChange={(event) => setForm((prev) => ({ ...prev, method: event.target.value }))}>
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input
              required
              type="date"
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
            />
          </label>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{editTarget ? 'Update Sale' : 'Save Sale'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('catalog');
  const [fabric, setFabric] = useState('All');
  const [region, setRegion] = useState('All');
  const [selected, setSelected] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [quickSaleSariId, setQuickSaleSariId] = useState('');
  const [editSariTarget, setEditSariTarget] = useState(null);
  const [editSaleTarget, setEditSaleTarget] = useState(null);

  const [saris, setSaris] = useState(() => readStorage(STORAGE_KEYS.saris, sampleSaris));
  const [sales, setSales] = useState(() => readStorage(STORAGE_KEYS.sales, sampleSales));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.saris, JSON.stringify(saris));
  }, [saris]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    if (!selected) {
      return;
    }

    const fresh = saris.find((item) => item.id === selected.id);
    if (!fresh) {
      setSelected(null);
      return;
    }

    if (fresh !== selected) {
      setSelected(fresh);
    }
  }, [saris, selected]);

  const filtered = useMemo(() => {
    return saris.filter(
      (sari) =>
        (fabric === 'All' || sari.fabric === fabric) &&
        (region === 'All' || sari.region === region)
    );
  }, [fabric, region, saris]);

  const totalRevenue = useMemo(() => {
    return sales.reduce((sum, sale) => sum + Number(sale.actualPrice || 0), 0);
  }, [sales]);

  const addSari = (newSari) => {
    setSaris((prev) => [...prev, { ...newSari, id: nextId(prev) }]);
  };

  const markReserved = (id) => {
    setSaris((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 0 ? { ...item, reserved: !item.reserved } : item
      )
    );
  };

  const recordSale = (newSale) => {
    setSales((prev) => [{ ...newSale, id: nextId(prev) }, ...prev]);

    setSaris((prev) =>
      prev.map((item) => {
        if (item.id !== newSale.sariId) {
          return item;
        }

        const nextQty = Math.max(0, item.quantity - newSale.qty);
        return {
          ...item,
          quantity: nextQty,
          reserved: nextQty === 0 ? false : item.reserved,
        };
      })
    );
  };

  const openSale = (sariId = '') => {
    setQuickSaleSariId(String(sariId));
    setSaleModalOpen(true);
  };

  const editSari = (id, updatedData) => {
    setSaris((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)));
  };

  const deleteSari = (id) => {
    setSaris((prev) => prev.filter((item) => item.id !== id));
    setSelected((prev) => (prev?.id === id ? null : prev));
  };

  const editSale = (id, updatedSale) => {
    const old = sales.find((s) => s.id === id);
    setSales((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedSale, id } : s)));
    if (old) {
      setSaris((prev) =>
        prev.map((item) => {
          if (item.id === old.sariId && item.id === updatedSale.sariId) {
            const newQty = Math.max(0, item.quantity + old.qty - updatedSale.qty);
            return { ...item, quantity: newQty, reserved: newQty === 0 ? false : item.reserved };
          }
          if (item.id === old.sariId) {
            return { ...item, quantity: item.quantity + old.qty };
          }
          if (item.id === updatedSale.sariId) {
            const newQty = Math.max(0, item.quantity - updatedSale.qty);
            return { ...item, quantity: newQty, reserved: newQty === 0 ? false : item.reserved };
          }
          return item;
        })
      );
    }
  };

  const deleteSale = (id) => {
    const sale = sales.find((s) => s.id === id);
    setSales((prev) => prev.filter((s) => s.id !== id));
    if (sale) {
      setSaris((prev) =>
        prev.map((item) =>
          item.id === sale.sariId ? { ...item, quantity: item.quantity + sale.qty } : item
        )
      );
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-row">
          <div>
            <div className="kicker">✦ COLLECTION ✦</div>
            <h1 className="title">Uma Saris</h1>
          </div>
          <button className="add-btn" onClick={() => setAddModalOpen(true)}>+ ADD SARI</button>
        </div>
        <div className="tab-row">
          {['catalog', 'transactions'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`tab-btn ${tab === t ? 'active' : ''}`}
            >
              {t === 'catalog' ? 'Catalog' : 'Sales Log'}
            </button>
          ))}
        </div>
      </header>

      <main className="content">
        {tab === 'catalog' && (
          <>
            <div className="pill-row">
              {FABRICS.map((item) => (
                <button
                  key={item}
                  onClick={() => setFabric(item)}
                  className={`pill fabric ${fabric === item ? 'active' : ''}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="pill-row region-row">
              {REGIONS.map((item) => (
                <button
                  key={item}
                  onClick={() => setRegion(item)}
                  className={`pill region ${region === item ? 'active' : ''}`}
                >
                  {item}
                </button>
              ))}
            </div>

            <section className="card-grid">
              {filtered.map((sari) => (
                <article key={sari.id} className="card" onClick={() => setSelected(sari)}>
                  <div className="card-media">
                    <SariImage sari={sari} />
                    <div className="status-wrap"><StatusBadge sari={sari} /></div>
                  </div>
                  <div className="card-body">
                    <div className="sari-name">{sari.name}</div>
                    <div className="card-actions">
                      <button
                        type="button"
                        className="icon-btn edit"
                        aria-label="Edit sari"
                        onClick={(e) => { e.stopPropagation(); setEditSariTarget(sari); setAddModalOpen(true); }}
                      >✎</button>
                      <button
                        type="button"
                        className="icon-btn delete"
                        aria-label="Delete sari"
                        onClick={(e) => { e.stopPropagation(); deleteSari(sari.id); }}
                      >✕</button>
                    </div>
                    <div className="card-row">
                      <span className="price">${sari.priceMin}-{sari.priceMax}</span>
                      <button
                        type="button"
                        disabled={sari.quantity === 0}
                        className={`sell-btn ${sari.quantity === 0 ? 'disabled' : ''}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          openSale(sari.id);
                        }}
                      >
                        SELL
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        {tab === 'transactions' && (
          <section>
            <div className="sales-header">
              <div className="sales-kicker">RECENT SALES</div>
              <div className="sales-total">Total: ${totalRevenue}</div>
            </div>

            <div className="sales-list">
              {sales.map((sale) => (
                <article key={sale.id} className="sale-card">
                  <div>
                    <div className="sale-sari">{sale.sari}</div>
                    <div className="sale-meta">{sale.buyer} · {sale.qty} pc · {sale.method}</div>
                  </div>
                  <div className="sale-right">
                    <div className="sale-price">${sale.actualPrice}</div>
                    <div className="sale-date">{formatSaleDate(sale.date)}</div>
                    <div className="sale-actions">
                      <button
                        type="button"
                        className="icon-btn edit"
                        aria-label="Edit sale"
                        onClick={() => { setEditSaleTarget(sale); setSaleModalOpen(true); }}
                      >✎</button>
                      <button
                        type="button"
                        className="icon-btn delete"
                        aria-label="Delete sale"
                        onClick={() => deleteSale(sale.id)}
                      >✕</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button className="log-sale-btn" onClick={() => openSale('')}>+ LOG NEW SALE</button>
          </section>
        )}
      </main>

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="sheet sari-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="modal-image"><SariImage sari={selected} /></div>
            <h2 className="sari-title">{selected.name}</h2>
            <div className="sheet-row">
              <span className="sheet-price">${selected.priceMin}-${selected.priceMax}</span>
              <StatusBadge sari={selected} />
            </div>
            <div className="modal-action-grid">
              <button
                className="btn-primary"
                disabled={selected.quantity === 0}
                onClick={() => {
                  setSelected(null);
                  openSale(selected.id);
                }}
              >
                Record Sale
              </button>
              <button className="btn-secondary" onClick={() => markReserved(selected.id)}>
                {selected.reserved ? 'Unmark Reserved' : 'Mark Reserved'}
              </button>
            </div>
            <button className="close-btn" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}

      <AddSariModal
        isOpen={addModalOpen}
        onClose={() => { setAddModalOpen(false); setEditSariTarget(null); }}
        onSave={editSariTarget ? (data) => editSari(editSariTarget.id, data) : addSari}
        editTarget={editSariTarget}
      />
      <SaleModal
        isOpen={saleModalOpen}
        saris={saris}
        selectedSariId={quickSaleSariId}
        onClose={() => { setSaleModalOpen(false); setEditSaleTarget(null); }}
        onSave={editSaleTarget ? (data) => editSale(editSaleTarget.id, data) : recordSale}
        editTarget={editSaleTarget}
      />
    </div>
  );
}

import React, { useState } from 'react';

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Jack Daniel's",
    fullName: "Jack Daniel's Tennessee Whiskey",
    sku: "820007645B",
    price: 29.99,
    stock: 32,
    bg: "#ffe5d9",
    category: "Whiskey",
    volume: "750ml",
    caseBottle: "12",
    abv: "40%",
    discount: 2.00,
    taxCategory: "Liquor",
    deposit: 0.10,
    ageVerified: true
  },
  {
    id: 2,
    name: "Absolut Vodka",
    fullName: "Absolut Vodka",
    sku: "820007645C",
    price: 19.99,
    stock: 18,
    bg: "#e0f2fe",
    category: "Vodka",
    volume: "750ml",
    caseBottle: "12",
    abv: "40%",
    discount: 0.00,
    taxCategory: "Liquor",
    deposit: 0.10,
    ageVerified: true
  },
  {
    id: 3,
    name: "Casamigos Blanco",
    fullName: "Casamigos Blanco Tequila",
    sku: "820007645D",
    price: 49.99,
    stock: 24,
    bg: "#ecfccb",
    category: "Tequila",
    volume: "750ml",
    caseBottle: "6",
    abv: "40%",
    discount: 5.00,
    taxCategory: "Liquor",
    deposit: 0.10,
    ageVerified: true
  },
  {
    id: 4,
    name: "Crown Royal",
    fullName: "Crown Royal Blended Canadian Whisky",
    sku: "820007645E",
    price: 32.99,
    stock: 45,
    bg: "#f3e8ff",
    category: "Whiskey",
    volume: "750ml",
    caseBottle: "12",
    abv: "40%",
    discount: 0.00,
    taxCategory: "Liquor",
    deposit: 0.10,
    ageVerified: true
  },
  {
    id: 5,
    name: "Smirnoff No. 21",
    fullName: "Smirnoff No. 21 Vodka",
    sku: "820007645F",
    price: 15.99,
    stock: 50,
    bg: "#f1f5f9",
    category: "Vodka",
    volume: "750ml",
    caseBottle: "12",
    abv: "40%",
    discount: 0.00,
    taxCategory: "Liquor",
    deposit: 0.10,
    ageVerified: true
  },
  {
    id: 6,
    name: "Maker's Mark",
    fullName: "Maker's Mark Kentucky Straight Bourbon",
    sku: "820007645G",
    price: 28.99,
    stock: 29,
    bg: "#ffedd5",
    category: "Whiskey",
    volume: "750ml",
    caseBottle: "6",
    abv: "45%",
    discount: 0.00,
    taxCategory: "Liquor",
    deposit: 0.10,
    ageVerified: true
  },
];

const MOCK_CUSTOMERS = [
  { id: 1, name: "Johnathan Doe", phone: "(555) 123-4567", email: "john.doe@example.com", initials: "JD", color: "#e0f2fe", textColor: "#0ea5e9" },
  { id: 2, name: "Jane Smith", phone: "(555) 987-6543", email: "jane.smith@example.com", initials: "JS", color: "#dcfce7", textColor: "#22c55e" },
  { id: 3, name: "Michael Roe", phone: "(555) 246-8135", email: "michael.roe@example.com", initials: "MR", color: "#f3e8ff", textColor: "#a855f7" },
  { id: 4, name: "Emily Brown", phone: "(555) 369-2581", email: "emily.brown@example.com", initials: "EB", color: "#ffedd5", textColor: "#f97316" }
];

const SpecRow = ({ label, value, valueColor, isVerified }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{label}</span>
    {isVerified ? (
      <span style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center' }}>
        <svg style={{ marginRight: '4px' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
        {value}
      </span>
    ) : (
      <span style={{ fontSize: '11px', fontWeight: '700', color: valueColor || '#334155' }}>
        {value}
      </span>
    )}
  </div>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState("Whiskey");
  const [cart, setCart] = useState([]);

  // State for logic
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [productSearch, setProductSearch] = useState('');

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isPaymentViewOpen, setIsPaymentViewOpen] = useState(false);
  const [isAgeVerificationModalOpen, setIsAgeVerificationModalOpen] = useState(false);

  // Gift Card Payment State
  const [isGiftCardPaymentOpen, setIsGiftCardPaymentOpen] = useState(false);
  const [giftCardNumber, setGiftCardNumber] = useState('GFT-1234-5678-9012');
  const [giftCardBalance, setGiftCardBalance] = useState(50.00);
  const [giftCardAppliedAmount, setGiftCardAppliedAmount] = useState('50.00');

  // Cash Payment State
  const [isCashPaymentOpen, setIsCashPaymentOpen] = useState(false);
  const [cashTendered, setCashTendered] = useState('');

  // Logic to manage cart AND inventory stock dynamically
  const addToCart = (product) => {
    // If we have 0 stock left natively, ignore the click
    if (product.stock <= 0) return;

    // Decrease the active product's stock natively
    setProducts((prevProd) => prevProd.map(p => p.id === product.id ? { ...p, stock: p.stock - 1 } : p));

    // Increase cart qty
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id, delta) => {
    const pRecord = products.find(p => p.id === id);
    if (!pRecord) return;

    // Prevent bumping quantity if out of stock
    if (delta > 0 && pRecord.stock <= 0) return;

    // Shift stock oppositely to delta
    setProducts((prevProd) => prevProd.map(p => p.id === id ? { ...p, stock: p.stock - delta } : p));

    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQ = item.quantity + delta;
          return newQ > 0 ? { ...item, quantity: newQ } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const handleOpenAddCustomerModal = () => {
    setIsCustomerModalOpen(false);
    setIsAddCustomerModalOpen(true);
  };

  // Filter logics
  const displayedProducts = products.filter(p => {
    const matchesCategory = activeTab === 'All Products' || p.category === activeTab;
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedCustomers = MOCK_CUSTOMERS.filter(c => {
    const searchLow = customerSearch.toLowerCase();
    return c.name.toLowerCase().includes(searchLow) ||
      c.phone.includes(searchLow) ||
      (c.email && c.email.toLowerCase().includes(searchLow));
  });

  // Aggregation
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountTotal = cart.reduce((acc, item) => acc + (item.discount || 0) * item.quantity, 0);
  const tax = (subtotal - discountTotal) * 0.0825;
  const total = subtotal - discountTotal + tax;

  const tendered = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, tendered - total);
  const quickAmounts = [
    Math.ceil(total / 10) * 10,
    Math.ceil(total / 10) * 10 + 10,
    Math.ceil(total / 10) * 10 + 20,
  ];

  return (
    <div style={styles.container}>

      {/* Top Header */}
      <header style={styles.topHeader}>
        <div style={styles.headerLeft}>
          <div style={styles.logoBlueSquare}>
            <span style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>+</span>
          </div>
          <h1 style={styles.headerTitle}>Liquor POS</h1>
          <button style={styles.startNewSaleBtn}>+ Start New Sale</button>
        </div>
        <div style={styles.headerRight}>
          <svg style={styles.iconButton} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <svg style={styles.iconButton} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <div style={styles.avatar}></div>
        </div>
      </header>

      {/* Sub-Header Tabs */}
      <div style={styles.subHeader}>
        <div style={{ ...styles.subHeaderTab, ...styles.subHeaderTabActive }}>
          <svg style={{ marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          POS
        </div>
        <div style={styles.subHeaderTab}>
          <svg style={{ marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          Cash Drawer
        </div>
        <div style={styles.subHeaderTab}>
          <svg style={{ marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6"></path><path d="M21 13a9 9 0 1 1-3-7.7L21 8"></path></svg>
          Process Return
        </div>
        <div style={styles.subHeaderTab}>
          <svg style={{ marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          Lookup Transaction
        </div>
      </div>

      <div style={styles.mainLayout}>
        {/* Left Sidebar (Receipt) */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            {isGiftCardPaymentOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button style={styles.backBtn} onClick={() => setIsGiftCardPaymentOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <h2 style={styles.sidebarTitle}>Payment</h2>
              </div>
            ) : (
              <h2 style={styles.sidebarTitle}>Current Order</h2>
            )}
          </div>

          <div style={styles.orderItemsList}>
            {cart.length === 0 ? (
              <div style={styles.sidebarEmpty}>No items in order</div>
            ) : (
              cart.map((item) => (
                isGiftCardPaymentOpen ? (
                  /* Payment sidebar format — matches design image */
                  <div key={item.id} style={styles.paymentSidebarItemCard}>
                    <div style={styles.paymentSidebarItemLeft}>
                      <div style={styles.paymentSidebarItemIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="7" y="10" width="10" height="12" rx="2" /><path d="M10 2v8M14 2v8" /><line x1="10" y1="2" x2="14" y2="2" />
                        </svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={styles.paymentSidebarItemName}>{item.fullName}</div>
                        <div style={styles.paymentSidebarItemSku}>SKU: {item.sku}</div>
                      </div>
                      <div style={styles.paymentSidebarItemQty}>x{item.quantity}</div>
                    </div>
                    <div style={styles.paymentSidebarItemPrice}>${item.price.toFixed(2)}</div>
                  </div>
                ) : (
                  /* Full detailed card for Home page */
                  <div key={item.id} style={styles.orderItemCard}>
                    <div style={styles.orderItemTop}>
                      <div style={styles.orderItemIconContainer}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="7" y="10" width="10" height="12" rx="2" /><path d="M10 2v8M14 2v8" /><line x1="10" y1="2" x2="14" y2="2" />
                        </svg>
                      </div>
                      <div style={styles.orderItemInfo}>
                        <div style={styles.orderItemName}>{item.fullName}</div>
                        <div style={styles.orderItemSku}>SKU: {item.sku}</div>
                        <div style={styles.orderItemPrice}>${item.price.toFixed(2)}</div>
                      </div>
                      <div style={styles.qtySelector}>
                        <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span style={styles.qtyValue}>{item.quantity}</span>
                        <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '16px', gridRowGap: '8px', marginTop: '16px' }}>
                      <SpecRow label="Category:" value={item.category} />
                      <SpecRow label="Volume:" value={item.volume} />
                      <SpecRow label="Case/Bottle:" value={item.caseBottle} />
                      <SpecRow label="ABV:" value={item.abv} />
                      <SpecRow label="Discount:" value={item.discount > 0 ? `-$${item.discount.toFixed(2)}` : '$0.00'} valueColor={item.discount > 0 ? '#10b981' : '#334155'} />
                      <SpecRow label="Tax Category:" value={item.taxCategory} />
                      <SpecRow label="Deposit:" value={`$${item.deposit.toFixed(2)}`} />
                      <SpecRow label="" value="Age Verified" isVerified={item.ageVerified} />
                    </div>
                  </div>
                )
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div style={styles.summaryContainer}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Subtotal</span>
                <span style={styles.summaryValue}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={{ ...styles.summaryLabel, color: discountTotal > 0 ? '#ef4444' : '#64748b' }}>Discount</span>
                <span style={{ ...styles.summaryValue, color: discountTotal > 0 ? '#ef4444' : '#64748b' }}>
                  {discountTotal > 0 ? `-$${discountTotal.toFixed(2)}` : '$0.00'}
                </span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Tax (8.25%)</span>
                <span style={styles.summaryValue}>${tax.toFixed(2)}</span>
              </div>

              {isGiftCardPaymentOpen ? (
                /* Payment sidebar Total Due row */
                <>
                  <div style={styles.paymentSidebarTotalRow}>
                    <span style={styles.paymentSidebarTotalLabel}>Total Due</span>
                    <span style={styles.paymentSidebarTotalValue}>${total.toFixed(2)}</span>
                  </div>
                  {giftCardBalance < total && (
                    <>
                      <div style={styles.summaryRow}>
                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Amount Tendered</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>${parseFloat(giftCardAppliedAmount || 0).toFixed(2)}</span>
                      </div>
                      <div style={{ ...styles.summaryRow, marginTop: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>Remaining Balance</span>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: '#ef4444' }}>${Math.max(0, total - parseFloat(giftCardAppliedAmount || 0)).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </>
              ) : (
                /* Home page Total + Pay Now */
                <>
                  <div style={{ ...styles.summaryRow, marginTop: '12px', marginBottom: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Total</span>
                    <span style={{ fontSize: '26px', fontWeight: '800', color: '#0ea5e9' }}>${total.toFixed(2)}</span>
                  </div>
                  <button style={styles.payNowBtn} onClick={() => setIsPaymentViewOpen(true)}>Pay Now</button>
                </>
              )}
            </div>
          )}
        </aside>

        {/* Main Content (Product Grid) */}
        <main style={styles.content}>
            <>
              <div style={styles.actionRow}>
                {/* Search Input driven by state */}
                <div style={styles.searchContainer}>
                  <svg style={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search product by name or SKU..."
                    style={styles.searchInput}

                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>

                <button style={styles.barcodeScannerBtn} onClick={() => setIsAgeVerificationModalOpen(true)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="3" height="3" rx="0.5" />
                    <rect x="18" y="18" width="3" height="3" rx="0.5" />
                    <rect x="14" y="18" width="2" height="2" />
                    <rect x="18" y="14" width="2" height="2" />
                  </svg>
                </button>

                <button style={styles.selectCustomerBtn} onClick={() => setIsCustomerModalOpen(true)}>
                  <svg style={{ marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  Select Customer
                </button>
              </div>

              <div style={styles.categoryTabs}>
                {['Whiskey', 'Vodka', 'Wine', 'Beer', 'All Products'].map((tab) => (
                  <div
                    key={tab}
                    style={activeTab === tab ? { ...styles.tab, ...styles.activeTab } : styles.tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setProductSearch(''); // Reset search when switching categories
                    }}
                  >
                    {tab}
                  </div>
                ))}
              </div>

              <div style={styles.productGrid}>
                {displayedProducts.length === 0 ? (
                  <div style={{ color: '#94a3b8', fontSize: '14px', fontStyle: 'italic', padding: '24px 0' }}>No products found...</div>
                ) : (
                  displayedProducts.map((prod) => (
                    <div key={prod.id} style={styles.productCard} onClick={() => addToCart(prod)}>
                      <div style={{ ...styles.productImageContainer, backgroundColor: prod.bg }}>
                        <svg width="32" height="72" viewBox="0 0 24 64" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="5" y="22" width="14" height="40" rx="3" fill="#ffffff" />
                          <path d="M9 10v12 M15 10v12" />
                          <rect x="8" y="2" width="8" height="8" rx="2" fill="#94a3b8" />
                          <path d="M5 36 h14 M5 50 h14" strokeWidth="1" />
                        </svg>
                      </div>
                      <div style={styles.productInfo}>
                        <div style={styles.productName}>{prod.name}</div>
                        <div style={styles.productPrice}>${prod.price.toFixed(2)}</div>
                        <div style={{ ...styles.productStock, color: prod.stock <= 0 ? '#ef4444' : '#94a3b8' }}>
                          {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of stock'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
        </main>
      </div>

      {/* Universal Payment Overlay Pop Up */}
      {(isPaymentViewOpen || isCashPaymentOpen || isGiftCardPaymentOpen) && (
        <div style={styles.paymentViewContainer}>
          <div style={styles.paymentCard}>
            
            {/* Common Payment Left Sidebar */}
            <div style={styles.paymentLeft}>
              <div style={styles.paymentHeader}>
                {isPaymentViewOpen ? (
                  <>
                    <h2 style={styles.paymentTitle}>Order Summary</h2>
                    <button style={styles.backToSaleBtn} onClick={() => setIsPaymentViewOpen(false)}>
                      <svg style={{ marginRight: '4px' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                      Back to Sale
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button style={styles.backBtn} onClick={() => {
                        setIsCashPaymentOpen(false);
                        setIsGiftCardPaymentOpen(false);
                        setIsPaymentViewOpen(true);
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                      </button>
                      <h2 style={styles.paymentTitle}>Payment</h2>
                    </div>
                    <div></div>
                  </>
                )}
              </div>

              <div style={styles.paymentCartList}>
                {cart.map(item => (
                  <div key={item.id} style={styles.paymentSidebarItemCard}>
                      <div style={styles.paymentSidebarItemLeft}>
                        <div style={styles.paymentSidebarItemIcon}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="7" y="10" width="10" height="12" rx="2" /><path d="M10 2v8M14 2v8" /><line x1="10" y1="2" x2="14" y2="2" />
                          </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={styles.paymentSidebarItemName}>{item.fullName || item.name}</div>
                          <div style={styles.paymentSidebarItemSku}>SKU: {item.sku}</div>
                        </div>
                        <div style={styles.paymentSidebarItemQty}>x{item.quantity}</div>
                      </div>
                      <div style={styles.paymentSidebarItemPrice}>${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div style={styles.paymentTotals}>
                <div style={styles.paymentTotalRow}>
                  <span style={styles.paymentTotalLabel}>Subtotal</span>
                  <span style={styles.paymentTotalValue}>${subtotal.toFixed(2)}</span>
                </div>
                <div style={styles.paymentTotalRow}>
                  <span style={styles.paymentTotalLabel}>Discount</span>
                  <span style={{ ...styles.paymentTotalValue, color: discountTotal > 0 ? '#ef4444' : '#10b981' }}>{discountTotal > 0 ? `-$${discountTotal.toFixed(2)}` : '$0.00'}</span>
                </div>
                <div style={styles.paymentTotalRow}>
                  <span style={styles.paymentTotalLabel}>Tax (8.25%)</span>
                  <span style={styles.paymentTotalValue}>${tax.toFixed(2)}</span>
                </div>
                <div style={{ ...styles.paymentTotalRow, marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <span style={styles.paymentGrandLabel}>Total Due</span>
                  <span style={styles.paymentGrandValue}>${total.toFixed(2)}</span>
                </div>
                
                {/* For Gift Card Amount Applied */}
                {isGiftCardPaymentOpen && giftCardBalance < total && (
                    <>
                      <div style={{ ...styles.paymentTotalRow, marginTop: '12px' }}>
                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Amount Tendered</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>${parseFloat(giftCardAppliedAmount || 0).toFixed(2)}</span>
                      </div>
                      <div style={{ ...styles.paymentTotalRow, marginTop: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>Remaining Balance</span>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: '#ef4444' }}>${Math.max(0, total - parseFloat(giftCardAppliedAmount || 0)).toFixed(2)}</span>
                      </div>
                    </>
                )}
              </div>
            </div>

            {/* Payment Right Container */}
            <div style={{ ...styles.paymentRight, overflowY: 'auto', backgroundColor: isPaymentViewOpen ? '#ffffff' : '#f8fafc' }}>
              
              {isPaymentViewOpen && (
                <>
                  <div style={styles.paymentRightHeader}>
                    <h2 style={styles.paymentTitleCenter}>Select Payment Method</h2>
                    <p style={styles.paymentSubtitle}>Choose how the customer would like to pay.</p>
                  </div>

                  <div style={styles.paymentMethodsList}>
                    {[
                      { title: 'Cash', desc: 'Pay with physical currency', svg: <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></> },
                      { title: 'Card', desc: 'Credit or Debit Card', svg: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></> },
                      { title: 'Split Payment', desc: 'Use multiple payment methods', svg: <><path d="M6 12H10" /><path d="M10 12C12 12 14 8 18 8" /><path d="M10 12C12 12 14 16 18 16" /><polyline points="15 5 18 8 15 11" /><polyline points="15 13 18 16 15 19" /></> },
                      { title: 'Gift Card', desc: 'Pay with a gift card', svg: <><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></> },
                      { title: 'Store Credit', desc: 'Apply customer store credit', svg: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></> }
                    ].map(method => (
                      <button key={method.title} style={styles.paymentMethodBtn} onClick={() => {
                        if (method.title === 'Gift Card') {
                          setIsPaymentViewOpen(false);
                          setIsGiftCardPaymentOpen(true);
                        } else if (method.title === 'Cash') {
                          setIsPaymentViewOpen(false);
                          setCashTendered(Math.ceil(total).toFixed(2));
                          setIsCashPaymentOpen(true);
                        }
                      }}>
                        <div style={styles.paymentMethodIconContainer}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {method.svg}
                          </svg>
                        </div>
                        <div style={styles.paymentMethodInfo}>
                          <div style={styles.paymentMethodTitle}>{method.title}</div>
                          <div style={styles.paymentMethodDesc}>{method.desc}</div>
                        </div>
                        <svg style={styles.paymentMethodChevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {isCashPaymentOpen && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={styles.paymentRightHeader}>
                    <h2 style={styles.paymentTitleCenter}>Cash Payment</h2>
                  </div>

                  <div style={styles.gcDetailsCard}>
                    <h4 style={styles.gcDetailsTitle}>Transaction Details</h4>
                    <div style={styles.gcDetailsRow}>
                      <div style={styles.gcDetailsCol}>
                        <span style={styles.gcDetailsLabel}>Total Amount Due</span>
                        <span style={styles.gcDetailsTotalValue}>${total.toFixed(2)}</span>
                      </div>
                      <div style={styles.gcDetailsCol}>
                        <span style={styles.gcDetailsLabel}>Change Due</span>
                        <span style={{...styles.gcDetailsBalanceValue, color: changeDue > 0 ? '#10b981' : '#94a3b8'}}>${changeDue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.gcFormGroup}>
                    <label style={styles.gcLabel}>Amount Tendered</label>
                    <div style={styles.gcInputWrapper}>
                      <span style={styles.gcCurrencySymbol}>$</span>
                      <input
                        type="number"
                        style={{...styles.gcAmountInput, textAlign: 'left'}}
                        value={cashTendered}
                        onChange={e => setCashTendered(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    {quickAmounts.map(amt => (
                      <button key={amt} style={{ flex: 1, height: '36px', backgroundColor: '#e0f2fe', color: '#0ea5e9', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} onClick={() => setCashTendered(amt.toFixed(2))}>
                        ${amt}
                      </button>
                    ))}
                    <button style={{ flex: 1, height: '36px', backgroundColor: '#e0f2fe', color: '#0ea5e9', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} onClick={() => setCashTendered(total.toFixed(2))}>Exact</button>
                  </div>

                  <div style={styles.gcFooter}>
                    <button style={styles.gcCancelBtn} onClick={() => { setIsCashPaymentOpen(false); setIsPaymentViewOpen(true); }}>Cancel</button>
                    <button style={styles.gcApplyBtn} onClick={() => setIsCashPaymentOpen(false)}>
                      Finalize Payment
                      <svg style={{ marginLeft: '4px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                  </div>
                </div>
              )}

              {isGiftCardPaymentOpen && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={styles.paymentRightHeader}>
                    <h2 style={styles.paymentTitleCenter}>Gift Card Payment</h2>
                  </div>

                  <div style={styles.gcFormGroup}>
                    <label style={styles.gcLabel}>Gift Card Number</label>
                    <div style={styles.gcInputRow}>
                      <div style={styles.gcInputWrapper}>
                        <svg style={styles.gcInputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>
                        <input type="text" style={styles.gcInput} value={giftCardNumber} onChange={(e) => setGiftCardNumber(e.target.value)} />
                      </div>
                      <button style={styles.gcCheckBalanceBtn}>Check Balance</button>
                    </div>
                  </div>

                  <div style={styles.gcDetailsCard}>
                    <h4 style={styles.gcDetailsTitle}>Card Details</h4>
                    <div style={styles.gcDetailsRow}>
                      <div style={styles.gcDetailsCol}>
                        <span style={styles.gcDetailsLabel}>Current Balance</span>
                        <span style={styles.gcDetailsBalanceValue}>${giftCardBalance.toFixed(2)}</span>
                      </div>
                      <div style={styles.gcDetailsCol}>
                        <span style={styles.gcDetailsLabel}>Total Due</span>
                        <span style={styles.gcDetailsTotalValue}>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.gcFormGroup}>
                    <label style={styles.gcLabel}>Amount to Apply</label>
                    <div style={styles.gcInputWrapper}>
                      <span style={styles.gcCurrencySymbol}>$</span>
                      <input type="text" style={styles.gcAmountInput} value={giftCardAppliedAmount} onChange={(e) => setGiftCardAppliedAmount(e.target.value)} />
                    </div>
                    {giftCardBalance < total && parseFloat(giftCardAppliedAmount || 0) >= giftCardBalance && (
                      <div style={styles.gcWarning}>
                        <svg style={{ marginRight: '4px' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        Insufficient balance. Applying the full card amount.
                      </div>
                    )}
                  </div>

                  <div style={styles.gcFooter}>
                    <button style={styles.gcCancelBtn} onClick={() => { setIsGiftCardPaymentOpen(false); setIsPaymentViewOpen(true);}}>Cancel</button>
                    <button style={styles.gcApplyBtn} onClick={() => setIsGiftCardPaymentOpen(false)}>
                      Apply Payment
                      <svg style={{ marginLeft: '4px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Customer Search Modal */}
      {isCustomerModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Search Customer</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }} onClick={() => setIsCustomerModalOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.modalSearchContainer}>
                <svg style={styles.modalSearchIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, phone, or email..."
                  style={styles.modalSearchInput}
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
              </div>
              <div style={styles.customerList}>
                {displayedCustomers.map((customer) => (
                  <div key={customer.id} style={styles.customerItem}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ ...styles.customerAvatar, backgroundColor: customer.color, color: customer.textColor }}>
                        {customer.initials}
                      </div>
                      <div style={styles.customerInfoBlock}>
                        <div style={styles.customerName}>{customer.name}</div>
                        <div style={styles.customerPhone}>{customer.phone}</div>
                      </div>
                    </div>
                    <button style={styles.customerSelectBtn} onClick={() => setIsCustomerModalOpen(false)}>Select</button>
                  </div>
                ))}
                {displayedCustomers.length === 0 && (
                  <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', marginTop: '16px' }}>No customers found.</div>
                )}
              </div>
            </div>
            <div style={styles.modalFooter}>
              <span style={styles.footerHelpText}>Can't find the customer?</span>
              <button style={styles.addCustomerBtn} onClick={handleOpenAddCustomerModal}>
                <svg style={{ marginRight: '6px' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                Add New Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Customer Modal */}
      {isAddCustomerModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Add New Customer</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }} onClick={() => setIsAddCustomerModalOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div style={styles.modalFormBody}>

              {/* Full Name */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={styles.formInputWrapper}>
                  <svg style={styles.formInputIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  <input type="text" placeholder="e.g. John Doe" style={styles.formInput} />
                </div>
              </div>

              {/* Phone */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={styles.formInputWrapper}>
                  <svg style={styles.formInputIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  <input type="text" placeholder="(555) 123-4567" style={styles.formInput} />
                </div>
              </div>

              {/* Email */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Email Address</label>
                <div style={styles.formInputWrapper}>
                  <svg style={styles.formInputIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  <input type="email" placeholder="john.doe@example.com" style={styles.formInput} />
                </div>
              </div>

            </div>

            <div style={styles.modalAddFooter}>
              <button style={styles.btnCancel} onClick={() => setIsAddCustomerModalOpen(false)}>Cancel</button>
              <button style={styles.btnAddFinal}>
                <svg style={{ marginRight: '6px' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Age Verification Modal */}
      {isAgeVerificationModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.ageModalCard}>
            <div style={styles.ageModalIconContainer}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h3 style={styles.ageModalTitle}>Age Verification Required</h3>
            <p style={styles.ageModalSubtitle}>This item requires age verification. Please verify the customer is of legal drinking age.</p>

            <div style={styles.ageModalFormGroup}>
              <label style={styles.ageFormLabel}>Enter Date of Birth</label>
              <div style={styles.dobContainer}>
                <input type="text" placeholder="MM" style={styles.dobInput} />
                <input type="text" placeholder="DD" style={styles.dobInput} />
                <input type="text" placeholder="YYYY" style={styles.dobInputLarge} />
              </div>
            </div>

            <div style={styles.scanActionRow}>
              <button style={styles.scanActionBtn}>
                <svg style={{ marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 15h4M15 15h2M7 11h2M15 11h2" /><circle cx="10" cy="9" r="2" /></svg>
                Scan ID
              </button>
              <button style={styles.scanActionBtn}>
                <svg style={{ marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                Capture Photo
              </button>
            </div>

            <div style={styles.ageModalFooter}>
              <button style={styles.ageBtnCancel} onClick={() => setIsAgeVerificationModalOpen(false)}>Cancel</button>
              <button style={styles.ageBtnVerify} onClick={() => setIsAgeVerificationModalOpen(false)}>Verify</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#ffffff',
    fontFamily: '"Inter", sans-serif',
  },
  topHeader: {
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    borderBottom: '1px solid #e2e8f0',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logoBlueSquare: {
    width: '32px',
    height: '32px',
    backgroundColor: '#0ea5e9',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-0.5px'
  },
  startNewSaleBtn: {
    marginLeft: '8px',
    padding: '8px 16px',
    backgroundColor: '#0ea5e9',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  iconButton: {
    color: '#64748b',
    cursor: 'pointer',
  },
  avatar: {
    width: '32px',
    height: '32px',
    backgroundColor: '#fde047',
    borderRadius: '50%',
  },
  subHeader: {
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    borderBottom: '1px solid #e2e8f0',
    gap: '32px',
  },
  subHeaderTab: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    height: '100%',
  },
  subHeaderTabActive: {
    color: '#0ea5e9',
    borderBottom: '2px solid #0ea5e9',
    marginBottom: '-1px',
  },
  mainLayout: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '350px',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  sidebarHeader: {
    padding: '24px 24px 16px 24px',
  },
  sidebarTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
  },
  orderItemsList: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sidebarEmpty: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    fontSize: '14px',
    fontStyle: 'italic',
  },
  orderItemCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
  },
  orderItemTop: {
    display: 'flex',
    flexDirection: 'row',
  },
  orderItemIconContainer: {
    width: '40px',
    height: '40px',
    backgroundColor: '#e2e8f0',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  orderItemInfo: {
    flex: 1,
    marginLeft: '12px',
    marginRight: '12px',
    display: 'flex',
    flexDirection: 'column',
  },
  orderItemName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: '1.2',
    marginBottom: '4px',
  },
  orderItemSku: {
    fontSize: '11px',
    color: '#94a3b8',
    marginBottom: '4px',
  },
  orderItemPrice: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0ea5e9',
  },
  qtySelector: {
    display: 'flex',
    alignItems: 'center',
    height: '28px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '0 6px',
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    padding: '0 4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a',
    minWidth: '20px',
    textAlign: 'center',
  },
  summaryContainer: {
    borderTop: '1px solid #e2e8f0',
    padding: '24px',
    backgroundColor: '#ffffff',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  summaryLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#334155',
  },
  payNowBtn: {
    width: '100%',
    height: '48px',
    backgroundColor: '#0ea5e9',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: '24px 32px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  actionRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
  },
  searchContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '0 16px',
    height: '44px',
  },
  searchIcon: {
    color: '#94a3b8',
    marginRight: '12px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#0f172a',
    background: 'transparent',
  },
  barcodeScannerBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '44px',
    width: '44px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  selectCustomerBtn: {
    display: 'flex',
    alignItems: 'center',
    height: '44px',
    padding: '0 16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
    cursor: 'pointer',
  },
  categoryTabs: {
    display: 'flex',
    gap: '24px',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '24px',
  },
  tab: {
    paddingBottom: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
  },
  activeTab: {
    color: '#0ea5e9',
    borderBottom: '2px solid #0ea5e9',
    marginBottom: '-1px',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'transform 0.1s, box-shadow 0.1s',
  },
  productImageContainer: {
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '12px 12px 0 12px',
    borderRadius: '8px',
  },
  productInfo: {
    padding: '16px',
    textAlign: 'center',
  },
  productName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px',
  },
  productPrice: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#0ea5e9',
    marginBottom: '4px',
  },
  productStock: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    width: '460px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e2e8f0',
  },
  modalTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
  },
  modalBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  modalSearchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '0 12px',
    height: '40px',
  },
  modalSearchIcon: {
    color: '#94a3b8',
    marginRight: '8px',
  },
  modalSearchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '13px',
    color: '#334155',
  },
  customerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  customerItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
  },
  customerAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '13px',
  },
  customerInfoBlock: {
    marginLeft: '12px',
    display: 'flex',
    flexDirection: 'column',
  },
  customerName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: '1.2',
    marginBottom: '2px',
  },
  customerPhone: {
    fontSize: '12px',
    color: '#64748b',
  },
  customerSelectBtn: {
    backgroundColor: '#0ea5e9',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
  },
  modalFooter: {
    borderTop: '1px solid #e2e8f0',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  footerHelpText: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  addCustomerBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
    cursor: 'pointer',
  },
  modalFormBody: {
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  formLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
  },
  formInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  formInputIcon: {
    position: 'absolute',
    left: '12px',
    color: '#94a3b8',
    pointerEvents: 'none',
  },
  formInput: {
    width: '100%',
    height: '42px',
    padding: '0 12px 0 36px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
  },
  modalAddFooter: {
    borderTop: '1px solid #e2e8f0',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  btnCancel: {
    background: 'none',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '8px 24px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    cursor: 'pointer',
    backgroundColor: '#ffffff',
  },
  btnAddFinal: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 20px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  // Payment View Styles
  paymentViewContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    fontFamily: '"Inter", sans-serif',
  },
  paymentCard: {
    backgroundColor: '#ffffff',
    width: '900px',
    height: '600px',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    overflow: 'hidden',
  },
  paymentLeft: {
    flex: '1',
    backgroundColor: '#f8fafc',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    padding: '32px',
  },
  paymentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  paymentTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
  },
  backToSaleBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: '#0ea5e9',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  paymentCartList: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  paymentCartItem: {
    display: 'flex',
    alignItems: 'center',
  },
  paymentCartIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#e2e8f0',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  paymentCartItemInfo: {
    flex: 1,
    marginLeft: '12px',
  },
  paymentCartItemName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '2px',
  },
  paymentCartItemQty: {
    fontSize: '11px',
    color: '#64748b',
  },
  paymentCartItemPrice: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a',
  },
  paymentTotals: {
    paddingTop: '24px',
    borderTop: '1px solid #e2e8f0',
  },
  paymentTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  paymentTotalLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  paymentTotalValue: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#334155',
  },
  paymentGrandLabel: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#0f172a',
  },
  paymentGrandValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#0ea5e9',
  },
  paymentRight: {
    flex: '1.2',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
  },
  paymentRightHeader: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  paymentTitleCenter: {
    margin: '0 0 8px 0',
    fontSize: '22px',
    fontWeight: '800',
    color: '#0f172a',
  },
  paymentSubtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#64748b',
  },
  paymentMethodsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  paymentMethodBtn: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'border-color 0.2s',
  },
  paymentMethodIconContainer: {
    width: '40px',
    height: '40px',
    backgroundColor: '#e0f2fe',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: '16px',
  },
  paymentMethodTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '2px',
  },
  paymentMethodDesc: {
    fontSize: '12px',
    color: '#64748b',
  },
  paymentMethodChevron: {
    color: '#94a3b8',
  },

  // Gift Card Sidebar compact list styles
  gcSidebarItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #f1f1f1',
  },
  gcSidebarItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  gcSidebarItemIcon: {
    width: '34px',
    height: '34px',
    backgroundColor: '#eef2f7',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  gcSidebarItemName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '2px',
  },
  gcSidebarItemSubtext: {
    fontSize: '11px',
    color: '#94a3b8',
  },
  gcSidebarItemTotal: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e293b',
  },

  // Gift Card Payment View Styles
  giftCardViewContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '64px',
    width: '100%',
  },
  giftCardView: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '480px',
  },
  giftCardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '0',
    marginRight: '12px',
  },
  giftCardTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
  },
  gcFormGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  gcLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '8px',
  },
  gcInputRow: {
    display: 'flex',
    gap: '12px',
  },
  gcInputWrapper: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  gcInputIcon: {
    position: 'absolute',
    left: '12px',
    color: '#94a3b8',
  },
  gcInput: {
    width: '100%',
    height: '42px',
    padding: '0 12px 0 36px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
  },
  gcCheckBalanceBtn: {
    backgroundColor: '#0ea5e9',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    height: '42px',
    whiteSpace: 'nowrap',
  },
  gcDetailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  },
  gcDetailsTitle: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
  },
  gcDetailsRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  gcDetailsCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  gcDetailsLabel: {
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '4px',
  },
  gcDetailsBalanceValue: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#10b981',
  },
  gcDetailsTotalValue: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0ea5e9',
  },
  gcCurrencySymbol: {
    position: 'absolute',
    left: '12px',
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '600',
  },
  gcAmountInput: {
    width: '100%',
    height: '42px',
    padding: '0 12px 0 24px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a',
    outline: 'none',
  },
  gcWarning: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '11px',
    color: '#d97706',
    marginTop: '8px',
    fontWeight: '500',
  },
  gcFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  gcCancelBtn: {
    backgroundColor: '#e2e8f0',
    color: '#334155',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  gcApplyBtn: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // ── Cash Payment Page ──────────────────────────────────────
  cashCard: {
    width: '400px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e9ecef',
    padding: '32px 28px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cashIconWrap: {
    width: '56px',
    height: '56px',
    backgroundColor: '#e0f2fe',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  cashTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px 0',
    textAlign: 'center',
  },
  cashSubtitle: {
    fontSize: '13px',
    color: '#94a3b8',
    margin: '0 0 20px 0',
    textAlign: 'center',
  },
  cashTotalLabel: {
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '4px',
    textAlign: 'center',
  },
  cashTotalAmount: {
    fontSize: '38px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-1px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  cashInputGroup: {
    width: '100%',
    marginBottom: '12px',
  },
  cashInputLabel: {
    fontSize: '12px',
    color: '#64748b',
    display: 'block',
    marginBottom: '6px',
  },
  cashInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    padding: '0 14px',
    height: '44px',
  },
  cashInputDollar: {
    fontSize: '14px',
    color: '#94a3b8',
    marginRight: '8px',
    fontWeight: '600',
  },
  cashInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '15px',
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'right',
  },
  cashQuickAmounts: {
    display: 'flex',
    gap: '8px',
    width: '100%',
    marginBottom: '20px',
  },
  cashQuickBtn: {
    flex: 1,
    height: '36px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    cursor: 'pointer',
  },
  cashChangeDueRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '20px',
    padding: '0 2px',
  },
  cashChangeDueLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
  },
  cashChangeDueValue: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#10b981',
  },
  cashFinalizeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '46px',
    backgroundColor: '#2EA4DB',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  // ── Standardized Payment Sidebar Item Card ─────────────────
  paymentSidebarItemCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '10px',
  },
  paymentSidebarItemLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '8px',
  },
  paymentSidebarItemIcon: {
    width: '34px',
    height: '34px',
    backgroundColor: '#eef2f7',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  paymentSidebarItemName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '2px',
    lineHeight: '1.3',
  },
  paymentSidebarItemSku: {
    fontSize: '11px',
    color: '#94a3b8',
  },
  paymentSidebarItemQty: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    flexShrink: 0,
  },
  paymentSidebarItemPrice: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#2EA4DB',
  },
  paymentSidebarTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #e2e8f0',
  },
  paymentSidebarTotalLabel: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#0f172a',
  },
  paymentSidebarTotalValue: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#2EA4DB',
  },
};

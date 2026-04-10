import React, { useState, useEffect } from 'react';
import { API_BASE_URL, CUSTOMER_DISPLAY_URL } from './config';



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
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // State for logic
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState('');

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [customerSearch, setCustomerSearch] = useState('');

  // Add Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');

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

  // Card Payment State
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [isCreditCardExpanded, setIsCreditCardExpanded] = useState(false);
  const [isCardProcessingOpen, setIsCardProcessingOpen] = useState(false);
  const [cardProcessingStep, setCardProcessingStep] = useState(0);
  const [cardTxnId, setCardTxnId] = useState('');
  const [cardAuthCode, setCardAuthCode] = useState('');
  const [cardProcessingTimer, setCardProcessingTimer] = useState(null);

  const startCardProcessing = () => {
    const txn = 'TXN-' + Math.floor(1000000000 + Math.random() * 9000000000);
    const auth = 'AUTH-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setCardTxnId(txn);
    setCardAuthCode(auth);
    setCardProcessingStep(0);
    setIsPaymentViewOpen(false);
    setIsCardProcessingOpen(true);
    const t1 = setTimeout(() => setCardProcessingStep(1), 3000);
    const t2 = setTimeout(() => setCardProcessingStep(2), 7000);
    const t3 = setTimeout(() => setCardProcessingStep(3), 15000);
    setCardProcessingTimer([t1, t2, t3]);
  };

  // Split Payment State
  const [isSplitPaymentOpen, setIsSplitPaymentOpen] = useState(false);
  const [splitPaymentMethod, setSplitPaymentMethod] = useState('Cash');
  const [splitAmount, setSplitAmount] = useState('');
  const [appliedPayments, setAppliedPayments] = useState([]);

  // Process Return State
  const [activeNavTab, setActiveNavTab] = useState('POS');
  const [returnReceiptBarcode, setReturnReceiptBarcode] = useState('');
  const [returnTransactionId, setReturnTransactionId] = useState('');

  // Process Return Detailed State
  const [isReturnItemsViewOpen, setIsReturnItemsViewOpen] = useState(false);
  const [returnItems, setReturnItems] = useState([
    { id: 101, name: 'Grey Goose Vodka', sku: '789012', purchasedQty: 2, price: 45.00, eligibility: 'Returnable', bg: '#f1f5f9' },
    { id: 102, name: 'Patron Silver Tequila', sku: '345678', purchasedQty: 1, price: 24.00, eligibility: 'Manager Approval', bg: '#fffbeb' },
    { id: 103, name: 'Cabernet Sauvignon', sku: '123456', purchasedQty: 1, price: 15.50, eligibility: 'Final Sale', bg: '#fef2f2' },
  ]);
  const [selectedReturnIds, setSelectedReturnIds] = useState([]);
  const [returnQuantities, setReturnQuantities] = useState({ 101: 1, 102: 1, 103: 0 });

  const toggleReturnItem = (id) => {
    setSelectedReturnIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const updateReturnQty = (id, val, max) => {
    const qty = Math.max(0, Math.min(max, parseInt(val) || 0));
    setReturnQuantities(prev => ({ ...prev, [id]: qty }));
    if (qty > 0 && !selectedReturnIds.includes(id)) {
      setSelectedReturnIds(prev => [...prev, id]);
    } else if (qty === 0 && selectedReturnIds.includes(id)) {
      setSelectedReturnIds(prev => prev.filter(i => i !== id));
    }
  };

  // Return Confirmation State
  const [isReturnConfirmModalOpen, setIsReturnConfirmModalOpen] = useState(false);
  const [returnRequirementsAccepted, setReturnRequirementsAccepted] = useState(false);

  // Return Reason State
  const [isReturnReasonModalOpen, setIsReturnReasonModalOpen] = useState(false);
  const [selectedReturnReason, setSelectedReturnReason] = useState('');
  const [customReturnReason, setCustomReturnReason] = useState('');

  // Refund Method & Final Logic State
  const [isRefundMethodModalOpen, setIsRefundMethodModalOpen] = useState(false);
  const [selectedRefundMethod, setSelectedRefundMethod] = useState('');
  const [isReturnRequestSuccessOpen, setIsReturnRequestSuccessOpen] = useState(false);

  // Payment Success State
  const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState(false);
  const [successDetails, setSuccessDetails] = useState({
    authCode: ''
  });

  // Transaction History State
  const [pastTransactions, setPastTransactions] = useState([]);
  const [isLoadingPastTransactions, setIsLoadingPastTransactions] = useState(false);
  const [txnSearchQuery, setTxnSearchQuery] = useState('');

  // Age Verification Flow State
  const [hasVerifiedAgeThisSession, setHasVerifiedAgeThisSession] = useState(false);
  const [pendingAgeVerifyProduct, setPendingAgeVerifyProduct] = useState(null);
  const [pendingProductToCart, setPendingProductToCart] = useState(null);

  // Track the single customer display window — never re-open if already alive
  const customerDisplayWindowRef = React.useRef(null);

  const openCustomerDisplayOnce = () => {
    const win = customerDisplayWindowRef.current;
    if (!win || win.closed) {
      customerDisplayWindowRef.current = window.open(
        CUSTOMER_DISPLAY_URL,
        'liquorPosCustomerDisplay'
      );
    }
    // If already open, do nothing — window.open with same name would refresh it
  };

  // ── Fetch Products from Backend ──────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // ── Fetch Customers from Backend ──────────────────────────────
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/customers`);
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setIsLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  const fetchPastTransactions = async () => {
    setIsLoadingPastTransactions(true);
    try {
      const token = localStorage.getItem('liquor_pos_token');
      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPastTransactions(data);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setIsLoadingPastTransactions(false);
    }
  };

  useEffect(() => {
    if (activeNavTab === 'Lookup Transaction') {
      fetchPastTransactions();
    }
  }, [activeNavTab]);

  // Aggregation (Moved up to prevent ReferenceError in Broadcaster)
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountTotal = cart.reduce((acc, item) => acc + (item.discount || 0) * item.quantity, 0);
  const tax = (subtotal - discountTotal) * 0.0825;
  const total = subtotal - discountTotal + tax;

  // ── Broadcast State to Customer Display ───────────────────────
  useEffect(() => {
    const payload = { cart, subtotal, tax, total };

    // Persist to localStorage so CustomerDisplay can hydrate on load
    // (avoids race condition where BroadcastChannel fires before the tab has loaded)
    localStorage.setItem('liquorpos_cart_snapshot', JSON.stringify(payload));

    const channel = new BroadcastChannel('liquor-pos-sync');
    channel.postMessage({ type: 'CART_UPDATE', data: payload });
    return () => channel.close();
  }, [cart, subtotal, tax, total]);

  useEffect(() => {
    if (isPaymentSuccessOpen) {
      const channel = new BroadcastChannel('liquor-pos-sync');
      channel.postMessage({
        type: 'PAYMENT_SUCCESS',
        data: successDetails
      });
      channel.close();
    }
  }, [isPaymentSuccessOpen, successDetails]);

  const completeTransaction = async (finalTotal, txnId, authCode) => {
    // ── Build Transaction Payload ───────────────────────────────
    const transactionData = {
      customer_id: selectedCustomer ? selectedCustomer.id : null,
      subtotal: subtotal,
      tax: tax,
      discount: discountTotal,
      total: finalTotal,
      payment_method: isCashPaymentOpen ? 'CASH' : isGiftCardPaymentOpen ? 'GIFT_CARD' : 'CARD',
      items: cart.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const token = localStorage.getItem('liquor_pos_token');
      if (!token) {
        alert("Session expired. Please log in again.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transactionData)
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessDetails({
          total: finalTotal,
          txnId: String(result.id || txnId || Math.floor(100000 + Math.random() * 900000)).padStart(12, '0'),
          authCode: authCode || 'AUTH-' + Math.random().toString(36).substring(2, 8).toUpperCase()
        });
        setIsPaymentSuccessOpen(true);

        // Close the customer display window after a short delay so success animation plays
        setTimeout(() => {
          if (customerDisplayWindowRef.current && !customerDisplayWindowRef.current.closed) {
            customerDisplayWindowRef.current.close();
          }
          customerDisplayWindowRef.current = null;
          localStorage.removeItem('liquorpos_cart_snapshot');
        }, 3000);

        const prodRes = await fetch(`${API_BASE_URL}/api/products`);
        if (prodRes.ok) {
          const freshProducts = await prodRes.json();
          setProducts(freshProducts);
        }
      } else if (response.status === 401) {
        // Handle Token Expired or Invalid specifically
        localStorage.removeItem('liquor_pos_token');
        localStorage.removeItem('liquor_pos_user');
        alert("Your session has truly expired. The app will now reload for security.");
        window.location.reload();
      } else {
        const err = await response.json();
        alert(`Transaction Error (${response.status}): ${err.msg || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Sale persistence error:", err);
      alert("Network Error: Could not connect to the backend server.");
    } finally {
      // Close other payment modals
      setIsPaymentViewOpen(false);
      setIsCashPaymentOpen(false);
      setIsGiftCardPaymentOpen(false);
      setIsCardProcessingOpen(false);
      setIsSplitPaymentOpen(false);
    }
  };

  const resetPOS = () => {
    setCart([]);
    setSelectedCustomer(null);
    setCustomerSearch('');
    setProductSearch('');
    setIsPaymentSuccessOpen(false);
    setActiveNavTab('POS');
    setHasVerifiedAgeThisSession(false);
    // Reset for next customer — allow a fresh display window to open
    customerDisplayWindowRef.current = null;
    localStorage.removeItem('liquorpos_cart_snapshot');
  };

  const processAgeVerificationAndAdd = (product) => {
    // Intercept if age verification required
    if (product.ageVerified && !hasVerifiedAgeThisSession) {
      setPendingAgeVerifyProduct(product);
      setIsAgeVerificationModalOpen(true);
      return;
    }

    // If we have 0 stock left natively, ignore the click
    if (product.stock <= 0) return;

    // Open customer display once — only now that customer is selected and age ok
    openCustomerDisplayOnce();

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

  // Logic to manage cart AND inventory stock dynamically
  const addToCart = (product) => {
    if (!selectedCustomer) {
      setPendingProductToCart(product);
      setIsCustomerModalOpen(true);
      return;
    }
    processAgeVerificationAndAdd(product);
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

  const selectCustomerForSale = (customer) => {
    if (selectedCustomer?.id !== customer.id) {
      setHasVerifiedAgeThisSession(false);
      // New customer = new display window allowed
      customerDisplayWindowRef.current = null;
    }
    const initials = customer.name ? customer.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
    setSelectedCustomer({ ...customer, initials, color: '#eff6ff', textColor: '#3b82f6' });
    setIsCustomerModalOpen(false);

    if (pendingProductToCart) {
      processAgeVerificationAndAdd(pendingProductToCart);
      setPendingProductToCart(null);
    }
  };

  const handleAddNewCustomer = async () => {
    if (!newCustName || !newCustPhone) {
      alert("Name and Phone are required.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCustName,
          phone: newCustPhone,
          email: newCustEmail
        })
      });

      if (response.ok) {
        const newCustomer = await response.json();
        // Update local state to include new customer
        setCustomers(prev => [...prev, newCustomer]);
        // Close modal and reset form
        setIsAddCustomerModalOpen(false);
        setNewCustName('');
        setNewCustPhone('');
        setNewCustEmail('');
        // Automatically select the new customer for the sale
        setHasVerifiedAgeThisSession(false);
        const initials = newCustomer.name ? newCustomer.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
        setSelectedCustomer({ ...newCustomer, initials, color: '#eff6ff', textColor: '#3b82f6' });

        if (pendingProductToCart) {
            processAgeVerificationAndAdd(pendingProductToCart);
            setPendingProductToCart(null);
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.msg || 'Could not add customer'}`);
      }
    } catch (err) {
      console.error("Add customer error:", err);
    }
  };

  // Filter logics
  const displayedProducts = products.filter(p => {
    const matchesCategory = activeTab === 'All Products' || p.category === activeTab;
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedCustomers = customers.filter(c => {
    const searchLow = customerSearch.toLowerCase();
    // Ensure phone is treated as a string for inclusion checks
    const phoneStr = (c.phone || '').toString();
    return c.name.toLowerCase().includes(searchLow) ||
      phoneStr.includes(searchLow) ||
      (c.email && c.email.toLowerCase().includes(searchLow));
  });

  // Aggregation
  const tendered = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, tendered - total);
  const quickAmounts = [
    Math.ceil(total / 10) * 10,
    Math.ceil(total / 10) * 10 + 10,
    Math.ceil(total / 10) * 10 + 20,
  ];

  // Return aggregation
  const returnSubtotal = selectedReturnIds.reduce((acc, id) => {
    const item = returnItems.find(i => i.id === id);
    return acc + (item.price * (returnQuantities[id] || 0));
  }, 0);
  const returnTax = returnSubtotal * 0.0825;
  const returnTotal = returnSubtotal + returnTax;

  const requiresManagerApproval = selectedReturnIds.some(id => {
    const item = returnItems.find(i => i.id === id);
    return item.eligibility === 'Manager Approval';
  });


  const handleProcessReturnFromHistory = (txnId) => {
    setReturnTransactionId(txnId);
    setActiveNavTab('Process Return');
    // Auto-triggering the items view to simulate a successful lookup
    setIsReturnItemsViewOpen(true);
  };

  return (
    <div style={styles.container}>

      {/* Top Header */}
      <header style={styles.topHeader}>
        <div style={styles.headerLeft}>
          <div style={{...styles.logoBlueSquare, cursor: 'pointer', backgroundColor: '#0f172a', border: '1px solid #1e293b'}} onClick={() => setIsAddProductModalOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* Glass base and stem */}
              <path d="M8 22h8" />
              <path d="M12 11v11" />
              <path d="M19 3l-7 8-7-8Z" />
              
              {/* Lemon garnish */}
              <circle cx="6" cy="6" r="3.5" stroke="#fde047" strokeWidth="2" fill="#fef08a" />
              
              {/* Stir and Cherry */}
              <line x1="15" y1="8" x2="20" y2="3" stroke="#e2e8f0" strokeWidth="1.5" />
              <circle cx="20" cy="3" r="2" fill="#ef4444" stroke="none" />
            </svg>
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
        <div
          style={{ ...styles.subHeaderTab, ...(activeNavTab === 'POS' ? styles.subHeaderTabActive : {}) }}
          onClick={() => setActiveNavTab('POS')}
        >
          <svg style={{ marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={activeNavTab === 'POS' ? '#0ea5e9' : 'currentColor'} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          POS
        </div>
        <div style={styles.subHeaderTab}>
          <svg style={{ marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          Cash Drawer
        </div>
        <div
          style={{ ...styles.subHeaderTab, ...(activeNavTab === 'Process Return' ? styles.subHeaderTabActive : {}) }}
          onClick={() => setActiveNavTab('Process Return')}
        >
          <svg style={{ marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={activeNavTab === 'Process Return' ? '#0ea5e9' : 'currentColor'} strokeWidth="2"><path d="M21 2v6h-6"></path><path d="M21 13a9 9 0 1 1-3-7.7L21 8"></path></svg>
          Process Return
        </div>
        <div
          style={{ ...styles.subHeaderTab, ...(activeNavTab === 'Lookup Transaction' ? styles.subHeaderTabActive : {}) }}
          onClick={() => setActiveNavTab('Lookup Transaction')}
        >
          <svg style={{ marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={activeNavTab === 'Lookup Transaction' ? '#0ea5e9' : 'currentColor'} strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          Lookup Transaction
        </div>
      </div>

      <div style={styles.mainLayout}>
        {/* Left Sidebar (Receipt) — only shown on POS */}
        {activeNavTab === 'POS' && (
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
        )}

        <main style={styles.content}>
          {activeNavTab === 'Process Return' ? (
            isReturnItemsViewOpen ? (
              <div style={styles.returnItemsContainer}>
                <div style={styles.returnItemListSection}>
                  <div style={styles.returnHeaderSection}>
                    <h1 style={styles.returnMainTitle}>Process Return</h1>
                    <p style={styles.returnMetadata}>Original Transaction: #8472619A | Purchase Date: Oct 26, 2023</p>
                    <p style={styles.returnSelectPrompt}>Select items and quantities to return.</p>
                  </div>

                  <table style={styles.returnTable}>
                    <thead>
                      <tr>
                        <th style={styles.returnTableHeader}><input type="checkbox" onChange={(e) => {
                          if (e.target.checked) setSelectedReturnIds(returnItems.map(i => i.id));
                          else setSelectedReturnIds([]);
                        }} checked={selectedReturnIds.length === returnItems.length} /></th>
                        <th style={styles.returnTableHeader}>Product</th>
                        <th style={styles.returnTableHeader}>Purchased</th>
                        <th style={styles.returnTableHeader}>Return Qty</th>
                        <th style={styles.returnTableHeader}>Price</th>
                        <th style={styles.returnTableHeader}>Eligibility</th>
                      </tr>
                    </thead>
                    <tbody>
                      {returnItems.map(item => (
                        <tr key={item.id} style={styles.returnRow}>
                          <td style={{ ...styles.returnCell, ...styles.returnCellFirst }}>
                            <input type="checkbox" checked={selectedReturnIds.includes(item.id)} onChange={() => toggleReturnItem(item.id)} />
                          </td>
                          <td style={styles.returnCell}>
                            <div style={styles.returnProductInfo}>
                              <div style={{ ...styles.returnProductImage, backgroundColor: item.bg }}>
                                <svg width="18" height="32" viewBox="0 0 24 64" fill="none" stroke="#475569" strokeWidth="2"><rect x="5" y="22" width="14" height="40" rx="3" fill="#ffffff" /><rect x="8" y="2" width="8" height="8" rx="2" fill="#94a3b8" /></svg>
                              </div>
                              <div>
                                <div style={styles.returnProductName}>{item.name}</div>
                                <div style={styles.returnProductSku}>SKU: {item.sku}</div>
                              </div>
                            </div>
                          </td>
                          <td style={styles.returnCell}>{item.purchasedQty}</td>
                          <td style={styles.returnCell}>
                            <input
                              type="number"
                              style={styles.returnQtyInput}
                              value={returnQuantities[item.id]}
                              onChange={(e) => updateReturnQty(item.id, e.target.value, item.purchasedQty)}
                            />
                          </td>
                          <td style={styles.returnCell}>${item.price.toFixed(2)}</td>
                          <td style={{ ...styles.returnCell, ...styles.returnCellLast }}>
                            <span style={{
                              ...styles.returnBadge,
                              backgroundColor: item.eligibility === 'Returnable' ? '#ecfdf5' : item.eligibility === 'Manager Approval' ? '#fffbeb' : '#fef2f2',
                              color: item.eligibility === 'Returnable' ? '#10b981' : item.eligibility === 'Manager Approval' ? '#d97706' : '#ef4444'
                            }}>
                              {item.eligibility}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={styles.returnSummarySidebar}>
                  <div style={styles.returnSummaryCard}>
                    <h2 style={styles.returnSummaryTitle}>Return Summary</h2>

                    <div style={styles.returnSummaryList}>
                      {selectedReturnIds.map(id => {
                        const item = returnItems.find(i => i.id === id);
                        return (
                          <div key={id} style={styles.returnSummaryItem}>
                            <span>{item.name} (x{returnQuantities[id]})</span>
                            <span>${(item.price * returnQuantities[id]).toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div style={styles.returnSummaryTotals}>
                      <div style={styles.returnSummaryTotalRow}>
                        <span>Subtotal</span>
                        <span>${returnSubtotal.toFixed(2)}</span>
                      </div>
                      <div style={styles.returnSummaryTotalRow}>
                        <span>Tax (8.25%)</span>
                        <span>${returnTax.toFixed(2)}</span>
                      </div>
                      <div style={{ ...styles.returnSummaryTotalRow, marginTop: '8px' }}>
                        <span style={styles.returnSummaryMainTotal}>Total Refund</span>
                        <span style={styles.returnRefundValue}>${returnTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button style={styles.returnManagerBtn} onClick={() => setIsReturnConfirmModalOpen(true)}>
                      {requiresManagerApproval && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
                      {requiresManagerApproval ? 'Manager Approval Required' : 'Process Refund'}
                    </button>
                    <button style={styles.returnCancelBtn} onClick={() => setIsReturnItemsViewOpen(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.processReturnCardsRow}>

                {/* Card 1 */}
                <div style={styles.processReturnCard}>
                  <div style={styles.processReturnCardHeader}>
                    <div style={styles.processReturnCardIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 15h4M15 15h2M7 11h2M15 11h2" /><circle cx="10" cy="9" r="2" /></svg>
                    </div>
                    <div>
                      <div style={styles.processReturnCardTitle}>Scan Receipt</div>
                      <div style={styles.processReturnCardSub}>Scan the barcode from the customer's receipt.</div>
                    </div>
                  </div>
                  <label style={styles.processReturnLabel}>Receipt Barcode</label>
                  <input type="text" placeholder="Scan barcode here..." style={styles.processReturnInput} value={returnReceiptBarcode} onChange={e => setReturnReceiptBarcode(e.target.value)} />
                  <button style={styles.processReturnFindBtn} onClick={() => setIsReturnItemsViewOpen(true)}>Find Receipt</button>
                </div>

                {/* Card 2 */}
                <div style={styles.processReturnCard}>
                  <div style={styles.processReturnCardHeader}>
                    <div style={styles.processReturnCardIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="15" x2="11" y2="15" /></svg>
                    </div>
                    <div>
                      <div style={styles.processReturnCardTitle}>Enter Receipt Number</div>
                      <div style={styles.processReturnCardSub}>Manually type the transaction ID from the receipt.</div>
                    </div>
                  </div>
                  <label style={styles.processReturnLabel}>Transaction ID</label>
                  <input type="text" placeholder="Enter transaction ID..." style={styles.processReturnInput} value={returnTransactionId} onChange={e => setReturnTransactionId(e.target.value)} />
                  <button style={styles.processReturnFindBtn} onClick={() => setIsReturnItemsViewOpen(true)}>Find Receipt</button>
                </div>

                {/* Card 3 */}
                <div style={{ ...styles.processReturnCard, backgroundColor: '#f8fafc' }}>
                  <div style={styles.processReturnCardHeader}>
                    <div style={{ ...styles.processReturnCardIcon, backgroundColor: '#e2e8f0' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    </div>
                    <div>
                      <div style={styles.processReturnCardTitle}>Manual Return</div>
                      <div style={{ fontSize: '11px', color: '#0ea5e9', fontWeight: '600' }}>(Manager Access)</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>Create a return without a receipt. This option requires manager approval and authentication.</p>
                  <button style={styles.processReturnManualBtn}>Proceed to Manual Return</button>
                </div>

              </div>
            )
          ) : activeNavTab === 'Lookup Transaction' ? (
            <div style={styles.historyContainer}>
              <div style={styles.historyHeader}>
                <div>
                  <h2 style={styles.historyTitle}>Transaction History</h2>
                  <p style={styles.historySubtitle}>Review and manage past sales records. All data is securely committed.</p>
                </div>
                <div style={styles.historySearchContainer}>
                  <svg style={styles.historySearchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  <input
                    type="text"
                    placeholder="Search by Transaction ID..."
                    style={styles.historySearchInput}
                    value={txnSearchQuery}
                    onChange={(e) => setTxnSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.historyTableWrapper}>
                <table style={styles.historyTable}>
                  <thead>
                    <tr>
                      <th style={styles.historyTh}>Transaction ID</th>
                      <th style={styles.historyTh}>Date & Time</th>
                      <th style={styles.historyTh}>Customer</th>
                      <th style={styles.historyTh}>Method</th>
                      <th style={styles.historyTh}>Amount</th>
                      <th style={styles.historyTh}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingPastTransactions ? (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading transactions...</td></tr>
                    ) : pastTransactions.length === 0 ? (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No transactions found.</td></tr>
                    ) : (
                      pastTransactions
                        .filter(t => {
                          const query = txnSearchQuery.toLowerCase();
                          const stringId = String(t.id).padStart(12, '0');
                          return stringId.includes(query) ||
                            (t.customer_name && t.customer_name.toLowerCase().includes(query));
                        })
                        .map(txn => (
                          <tr key={txn.id} style={styles.historyRow}>
                            <td style={styles.historyTd}>
                              <span style={styles.historyIdBadge}>{String(txn.id).padStart(12, '0')}</span>
                            </td>
                            <td style={styles.historyTd}>
                              {new Date(txn.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </td>
                            <td style={styles.historyTd}>
                              <div style={styles.historyCustomerCell}>
                                <div style={{ ...styles.avatarSmall, backgroundColor: txn.customer_id ? '#eff6ff' : '#f8fafc', color: txn.customer_id ? '#3b82f6' : '#94a3b8' }}>
                                  {txn.customer_name ? txn.customer_name.charAt(0) : 'W'}
                                </div>
                                <span>{txn.customer_name}</span>
                              </div>
                            </td>
                            <td style={styles.historyTd}>
                              <span style={{ ...styles.paymentBadge, backgroundColor: txn.payment_method === 'CASH' ? '#f0fdf4' : txn.payment_method === 'CARD' ? '#eff6ff' : '#fdf4ff', color: txn.payment_method === 'CASH' ? '#16a34a' : txn.payment_method === 'CARD' ? '#2563eb' : '#a21caf' }}>
                                {txn.payment_method}
                              </span>
                            </td>
                            <td style={{ ...styles.historyTd, fontWeight: '700', color: '#0f172a' }}>
                              ${txn.total.toFixed(2)}
                            </td>
                            <td style={styles.historyTd}>
                              <button style={styles.historyActionBtn}>View Details</button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <>
              <div style={styles.actionRow}>
                <div style={styles.searchContainer}>
                  <svg style={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input type="text" placeholder="Search product by name or SKU..." style={styles.searchInput} value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
                </div>
                <button style={styles.barcodeScannerBtn} onClick={() => window.open(CUSTOMER_DISPLAY_URL, 'liquorPosCustomerDisplay')}>
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
                <button style={{ ...styles.selectCustomerBtn, backgroundColor: selectedCustomer ? '#f0f9ff' : '#0ea5e9', color: selectedCustomer ? '#0ea5e9' : 'white', border: selectedCustomer ? '1px solid #0ea5e9' : 'none' }} onClick={() => setIsCustomerModalOpen(true)}>
                  <svg style={{ marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  {selectedCustomer ? selectedCustomer.name : 'Select Customer'}
                  {selectedCustomer && (
                    <div
                      onClick={(e) => { e.stopPropagation(); setSelectedCustomer(null); }}
                      style={{ marginLeft: '8px', padding: '2px', cursor: 'pointer' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                  )}
                </button>
              </div>

              <div style={styles.categoryTabs}>
                {['Whiskey', 'Vodka', 'Wine', 'Beer', 'All Products'].map((tab) => (
                  <div key={tab} style={activeTab === tab ? { ...styles.tab, ...styles.activeTab } : styles.tab} onClick={() => { setActiveTab(tab); setProductSearch(''); }}>
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
          )}
        </main>
      </div>

      {/* Universal Payment Overlay Pop Up */}
      {(isPaymentViewOpen || isCashPaymentOpen || isGiftCardPaymentOpen || isSplitPaymentOpen) && (
        <div style={styles.paymentViewContainer}>
          {isSplitPaymentOpen ? (
            <div style={styles.splitPaymentCard}>
              <div style={styles.splitPaymentHeader}>
                <div>
                  <h2 style={styles.splitPaymentTitle}>Split Payment</h2>
                  <div style={styles.splitPaymentSubtitle}>Order #12084</div>
                </div>
                <button style={styles.splitPaymentBackBtn} onClick={() => { setIsSplitPaymentOpen(false); setIsPaymentViewOpen(true); }}>
                  <svg style={{ marginRight: '4px' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  Back to Sale
                </button>
              </div>

              <div style={styles.splitPaymentBody}>
                <div style={styles.splitPaymentLeftPanel}>
                  <h3 style={styles.splitPaymentSectionTitle}>Select Payment Method</h3>
                  <div style={styles.splitPaymentMethodGrid}>
                    {['Cash', 'Card', 'Gift Card', 'Other'].map(method => (
                      <button
                        key={method}
                        style={splitPaymentMethod === method ? styles.splitPaymentMethodBtnActive : styles.splitPaymentMethodBtn}
                        onClick={() => setSplitPaymentMethod(method)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={splitPaymentMethod === method ? '#0ea5e9' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
                          {method === 'Cash' && <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></>}
                          {method === 'Card' && <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></>}
                          {method === 'Gift Card' && <><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></>}
                          {method === 'Other' && <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>}
                        </svg>
                        {method}
                      </button>
                    ))}
                  </div>

                  <h3 style={styles.splitPaymentSectionTitle}>Amount to Pay</h3>
                  <div style={styles.splitPaymentInputWrapper}>
                    <span style={styles.splitPaymentCurrencySymbol}>$</span>
                    <input
                      type="number"
                      style={styles.splitPaymentAmountInput}
                      value={splitAmount}
                      onChange={(e) => setSplitAmount(e.target.value)}
                    />
                  </div>

                  <div style={styles.splitPaymentFractionRow}>
                    <button style={styles.splitPaymentFractionBtn} onClick={() => setSplitAmount((total / 2).toFixed(2))}>1/2</button>
                    <button style={styles.splitPaymentFractionBtn} onClick={() => setSplitAmount((total / 3).toFixed(2))}>1/3</button>
                    <button style={styles.splitPaymentFractionBtn} onClick={() => setSplitAmount((total / 4).toFixed(2))}>1/4</button>
                  </div>

                  <button
                    style={styles.splitPaymentAddBtn}
                    onClick={() => {
                      if (parseFloat(splitAmount) > 0) {
                        setAppliedPayments([...appliedPayments, {
                          id: Date.now(),
                          method: splitPaymentMethod,
                          amount: parseFloat(splitAmount),
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }]);
                        setSplitAmount('');
                      }
                    }}
                  >
                    + Add Payment
                  </button>
                </div>

                <div style={styles.splitPaymentRightPanel}>
                  <h3 style={styles.splitPaymentSectionTitle}>Payment Summary</h3>
                  <div style={styles.splitPaymentSummaryBox}>
                    <div style={styles.splitPaymentSummaryRow}>
                      <span style={styles.splitPaymentSummaryLabel}>Total Amount</span>
                      <span style={styles.splitPaymentSummaryValueLarge}>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <h3 style={{ ...styles.splitPaymentSectionTitle, fontSize: '13px', marginTop: '24px', marginBottom: '12px' }}>Applied Payments</h3>
                  <div style={styles.splitPaymentAppliedList}>
                    {appliedPayments.length === 0 ? (
                      <div style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>No payments applied yet.</div>
                    ) : (
                      appliedPayments.map((payment, index) => (
                        <div key={payment.id} style={styles.splitPaymentAppliedItem}>
                          <div style={styles.splitPaymentAppliedItemLeft}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px' }}>
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <div>
                              <div style={styles.splitPaymentAppliedItemTitle}>Payment {index + 1}: {payment.method}</div>
                              <div style={styles.splitPaymentAppliedItemTime}>Today at {payment.timestamp}</div>
                            </div>
                          </div>
                          <div style={styles.splitPaymentAppliedItemRight}>
                            <div style={styles.splitPaymentAppliedItemAmount}>${payment.amount.toFixed(2)}</div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', marginLeft: '12px' }} onClick={() => {
                              setAppliedPayments(appliedPayments.filter(p => p.id !== payment.id));
                            }}>
                              <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {(() => {
                    const totalPaid = appliedPayments.reduce((acc, curr) => acc + curr.amount, 0);
                    const remainingBalance = Math.max(0, total - totalPaid);
                    return (
                      <div style={styles.splitPaymentTotalsSection}>
                        <div style={styles.splitPaymentTotalRow}>
                          <span style={styles.splitPaymentTotalLabel}>Total Paid</span>
                          <span style={styles.splitPaymentTotalValue}>${totalPaid.toFixed(2)}</span>
                        </div>
                        <div style={styles.splitPaymentTotalRow}>
                          <span style={styles.splitPaymentRemainingLabel}>Remaining Balance</span>
                          <span style={styles.splitPaymentRemainingValue}>${remainingBalance.toFixed(2)}</span>
                        </div>
                        <button style={styles.splitPaymentCompleteBtn} onClick={() => {
                          completeTransaction(appliedPayments.reduce((acc, curr) => acc + curr.amount, 0));
                          setAppliedPayments([]);
                        }}>
                          Complete Sale
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : (
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
                        <div key={method.title} style={{ display: 'flex', flexDirection: 'column' }}>
                          <button style={{ ...styles.paymentMethodBtn, ...(method.title === 'Card' && isCardExpanded ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: 'none' } : {}) }} onClick={() => {
                            if (method.title === 'Card') {
                              setIsCardExpanded(!isCardExpanded);
                            } else if (method.title === 'Gift Card') {
                              setIsPaymentViewOpen(false);
                              setIsGiftCardPaymentOpen(true);
                            } else if (method.title === 'Cash') {
                              setIsPaymentViewOpen(false);
                              setCashTendered(Math.ceil(total).toFixed(2));
                              setIsCashPaymentOpen(true);
                            } else if (method.title === 'Split Payment') {
                              setIsPaymentViewOpen(false);
                              setSplitAmount(total.toFixed(2));
                              setIsSplitPaymentOpen(true);
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
                            <svg style={styles.paymentMethodChevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              {method.title === 'Card' && isCardExpanded ? (
                                <polyline points="6 9 12 15 18 9"></polyline>
                              ) : (
                                <polyline points="9 18 15 12 9 6"></polyline>
                              )}
                            </svg>
                          </button>
                          {method.title === 'Card' && isCardExpanded && (
                            <div style={styles.cardSubMethodsContainer}>
                              <button style={styles.cardSubMethodBtn} onClick={startCardProcessing}>
                                <div style={{ width: '28px', height: '20px', backgroundColor: '#e0f2fe', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                                </div>
                                <div style={{ flex: 1, textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>Debit Card</div>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                              </button>
                              <button style={styles.cardSubMethodBtn} onClick={() => setIsCreditCardExpanded(!isCreditCardExpanded)}>
                                <div style={{ width: '28px', height: '20px', backgroundColor: '#e0f2fe', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                                </div>
                                <div style={{ flex: 1, textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>Credit Card</div>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  {isCreditCardExpanded ? (
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                  ) : (
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                  )}
                                </svg>
                              </button>
                              {isCreditCardExpanded && (
                                <div style={styles.creditCardBrandsGrid}>
                                  {[
                                    { name: 'Amex', icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></> },
                                    { name: 'Discover', icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></> },
                                    { name: 'Visa', icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></> },
                                    { name: 'American Express', icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></> }
                                  ].map(brand => (
                                    <button key={brand.name} style={styles.creditCardBrandBtn} onClick={startCardProcessing}>
                                      <div style={{ width: '24px', height: '16px', backgroundColor: '#e0f2fe', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{brand.icon}</svg>
                                      </div>
                                      <span style={{ fontSize: '11px', fontWeight: '600', color: '#334155' }}>{brand.name}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {isCardProcessingOpen && (
                  <div style={styles.cardProcessingContainer}>
                    <div style={styles.cardProcessingHeader}>
                      <h2 style={styles.cardProcessingTitle}>Processing Card Payment</h2>
                      <p style={styles.cardProcessingSubtitle}>Please follow the instructions on the card terminal.</p>
                    </div>

                    <div style={styles.cardProcessingAmountRow}>
                      <span style={styles.cardProcessingAmountLabel}>Total Amount</span>
                      <span style={styles.cardProcessingAmountValue}>${total.toFixed(2)}</span>
                    </div>

                    <div style={styles.cardProcessingStatusSection}>
                      <div style={styles.cardProcessingStatusTitle}>Transaction Status</div>
                      {[
                        { label: 'Connecting to Payment Terminal', sub: 'Established secure connection.', step: 0 },
                        { label: 'Awaiting Card Information', sub: 'Please insert, tap, or swipe your card.', step: 1 },
                        { label: 'Processing Transaction', sub: 'Waiting for authorization from the bank.', step: 2 },
                      ].map(({ label, sub, step }) => {
                        const isDone = cardProcessingStep > step;
                        const isActive = cardProcessingStep === step;
                        const isPending = cardProcessingStep < step;
                        return (
                          <div key={step} style={{ ...styles.cardStatusRow, opacity: isPending ? 0.45 : 1 }}>
                            <div style={{ ...styles.cardStatusIcon, backgroundColor: isDone ? '#dcfce7' : isActive ? '#0ea5e9' : '#e2e8f0' }}>
                              {isDone ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                              ) : isActive ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /></svg>
                              )}
                            </div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: '700', color: isPending ? '#94a3b8' : '#0f172a' }}>{label}</div>
                              <div style={{ fontSize: '12px', color: isPending ? '#cbd5e1' : '#64748b', marginTop: '2px' }}>{sub}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={styles.cardProcessingFieldsRow}>
                      <div style={styles.cardProcessingField}>
                        <label style={styles.cardProcessingFieldLabel}>Transaction ID</label>
                        <div style={{ ...styles.cardProcessingFieldInput, color: cardProcessingStep === 3 ? '#0f172a' : 'transparent' }}>{cardTxnId}</div>
                      </div>
                      <div style={styles.cardProcessingField}>
                        <label style={styles.cardProcessingFieldLabel}>Authorization Code</label>
                        <div style={{ ...styles.cardProcessingFieldInput, color: cardProcessingStep === 3 ? '#0f172a' : 'transparent' }}>{cardAuthCode}</div>
                      </div>
                    </div>

                    {cardProcessingStep < 3 ? (
                      <button style={styles.cardCancelBtn} onClick={() => {
                        if (cardProcessingTimer) cardProcessingTimer.forEach(t => clearTimeout(t));
                        setIsCardProcessingOpen(false);
                        setIsPaymentViewOpen(true);
                        setCardProcessingStep(0);
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                        Cancel Transaction
                      </button>
                    ) : (
                      <button style={styles.cardDoneBtn} onClick={() => { setIsCardProcessingOpen(false); setIsPaymentViewOpen(false); setCardProcessingStep(0); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><polyline points="20 6 9 17 4 12" /></svg>
                        Payment Approved
                      </button>
                    )}
                  </div>
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
                          <span style={{ ...styles.gcDetailsBalanceValue, color: changeDue > 0 ? '#10b981' : '#94a3b8' }}>${changeDue.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.gcFormGroup}>
                      <label style={styles.gcLabel}>Amount Tendered</label>
                      <div style={styles.gcInputWrapper}>
                        <span style={styles.gcCurrencySymbol}>$</span>
                        <input
                          type="number"
                          style={{ ...styles.gcAmountInput, textAlign: 'left' }}
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
                      <button style={styles.gcApplyBtn} onClick={() => completeTransaction(total)}>
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
                      <button style={styles.gcCancelBtn} onClick={() => { setIsGiftCardPaymentOpen(false); setIsPaymentViewOpen(true); }}>Cancel</button>
                      <button style={styles.gcApplyBtn} onClick={() => completeTransaction(parseFloat(giftCardAppliedAmount || 0))}>
                        Apply Payment
                        <svg style={{ marginLeft: '4px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      )}

      {/* Card Payment Processing Overlay */}
      {isCardProcessingOpen && (
        <div style={styles.paymentViewContainer}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            width: '600px',
            maxWidth: '90vw',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', paddingBottom: '28px', borderBottom: '1px solid #e2e8f0', marginBottom: '28px' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Processing Card Payment</h2>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Please follow the instructions on the card terminal.</p>
            </div>

            {/* Total Amount */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Total Amount</span>
              <span style={{ fontSize: '32px', fontWeight: '800', color: '#0ea5e9' }}>${total.toFixed(2)}</span>
            </div>

            {/* Status Steps */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>Transaction Status</div>
              {[
                { label: 'Connecting to Payment Terminal', sub: 'Established secure connection.', step: 0 },
                { label: 'Awaiting Card Information', sub: 'Please insert, tap, or swipe your card.', step: 1 },
                { label: 'Processing Transaction', sub: 'Waiting for authorization from the bank.', step: 2 },
              ].map(({ label, sub, step }) => {
                const isDone = cardProcessingStep > step;
                const isActive = cardProcessingStep === step;
                const isPending = cardProcessingStep < step;
                return (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', padding: '16px 20px', marginBottom: '10px', opacity: isPending ? 0.4 : 1, transition: 'opacity 0.4s ease' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: isDone ? '#dcfce7' : isActive ? '#0ea5e9' : '#e2e8f0', transition: 'background-color 0.4s ease' }}>
                      {isDone ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : isActive ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /></svg>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: isPending ? '#94a3b8' : '#0f172a' }}>{label}</div>
                      <div style={{ fontSize: '13px', color: isPending ? '#cbd5e1' : '#64748b', marginTop: '3px' }}>{sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fields */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Transaction ID</label>
                <div style={{ height: '44px', backgroundColor: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: '13px', fontWeight: '700', color: cardProcessingStep === 3 ? '#0f172a' : '#f1f5f9', letterSpacing: '0.5px' }}>
                  {cardTxnId}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Authorization Code</label>
                <div style={{ height: '44px', backgroundColor: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: '13px', fontWeight: '700', color: cardProcessingStep === 3 ? '#0f172a' : '#f1f5f9', letterSpacing: '0.5px' }}>
                  {cardAuthCode}
                </div>
              </div>
            </div>

            {/* Action Button */}
            {cardProcessingStep < 3 ? (
              <button
                style={{ width: '100%', height: '52px', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', color: '#ef4444', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => {
                  if (cardProcessingTimer) cardProcessingTimer.forEach(t => clearTimeout(t));
                  setIsCardProcessingOpen(false);
                  setIsPaymentViewOpen(true);
                  setCardProcessingStep(0);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                Cancel Transaction
              </button>
            ) : (
              <button
                style={{ width: '100%', height: '52px', backgroundColor: '#16a34a', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => completeTransaction(total, cardTxnId, cardAuthCode)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Payment Approved — Complete
              </button>
            )}
          </div>
        </div>
      )}

      {/* Confirm Return Requirements Modal */}
      {isReturnConfirmModalOpen && (
        <div style={styles.paymentViewContainer}>
          <div style={styles.confirmReturnModalCard}>
            <h2 style={styles.confirmReturnTitle}>Confirm Return Requirements</h2>
            <p style={styles.confirmReturnSubtitle}>
              Please confirm that all returned bottles are unopened and seals are intact before proceeding.
            </p>

            <div style={styles.confirmCheckRow} onClick={() => setReturnRequirementsAccepted(!returnRequirementsAccepted)}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: returnRequirementsAccepted ? 'none' : '2px solid #cbd5e1',
                backgroundColor: returnRequirementsAccepted ? '#0ea5e9' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}>
                {returnRequirementsAccepted && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
              </div>
              <span style={styles.confirmCheckText}>I confirm all items are sealed and unopened.</span>
            </div>

            <div style={styles.confirmModalBtnRow}>
              <button style={styles.confirmBtnCancel} onClick={() => {
                setIsReturnConfirmModalOpen(false);
                setReturnRequirementsAccepted(false);
              }}>
                Cancel
              </button>
              <button
                style={returnRequirementsAccepted ? styles.confirmBtnRefundEnabled : styles.confirmBtnRefundDisabled}
                disabled={!returnRequirementsAccepted}
                onClick={() => {
                  setIsReturnConfirmModalOpen(false);
                  setReturnRequirementsAccepted(false);
                  // Open Reason modal instead of finalizing directly
                  setIsReturnReasonModalOpen(true);
                }}
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reason for Return Modal */}
      {isReturnReasonModalOpen && (
        <div style={styles.paymentViewContainer}>
          <div style={styles.reasonReturnModalCard}>
            <h2 style={styles.confirmReturnTitle}>Reason for Return</h2>
            <p style={{ ...styles.confirmReturnSubtitle, textAlign: 'left', margin: '4px 0 0 0' }}>
              Please select a reason to continue.
            </p>

            <div style={styles.reasonList}>
              {[
                'Damaged Product',
                'Wrong Item',
                'Expired Product',
                'Customer Dissatisfied',
                'Other (Specify)'
              ].map(reason => {
                const isActive = selectedReturnReason === reason;
                return (
                  <div
                    key={reason}
                    style={{
                      ...styles.reasonItem,
                      ...(isActive ? styles.reasonItemActive : {}),
                      ...(isActive && reason === 'Other (Specify)' ? { paddingBottom: '0', flexDirection: 'column', alignItems: 'flex-start' } : {})
                    }}
                    onClick={() => setSelectedReturnReason(reason)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: isActive && reason === 'Other (Specify)' ? '12px' : '0' }}>
                      <div style={{ ...styles.reasonRadio, ...(isActive ? styles.reasonRadioActive : {}) }}>
                        {isActive && <div style={styles.reasonRadioDot} />}
                      </div>
                      <span style={styles.reasonText}>{reason}</span>
                    </div>

                    {isActive && reason === 'Other (Specify)' && (
                      <div style={{ ...styles.reasonOtherBox, width: '100%', marginBottom: '16px', boxSizing: 'border-box' }} onClick={(e) => e.stopPropagation()}>
                        <textarea
                          placeholder="Enter other reason here..."
                          style={styles.reasonTextarea}
                          value={customReturnReason}
                          onChange={(e) => setCustomReturnReason(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ ...styles.confirmModalBtnRow, justifyContent: 'flex-end' }}>
              <button
                style={{ ...styles.confirmBtnCancel, flex: 'none', padding: '0 32px' }}
                onClick={() => {
                  setIsReturnReasonModalOpen(false);
                  setSelectedReturnReason('');
                  setCustomReturnReason('');
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  ...(selectedReturnReason ? styles.confirmBtnRefundEnabled : styles.confirmBtnRefundDisabled),
                  flex: 'none',
                  padding: '0 32px'
                }}
                disabled={!selectedReturnReason}
                onClick={() => {
                  setIsReturnReasonModalOpen(false);
                  // Open Refund Method modal instead of finalizing
                  setIsRefundMethodModalOpen(true);
                  // Resets
                  // setSelectedReturnReason(''); // Keep it for final logic if needed, but we'll reset at the end
                  // setCustomReturnReason('');
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select Refund Method Modal */}
      {isRefundMethodModalOpen && (
        <div style={styles.paymentViewContainer}>
          <div style={styles.reasonReturnModalCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 style={{ ...styles.confirmReturnTitle, margin: 0 }}>Select Refund Method</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} onClick={() => setIsRefundMethodModalOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <p style={{ ...styles.confirmReturnSubtitle, textAlign: 'left', margin: '0 0 24px 0' }}>
              Total to be Refunded: <span style={{ fontWeight: '800', color: '#0f172a' }}>${returnTotal.toFixed(2)}</span>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                {
                  id: 'Original Card', title: 'Refund to Original Card', sub: 'Refunds to card ending in 4242', icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                  )
                },
                {
                  id: 'Cash', title: 'Refund as Cash', sub: 'Give the customer cash from the register', icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
                  )
                },
                {
                  id: 'Store Credit', title: 'Issue Store Credit', sub: "Add credit to the customer's account", icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></svg>
                  )
                }
              ].map(method => {
                const isActive = selectedRefundMethod === method.id;
                return (
                  <div
                    key={method.id}
                    style={{ ...styles.refundMethodCard, ...(isActive ? styles.refundMethodCardActive : {}) }}
                    onClick={() => setSelectedRefundMethod(method.id)}
                  >
                    <div style={{ ...styles.refundIconContainer, ...(isActive ? styles.refundIconActive : {}) }}>
                      {method.icon}
                    </div>
                    <div style={styles.refundMethodInfo}>
                      <div style={styles.refundMethodTitle}>{method.title}</div>
                      <div style={styles.refundMethodSubtitle}>{method.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ ...styles.confirmModalBtnRow, justifyContent: 'flex-end' }}>
              <button
                style={{ ...styles.confirmBtnCancel, flex: 'none', padding: '0 32px' }}
                onClick={() => setIsRefundMethodModalOpen(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  ...(selectedRefundMethod ? styles.confirmBtnRefundEnabled : styles.confirmBtnRefundDisabled),
                  flex: 'none',
                  padding: '0 32px'
                }}
                disabled={!selectedRefundMethod}
                onClick={() => {
                  setIsRefundMethodModalOpen(false);
                  if (requiresManagerApproval) {
                    setIsReturnRequestSuccessOpen(true);
                  } else {
                    resetPOS();
                  }
                  // Clean up return-specific state
                  setSelectedReturnReason('');
                  setCustomReturnReason('');
                  setSelectedRefundMethod('');
                  setSelectedReturnIds([]);
                  setIsReturnItemsViewOpen(false);
                }}
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Successful Popup */}
      {isReturnRequestSuccessOpen && (
        <div style={styles.paymentViewContainer}>
          <div style={styles.refundRequestCard}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2 style={styles.confirmReturnTitle}>Request Successful</h2>
            <p style={{ ...styles.confirmReturnSubtitle, marginBottom: '32px' }}>
              Your return request for items requiring manager approval has been submitted successfully.
            </p>
            <button
              style={{ ...styles.confirmBtnRefundEnabled, padding: '0 48px', flex: 'none' }}
              onClick={() => {
                setIsReturnRequestSuccessOpen(false);
                resetPOS();
              }}
            >
              Back to POS
            </button>
          </div>
        </div>
      )}

      {/* Payment Success Overlay */}
      {isPaymentSuccessOpen && (
        <div style={styles.paymentViewContainer}>
          <div style={styles.successCard}>
            <div style={styles.successIconCircle}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2 style={styles.successTitle}>Payment Successful</h2>
            <p style={styles.successSubtitle}>The transaction has been completed.</p>

            <div style={styles.successAmountSection}>
              <span style={styles.successAmountLabel}>Total Amount Paid</span>
              <span style={styles.successAmountValue}>${successDetails.total.toFixed(2)}</span>
            </div>

            <div style={styles.successFieldsRow}>
              <div style={styles.successFieldItem}>
                <label style={styles.successFieldLabel}>Transaction ID</label>
                <div style={styles.successFieldValue}>{successDetails.txnId}</div>
              </div>
              <div style={styles.successFieldItem}>
                <label style={styles.successFieldLabel}>Authorization Code</label>
                <div style={styles.successFieldValue}>{successDetails.authCode}</div>
              </div>
            </div>

            <div style={styles.successBtnRow}>
              <button style={styles.successBtnNewSale} onClick={resetPOS}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                New Sale
              </button>
              <button style={styles.successBtnPrint} onClick={() => console.log("Printing receipt...")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

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
                {displayedCustomers.map((customer) => {
                  // Generate initials and colors if not in DB
                  const initials = customer.name ? customer.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
                  const color = '#eff6ff';
                  const textColor = '#3b82f6';

                  return (
                    <div key={customer.id} style={styles.customerItem}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ ...styles.customerAvatar, backgroundColor: color, color: textColor }}>
                          {initials}
                        </div>
                        <div style={styles.customerInfoBlock}>
                          <div style={styles.customerName}>{customer.name}</div>
                          <div style={styles.customerPhone}>{customer.phone}</div>
                        </div>
                      </div>
                      <button
                        style={styles.customerSelectBtn}
                        onClick={() => {
                          setSelectedCustomer({ ...customer, initials, color, textColor });
                          setIsCustomerModalOpen(false);
                        }}
                      >
                        Select
                      </button>
                    </div>
                  );
                })}
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
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    style={styles.formInput}
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                  />
                </div>
              </div>

              {/* Phone */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={styles.formInputWrapper}>
                  <svg style={styles.formInputIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  <input
                    type="text"
                    placeholder="(555) 123-4567"
                    style={styles.formInput}
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Email Address</label>
                <div style={styles.formInputWrapper}>
                  <svg style={styles.formInputIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  <input
                    type="email"
                    placeholder="john.doe@example.com"
                    style={styles.formInput}
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                  />
                </div>
              </div>

            </div>

            <div style={styles.modalAddFooter}>
              <button style={styles.btnCancel} onClick={() => setIsAddCustomerModalOpen(false)}>Cancel</button>
              <button style={styles.btnAddFinal} onClick={handleAddNewCustomer}>
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
            <div style={styles.ageModalHeader}>
              <div style={styles.ageModalIconContainer}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 11 12 14 22 4" stroke="#10b981" />
                </svg>
              </div>
              <h3 style={styles.ageModalTitle}>Age Verification Required</h3>
              <p style={styles.ageModalSubtitle}>This item is restricted. Please confirm the customer's legal drinking age before proceeding.</p>
            </div>

            <div style={styles.ageModalFormGroup}>
              <label style={styles.ageFormLabel}>Date of Birth</label>
              <div style={styles.dobContainer}>
                <input type="text" placeholder="MM" style={styles.dobInput} maxLength="2" />
                <input type="text" placeholder="DD" style={styles.dobInput} maxLength="2" />
                <input type="text" placeholder="YYYY" style={styles.dobInputLarge} maxLength="4" />
              </div>
            </div>

            <div style={styles.scanActionRow}>
              <button style={styles.scanActionBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 15h4M15 15h2M7 11h2M15 11h2" /><circle cx="10" cy="9" r="2" /></svg>
                Scan ID Card
              </button>
              <button style={styles.scanActionBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                Capture Photo
              </button>
            </div>

            <div style={styles.ageModalFooter}>
              <button style={styles.ageBtnCancel} onClick={() => { setIsAgeVerificationModalOpen(false); setPendingAgeVerifyProduct(null); }}>Cancel</button>
              <button style={styles.ageBtnVerify} onClick={() => {
                setHasVerifiedAgeThisSession(true);
                setIsAgeVerificationModalOpen(false);
                if (pendingAgeVerifyProduct) {
                  processAgeVerificationAndAdd(pendingAgeVerifyProduct);
                  setPendingAgeVerifyProduct(null);
                }
              }}>Verify Customer</button>
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
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
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
  splitPaymentCard: {
    backgroundColor: '#ffffff',
    width: '900px',
    height: '600px',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  splitPaymentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
    borderBottom: '1px solid #e2e8f0',
  },
  splitPaymentTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '800',
    color: '#0f172a',
  },
  splitPaymentSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '4px',
  },
  splitPaymentBackBtn: {
    display: 'flex',
    alignItems: 'center',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '8px 16px',
    borderRadius: '8px',
    color: '#64748b',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  splitPaymentBody: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  splitPaymentLeftPanel: {
    flex: '1',
    padding: '32px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  splitPaymentRightPanel: {
    flex: '1',
    padding: '32px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  splitPaymentSectionTitle: {
    margin: '0 0 16px 0',
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
  },
  splitPaymentMethodGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '32px',
  },
  splitPaymentMethodBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '72px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
  },
  splitPaymentMethodBtnActive: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '72px',
    backgroundColor: '#e0f2fe',
    border: '1px solid #0ea5e9',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#0ea5e9',
    cursor: 'pointer',
  },
  splitPaymentInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    height: '48px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '0 16px',
    marginBottom: '16px',
  },
  splitPaymentCurrencySymbol: {
    color: '#94a3b8',
    fontSize: '18px',
    fontWeight: '600',
    marginRight: '8px',
  },
  splitPaymentAmountInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
  },
  splitPaymentFractionRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
  },
  splitPaymentFractionBtn: {
    flex: 1,
    height: '36px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    cursor: 'pointer',
  },
  splitPaymentAddBtn: {
    height: '48px',
    backgroundColor: '#0ea5e9',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: 'auto',
  },
  splitPaymentSummaryBox: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
  },
  splitPaymentSummaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  splitPaymentSummaryLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
  },
  splitPaymentSummaryValueLarge: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
  },
  splitPaymentAppliedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
    marginBottom: '24px',
  },
  splitPaymentAppliedItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px',
  },
  splitPaymentAppliedItemLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  splitPaymentAppliedItemTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '2px',
  },
  splitPaymentAppliedItemTime: {
    fontSize: '11px',
    color: '#94a3b8',
  },
  splitPaymentAppliedItemRight: {
    display: 'flex',
    alignItems: 'center',
  },
  splitPaymentAppliedItemAmount: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
  },
  splitPaymentTotalsSection: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '20px',
  },
  splitPaymentTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  splitPaymentTotalLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  splitPaymentTotalValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
  },
  splitPaymentRemainingLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '600',
  },
  splitPaymentRemainingValue: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#0ea5e9',
  },
  splitPaymentCompleteBtn: {
    width: '100%',
    height: '48px',
    backgroundColor: '#e2e8f0',
    color: '#0f172a',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '16px',
  },
  cardSubMethodsContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderTop: 'none',
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
    padding: '0 16px 16px 16px',
    marginTop: '-12px',
    gap: '8px',
  },
  cardSubMethodBtn: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px 16px',
    cursor: 'pointer',
  },
  creditCardBrandsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    padding: '0 8px 8px 36px',
  },
  creditCardBrandBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  cardProcessingContainer: { display: 'flex', flexDirection: 'column', width: '100%' },
  cardProcessingHeader: { textAlign: 'center', padding: '24px 0 20px 0', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' },
  cardProcessingTitle: { margin: '0 0 8px 0', fontSize: '22px', fontWeight: '800', color: '#0f172a' },
  cardProcessingSubtitle: { margin: 0, fontSize: '13px', color: '#64748b' },
  cardProcessingAmountRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' },
  cardProcessingAmountLabel: { fontSize: '15px', fontWeight: '700', color: '#0f172a' },
  cardProcessingAmountValue: { fontSize: '26px', fontWeight: '800', color: '#0ea5e9' },
  cardProcessingStatusSection: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' },
  cardProcessingStatusTitle: { fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' },
  cardStatusRow: { display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', padding: '14px 16px', transition: 'opacity 0.4s ease' },
  cardStatusIcon: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background-color 0.4s ease' },
  cardProcessingFieldsRow: { display: 'flex', gap: '16px', marginBottom: '24px' },
  cardProcessingField: { flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' },
  cardProcessingFieldLabel: { fontSize: '12px', color: '#64748b', fontWeight: '600' },
  cardProcessingFieldInput: { height: '42px', backgroundColor: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px' },
  cardCancelBtn: { width: '100%', height: '48px', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', color: '#ef4444', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardDoneBtn: { width: '100%', height: '48px', backgroundColor: '#16a34a', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  processReturnCardsRow: {
    display: 'flex',
    gap: '24px',
    padding: '48px 32px',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    boxSizing: 'border-box',
  },
  processReturnCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    flex: '0 1 280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  processReturnCardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  processReturnCardIcon: {
    width: '44px',
    height: '44px',
    backgroundColor: '#e0f2fe',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  processReturnCardTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px',
  },
  processReturnCardSub: {
    fontSize: '12px',
    color: '#64748b',
    lineHeight: '1.5',
  },
  processReturnLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
  },
  processReturnInput: {
    width: '100%',
    height: '42px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '0 14px',
    fontSize: '13px',
    color: '#0f172a',
    outline: 'none',
    backgroundColor: '#f8fafc',
    boxSizing: 'border-box',
  },
  processReturnFindBtn: {
    width: '100%',
    height: '42px',
    backgroundColor: '#0ea5e9',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  processReturnManualBtn: {
    width: '100%',
    height: '42px',
    backgroundColor: '#334155',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  // ── Age Verification Modal ───────────────────────
  ageModalCard: {
    backgroundColor: '#ffffff',
    width: '460px',
    borderRadius: '24px',
    padding: '40px 32px',
    boxShadow: '0 25px 70px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    border: '1px solid #e2e8f0',
  },
  ageModalHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '32px',
  },
  ageModalIconContainer: {
    width: '72px',
    height: '72px',
    borderRadius: '20px',
    backgroundColor: '#fffbeb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    border: '1px solid #fef3c7',
  },
  ageModalTitle: {
    margin: '0 0 10px 0',
    fontSize: '24px',
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    letterSpacing: '-0.02em',
  },
  ageModalSubtitle: {
    margin: 0,
    fontSize: '15px',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: '1.6',
    padding: '0 10px',
  },
  ageModalFormGroup: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '32px',
    boxSizing: 'border-box',
  },
  ageFormLabel: {
    fontSize: '13px',
    color: '#475569',
    marginBottom: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  dobContainer: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    boxSizing: 'border-box',
  },
  dobInput: {
    flex: '1 1 0px',
    minWidth: 0,
    height: '56px',
    backgroundColor: '#f8fafc',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '17px',
    fontWeight: '700',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  },
  dobInputLarge: {
    flex: '1.5 1 0px',
    minWidth: 0,
    height: '56px',
    backgroundColor: '#f8fafc',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '17px',
    fontWeight: '700',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  },
  scanActionRow: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    marginBottom: '32px',
    boxSizing: 'border-box',
  },
  scanActionBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '52px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#334155',
    cursor: 'pointer',
    boxSizing: 'border-box',
    gap: '10px',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  ageModalFooter: {
    display: 'flex',
    gap: '16px',
    width: '100%',
    boxSizing: 'border-box',
  },
  ageBtnCancel: {
    flex: 1,
    height: '56px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '12px',
    color: '#475569',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    boxSizing: 'border-box',
    transition: 'background-color 0.2s',
  },
  ageBtnVerify: {
    flex: 1,
    height: '56px',
    backgroundColor: '#0ea5e9',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    boxSizing: 'border-box',
    transition: 'background-color 0.2s',
    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)',
  },
  successCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    width: '640px',
    maxWidth: '90vw',
    padding: '48px',
    boxShadow: '0 25px 70px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  successIconCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: '#ecfdf5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  successTitle: {
    margin: '0 0 12px 0',
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
  },
  successSubtitle: {
    margin: '0 0 32px 0',
    fontSize: '15px',
    color: '#64748b',
  },
  successAmountSection: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 0',
    borderTop: '1px solid #f1f5f9',
    borderBottom: '1px solid #f1f5f9',
    marginBottom: '32px',
  },
  successAmountLabel: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#0f172a',
  },
  successAmountValue: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#10b981',
  },
  successFieldsRow: {
    display: 'flex',
    gap: '20px',
    width: '100%',
    marginBottom: '40px',
  },
  successFieldItem: {
    flex: 1,
    textAlign: 'left',
  },
  successFieldLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '10px',
  },
  successFieldValue: {
    height: '48px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #edf2f7',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#334155',
  },
  successBtnRow: {
    display: 'flex',
    gap: '16px',
    width: '100%',
    justifyContent: 'center',
  },
  successBtnNewSale: {
    height: '52px',
    padding: '0 32px',
    backgroundColor: '#0ea5e9',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'background-color 0.2s',
  },
  successBtnPrint: {
    height: '52px',
    padding: '0 32px',
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
    color: '#334155',
    fontSize: '16px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'background-color 0.2s',
  },
  returnItemsContainer: {
    display: 'flex',
    gap: '32px',
    padding: '32px',
    height: '100%',
    boxSizing: 'border-box',
  },
  returnItemListSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  returnHeaderSection: {
    marginBottom: '8px',
  },
  returnMainTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 8px 0',
  },
  returnMetadata: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 16px 0',
  },
  returnSelectPrompt: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#334155',
    margin: 0,
  },
  returnTable: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 12px',
  },
  returnTableHeader: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '0 16px 8px 16px',
    textAlign: 'left',
  },
  returnRow: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  returnCell: {
    padding: '16px',
    borderTop: '1px solid #f1f5f9',
    borderBottom: '1px solid #f1f5f9',
    verticalAlign: 'middle',
  },
  returnCellFirst: {
    borderLeft: '1px solid #f1f5f9',
    borderTopLeftRadius: '12px',
    borderBottomLeftRadius: '12px',
  },
  returnCellLast: {
    borderRight: '1px solid #f1f5f9',
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
  },
  returnProductInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  returnProductImage: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  returnProductName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
  },
  returnProductSku: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '2px',
  },
  returnQtyInput: {
    width: '56px',
    height: '36px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  returnBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    display: 'inline-block',
  },
  returnSummarySidebar: {
    width: '380px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  returnSummaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    border: '1px solid #f1f5f9',
  },
  returnSummaryTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 20px 0',
  },
  returnSummaryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  returnSummaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#475569',
  },
  returnSummaryTotals: {
    borderTop: '1px solid #f1f5f9',
    paddingTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  returnSummaryTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  returnSummaryMainTotal: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0f172a',
  },
  returnRefundValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#10b981',
  },
  returnManagerBtn: {
    width: '100%',
    height: '52px',
    backgroundColor: '#0ea5e9',
    borderRadius: '12px',
    color: 'white',
    fontSize: '15px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '24px',
  },
  returnCancelBtn: {
    width: '100%',
    height: '52px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    color: '#64748b',
    fontSize: '15px',
    fontWeight: '700',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    marginTop: '12px',
  },
  confirmReturnModalCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    width: '560px',
    maxWidth: '90vw',
    padding: '44px',
    boxShadow: '0 25px 70px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  confirmReturnTitle: {
    margin: '0 0 16px 0',
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
  },
  confirmReturnSubtitle: {
    margin: '0 0 32px 0',
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#475569',
  },
  confirmCheckRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '40px',
    backgroundColor: '#f8fafc',
    padding: '16px 24px',
    borderRadius: '12px',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #e2e8f0',
  },
  confirmCheckText: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#334155',
  },
  confirmModalBtnRow: {
    display: 'flex',
    gap: '16px',
    width: '100%',
  },
  confirmBtnCancel: {
    flex: 1,
    height: '52px',
    backgroundColor: '#e2e8f0',
    borderRadius: '12px',
    color: '#334155',
    fontSize: '16px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
  },
  confirmBtnRefundEnabled: {
    flex: 1,
    height: '52px',
    backgroundColor: '#0ea5e9',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
  },
  confirmBtnRefundDisabled: {
    flex: 1,
    height: '52px',
    backgroundColor: '#bae6fd',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '700',
    border: 'none',
    cursor: 'not-allowed',
  },
  reasonReturnModalCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    width: '560px',
    maxWidth: '90vw',
    padding: '40px',
    boxShadow: '0 25px 70px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  reasonList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    margin: '24px 0 32px 0',
  },
  reasonItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  reasonItemActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  reasonRadio: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid #cbd5e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '14px',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  reasonRadioActive: {
    borderColor: '#0ea5e9',
    backgroundColor: '#ffffff',
  },
  reasonRadioDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#0ea5e9',
  },
  reasonText: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#334155',
  },
  reasonOtherBox: {
    marginTop: '12px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  reasonTextarea: {
    width: '100%',
    height: '100px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#475569',
    resize: 'none',
    padding: '4px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  refundMethodCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px 24px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  refundMethodCardActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  refundIconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#0ea5e9',
    transition: 'background-color 0.2s',
  },
  refundIconActive: {
    backgroundColor: '#ffffff',
  },
  refundMethodInfo: {
    flex: 1,
  },
  refundMethodTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 2px 0',
  },
  refundMethodSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
  },
  refundRequestCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    width: '520px',
    maxWidth: '90vw',
    padding: '44px 40px',
    boxShadow: '0 25px 70px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  // Transaction History Styles
  historyContainer: {
    padding: '32px',
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#f8fafc',
  },
  historyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  historyTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
  },
  historySubtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '6px',
  },
  historySearchContainer: {
    position: 'relative',
    width: '320px',
  },
  historySearchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  historySearchInput: {
    width: '100%',
    height: '44px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '0 16px 0 44px',
    fontSize: '14px',
    color: '#334155',
    outline: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  historyTableWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  },
  historyTable: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  historyTh: {
    padding: '16px 24px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  historyRow: {
    borderBottom: '1px solid #f8fafc',
    transition: 'background-color 0.2s',
  },
  historyTd: {
    padding: '20px 24px',
    fontSize: '14px',
    color: '#334155',
  },
  historyIdBadge: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0ea5e9',
    backgroundColor: '#f0f9ff',
    padding: '4px 10px',
    borderRadius: '6px',
    fontFamily: 'monospace',
  },
  historyCustomerCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatarSmall: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
  },
  paymentBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    display: 'inline-block',
  },
  historyActionBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

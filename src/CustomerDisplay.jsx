import React, { useState, useEffect } from 'react';
import winePromo from './assets/wine_promo.png';

const CustomerDisplay = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel('liquor-pos-sync');
    
    channel.onmessage = (event) => {
      const { type, data } = event.data;
      if (type === 'CART_UPDATE') {
        setCart(data.cart || []);
        setSubtotal(data.subtotal || 0);
        setTax(data.tax || 0);
        setTotal(data.total || 0);
        setIsSuccess(false);
      } else if (type === 'PAYMENT_SUCCESS') {
        setSuccessDetails(data);
        setIsSuccess(true);
      } else if (type === 'RESET') {
        setCart([]);
        setSubtotal(0);
        setTax(0);
        setTotal(0);
        setIsSuccess(false);
      }
    };

    return () => channel.close();
  }, []);

  return (
    <div style={styles.container}>
      {/* Inject Keyframes for the scanning pulse */}
      <style>
        {`
          @keyframes customer-pulse {
            0% { opacity: 0.4; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0.4; transform: scale(0.9); }
          }
        `}
      </style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoBlueSquare}>
            <span style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>+</span>
          </div>
          <span style={styles.brandName}>Liquor POS</span>
        </div>

        <div style={styles.headerRight}>
          <svg style={styles.iconButton} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <div style={styles.timeRow}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span style={styles.timeText}>{currentTime}</span>
          </div>
          <div style={styles.avatar}></div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Left Panel: Cart */}
        <div style={styles.leftPanel}>
          <div style={styles.cartHeaderSection}>
            <h2 style={styles.panelTitle}>Your Cart</h2>
            <div style={styles.scanningIndicator}>
              <div style={styles.pulseDot}></div>
              <span style={styles.scanningText}>Scanning items...</span>
            </div>
          </div>

          <div style={styles.itemList}>
            {cart.length === 0 ? (
              <div style={styles.emptyCartContainer}>
                <div style={styles.emptyCartIcon}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                </div>
                <p style={styles.emptyCartText}>Welcome! Ready to start your checkout.</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} style={styles.itemRow}>
                  <img src={item.image} alt={item.name} style={styles.itemImage} />
                  <div style={styles.itemInfo}>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.itemQty}>Qty: {item.quantity}</div>
                  </div>
                  <div style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))
            )}
          </div>

          <div style={styles.cartFooter}>
            <div style={styles.footerRow}>
              <span style={styles.footerLabel}>Subtotal</span>
              <span style={styles.footerValue}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.footerRow}>
              <span style={styles.footerLabel}>Taxes & Fees</span>
              <span style={styles.footerValue}>${tax.toFixed(2)}</span>
            </div>
            <div style={{ ...styles.footerRow, marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #e2e8f0' }}>
              <span style={styles.totalLabel}>Total Due</span>
              <span style={styles.totalValue}>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Promo */}
        <div style={styles.rightPanel}>
          <div style={styles.promoCard}>
            <img 
              src={winePromo} 
              alt="Wine Promo" 
              style={styles.promoImage} 
              onError={(e) => {
                // Fallback for demo if path is different
                e.target.src = "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80";
              }}
            />
            <div style={styles.promoContent}>
              <h1 style={styles.promoTitle}>Get 15% Off All Local Wines</h1>
              <p style={styles.promoSubtitle}>Discover the best of our region's vineyards. Ask your cashier for recommendations!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Overlay for Customer Display */}
      {isSuccess && (
        <div style={styles.successOverlay}>
          <div style={styles.successCard}>
            <div style={styles.successIconBox}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 style={styles.successTitle}>Payment Successful!</h2>
            <p style={styles.successMsg}>Thank you for your purchase.</p>
            <div style={styles.successAmount}>Total Paid: ${successDetails?.total?.toFixed(2)}</div>
            <p style={styles.receiptNote}>A digital receipt has been sent to your device.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"Inter", sans-serif',
    overflow: 'hidden',
  },
  header: {
    height: '88px',
    backgroundColor: '#ffffff',
    padding: '0 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e2e8f0',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  logoBlueSquare: {
    width: '44px',
    height: '44px',
    backgroundColor: '#0ea5e9',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.5px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  iconButton: {
    color: '#64748b',
  },
  avatar: {
    width: '44px',
    height: '44px',
    backgroundColor: '#fde047',
    borderRadius: '50%',
  },
  timeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  timeText: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#64748b',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    padding: '40px',
    gap: '40px',
  },
  leftPanel: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  },
  cartHeaderSection: {
    padding: '32px 40px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  panelTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
  },
  scanningIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#f0f9ff',
    padding: '8px 16px',
    borderRadius: '20px',
  },
  pulseDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#0ea5e9',
    borderRadius: '50%',
    animation: 'customer-pulse 2s infinite ease-in-out',
  },
  scanningText: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0ea5e9',
  },
  itemList: {
    flex: 1,
    padding: '0 40px',
    overflowY: 'auto',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '24px 0',
    borderBottom: '1px solid #f8fafc',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    objectFit: 'cover',
    backgroundColor: '#f1f5f9',
  },
  itemInfo: {
    flex: 1,
    paddingLeft: '24px',
  },
  itemName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px',
  },
  itemQty: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
  },
  emptyCartContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
  },
  emptyCartIcon: {
    marginBottom: '20px',
  },
  emptyCartText: {
    fontSize: '18px',
    fontWeight: '500',
  },
  cartFooter: {
    padding: '32px 40px',
    backgroundColor: '#fafafa',
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  footerLabel: {
    fontSize: '16px',
    color: '#64748b',
    fontWeight: '500',
  },
  footerValue: {
    fontSize: '16px',
    color: '#0f172a',
    fontWeight: '700',
  },
  totalLabel: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: '32px',
    fontWeight: '900',
    color: '#0ea5e9',
  },
  rightPanel: {
    width: '40%',
    display: 'flex',
    flexDirection: 'column',
  },
  promoCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: '32px',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  promoImage: {
    width: '100%',
    height: '50%',
    objectFit: 'cover',
  },
  promoContent: {
    padding: '48px',
    textAlign: 'center',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  promoTitle: {
    fontSize: '32px',
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: '20px',
    lineHeight: '1.2',
  },
  promoSubtitle: {
    fontSize: '16px',
    color: '#64748b',
    lineHeight: '1.6',
    margin: 0,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(241, 245, 249, 0.95)',
    backdropFilter: 'blur(20px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  successCard: {
    backgroundColor: '#ffffff',
    padding: '80px',
    borderRadius: '40px',
    textAlign: 'center',
    boxShadow: '0 30px 100px rgba(0,0,0,0.1)',
    maxWidth: '600px',
  },
  successIconBox: {
    width: '120px',
    height: '120px',
    backgroundColor: '#ecfdf5',
    borderRadius: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 40px auto',
  },
  successTitle: {
    fontSize: '44px',
    fontWeight: '900',
    color: '#0f172a',
    margin: '0 0 16px 0',
  },
  successMsg: {
    fontSize: '20px',
    color: '#64748b',
    marginBottom: '40px',
  },
  successAmount: {
    fontSize: '36px',
    fontWeight: '900',
    color: '#10b981',
    backgroundColor: '#f0fdf4',
    padding: '24px 48px',
    borderRadius: '24px',
    display: 'inline-block',
    marginBottom: '32px',
  },
  receiptNote: {
    fontSize: '15px',
    color: '#94a3b8',
    margin: 0,
  }
};

export default CustomerDisplay;

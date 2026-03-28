'use client'

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductPage from "./components/ProductPage";
import SignIn from "./components/SignIn";
import Contact from "./components/Contact";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Search from "./components/Search";
import AnnouncementBar from "./components/AnnouncementBar";
import CategoryBanner from "./components/CategoryBanner";
import AdminDashboard from "./components/AdminDashboard";
import { getProducts } from "./lib/api";

// ── localStorage cart (no login required for shoppers) ──
function readCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}
function writeCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart.reduce((s, i) => s + i.qty, 0);
}
function localAddToCart(productId, qty = 1) {
  const cart = readCart();
  const existing = cart.find((i) => i.productId === productId);
  if (existing) existing.qty += qty;
  else cart.push({ productId, qty });
  return writeCart(cart);
}

import asset1 from "./data/assets/5B93E622-F9D1-4940-BD1E-23D8C50DA7CE.jpeg";
import asset2 from "./data/assets/7034D6BE-D40F-4109-8491-DB4A62C6C5D1.jpeg";
import asset3 from "./data/assets/F76B3622-4117-4C44-95EC-23767ED68A04.jpeg";
import asset4 from "./data/assets/B3957D09-1B9C-40E8-A1F5-281901BA1D65.jpeg";

const assetButtons = [
  { src: asset1, label: "Footwear", category: "footwear" },
  { src: asset2, label: "Electronics", category: "electronics" },
  { src: asset3, label: "Handmade Rugs", category: "rugs" },
  { src: asset4, label: "New Arrivals", category: "all" },
];

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [currentSection, setCurrentSection] = useState(null);
  const [signInOpen, setSignInOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(readCart);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // Fetch products from API (falls back to static if server is down)
  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => {});
  }, []);

  // Load user + cart from localStorage after hydration
  useEffect(() => {
    setUser(loadUser());
    setCartCount(readCart().reduce((s, i) => s + i.qty, 0));
  }, []);

  function handleAuthSuccess({ token, user: u }) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  }

  function handleSignOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  function handleAddToCart(productId, qty = 1) {
    const count = localAddToCart(productId, qty);
    setCartCount(count);
    setCartItems(readCart());
  }

  function handleRemoveFromCart(productId) {
    const cart = readCart().filter((i) => i.productId !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart);
    setCartCount(cart.reduce((s, i) => s + i.qty, 0));
  }

  function handleUpdateCartQty(productId, qty) {
    if (qty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    const cart = readCart().map((i) =>
      i.productId === productId ? { ...i, qty } : i,
    );
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart);
    setCartCount(cart.reduce((s, i) => s + i.qty, 0));
  }

  function handleOrderSuccess() {
    localStorage.removeItem("cart");
    setCartItems([]);
    setCartCount(0);
    setActivePage("order-success");
  }

  function navigate(id) {
    setCurrentProduct(null);
    if (id === "home") {
      setCurrentSection(null);
      setActivePage("home");
    } else if (id === "contact") {
      setCurrentSection(null);
      setActivePage("contact");
    } else if (id === "admin") {
      setCurrentSection(null); setActivePage("admin")
    } else if (id === "cart" || id === "checkout") {
      setCurrentSection(null);
      setActivePage(id);
    } else {
      setCurrentSection(id);
      setActivePage(id);
    }
  }

  const activeSection = assetButtons.find((b) => b.category === currentSection);
  const currentPageLabel =
    (activePage === "contact"
      ? "Contact"
      : activePage === "cart"
        ? "Bag"
        : activePage === "checkout"
          ? "Checkout"
          : activePage === "admin"
            ? "Admin"
            : null);

  function handleBack() {
    if (currentProduct) setCurrentProduct(null);
    else if (activePage === "checkout") navigate("cart");
    else if (activePage === "contact") navigate("home");
    else {
      setCurrentSection(null);
      setActivePage("home");
    }
  }

  const sectionProducts =
    currentSection === "all"
      ? products
      : products.filter((p) => p.category === currentSection);


  return (
    <div className="min-h-screen bg-white">
      {showBanner && <AnnouncementBar onDismiss={() => setShowBanner(false)} />}

      <Header
        onMenuOpen={() => setSidebarOpen(true)}
        cartCount={cartCount}
        currentPage={currentPageLabel}
        onBack={handleBack}
        onSignIn={() => setSignInOpen(true)}
        user={user}
        onSignOut={handleSignOut}
        onCartOpen={() => navigate("cart")}
        onSearchOpen={() => setSearchOpen(true)}
        activePage={activePage}
        onNavigate={navigate}
      />

      <Search
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => {
          setSearchOpen(false);
          setCurrentProduct(p);
        }}
      />

      <SignIn
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={activePage}
        onNavigate={navigate}
      />

      {activePage === "admin" && user ? (
        <AdminDashboard
          products={products}
          onProductsChange={() => getProducts().then(setProducts).catch(() => {})}
        />
      ) : (
        <div className="px-5">
          {activePage === "cart" ? (
            <Cart
              cartItems={cartItems}
              products={products}
              onRemove={handleRemoveFromCart}
              onUpdateQty={handleUpdateCartQty}
              onCheckout={() => navigate("checkout")}
              onContinue={() => navigate("home")}
            />
          ) : activePage === "checkout" ? (
            <Checkout
              cartItems={cartItems}
              products={products}
              onBack={() => navigate("cart")}
              onSuccess={handleOrderSuccess}
            />
          ) : activePage === "contact" ? (
            <Contact />
          ) : currentProduct ? (
            <ProductPage product={currentProduct} onAddToCart={handleAddToCart} />
          ) : currentSection ? (
            <div className="pt-7 p-8 pb-12">
              <p className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-bold mb-5 capitalize">
                {currentSection}
              </p>
              <div className="grid grid-cols-5 gap-x-3 gap-y-6">
                {sectionProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={() => setCurrentProduct(p)}
                    onAddToCart={() => handleAddToCart(p.id)}
                  />
                ))}
              </div>
              {sectionProducts.length === 0 && (
                <p className="text-center text-black/20 py-20 text-sm tracking-wide">
                  No products yet.
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="-mx-5">
                <Hero onShopAll={() => setCurrentSection("all")} />
              </div>
              <CategoryBanner onNavigate={navigate} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

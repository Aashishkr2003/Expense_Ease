import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Auth } from "./pages/auth";
import { FinancialRecordsProvider } from "./contexts/financial-record-context";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <div className="app-container">
        <div className="navbar" style={{ position: "relative", minHeight: "80px" }}>
          <div style={{ flex: 1 }} />
          <h2
            style={{
              margin: 0,
              textAlign: "center",
              flex: "none",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: "65%",
              translate: "0 -50%",
              zIndex: 1,
            }}
          >
            ExpenseEase
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, justifyContent: "flex-end" }}>
            {/* Only show theme toggle and user button on dashboard, not on auth page */}
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <button
                      className="theme-toggle-btn"
                      onClick={toggleTheme}
                      aria-label="Toggle theme"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.5rem",
                        color: "inherit",
                        padding: 0,
                      }}
                    >
                      {theme === "light" ? "🌙" : "☀️"}
                    </button>
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                  </>
                }
              />
            </Routes>
          </div>
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <FinancialRecordsProvider>
                    <Dashboard />
                  </FinancialRecordsProvider>
                </SignedIn>
                <SignedOut>
                  <Navigate to="/auth" replace />
                </SignedOut>
              </>
            }
          />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

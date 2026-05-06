import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Waves, Menu, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { LanguageToggle } from "./LanguageToggle";

const linkBase =
  "text-sm font-medium tracking-wide transition-colors px-3 py-2 rounded-full";
const linkInactive = "text-zinc-400 hover:text-white";
const linkActive = "text-white bg-white/[0.06] border border-white/10";

export const Nav = () => {
  const { t } = useApp();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 pt-4">
      <nav
        data-testid="main-nav"
        className="mx-auto flex max-w-7xl items-center justify-between glass rounded-full px-4 sm:px-6 py-2.5"
      >
        <Link
          to="/"
          data-testid="brand-link"
          className="flex items-center gap-2.5 group"
        >
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/30 to-rose-700/10 border border-rose-400/30">
            <Waves className="h-4 w-4 text-rose-300 group-hover:text-white transition-colors" />
            <span className="absolute inset-0 rounded-full bg-rose-500/30 blur-md opacity-50" />
          </span>
          <div className="leading-tight">
            <p className="font-heading text-lg font-semibold tracking-tight">
              {t.nav.brand}
            </p>
            <p className="hidden sm:block text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              Auditory Detection
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            end
            data-testid="nav-home"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            {t.nav.home}
          </NavLink>
          <NavLink
            to="/detector"
            data-testid="nav-detector"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            {t.nav.detector}
          </NavLink>
          <NavLink
            to="/dashboard"
            data-testid="nav-dashboard"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            {t.nav.dashboard}
          </NavLink>
          <NavLink
            to="/about"
            data-testid="nav-about"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            {t.nav.about}
          </NavLink>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <button
            type="button"
            data-testid="mobile-menu-toggle"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-200 hover:text-white"
            aria-label="Open menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          data-testid="mobile-menu"
          className="md:hidden mx-auto max-w-7xl mt-2 glass rounded-3xl p-3 animate-fade-up"
        >
          <div className="flex flex-col">
            {[
              { to: "/", label: t.nav.home, end: true, testid: "mobile-nav-home" },
              { to: "/detector", label: t.nav.detector, testid: "mobile-nav-detector" },
              { to: "/dashboard", label: t.nav.dashboard, testid: "mobile-nav-dashboard" },
              { to: "/about", label: t.nav.about, testid: "mobile-nav-about" },
            ].map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                data-testid={it.testid}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/[0.06] text-white border border-white/10"
                      : "text-zinc-300 hover:bg-white/[0.04] hover:text-white"
                  }`
                }
              >
                {it.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

import { Logo } from "./components/Logo"
import { StoreProvider } from "./store"
import { Toasts } from "./ui"
import Search from "./pages/Search"
import Tokens from "./pages/Tokens"

function Shell() {
  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <Logo />
          <span className="brand-name">SCM.Museum</span>
        </div>
      </header>
      <main className="page">
        {location.hash === "#/tokens" ? <Tokens /> : <Search />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
      <Toasts />
    </StoreProvider>
  )
}

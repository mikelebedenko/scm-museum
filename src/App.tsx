import { StoreProvider } from "./store"
import { Toasts } from "./ui"
import Search from "./pages/Search"
import Tokens from "./pages/Tokens"

function Shell() {
  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <span className="brandmark">К</span>
          <span>
            <b>Кабінет дослідника</b>
            <small>Архів усної історії</small>
          </span>
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

import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { store } from "./config/redux"
import App from "./App"
import "./index.css"

ReactDOM.createRoot(document.querySelector("#root") as HTMLElement).render(
  <Provider store={ store }>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </Provider>
)

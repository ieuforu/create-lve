import ReactDOM from 'react-dom/client'
import './styles.css'
import { StrictMode } from 'react'
import { App } from '#/app/App'

const rootElement = document.getElementById('react-root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

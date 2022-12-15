import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Main from './pages/parser'
import { Layout } from './layout'
import { HashRouter } from 'react-router-dom'
import GetRoutes from "./routes"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Layout>
        <HashRouter>
          <GetRoutes />
        </HashRouter>
      </Layout>
    </div>
  )
}

export default App

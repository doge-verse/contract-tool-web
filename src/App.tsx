import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Main from './pages/main'
import { Layout } from './layout'
import { BrowserRouter } from 'react-router-dom'
import GetRoutes from "./routes"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Layout>
        <BrowserRouter>
          <GetRoutes />
        </BrowserRouter>
      </Layout>
    </div>
  )
}

export default App

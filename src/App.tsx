import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Main from './pages/main'
import { Layout } from './layout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Layout>
        <Main></Main>
      </Layout>
    </div>
  )
}

export default App

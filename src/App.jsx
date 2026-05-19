import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SlapStatus from "./SlapStatus"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SlapStatus />} />
      </Routes>
    </Router>
  )
}

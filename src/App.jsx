import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SlapStatus from "./SlapStatus"
import Test from "./Test"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SlapStatus />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  )
}
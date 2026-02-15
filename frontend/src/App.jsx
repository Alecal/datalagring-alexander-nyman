import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Users from './pages/Users'
import Courses from './pages/Courses'
import CourseOfferings from './pages/CourseOfferings'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course-offerings" element={<CourseOfferings />} />
      </Route>
    </Routes>
  )
}

export default App

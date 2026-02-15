import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Users from './pages/Users'
import UserEdit from './pages/UserEdit'
import Courses from './pages/Courses'
import CourseOfferings from './pages/CourseOfferings'
import Instructors from './pages/Instructors'
import Expertises from './pages/Expertises'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id/edit" element={<UserEdit />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/course-offerings" element={<CourseOfferings />} />
        <Route path="/expertises" element={<Expertises />} />
      </Route>
    </Routes>
  )
}

export default App

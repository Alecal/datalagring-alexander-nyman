import { Link, NavLink, Outlet } from 'react-router-dom'

const navClass = ({ isActive }) =>
  `font-medium ${isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'}`

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-slate-800 hover:text-slate-600">
            Membler
          </Link>
          <nav className="flex gap-6">
            <NavLink to="/users" className={navClass}>Användare</NavLink>
            <NavLink to="/courses" className={navClass}>Kurser</NavLink>
            <NavLink to="/instructors" className={navClass}>Lärare</NavLink>
            <NavLink to="/course-offerings" className={navClass}>Kurstillfällen</NavLink>
            <NavLink to="/expertises" className={navClass}>Expertiser</NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

import { Link, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-slate-800 hover:text-slate-600">
            Membler
          </Link>
          <nav className="flex gap-6">
            <Link to="/users" className="text-slate-600 hover:text-slate-900 font-medium">
              Users
            </Link>
            <Link to="/courses" className="text-slate-600 hover:text-slate-900 font-medium">
              Courses
            </Link>
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

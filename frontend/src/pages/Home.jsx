import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome</h1>
      <p className="text-slate-600 mb-8">Get started with Users and Courses.</p>
      <div className="flex gap-4">
        <Link
          to="/users"
          className="inline-block px-5 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700"
        >
          Users
        </Link>
        <Link
          to="/courses"
          className="inline-block px-5 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700"
        >
          Courses
        </Link>
      </div>
    </div>
  )
}

export default Home

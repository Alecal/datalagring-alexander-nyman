import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Välkommen</h1>
      <p className="text-slate-600 mb-8">
        Här hanterar du användare, kurser, lärare och kurstillfällen.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/users"
          className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700"
        >
          Användare
        </Link>
        <Link
          to="/courses"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          Kurser
        </Link>
        <Link
          to="/instructors"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          Lärare
        </Link>
        <Link
          to="/course-offerings"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          Kurstillfällen
        </Link>
        <Link
          to="/expertises"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          Expertiser
        </Link>
      </div>
    </div>
  )
}

export default Home

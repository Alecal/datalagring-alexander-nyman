import { useState, useEffect } from 'react'
import { get } from '../api/client'

function InstructorIcon() {
  return (
    <span className="inline-flex shrink-0" title="Instructor" aria-hidden>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-600">
        <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912a.75.75 0 0 1-.6 0 49.913 49.913 0 0 0-9.902-3.912.75.75 0 0 1-.231-1.337A60.65 60.65 0 0 1 11.7 2.805Z" />
        <path fillRule="evenodd" d="M3.478 12.305a.75.75 0 0 1 .422.97l-.825 2.25a.75.75 0 0 1-1.422-.354l.824-2.25a.75.75 0 0 1 1-.422ZM3.75 17.25a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 0 1.5h-.01a.75.75 0 0 1-.75-.75Zm15.75-.75a.75.75 0 0 1-.75.75h-.01a.75.75 0 0 1 0-1.5h.01a.75.75 0 0 1 .75.75Zm-.75-3a.75.75 0 0 0 .75-.75h.01a.75.75 0 0 0 0-1.5h-.01a.75.75 0 0 0-.75.75Z" clipRule="evenodd" />
      </svg>
    </span>
  )
}

const FILTER_ALL = 'all'
const FILTER_STUDENTS = 'students'
const FILTER_INSTRUCTORS = 'instructors'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState(FILTER_ALL)

  useEffect(() => {
    get('/api/users')
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter((user) => {
    if (filter === FILTER_STUDENTS) return !user.isInstructor
    if (filter === FILTER_INSTRUCTORS) return user.isInstructor
    return true
  })

  if (loading) return <p className="text-slate-600">Loading…</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Users</h1>
      <p className="text-slate-600 mb-6">User list and management.</p>
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setFilter(FILTER_ALL)}
          className={`px-4 py-2 rounded-lg font-medium ${filter === FILTER_ALL ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
        >
          Visa alla
        </button>
        <button
          type="button"
          onClick={() => setFilter(FILTER_STUDENTS)}
          className={`px-4 py-2 rounded-lg font-medium ${filter === FILTER_STUDENTS ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
        >
          Visa Elever
        </button>
        <button
          type="button"
          onClick={() => setFilter(FILTER_INSTRUCTORS)}
          className={`px-4 py-2 rounded-lg font-medium ${filter === FILTER_INSTRUCTORS ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
        >
          Visa Lärare
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {filtered.map((user) => (
          <div
            key={user.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-800">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-slate-600">{user.email}</p>
                {user.bio && (
                  <p className="mt-2 text-sm text-slate-500">{user.bio}</p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              {user.isInstructor && <InstructorIcon />}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-slate-500">Inga användare att visa.</p>
      )}
    </div>
  )
}

export default Users

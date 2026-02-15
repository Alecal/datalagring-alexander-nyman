import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { get, post } from '../api/client'

function TeacherIcon({ className = 'w-10 h-10' }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700" title="Lärare" aria-hidden>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912a.75.75 0 0 1-.6 0 49.913 49.913 0 0 0-9.902-3.912.75.75 0 0 1-.231-1.337A60.65 60.65 0 0 1 11.7 2.805Z" />
        <path fillRule="evenodd" d="M3.478 12.305a.75.75 0 0 1 .422.97l-.825 2.25a.75.75 0 0 1-1.422-.354l.824-2.25a.75.75 0 0 1 1-.422ZM3.75 17.25a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 0 1.5h-.01a.75.75 0 0 1-.75-.75Zm15.75-.75a.75.75 0 0 1-.75.75h-.01a.75.75 0 0 1 0-1.5h.01a.75.75 0 0 1 .75.75Zm-.75-3a.75.75 0 0 0 .75-.75h.01a.75.75 0 0 0 0-1.5h-.01a.75.75 0 0 0-.75.75Z" clipRule="evenodd" />
      </svg>
    </span>
  )
}

function StudentIcon({ className = 'w-10 h-10' }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600" title="Elev / deltagare" aria-hidden>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
      </svg>
    </span>
  )
}

const FILTER_ALL = 'all'
const FILTER_STUDENTS = 'students'
const FILTER_INSTRUCTORS = 'instructors'

const emptyUserForm = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'student',
  bio: '',
  expertiseIds: [],
}

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState(FILTER_ALL)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [form, setForm] = useState(emptyUserForm)
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [expertises, setExpertises] = useState([])

  const loadUsers = () => {
    setLoading(true)
    Promise.all([get('/api/users'), get('/api/instructors'), get('/api/expertises')])
      .then(([u, i, ex]) => {
        setUsers(Array.isArray(u) ? u : [])
        setInstructorIds(new Set((Array.isArray(i) ? i : []).map((x) => x.userId ?? x.UserId).filter(Boolean)))
        setExpertises(Array.isArray(ex) ? ex : [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  const [instructorIds, setInstructorIds] = useState(new Set())

  useEffect(() => {
    loadUsers()
  }, [])

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    const isInstructor = form.role === 'instructor'
    try {
      await post('/api/users', {
        FirstName: form.firstName.trim(),
        LastName: form.lastName.trim(),
        Email: form.email.trim(),
        IsInstructor: isInstructor,
        Bio: isInstructor ? (form.bio.trim() || null) : null,
        ExpertiseIds: isInstructor && form.expertiseIds?.length ? form.expertiseIds : null,
      })
      setForm(emptyUserForm)
      setShowCreateForm(false)
      loadUsers()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleExpertise = (id) => {
    setForm((f) => ({
      ...f,
      expertiseIds: f.expertiseIds.includes(id)
        ? f.expertiseIds.filter((x) => x !== id)
        : [...f.expertiseIds, id],
    }))
  }

  const isInstructor = (user) => instructorIds.has(user.id ?? user.Id)
  const filtered = users.filter((user) => {
    if (filter === FILTER_STUDENTS) return !isInstructor(user)
    if (filter === FILTER_INSTRUCTORS) return isInstructor(user)
    return true
  })

  if (loading) return <p className="text-slate-600">Laddar…</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Användare</h1>
      <p className="text-slate-600 mb-8">Lista och hantera användare. Här skapar du användare som kan vara elever eller lärare.</p>

      {showCreateForm ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Skapa användare</h2>
          <form onSubmit={handleCreateUser} className="flex flex-col gap-4 max-w-md">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">Förnamn</label>
              <input
                id="firstName"
                type="text"
                required
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">Efternamn</label>
              <input
                id="lastName"
                type="text"
                required
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">E-post</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
            <div>
              <span className="block text-sm font-medium text-slate-700 mb-2">Roll</span>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={form.role === 'student'}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="rounded-full border-slate-300 text-slate-800 focus:ring-slate-500"
                  />
                  <span className="text-slate-700">Elev</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="instructor"
                    checked={form.role === 'instructor'}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="rounded-full border-slate-300 text-slate-800 focus:ring-slate-500"
                  />
                  <span className="text-slate-700">Lärare</span>
                </label>
              </div>
            </div>
            {form.role === 'instructor' && (
              <>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">Bio (valfritt)</label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                    placeholder="Kort beskrivning, erfarenhet, kompetens …"
                  />
                </div>
                <div>
                  <span className="block text-sm font-medium text-slate-700 mb-2">Expertis(er) (valfritt)</span>
                  {expertises.length === 0 ? (
                    <p className="text-sm text-slate-500">Inga expertiser finns registrerade. Du kan lägga till dem vid redigering.</p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {expertises.map((ex) => (
                        <label key={ex.id ?? ex.Id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.expertiseIds.includes(ex.id ?? ex.Id)}
                            onChange={() => toggleExpertise(ex.id ?? ex.Id)}
                            className="rounded border-slate-300 text-slate-800 focus:ring-slate-500"
                          />
                          <span className="text-slate-700">{ex.subject ?? ex.Subject}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            {submitError && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{submitError}</p>}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {submitting ? 'Skapar…' : 'Skapa användare'}
              </button>
              <button
                type="button"
                onClick={() => { setShowCreateForm(false); setSubmitError(null); setForm(emptyUserForm); }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
              >
                Avbryt
              </button>
            </div>
          </form>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="mb-8 rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700"
        >
          Skapa användare
        </button>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setFilter(FILTER_ALL)}
          className={`rounded-lg px-4 py-2 font-medium ${filter === FILTER_ALL ? 'bg-slate-800 text-white hover:bg-slate-700' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
        >
          Visa alla
        </button>
        <button
          type="button"
          onClick={() => setFilter(FILTER_STUDENTS)}
          className={`rounded-lg px-4 py-2 font-medium ${filter === FILTER_STUDENTS ? 'bg-slate-800 text-white hover:bg-slate-700' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
        >
          Visa elever
        </button>
        <button
          type="button"
          onClick={() => setFilter(FILTER_INSTRUCTORS)}
          className={`rounded-lg px-4 py-2 font-medium ${filter === FILTER_INSTRUCTORS ? 'bg-slate-800 text-white hover:bg-slate-700' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
        >
          Visa lärare
        </button>
      </div>
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <p className="p-8 text-slate-500">Inga användare att visa.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
        {filtered.map((user) => (
          <li
            key={user.id ?? user.Id}
            className="flex gap-4 p-4 relative"
          >
            <div className="flex shrink-0 items-center">
              {isInstructor(user) ? <TeacherIcon /> : <StudentIcon />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-800">
                {user.firstName ?? user.FirstName} {user.lastName ?? user.LastName}
              </p>
              <p className="text-sm text-slate-600">{user.email ?? user.Email}</p>
              {(user.bio ?? user.Bio) && (
                <p className="mt-2 text-sm text-slate-500">{user.bio ?? user.Bio}</p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
              </p>
            </div>
            <div className="absolute top-4 right-4">
              <Link
                to={`/users/${user.id ?? user.Id}/edit`}
                className="inline-block rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Redigera
              </Link>
            </div>
          </li>
        ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default Users

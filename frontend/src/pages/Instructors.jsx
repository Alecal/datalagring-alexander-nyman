import { useState, useEffect } from 'react'
import { get, post } from '../api/client'

function Instructors() {
  const [users, setUsers] = useState([])
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    setLoading(true)
    setError(null)
    Promise.all([get('/api/users'), get('/api/instructors')])
      .then(([u, i]) => {
        setUsers(Array.isArray(u) ? u : [])
        setInstructors(Array.isArray(i) ? i : [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const instructorUserIds = new Set(
    instructors.map((i) => i.userId ?? i.UserId).filter(Boolean)
  )
  const usersNotInstructors = users.filter(
    (u) => !instructorUserIds.has(u.id ?? u.Id)
  )

  const handleRegister = async (e) => {
    e.preventDefault()
    const userId = selectedUserId?.trim()
    if (!userId) return
    setSubmitError(null)
    setSubmitting(true)
    try {
      await post('/api/instructors', { userId })
      setSelectedUserId('')
      load()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-slate-600">Laddar…</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Lärare</h1>
      <p className="text-slate-600 mb-6">
        Registrera användare som lärare så att de kan väljas vid skapande av kurstillfällen.
      </p>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Registrera användare som lärare</h2>
        <form onSubmit={handleRegister} className="flex flex-wrap items-end gap-4">
          <div className="min-w-[200px]">
            <label htmlFor="instructor-user" className="block text-sm font-medium text-slate-700 mb-1">
              Välj användare
            </label>
            <select
              id="instructor-user"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
            >
              <option value="">– Välj –</option>
              {usersNotInstructors.map((u) => (
                <option key={u.id ?? u.Id} value={u.id ?? u.Id}>
                  {(u.firstName ?? u.FirstName ?? '')} {(u.lastName ?? u.LastName ?? '')} ({u.email ?? u.Email ?? ''})
                </option>
              ))}
            </select>
            {usersNotInstructors.length === 0 && users.length > 0 && (
              <p className="mt-1 text-sm text-slate-500">Alla användare är redan registrerade som lärare.</p>
            )}
            {users.length === 0 && (
              <p className="mt-1 text-sm text-amber-600">Inga användare. Skapa först användare under Users.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting || !selectedUserId || usersNotInstructors.length === 0}
            className="px-4 py-2 rounded-lg font-medium bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {submitting ? 'Registrerar…' : 'Registrera som lärare'}
          </button>
        </form>
        {submitError && <p className="mt-2 text-sm text-red-600">{submitError}</p>}
      </div>

      <h2 className="text-lg font-semibold text-slate-800 mb-2">Registrerade lärare</h2>
      <div className="flex flex-col gap-2">
        {instructors.length === 0 ? (
          <p className="text-slate-500">Inga lärare registrerade än. Registrera en användare ovan.</p>
        ) : (
          instructors.map((i) => (
            <div
              key={i.userId ?? i.UserId}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm"
            >
              {(i.firstName ?? i.FirstName ?? '')} {(i.lastName ?? i.LastName ?? '')}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Instructors

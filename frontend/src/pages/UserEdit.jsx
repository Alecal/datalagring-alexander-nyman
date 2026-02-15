import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { get, put } from '../api/client'

function UserEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', bio: '', expertiseIds: [] })
  const [expertises, setExpertises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([get(`/api/users/${id}`), get('/api/expertises')])
      .then(([userData, exList]) => {
        setUser(userData)
        setExpertises(Array.isArray(exList) ? exList : [])
        setForm({
          firstName: userData.firstName ?? userData.FirstName ?? '',
          lastName: userData.lastName ?? userData.LastName ?? '',
          email: userData.email ?? userData.Email ?? '',
          bio: userData.bio ?? userData.Bio ?? '',
          expertiseIds: [],
        })
        const isInstructor = userData.isInstructor ?? userData.IsInstructor
        if (isInstructor) {
          return get(`/api/instructors/${id}`).then((instructor) => {
            const ids = (instructor.expertises ?? instructor.Expertises ?? []).map((e) => e.id ?? e.Id)
            setForm((f) => ({ ...f, expertiseIds: ids }))
          })
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    try {
      await put(`/api/users/${id}`, {
        id,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
      })
      const isInstructor = user?.isInstructor ?? user?.IsInstructor
      if (isInstructor) {
        await put(`/api/instructors/${id}`, {
          userId: id,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          bio: form.bio.trim() || null,
          expertiseIds: form.expertiseIds?.length ? form.expertiseIds : null,
        })
      }
      navigate('/users')
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-slate-600">Laddar…</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (!user) return <p className="text-slate-600">Användaren hittades inte.</p>

  const isInstructor = user.isInstructor ?? user.IsInstructor

  return (
    <div className="max-w-2xl">
      <nav className="mb-8">
        <Link
          to="/users"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <span aria-hidden>←</span> Tillbaka till användare
        </Link>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Redigera användare</h1>
        <p className="mt-1 text-slate-600">
          {isInstructor
            ? 'Uppdatera uppgifter och eventuellt bio för läraren.'
            : 'Uppdatera namn och e-post.'}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Uppgifter</h2>
          <div className="flex flex-col gap-4">
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
          </div>
        </section>

        {isInstructor && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Lärare – bio och expertis</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">Kort beskrivning eller kompetens</label>
                <textarea
                  id="bio"
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  placeholder="T.ex. erfarenhet, ämnen, certifieringar …"
                />
              </div>
              {expertises.length > 0 && (
                <div>
                  <span className="block text-sm font-medium text-slate-700 mb-2">Expertis(er)</span>
                  <div className="flex flex-wrap gap-3">
                    {expertises.map((ex) => (
                      <label key={ex.id ?? ex.Id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.expertiseIds.includes(ex.id ?? ex.Id)}
                          onChange={() => setForm((f) => ({
                            ...f,
                            expertiseIds: f.expertiseIds.includes(ex.id ?? ex.Id)
                              ? f.expertiseIds.filter((x) => x !== (ex.id ?? ex.Id))
                              : [...f.expertiseIds, ex.id ?? ex.Id],
                          }))}
                          className="rounded border-slate-300 text-slate-800 focus:ring-slate-500"
                        />
                        <span className="text-slate-700">{ex.subject ?? ex.Subject}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {submitError && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{submitError}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {submitting ? 'Sparar…' : 'Spara'}
          </button>
          <Link
            to="/users"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            Avbryt
          </Link>
        </div>
      </form>
    </div>
  )
}

export default UserEdit

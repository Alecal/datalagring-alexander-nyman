import { useState, useEffect } from 'react'
import { get, post, put, del } from '../api/client'

const inputClass = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500'
const labelClass = 'block text-sm font-medium text-slate-700 mb-1'

function Expertises() {
  const [expertises, setExpertises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newSubject, setNewSubject] = useState('')
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editSubject, setEditSubject] = useState('')

  const loadExpertises = () => {
    setLoading(true)
    get('/api/expertises')
      .then((data) => setExpertises(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadExpertises()
  }, [])

  const id = (ex) => ex.id ?? ex.Id
  const subject = (ex) => ex.subject ?? ex.Subject

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    try {
      await post('/api/expertises', { Subject: newSubject.trim() })
      setNewSubject('')
      setShowCreateForm(false)
      loadExpertises()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (ex) => {
    setEditingId(id(ex))
    setEditSubject(subject(ex))
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditSubject('')
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editingId) return
    setSubmitError(null)
    setSubmitting(true)
    try {
      await put(`/api/expertises/${editingId}`, { Id: editingId, Subject: editSubject.trim() })
      cancelEdit()
      loadExpertises()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (ex) => {
    if (!window.confirm(`Ta bort expertisen "${subject(ex)}"?`)) return
    try {
      await del(`/api/expertises/${id(ex)}`)
      loadExpertises()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p className="text-slate-600">Laddar…</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Expertiser</h1>
      <p className="text-slate-600 mb-8">
        Hantera expertisområden (t.ex. programmeringsspråk och tekniker). Dessa kan kopplas till lärare vid skapande eller redigering.
      </p>

      {showCreateForm ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Lägg till expertis</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div>
              <label htmlFor="newSubject" className={labelClass}>Namn (t.ex. C#, React, SQL)</label>
              <input
                id="newSubject"
                type="text"
                required
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className={inputClass}
                placeholder="T.ex. C#"
              />
            </div>
            {submitError && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{submitError}</p>}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {submitting ? 'Skapar…' : 'Lägg till'}
              </button>
              <button
                type="button"
                onClick={() => { setShowCreateForm(false); setSubmitError(null); setNewSubject(''); }}
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
          Lägg till expertis
        </button>
      )}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {expertises.length === 0 ? (
          <p className="p-8 text-slate-500">Inga expertiser än. Lägg till några ovan.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {expertises.map((ex) => (
              <li key={id(ex)} className="p-4 flex items-center justify-between gap-4">
                {editingId === id(ex) ? (
                  <form onSubmit={handleUpdate} className="flex-1 flex items-center gap-3">
                    <input
                      type="text"
                      required
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      className={inputClass + ' flex-1'}
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                    >
                      Spara
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Avbryt
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="font-medium text-slate-800">{subject(ex)}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(ex)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Redigera
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(ex)}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        Ta bort
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default Expertises

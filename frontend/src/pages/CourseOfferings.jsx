import { useState, useEffect } from 'react'
import { get, post, put, del } from '../api/client'

const emptyForm = {
  courseId: '',
  instructorId: '',
  maxCapacity: 20,
  startDate: '',
  endDate: '',
}

function CourseOfferings() {
  const [offerings, setOfferings] = useState([])
  const [courses, setCourses] = useState([])
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(emptyForm)

  const loadOfferings = () => {
    get('/api/course-offerings')
      .then(setOfferings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      get('/api/course-offerings'),
      get('/api/courses'),
      get('/api/instructors'),
    ])
      .then(([off, c, i]) => {
        setOfferings(Array.isArray(off) ? off : [])
        setCourses(Array.isArray(c) ? c : [])
        setInstructors(Array.isArray(i) ? i : [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    try {
      await post('/api/course-offerings', {
        courseId: form.courseId,
        instructorId: form.instructorId,
        maxCapacity: Number(form.maxCapacity),
        startDate: form.startDate,
        endDate: form.endDate,
      })
      setForm(emptyForm)
      setShowCreateForm(false)
      loadOfferings()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (o) => {
    const id = o.id ?? o.Id
    setEditingId(id)
    setEditForm({
      courseId: o.courseId ?? o.CourseId ?? '',
      instructorId: o.instructorId ?? o.InstructorId ?? '',
      maxCapacity: o.maxCapacity ?? o.MaxCapacity ?? 20,
      startDate: o.startDate ?? o.StartDate ?? '',
      endDate: o.endDate ?? o.EndDate ?? '',
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editingId) return
    setSubmitError(null)
    setSubmitting(true)
    try {
      await put(`/api/course-offerings/${editingId}`, {
        id: editingId,
        courseId: editForm.courseId,
        instructorId: editForm.instructorId,
        maxCapacity: Number(editForm.maxCapacity),
        startDate: editForm.startDate,
        endDate: editForm.endDate,
      })
      setEditingId(null)
      loadOfferings()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Ta bort detta kurstillfälle?')) return
    try {
      await del(`/api/course-offerings/${id}`)
      loadOfferings()
    } catch (err) {
      setSubmitError(err.message)
    }
  }

  if (loading) return <p className="text-slate-600">Laddar…</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Kurstillfällen</h1>
      <p className="text-slate-600 mb-8">
        Ett kurstillfälle är en genomförd instans av en kurs: du väljer kurs, lärare, datum och max antal platser. Deltagare registreras sedan via kursregistreringar.
      </p>

      {showCreateForm ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Skapa kurstillfälle</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div>
              <label htmlFor="courseId" className="block text-sm font-medium text-slate-700 mb-1">Vilken kurs?</label>
              <select
                id="courseId"
                required
                value={form.courseId}
                onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
              >
                <option value="">Välj kurs</option>
                {courses.map((c) => (
                  <option key={c.id ?? c.Id} value={c.id ?? c.Id}>{c.name ?? c.Name ?? ''}</option>
                ))}
              </select>
              {courses.length === 0 && (
                <p className="mt-1 text-sm text-amber-600">Inga kurser. Gå till Kurser och skapa minst en kurs först.</p>
              )}
            </div>
            <div>
              <label htmlFor="instructorId" className="block text-sm font-medium text-slate-700 mb-1">Vilken lärare håller tillfället?</label>
              <select
                id="instructorId"
                required
                value={form.instructorId}
                onChange={(e) => setForm((f) => ({ ...f, instructorId: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
              >
                <option value="">Välj lärare</option>
                {instructors.map((i) => (
                  <option key={i.userId ?? i.UserId} value={i.userId ?? i.UserId}>
                    {(i.firstName ?? i.FirstName ?? '')} {(i.lastName ?? i.LastName ?? '')}
                  </option>
                ))}
              </select>
              {instructors.length === 0 && (
                <p className="mt-1 text-sm text-amber-600">Inga lärare. Se Visa lärare för att se registrerade lärare.</p>
              )}
            </div>
            <div>
              <label htmlFor="maxCapacity" className="block text-sm font-medium text-slate-700 mb-1">Max antal deltagare (platser)</label>
              <input
                id="maxCapacity"
                type="number"
                min="1"
                value={form.maxCapacity}
                onChange={(e) => setForm((f) => ({ ...f, maxCapacity: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
              />
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">När börjar tillfället?</label>
              <input
                id="startDate"
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1">När slutar tillfället?</label>
              <input
                id="endDate"
                type="date"
                required
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
              />
            </div>
            {submitError && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{submitError}</p>}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {submitting ? 'Skapar…' : 'Skapa kurstillfälle'}
              </button>
              <button
                type="button"
                onClick={() => { setShowCreateForm(false); setSubmitError(null); setForm(emptyForm); }}
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
          Skapa kurstillfälle
        </button>
      )}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {offerings.length === 0 && !showCreateForm ? (
          <p className="p-8 text-slate-500">Inga kurstillfällen än.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
        {offerings.map((o) => {
          const oId = o.id ?? o.Id
          return (
          <li key={oId} className="p-4">
            {editingId === oId ? (
              <form onSubmit={handleUpdate} className="flex flex-col gap-3">
                <select
                  value={editForm.courseId}
                  onChange={(e) => setEditForm((f) => ({ ...f, courseId: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2"
                >
                  {courses.map((c) => (
                    <option key={c.id ?? c.Id} value={c.id ?? c.Id}>{c.name ?? c.Name ?? ''}</option>
                  ))}
                </select>
                <select
                  value={editForm.instructorId}
                  onChange={(e) => setEditForm((f) => ({ ...f, instructorId: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2"
                >
                  {instructors.map((i) => (
                    <option key={i.userId ?? i.UserId} value={i.userId ?? i.UserId}>
                      {(i.firstName ?? i.FirstName ?? '')} {(i.lastName ?? i.LastName ?? '')}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={editForm.maxCapacity}
                  onChange={(e) => setEditForm((f) => ({ ...f, maxCapacity: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2"
                />
                <input
                  type="date"
                  value={editForm.startDate}
                  onChange={(e) => setEditForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2"
                />
                <input
                  type="date"
                  value={editForm.endDate}
                  onChange={(e) => setEditForm((f) => ({ ...f, endDate: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2"
                />
                {submitError && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{submitError}</p>}
                <div className="flex flex-wrap gap-3">
                  <button type="submit" disabled={submitting} className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white text-sm hover:bg-slate-700 disabled:opacity-50">
                    Spara
                  </button>
                  <button type="button" onClick={() => { setEditingId(null); setSubmitError(null); }} className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 text-sm hover:bg-slate-50">
                    Avbryt
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="font-semibold text-slate-800">{o.courseName ?? o.CourseName ?? 'Kurs'}</p>
                <p className="mt-1 text-sm text-slate-600">
                  <span className="text-slate-500">Lärare:</span> {o.instructorName ?? o.InstructorName ?? '–'}
                </p>
                <p className="mt-0.5 text-sm text-slate-600">
                  <span className="text-slate-500">Period:</span> {(o.startDate ?? o.StartDate) ?? '–'} till {(o.endDate ?? o.EndDate) ?? '–'}
                </p>
                <p className="mt-0.5 text-sm text-slate-600">
                  <span className="text-slate-500">Platser:</span> max {o.maxCapacity ?? o.MaxCapacity ?? 0} deltagare
                </p>
                <div className="mt-2 flex gap-3">
                  <button type="button" onClick={() => startEdit(o)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Redigera
                  </button>
                  <button type="button" onClick={() => handleDelete(oId)} className="text-sm font-medium text-red-600 hover:text-red-800">
                    Ta bort
                  </button>
                </div>
              </>
            )}
          </li>
          )
        })}
          </ul>
        )}
      </section>
    </div>
  )
}

export default CourseOfferings

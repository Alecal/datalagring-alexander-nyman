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
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Kurstillfällen</h1>
      <p className="text-slate-600 mb-6">Lista och hantera kurstillfällen.</p>

      {showCreateForm ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Skapa kurstillfälle</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4 max-w-md">
            <div>
              <label htmlFor="courseId" className="block text-sm font-medium text-slate-700 mb-1">Kurs</label>
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
                <p className="mt-1 text-sm text-amber-600">Inga kurser. Gå till Courses och skapa minst en kurs först.</p>
              )}
            </div>
            <div>
              <label htmlFor="instructorId" className="block text-sm font-medium text-slate-700 mb-1">Lärare</label>
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
                <p className="mt-1 text-sm text-amber-600">Inga lärare. Lägg till användare och registrera som lärare (via API eller Users) först.</p>
              )}
            </div>
            <div>
              <label htmlFor="maxCapacity" className="block text-sm font-medium text-slate-700 mb-1">Max antal platser</label>
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
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">Startdatum</label>
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
              <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1">Slutdatum</label>
              <input
                id="endDate"
                type="date"
                required
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
              />
            </div>
            {submitError && <p className="text-sm text-red-600">{submitError}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg font-medium bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {submitting ? 'Skapar…' : 'Skapa'}
              </button>
              <button
                type="button"
                onClick={() => { setShowCreateForm(false); setSubmitError(null); setForm(emptyForm); }}
                className="px-4 py-2 rounded-lg font-medium bg-slate-200 text-slate-700 hover:bg-slate-300"
              >
                Avbryt
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="mb-6 px-4 py-2 rounded-lg font-medium bg-slate-800 text-white hover:bg-slate-700"
        >
          Skapa kurstillfälle
        </button>
      )}

      <div className="flex flex-col gap-4">
        {offerings.map((o) => {
          const oId = o.id ?? o.Id
          return (
          <div key={oId} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
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
                {submitError && <p className="text-sm text-red-600">{submitError}</p>}
                <div className="flex gap-2">
                  <button type="submit" disabled={submitting} className="px-3 py-1 rounded bg-slate-800 text-white text-sm">
                    Spara
                  </button>
                  <button type="button" onClick={() => { setEditingId(null); setSubmitError(null); }} className="px-3 py-1 rounded bg-slate-200 text-slate-700 text-sm">
                    Avbryt
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="font-semibold text-slate-800">{o.courseName ?? o.CourseName ?? 'Kurs'}</p>
                <p className="text-sm text-slate-600">Lärare: {o.instructorName ?? o.InstructorName ?? '–'}</p>
                <p className="text-sm text-slate-600">{(o.startDate ?? o.StartDate) ?? ''} – {(o.endDate ?? o.EndDate) ?? ''}, max {o.maxCapacity ?? o.MaxCapacity ?? 0} platser</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => startEdit(o)} className="text-sm text-slate-600 hover:text-slate-900 underline">
                    Redigera
                  </button>
                  <button type="button" onClick={() => handleDelete(oId)} className="text-sm text-red-600 hover:text-red-800 underline">
                    Ta bort
                  </button>
                </div>
              </>
            )}
          </div>
          )
        })}
      </div>
      {offerings.length === 0 && !showCreateForm && (
        <p className="text-slate-500">Inga kurstillfällen än.</p>
      )}
    </div>
  )
}

export default CourseOfferings

import { useState, useEffect } from 'react'
import { get, post } from '../api/client'

const emptyCourseForm = { name: '', description: '' }

const inputClass = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500'
const labelClass = 'block text-sm font-medium text-slate-700 mb-1'

function Courses() {
  const [courses, setCourses] = useState([])
  const [courseCount, setCourseCount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [form, setForm] = useState(emptyCourseForm)
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const loadCourses = () => {
    setLoading(true)
    Promise.all([get('/api/courses'), get('/api/courses/count')])
      .then(([list, countData]) => {
        setCourses(Array.isArray(list) ? list : [])
        setCourseCount(countData?.count ?? null)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    try {
      await post('/api/courses', {
        Name: form.name.trim(),
        Description: form.description.trim() || null,
      })
      setForm(emptyCourseForm)
      setShowCreateForm(false)
      loadCourses()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-slate-600">Laddar…</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Kurser</h1>
      <p className="text-slate-600 mb-2">Lista och hantera kurser. Skapa kurser som sedan kan användas för kurstillfällen.</p>
      {courseCount !== null && (
        <p className="text-sm text-slate-500 mb-6">{courseCount} {courseCount === 1 ? 'kurs' : 'kurser'} totalt.</p>
      )}
      {courseCount === null && !loading && <div className="h-6 mb-6" />}

      {showCreateForm ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Skapa kurs</h2>
          <form onSubmit={handleCreateCourse} className="flex flex-col gap-4">
            <div>
              <label htmlFor="courseName" className={labelClass}>Namn</label>
              <input
                id="courseName"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="courseDescription" className={labelClass}>Beskrivning (valfritt)</label>
              <textarea
                id="courseDescription"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className={inputClass}
              />
            </div>
            {submitError && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{submitError}</p>}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {submitting ? 'Skapar…' : 'Skapa kurs'}
              </button>
              <button
                type="button"
                onClick={() => { setShowCreateForm(false); setSubmitError(null); setForm(emptyCourseForm); }}
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
          Skapa kurs
        </button>
      )}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {courses.length === 0 ? (
          <p className="p-8 text-slate-500">Inga kurser än.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {courses.map((course) => (
              <li key={course.id} className="p-4">
                <p className="font-semibold text-slate-800">{course.name}</p>
                {course.description && (
                  <p className="mt-1 text-sm text-slate-600">{course.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default Courses

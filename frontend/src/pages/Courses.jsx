import { useState, useEffect } from 'react'
import { get, post } from '../api/client'

const emptyCourseForm = { name: '', description: '' }

function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [form, setForm] = useState(emptyCourseForm)
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const loadCourses = () => {
    get('/api/courses')
      .then(setCourses)
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

  if (loading) return <p className="text-slate-600">Loading…</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Courses</h1>
      <p className="text-slate-600 mb-6">Course list and management.</p>

      {showCreateForm ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Skapa kurs</h2>
          <form onSubmit={handleCreateCourse} className="flex flex-col gap-4 max-w-md">
            <div>
              <label htmlFor="courseName" className="block text-sm font-medium text-slate-700 mb-1">Namn</label>
              <input
                id="courseName"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
            <div>
              <label htmlFor="courseDescription" className="block text-sm font-medium text-slate-700 mb-1">Beskrivning (valfritt)</label>
              <textarea
                id="courseDescription"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
            {submitError && <p className="text-sm text-red-600">{submitError}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg font-medium bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {submitting ? 'Skapar…' : 'Skapa kurs'}
              </button>
              <button
                type="button"
                onClick={() => { setShowCreateForm(false); setSubmitError(null); setForm(emptyCourseForm); }}
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
          Skapa kurs
        </button>
      )}

      <div className="flex flex-col gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="font-semibold text-slate-800">{course.name}</p>
            {course.description && (
              <p className="mt-1 text-sm text-slate-600">{course.description}</p>
            )}
          </div>
        ))}
      </div>
      {courses.length === 0 && (
        <p className="text-slate-500">No courses yet.</p>
      )}
    </div>
  )
}

export default Courses

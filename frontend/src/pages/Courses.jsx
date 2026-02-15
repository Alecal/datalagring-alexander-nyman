import { useState, useEffect } from 'react'
import { get } from '../api/client'

function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    get('/api/courses')
      .then(setCourses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-slate-600">Loading…</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Courses</h1>
      <p className="text-slate-600 mb-6">Course list and management.</p>
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

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { get } from '../api/client'

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

function Instructors() {
  const [instructors, setInstructors] = useState([])
  const [offerings, setOfferings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([get('/api/instructors'), get('/api/course-offerings')])
      .then(([inst, off]) => {
        setInstructors(Array.isArray(inst) ? inst : [])
        setOfferings(Array.isArray(off) ? off : [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const getOfferingsForInstructor = (userId) => {
    const id = userId ?? null
    if (!id) return []
    return offerings.filter(
      (o) => (o.instructorId ?? o.InstructorId) === id
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  function getOfferingStatus(o) {
    const start = o.startDate ?? o.StartDate
    const end = o.endDate ?? o.EndDate
    if (!start || !end) return 'ongoing'
    const startDate = new Date(start)
    const endDate = new Date(end)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)
    if (endDate < today) return 'ended'
    if (startDate > today) return 'upcoming'
    return 'ongoing'
  }

  const statusConfig = {
    upcoming: {
      label: 'Kommande',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden>
          <path fillRule="evenodd" d="M6.75 2.25a.75.75 0 0 1 .75-.75H16.5a4.5 4.5 0 0 1 4.5 4.5v11.75a4.5 4.5 0 0 1-4.5 4.5H6.75a.75.75 0 0 1-.75-.75V2.25Z" clipRule="evenodd" />
          <path d="M5.25 2.25a.75.75 0 0 0-.75.75v18c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3a.75.75 0 0 0-.75-.75H5.25Z" />
        </svg>
      ),
    },
    ongoing: {
      label: 'På gång',
      className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden>
          <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
        </svg>
      ),
    },
    ended: {
      label: 'Avslutat',
      className: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden>
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
        </svg>
      ),
    },
  }

  if (loading) return <p className="text-slate-600">Laddar…</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Visa lärare</h1>
      <p className="text-slate-600 mb-8">
        Lista över alla registrerade lärare. Under varje lärare visas de kurstillfällen de är kopplade till.
      </p>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {instructors.length === 0 ? (
          <p className="p-8 text-slate-500">Inga lärare registrerade.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {instructors.map((i) => {
              const instructorOfferings = getOfferingsForInstructor(i.userId ?? i.UserId)
              return (
                <li key={i.userId ?? i.UserId} className="flex gap-4 p-4 relative">
                  <div className="flex shrink-0 items-center">
                    <TeacherIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-800">
                        {(i.firstName ?? i.FirstName ?? '')} {(i.lastName ?? i.LastName ?? '')}
                      </p>
                      {(i.expertises ?? i.Expertises ?? []).length > 0 && (
                        <>
                          {(i.expertises ?? i.Expertises ?? []).map((ex) => (
                            <span
                              key={ex.id ?? ex.Id}
                              className="inline-flex items-center rounded-md bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-white"
                            >
                              {ex.subject ?? ex.Subject}
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                    {(i.bio ?? i.Bio) && (
                      <p className="mt-1 text-sm text-slate-600">{i.bio ?? i.Bio}</p>
                    )}
                    {instructorOfferings.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {instructorOfferings.map((o) => {
                          const status = getOfferingStatus(o)
                          const config = statusConfig[status]
                          const startStr = (o.startDate ?? o.StartDate) ? new Date(o.startDate ?? o.StartDate).toLocaleDateString('sv-SE', { year: 'numeric', month: 'short', day: 'numeric' }) : '–'
                          const endStr = (o.endDate ?? o.EndDate) ? new Date(o.endDate ?? o.EndDate).toLocaleDateString('sv-SE', { year: 'numeric', month: 'short', day: 'numeric' }) : '–'
                          return (
                            <span
                              key={o.id ?? o.Id}
                              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${config.className}`}
                            >
                              {config.icon}
                              <span className="font-semibold">{o.courseName ?? o.CourseName ?? 'Kurs'}</span>
                              <span className="opacity-90">({startStr} – {endStr})</span>
                              <span className="ml-0.5 text-xs font-normal opacity-90">· {config.label}</span>
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Link
                      to={`/users/${i.userId ?? i.UserId}/edit`}
                      className="inline-block rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Redigera
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

export default Instructors

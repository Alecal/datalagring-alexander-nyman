export async function get(path) {
  const res = await fetch(path, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function post(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function get(path) {
  const res = await fetch(path, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

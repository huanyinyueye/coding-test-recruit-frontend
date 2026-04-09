export interface Content {
  id: number
  title?: string
  body?: string
  createdAt?: string
  updatedAt?: string
}

const BASE = '/content'

export async function fetchAllContents(): Promise<Content[]> {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Failed to fetch contents')
  return res.json()
}

export async function fetchContent(id: number): Promise<Content> {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error('Failed to fetch content')
  return res.json()
}

export async function createContent(): Promise<Content> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: '', body: '' }),
  })
  if (!res.ok) throw new Error('Failed to create content')
  return res.json()
}

export async function updateContent(
  id: number,
  data: { title?: string; body?: string },
): Promise<Content> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update content')
  return res.json()
}

export async function deleteContent(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete content')
}

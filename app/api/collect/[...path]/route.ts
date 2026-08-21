import { API_URL } from "@/lib/constants"

const VANTA_API_KEY = process.env.VANTA_API_KEY 

const FORWARDED_HEADERS = [
  'accept-language',
  'user-agent',
  'referer',
  'origin',
  'x-forwarded-for',
]

async function proxyRequest(request: Request, path: string) {
  try {
    const url = `${API_URL}/${path}${new URL(request.url).search}`
    const headers = new Headers()
    headers.set('content-type', request.headers.get('content-type') || 'application/json')
    headers.set('authorization', `Bearer ${VANTA_API_KEY}`)

    const projectId = request.headers.get('x-project-id')
    if (projectId) headers.set('x-project-id', projectId)

    for (const name of FORWARDED_HEADERS) {
      const value = request.headers.get(name)
      if (value) headers.set(name, value)
    }

    const init: RequestInit = {
      method: request.method,
      headers,
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      init.body = await request.text()
    }

    const res = await fetch(url, init)
    const body = await res.text()

    return new Response(body, {
      status: res.status,
      headers: { 'content-type': res.headers.get('content-type') || 'application/json' },
    })
  } catch (err) {
    console.error('PROXY ERROR:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  return proxyRequest(request, path.join('/'))
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  return proxyRequest(request, path.join('/'))
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  return proxyRequest(request, path.join('/'))
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  return proxyRequest(request, path.join('/'))
}
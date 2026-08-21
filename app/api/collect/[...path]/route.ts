import { API_URL } from "@/lib/constants"

async function proxyRequest(request: Request, path: string) {
  try {
    const url = `${API_URL}/${path}${new URL(request.url).search}`
    const headers = new Headers()
    headers.set('content-type', request.headers.get('content-type') || 'application/json')

    const cookie = request.headers.get('cookie')
    if (cookie) headers.set('cookie', cookie)

    const authorization = request.headers.get('authorization')
    if (authorization) headers.set('authorization', authorization)

    const projectId = request.headers.get('x-project-id')
    if (projectId) headers.set('x-project-id', projectId)

    const init: RequestInit = {
      method: request.method,
      headers,
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      init.body = await request.text()
    }

    const res = await fetch(url, init)
    const body = await res.text()

    const responseHeaders = new Headers()
    responseHeaders.set('content-type', res.headers.get('content-type') || 'application/json')

    const setCookie = res.headers.getSetCookie?.() ?? []
    for (const c of setCookie) {
      responseHeaders.append('set-cookie', c)
    }

    return new Response(body, {
      status: res.status,
      headers: responseHeaders,
    })
  } catch (err) {
    console.error('PROXY ERROR:', err)
    return new Response(JSON.stringify({ error: String(err), stack: err instanceof Error ? err.stack : null }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
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
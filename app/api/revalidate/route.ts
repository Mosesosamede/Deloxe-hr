import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  // 1. Security: Check if the secret matches your environment variable
  if (secret !== process.env.MY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  let slug = ''
  try {
    const body = await request.json()
    slug = body.record?.slug || body.slug || ''

    if (!slug) {
      return NextResponse.json({ message: 'Missing slug in payload' }, { status: 400 })
    }

    // 2. Revalidate the specific blog post
    revalidatePath(`/blog/${slug}`)
    
    // 3. Revalidate the main blog listing page
    revalidatePath('/blog')
    
    // 4. Revalidate the sitemap so Google sees the update
    revalidatePath('/sitemap.xml')

    // Ping Google sitemap
    await fetch(`https://www.google.com/ping?sitemap=https://deloxehr.com/sitemap.xml`).catch(() => {})

    // 5. Notify IndexNow
    const indexNowKey = process.env.INDEXNOW_KEY || '38b97b44048b45c59e705352912b51ff'
    const host = 'deloxehr.com'
    const blogUrl = `https://${host}/blog/${slug}`

    if (indexNowKey) {
      try {
        const indexNowPayload = {
          host: host,
          key: indexNowKey,
          keyLocation: `https://${host}/${indexNowKey}.txt`,
          urlList: [
            blogUrl,
            `https://${host}/blog`,
            `https://${host}/sitemap.xml`
          ]
        }

        const indexNowRes = await fetch('https://api.indexnow.org/indexnow', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(indexNowPayload),
        })

        if (!indexNowRes.ok) {
          console.error('IndexNow API returned status:', indexNowRes.status)
        }
      } catch (indexNowErr) {
        console.error('IndexNow notification failed:', indexNowErr)
      }
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}


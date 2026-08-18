import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Read webhook secret from request header
  const secret = request.headers.get('x-webhook-secret')

  // Security check
  if (!secret || secret !== process.env.MY_WEBHOOK_SECRET) {
    return NextResponse.json(
      { message: 'Invalid secret' },
      { status: 401 }
    )
  }

  let slug = ''

  try {
    const body = await request.json()

    slug = body.record?.slug || body.slug || ''

    if (!slug) {
      return NextResponse.json(
        { message: 'Missing slug in payload' },
        { status: 400 }
      )
    }

    // Revalidate specific blog post
    revalidatePath(`/blog/${slug}`)

    // Revalidate blog listing
    revalidatePath('/blog')

    // Revalidate sitemap
    revalidatePath('/sitemap.xml')

    // Ping Google sitemap
    await fetch(
      `https://www.google.com/ping?sitemap=https://deloxehr.com/sitemap.xml`
    ).catch(() => {})

    // IndexNow
    const indexNowKey = process.env.INDEXNOW_KEY

    const host = 'deloxehr.com'
    const blogUrl = `https://${host}/blog/${slug}`

    if (indexNowKey) {
      try {
        const indexNowPayload = {
          host,
          key: indexNowKey,
          keyLocation: `https://${host}/${indexNowKey}.txt`,
          urlList: [
            blogUrl,
            `https://${host}/blog`,
            `https://${host}/sitemap.xml`,
          ],
        }

        const indexNowRes = await fetch(
          'https://api.indexnow.org/indexnow',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(indexNowPayload),
          }
        )

        if (!indexNowRes.ok) {
          console.error(
            'IndexNow API returned status:',
            indexNowRes.status
          )
        }
      } catch (indexNowErr) {
        console.error(
          'IndexNow notification failed:',
          indexNowErr
        )
      }
    }

    return NextResponse.json({
      revalidated: true,
      slug,
      now: Date.now(),
    })
  } catch (err) {
    console.error('Revalidation error:', err)

    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    )
  }
}

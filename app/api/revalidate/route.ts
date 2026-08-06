import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  // 1. Security: Check if the secret matches your environment variable
  if (secret !== process.env.MY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const slug = body.record.slug // This comes from Supabase's payload

    // 2. Revalidate the specific blog post
    revalidatePath(`/blog/${slug}`)
    
    // 3. Revalidate the main blog listing page
    revalidatePath('/blog')
    
    // 4. Revalidate the sitemap so Google sees the update
    revalidatePath('/sitemap.xml')

    // Inside your try block after revalidating:
    await fetch(`https://www.google.com/ping?sitemap=https://deloxehr.com/sitemap.xml`);

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}

// import { createBrowserClient  } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';

// export async function GET(request: Request) {
//   const requestUrl = new URL(request.url);
//   const code = requestUrl.searchParams.get('code');

//   if (code) {
//     const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{ cookies });
//     await supabase.auth.exchangeCodeForSession(code);
//   }

//   // URL to redirect to after sign in process completes
//   return NextResponse.redirect(new URL('/', requestUrl.origin));
// } 
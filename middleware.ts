import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protect dashboard routes
    if (request.nextUrl.pathname.startsWith("/") && !request.nextUrl.pathname.startsWith("/login") && !request.nextUrl.pathname.startsWith("/auth") && !request.nextUrl.pathname.startsWith("/design-system") && !request.nextUrl.pathname.startsWith("/api") && !request.nextUrl.pathname.startsWith("/_next") && !request.nextUrl.pathname.startsWith("/static") && !request.nextUrl.pathname.includes(".")) {
        if (!user) {
            // Redirect to login if not authenticated
            // For now, we allow access to everything to not block development, but in production this should be enabled
            // return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};

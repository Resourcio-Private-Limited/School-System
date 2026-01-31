import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // If not logged in, standard behavior handled by 'authorized' callback or automatic
        if (!token) return;

        // Force password change
        if (token.isFirstLogin && path !== "/change-password") {
            // Allow api calls though? Maybe. But for UI, redirect.
            // If user tries to go anywhere else, send them to change-password
            if (!path.startsWith("/api")) {
                return NextResponse.redirect(new URL("/change-password", req.url));
            }
        }

        // If password changed, prevent visiting change-password page again? No, optional.

        const role = token.role;

        if (path.startsWith("/principal") && role !== "PRINCIPAL") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (path.startsWith("/teacher") && role !== "TEACHER") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (path.startsWith("/student") && role !== "STUDENT") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/principal/:path*", "/teacher/:path*", "/student/:path*"],
};

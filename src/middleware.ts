import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    afterAuth(auth, req, evt) {
        // Users who are not authenticated will stay on the page they are on. 
            return
    }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
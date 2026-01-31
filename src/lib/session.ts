import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { User } from "@prisma/client";

export async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    return session?.user;
}

export async function getStrictCurrentUser() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
}

"use server";

import { prisma } from "@/lib/prisma";
import { getStrictCurrentUser } from "@/lib/session";
import { can, Action } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

// Zod Schemas
const CreateTeacherSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    password: z.string().min(6),
    qualification: z.array(z.string()).min(1),
    designation: z.string().optional(),
    joiningDate: z.string().datetime(), // ISO string from frontend
});

const CreateAcademicYearSchema = z.object({
    name: z.string().min(4), // e.g. "2025-26"
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
});

/**
 * TEACHER MANAGEMENT
 */

export async function createTeacher(data: z.infer<typeof CreateTeacherSchema>) {
    const user = await getStrictCurrentUser();
    if (!can(user, Action.MANAGE_TEACHERS)) {
        throw new Error("Unauthorized: Cannot manage teachers");
    }

    const { email, name, password, qualification, designation, joiningDate } = CreateTeacherSchema.parse(data);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: Role.TEACHER,
                    isFirstLogin: true,
                },
            });

            await tx.teacherProfile.create({
                data: {
                    id: newUser.id,
                    qualification,
                    designation,
                    joiningDate: new Date(joiningDate),
                },
            });

            return newUser;
        });

        // Log action (using simple create for now, ideally strictly typed logger)
        await prisma.auditLog.create({
            data: {
                action: "CREATE_TEACHER",
                entity: "Teacher",
                entityId: result.id,
                actorId: user.id,
                details: { email: result.email },
            }
        });

        revalidatePath("/principal/teachers");
        return { success: true, teacherId: result.id };
    } catch (error: any) {
        console.error("Create Teacher Failed:", error);
        return { success: false, error: error.message };
    }
}

export async function toggleTeacherAccess(teacherId: string, isActive: boolean) {
    const user = await getStrictCurrentUser();
    if (!can(user, Action.MANAGE_TEACHERS)) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.user.update({
            where: { id: teacherId },
            data: { isActive }
        });

        await prisma.auditLog.create({
            data: {
                action: isActive ? "ENABLE_TEACHER" : "DISABLE_TEACHER",
                entity: "Teacher",
                entityId: teacherId,
                actorId: user.id,
            }
        });

        revalidatePath("/principal/teachers");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * ACADEMIC YEAR MANAGEMENT
 */

export async function createAcademicYear(data: z.infer<typeof CreateAcademicYearSchema>) {
    const user = await getStrictCurrentUser();
    if (!can(user, Action.MANAGE_ACADEMIC_YEAR)) {
        throw new Error("Unauthorized");
    }

    const { name, startDate, endDate } = CreateAcademicYearSchema.parse(data);

    try {
        await prisma.academicYear.create({
            data: {
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status: "UPCOMING"
            }
        });

        revalidatePath("/principal/academics");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

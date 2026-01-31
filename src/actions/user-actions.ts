"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { EmailService } from "@/lib/email";
import crypto from "crypto";

// Helper to generate secure password
function generateSecurePassword(length = 12) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(crypto.randomInt(0, chars.length));
    }
    return password;
}

// Helper for audit logging
async function logAudit(action: string, entity: string, entityId: string, actorId: string, details?: any) {
    try {
        await prisma.auditLog.create({
            data: {
                action,
                entity,
                entityId,
                actorId,
                details: details ? JSON.stringify(details) : undefined,
            },
        });
    } catch (e) {
        console.error("Audit Log Failed:", e);
    }
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createTeacherAction(data: {
    name: string;
    email: string;
    qualification: string[];
    designation: string;
    joiningDate: Date;
}) {
    try {
        const session = await getServerSession(authOptions);
        const actorId = session?.user?.id || "system"; // Fallback to system if seeded or no auth

        const password = generateSecurePassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    password: hashedPassword,
                    role: "TEACHER",
                    isFirstLogin: true,
                },
            });

            await tx.teacherProfile.create({
                data: {
                    id: user.id,
                    qualification: data.qualification,
                    designation: data.designation,
                    joiningDate: data.joiningDate,
                },
            });

            // Log Audit
            await tx.auditLog.create({
                data: {
                    action: "CREATE_TEACHER",
                    entity: "User",
                    entityId: user.id,
                    actorId: actorId,
                    details: { email: data.email },
                }
            });

            // Send Email outside transaction ideally, but for now inside is okay or defer
            // We'll do it after transaction to avoid blocking DB if email is slow, 
            // but we need to ensure we have the password. Check below.
        });

        // Send Email
        await EmailService.sendWelcomeEmail(data.email, data.name, "TEACHER", password);

        revalidatePath("/principal/teachers");
        return { success: true };
    } catch (error: any) {
        if (error.code === "P2002") {
            return { success: false, error: "Email already exists" };
        }
        return { success: false, error: error.message };
    }
}

export async function createStudentAction(data: {
    name: string;
    email: string | null;
    admissionNo: string;
    joiningDate: Date;
    dob: Date;
    gender: "MALE" | "FEMALE" | "OTHER";
    fatherName: string;
    motherName: string;
    parentContact: string;
    address: string;
    nationality: string;
    classroomId: string;
    sectionId: string;
}) {
    try {
        const session = await getServerSession(authOptions);
        const actorId = session?.user?.id || "system";

        // Auto-generate secure password instead of DOB
        const password = generateSecurePassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        const admissionYear = data.joiningDate.getFullYear();
        const email = data.email || `${data.admissionNo.toLowerCase()}@school.com`;

        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    name: data.name,
                    password: hashedPassword,
                    role: "STUDENT",
                    isFirstLogin: true,
                },
            });

            await tx.studentProfile.create({
                data: {
                    id: user.id,
                    admissionNo: data.admissionNo,
                    admissionYear: admissionYear,
                    dob: data.dob,
                    gender: data.gender,
                    fatherName: data.fatherName,
                    motherName: data.motherName,
                    parentContact: data.parentContact,
                    address: data.address,
                    nationality: data.nationality,
                    classroomId: data.classroomId,
                    sectionId: data.sectionId,
                },
            });

            // Log Audit
            await tx.auditLog.create({
                data: {
                    action: "CREATE_STUDENT",
                    entity: "User",
                    entityId: user.id,
                    actorId: actorId,
                    details: { admissionNo: data.admissionNo },
                }
            });
        });

        // Send Email
        await EmailService.sendWelcomeEmail(email, data.name, "STUDENT", password);

        revalidatePath("/principal/students");
        return { success: true };
    } catch (error: any) {
        if (error.code === "P2002") {
            return { success: false, error: "Admission No or Email already exists" };
        }
        return { success: false, error: error.message };
    }
}

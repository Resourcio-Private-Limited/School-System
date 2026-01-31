"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createFeeStructureAction(data: {
    name: string;
    amount: number;
    frequency: string;
    academicYearId: string;
}) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "PRINCIPAL") {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await prisma.feeStructure.create({
            data: {
                name: data.name,
                amount: data.amount,
                frequency: data.frequency,
                academicYearId: data.academicYearId,
            }
        });

        revalidatePath("/principal/fees");
        return { success: true, message: "Fee structure created" };
    } catch (error) {
        console.error("Create Fee Error:", error);
        return { success: false, error: "Failed to create fee structure" };
    }
}

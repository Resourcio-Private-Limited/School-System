"use server";

import { PromotionService } from "@/services/promotion";
import { revalidatePath } from "next/cache";

export async function promoteStudentsAction(yearId: string) {
    try {
        const result = await PromotionService.promoteStudents(yearId);
        revalidatePath("/principal");
        return { success: true, ...result };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

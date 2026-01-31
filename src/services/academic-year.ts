import { prisma } from "@/lib/prisma";

export class AcademicYearService {
    static async getActive() {
        return prisma.academicYear.findFirst({
            where: { status: "ACTIVE" }
        });
    }
}

import { prisma } from "@/lib/prisma";

export class SchoolService {
    static async getAllClassrooms() {
        return prisma.classroom.findMany({
            include: {
                sections: {
                    orderBy: { name: "asc" },
                },
                classTeacher: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            },
            orderBy: {
                // Logic to order Class 1, Class 2... might need code parsing or manual order field.
                // For now, order by name.
                name: "asc"
            },
        });
    }

    static async getClassroomByCode(code: string) {
        return prisma.classroom.findUnique({
            where: { code },
            include: {
                sections: true,
                subjects: true,
            },
        });
    }
}

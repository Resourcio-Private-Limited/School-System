const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // 1. Create Principal (Admin)
    const principalEmail = "admin@school.com";
    const existingPrincipal = await prisma.user.findUnique({
        where: { email: principalEmail },
    });

    if (!existingPrincipal) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await prisma.user.create({
            data: {
                email: principalEmail,
                password: hashedPassword,
                role: "PRINCIPAL",
                name: "Principal Admin",
            },
        });
        console.log("✅ Created Principal: admin@school.com / admin123");
    }

    // 2. Create Global Academic Year (2025-26)
    const yearName = "2025-26";
    let academicYear = await prisma.academicYear.findUnique({
        where: { name: yearName },
    });

    if (!academicYear) {
        academicYear = await prisma.academicYear.create({
            data: {
                name: yearName,
                startDate: new Date("2025-04-01"),
                endDate: new Date("2026-03-31"),
                status: "ACTIVE",
            },
        });
        console.log("✅ Created Academic Year: 2025-26");
    }

    // 3. Create Classrooms (1 to 12)
    const classes = [
        { name: "Class 1", code: "CLASS_1", next: "CLASS_2" },
        { name: "Class 2", code: "CLASS_2", next: "CLASS_3" },
        { name: "Class 3", code: "CLASS_3", next: "CLASS_4" },
        { name: "Class 4", code: "CLASS_4", next: "CLASS_5" },
        { name: "Class 5", code: "CLASS_5", next: "CLASS_6" },
        { name: "Class 6", code: "CLASS_6", next: "CLASS_7" },
        { name: "Class 7", code: "CLASS_7", next: "CLASS_8" },
        { name: "Class 8", code: "CLASS_8", next: "CLASS_9" },
        { name: "Class 9", code: "CLASS_9", next: "CLASS_10" },
        { name: "Class 10", code: "CLASS_10", next: "CLASS_11" },
        { name: "Class 11", code: "CLASS_11", next: "CLASS_12" },
        { name: "Class 12", code: "CLASS_12", next: null },
    ];

    for (const cls of classes) {
        const classroom = await prisma.classroom.upsert({
            where: { code: cls.code },
            update: { nextClassroomCode: cls.next },
            create: {
                name: cls.name,
                code: cls.code,
                nextClassroomCode: cls.next,
            },
        });

        // Create Sections A, B
        const sections = ["A", "B"];
        for (const secName of sections) {
            await prisma.section.upsert({
                where: {
                    classroomId_name: {
                        classroomId: classroom.id,
                        name: secName,
                    }
                },
                update: {},
                create: {
                    name: secName,
                    classroomId: classroom.id,
                },
            });
        }
    }
    console.log("✅ Created Classrooms 1-12 with Sections A, B");

    console.log("🏁 Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

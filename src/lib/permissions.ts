import { Role } from "@prisma/client";

type UserRole = Role;

// Define specific actions to avoid "magic strings"
export enum Action {
    // System & Principal
    MANAGE_ACADEMIC_YEAR = "MANAGE_ACADEMIC_YEAR",
    MANAGE_CLASSES = "MANAGE_CLASSES",
    MANAGE_TEACHERS = "MANAGE_TEACHERS",
    MANAGE_STUDENTS = "MANAGE_STUDENTS",
    VIEW_FINANCE = "VIEW_FINANCE",
    VIEW_ALL_LOGS = "VIEW_ALL_LOGS",
    TRIGGER_PROMOTION = "TRIGGER_PROMOTION",

    // Teacher
    VIEW_ASSIGNED_CLASSROOM = "VIEW_ASSIGNED_CLASSROOM",
    MARK_ATTENDANCE = "MARK_ATTENDANCE",
    POST_ANNOUNCEMENT = "POST_ANNOUNCEMENT",
    ENTER_MARKS = "ENTER_MARKS",
    CREATE_ONLINE_CLASS = "CREATE_ONLINE_CLASS",

    // Student
    VIEW_OWN_MARKS = "VIEW_OWN_MARKS",
    DOWNLOAD_REPORT = "DOWNLOAD_REPORT",
    PAY_FEES = "PAY_FEES",
}

export const PERMISSIONS: Record<Role, Action[]> = {
    [Role.PRINCIPAL]: [
        Action.MANAGE_ACADEMIC_YEAR,
        Action.MANAGE_CLASSES,
        Action.MANAGE_TEACHERS,
        Action.MANAGE_STUDENTS,
        Action.VIEW_FINANCE,
        Action.VIEW_ALL_LOGS,
        Action.TRIGGER_PROMOTION,
    ],
    [Role.TEACHER]: [
        Action.VIEW_ASSIGNED_CLASSROOM,
        Action.MARK_ATTENDANCE,
        Action.POST_ANNOUNCEMENT,
        Action.ENTER_MARKS,
        Action.CREATE_ONLINE_CLASS,
    ],
    [Role.STUDENT]: [
        Action.VIEW_OWN_MARKS,
        Action.DOWNLOAD_REPORT,
        Action.PAY_FEES,
    ],
    [Role.PARENT]: [] // Reserved
};

/**
 * Basic role check
 */
export function hasRole(user: { role: UserRole }, role: UserRole): boolean {
    return user.role === role;
}

/**
 * Check if user can perform a generic action
 */
export function can(user: { role: UserRole }, action: Action): boolean {
    const allowedActions = PERMISSIONS[user.role] || [];
    return allowedActions.includes(action);
}

/**
 * SPECIFIC LOGIC CHECKS (Complex authorization)
 */

export function canMarkAttendance(user: { role: UserRole; id: string }, classTeacherId: string | null) {
    if (user.role !== Role.TEACHER) return false;
    // strict check: MUST be the class teacher
    return user.id === classTeacherId;
}

export function canEnterMarks(user: { role: UserRole }, locked: boolean) {
    if (user.role !== Role.TEACHER) return false;
    if (locked) return false;
    return true;
}

export function canPromoteStudents(user: { role: UserRole }, academicYearStatus: string) {
    if (user.role !== Role.PRINCIPAL) return false;
    return academicYearStatus === "ENDED";
}

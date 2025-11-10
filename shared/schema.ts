import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define roles enum
export enum UserRole {
  STUDENT = "student",
  EDUCATOR = "educator",
  ADMIN = "admin"
}

// Define admin levels enum
export enum AdminLevel {
  DISTRICT = "district",
  SCHOOL = "school",
  DEPARTMENT = "department"
}

// Districts table
export const districts = pgTable("districts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  phoneNumber: text("phone_number"),
  website: text("website"),
});

// Schools table
export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  districtId: integer("district_id").notNull(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  phoneNumber: text("phone_number"),
  gradeRange: text("grade_range"), // e.g., "K-5", "6-8", "9-12"
});

// Departments table (for high schools or specialized programs)
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  schoolId: integer("school_id").notNull(),
  chairPersonId: integer("chair_person_id"), // Reference to a teacher/educator
  description: text("description"),
});

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull(),
  email: text("email").notNull().unique(),
  schoolId: integer("school_id"),
  districtId: integer("district_id"),
  departmentId: integer("department_id"),
  adminLevel: text("admin_level"), // For admin users: district, school, or department level
  active: boolean("active").default(true),
  created: text("created").notNull(),
  lastLogin: text("last_login"),
});

// Students table
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  schoolId: integer("school_id").notNull(),
  grade: text("grade"),
  dateOfBirth: text("date_of_birth"),
  studentId: text("student_id").unique(), // Official school-assigned student ID
  guardianName: text("guardian_name"),
  guardianEmail: text("guardian_email"),
  guardianPhone: text("guardian_phone"),
});

// Educators table
export const educators = pgTable("educators", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  schoolId: integer("school_id").notNull(),
  departmentId: integer("department_id"),
  subjectSpecialty: text("subject_specialty"),
  employeeId: text("employee_id").unique(), // Official employee ID
  officeLocation: text("office_location"),
  officeHours: text("office_hours"),
});

// Classes table
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  educatorId: integer("educator_id").notNull(),
  schoolId: integer("school_id").notNull(),
  departmentId: integer("department_id"),
  roomNumber: text("room_number"),
  period: text("period"),
  semester: text("semester"),
  schoolYear: text("school_year"),
  active: boolean("active").default(true),
});

// Student enrollment in classes
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  classId: integer("class_id").notNull(),
  enrollmentDate: text("enrollment_date").notNull(),
  status: text("status").default("active"), // active, dropped, completed
});

// Grades table
export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  classId: integer("class_id").notNull(),
  assignmentName: text("assignment_name").notNull(),
  assignmentType: text("assignment_type"), // quiz, test, homework, project, etc.
  score: integer("score").notNull(),
  maxScore: integer("max_score").notNull(),
  submissionDate: text("submission_date").notNull(),
  gradedDate: text("graded_date"),
  comments: text("comments"),
});

// Attendance table
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  classId: integer("class_id").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull(), // present, absent, tardy, excused
  notes: text("notes"),
  recordedBy: integer("recorded_by").notNull(), // User ID of the educator who recorded attendance
});

// Achievements table
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // badge, certificate, milestone, level-up
  earnedAt: text("earned_at").notNull(),
  subject: text("subject"),
  pathNodeId: text("path_node_id"), // ID of the learning path node if this achievement is tied to a learning path
  progress: integer("progress"), // For achievements that track progress towards a goal
  maxProgress: integer("max_progress"), // Maximum progress value
  level: text("level"), // For level-based achievements
  iconType: text("icon_type"), // Visual representation: award, trophy, medal, star
  shared: boolean("shared").default(false), // Whether this achievement has been shared
  visible: boolean("visible").default(true), // Whether this achievement is visible to others
  isPublic: boolean("is_public").default(false), // Whether this achievement is public and visible to all users
  createdByEducator: boolean("created_by_educator").default(false), // Whether this achievement was created by an educator
});

// Tutoring sessions table - tracks all AI tutor interactions for progress monitoring
export const tutoringSessions = pgTable("tutoring_sessions", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  startedAt: text("started_at").notNull(),
  endedAt: text("ended_at"),
  subject: text("subject"), // Mathematics, Science, English, History, etc.
  topic: text("topic"), // Specific topic within subject
  difficulty: text("difficulty"), // beginner, intermediate, advanced
  totalMessages: integer("total_messages").default(0),
  studentQuestions: integer("student_questions").default(0),
  conceptsCovered: text("concepts_covered").array(), // Array of concepts discussed
  sessionSummary: text("session_summary"), // AI-generated summary of session
  performanceScore: integer("performance_score"), // 1-100 score based on understanding
  improvementAreas: text("improvement_areas").array(), // Areas needing more work
  strengthAreas: text("strength_areas").array(), // Areas where student excels
});

// Individual messages within tutoring sessions
export const tutoringMessages = pgTable("tutoring_messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  role: text("role").notNull(), // user or assistant
  content: text("content").notNull(),
  timestamp: text("timestamp").notNull(),
  conceptsDiscussed: text("concepts_discussed").array(), // Concepts in this specific message
});

// Homework assignments table - helps students track their assignments
export const homework = pgTable("homework", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  subject: text("subject"), // Mathematics, Science, English, History, etc.
  dueDate: text("due_date").notNull(),
  completed: boolean("completed").default(false),
  completedAt: text("completed_at"),
  priority: text("priority").default("medium"), // low, medium, high
  createdAt: text("created_at").notNull(),
  notes: text("notes"), // Student's personal notes
  attachmentUrl: text("attachment_url"), // URL to uploaded image/screenshot
  attachmentName: text("attachment_name"), // Original filename
});

// Schema for user insertion with default date
export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
    firstName: true,
    lastName: true,
    role: true,
    email: true,
    schoolId: true,
    districtId: true,
    departmentId: true,
    adminLevel: true,
  })
  .transform((data) => ({
    ...data,
    created: new Date().toISOString(),
  }));

// Schema for district insertion
export const insertDistrictSchema = createInsertSchema(districts);

// Schema for school insertion
export const insertSchoolSchema = createInsertSchema(schools);

// Schema for department insertion
export const insertDepartmentSchema = createInsertSchema(departments);

// Schema for educator insertion
export const insertEducatorSchema = createInsertSchema(educators);

// Schema for student insertion
export const insertStudentSchema = createInsertSchema(students);

// Schema for class insertion
export const insertClassSchema = createInsertSchema(classes);

// Schema for enrollment insertion
export const insertEnrollmentSchema = createInsertSchema(enrollments)
  .transform((data) => ({
    ...data,
    enrollmentDate: data.enrollmentDate || new Date().toISOString(),
  }));

// Schema for grade insertion
export const insertGradeSchema = createInsertSchema(grades);

// Schema for attendance insertion
export const insertAttendanceSchema = createInsertSchema(attendance);

// Schema for achievement insertion
export const insertAchievementSchema = createInsertSchema(achievements)
  .transform((data) => ({
    ...data,
    earnedAt: data.earnedAt || new Date().toISOString(),
  }));

// Schema for tutoring session insertion
export const insertTutoringSessionSchema = createInsertSchema(tutoringSessions)
  .transform((data) => ({
    ...data,
    startedAt: data.startedAt || new Date().toISOString(),
  }));

// Schema for tutoring message insertion
export const insertTutoringMessageSchema = createInsertSchema(tutoringMessages)
  .transform((data) => ({
    ...data,
    timestamp: data.timestamp || new Date().toISOString(),
  }));

// Schema for homework insertion
export const insertHomeworkSchema = createInsertSchema(homework)
  .transform((data) => ({
    ...data,
    createdAt: data.createdAt || new Date().toISOString(),
  }));

// Common export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertDistrict = z.infer<typeof insertDistrictSchema>;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type InsertEducator = z.infer<typeof insertEducatorSchema>;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type InsertTutoringSession = z.infer<typeof insertTutoringSessionSchema>;
export type InsertTutoringMessage = z.infer<typeof insertTutoringMessageSchema>;
export type InsertHomework = z.infer<typeof insertHomeworkSchema>;

export type User = typeof users.$inferSelect;
export type District = typeof districts.$inferSelect;
export type School = typeof schools.$inferSelect;
export type Department = typeof departments.$inferSelect;
export type Educator = typeof educators.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Class = typeof classes.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type Grade = typeof grades.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type TutoringSession = typeof tutoringSessions.$inferSelect;
export type TutoringMessage = typeof tutoringMessages.$inferSelect;
export type Homework = typeof homework.$inferSelect;

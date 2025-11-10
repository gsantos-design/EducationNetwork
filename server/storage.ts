import {
  users,
  type User,
  type InsertUser,
  students,
  type Student,
  type InsertStudent,
  educators,
  type Educator,
  type InsertEducator,
  achievements,
  type Achievement,
  type InsertAchievement,
  classes,
  type Class,
  type InsertClass,
  enrollments,
  type Enrollment,
  type InsertEnrollment,
  grades,
  type Grade,
  type InsertGrade,
  attendance,
  type Attendance,
  type InsertAttendance,
  districts,
  type District,
  type InsertDistrict,
  schools,
  type School,
  type InsertSchool,
  departments,
  type Department,
  type InsertDepartment,
  tutoringSessions,
  type TutoringSession,
  type InsertTutoringSession,
  tutoringMessages,
  type TutoringMessage,
  type InsertTutoringMessage,
  homework,
  type Homework,
  type InsertHomework,
  UserRole,
  AdminLevel
} from "@shared/schema";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { db } from "./db";
import { eq, and, isNull, desc } from "drizzle-orm";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import createMemoryStore from "memorystore";

// Configure Neon to use WebSocket
neonConfig.webSocketConstructor = ws;

const PgSession = connectPgSimple(session);
const MemoryStore = createMemoryStore(session);
type SessionStore = session.Store;

export interface IStorage {
  // District management
  getDistrict(id: number): Promise<District | undefined>;
  getDistrictByCode(code: string): Promise<District | undefined>;
  createDistrict(district: InsertDistrict): Promise<District>;
  getAllDistricts(): Promise<District[]>;
  
  // School management
  getSchool(id: number): Promise<School | undefined>;
  getSchoolByCode(code: string): Promise<School | undefined>;
  getSchoolsByDistrictId(districtId: number): Promise<School[]>;
  createSchool(school: InsertSchool): Promise<School>;
  getAllSchools(userContext?: User): Promise<School[]>;
  
  // Department management
  getDepartment(id: number): Promise<Department | undefined>;
  getDepartmentsBySchoolId(schoolId: number): Promise<Department[]>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  getAllDepartments(userContext?: User): Promise<Department[]>;
  
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  getAllUsers(userContext?: User): Promise<User[]>;

  // Student management
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByUserId(userId: number): Promise<Student | undefined>;
  getStudentsBySchoolId(schoolId: number): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  getAllStudents(userContext?: User): Promise<Student[]>;

  // Educator management
  getEducator(id: number): Promise<Educator | undefined>;
  getEducatorByUserId(userId: number): Promise<Educator | undefined>;
  getEducatorsBySchoolId(schoolId: number): Promise<Educator[]>;
  getEducatorsByDepartmentId(departmentId: number): Promise<Educator[]>;
  createEducator(educator: InsertEducator): Promise<Educator>;
  getAllEducators(userContext?: User): Promise<Educator[]>;

  // Class management
  getClass(id: number): Promise<Class | undefined>;
  getClassesByEducatorId(educatorId: number): Promise<Class[]>;
  getClassesBySchoolId(schoolId: number): Promise<Class[]>;
  getClassesByDepartmentId(departmentId: number): Promise<Class[]>;
  createClass(classData: InsertClass): Promise<Class>;
  getAllClasses(userContext?: User): Promise<Class[]>;

  // Enrollment management
  getEnrollment(id: number): Promise<Enrollment | undefined>;
  getEnrollmentsByStudentId(studentId: number): Promise<Enrollment[]>;
  getEnrollmentsByClassId(classId: number): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getAllEnrollments(userContext?: User): Promise<Enrollment[]>;

  // Grade management
  getGrade(id: number): Promise<Grade | undefined>;
  getGradesByStudentId(studentId: number): Promise<Grade[]>;
  getGradesByClassId(classId: number): Promise<Grade[]>;
  createGrade(grade: InsertGrade): Promise<Grade>;
  getAllGrades(userContext?: User): Promise<Grade[]>;

  // Attendance management
  getAttendance(id: number): Promise<Attendance | undefined>;
  getAttendanceByStudentId(studentId: number): Promise<Attendance[]>;
  getAttendanceByClassId(classId: number): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  getAllAttendance(userContext?: User): Promise<Attendance[]>;

  // Achievement management
  getAchievement(id: number): Promise<Achievement | undefined>;
  getAchievementsByUserId(userId: number): Promise<Achievement[]>;
  getAchievementsBySubject(subject: string): Promise<Achievement[]>;
  getAchievementsByType(type: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getAllAchievements(userContext?: User): Promise<Achievement[]>;
  
  // Tutoring session management
  getTutoringSession(id: number): Promise<TutoringSession | undefined>;
  getTutoringSessionsByStudentId(studentId: number): Promise<TutoringSession[]>;
  getActiveTutoringSession(studentId: number): Promise<TutoringSession | undefined>;
  createTutoringSession(session: InsertTutoringSession): Promise<TutoringSession>;
  updateTutoringSession(id: number, sessionData: Partial<TutoringSession>): Promise<TutoringSession | undefined>;
  
  // Tutoring message management
  getTutoringMessage(id: number): Promise<TutoringMessage | undefined>;
  getTutoringMessagesBySessionId(sessionId: number): Promise<TutoringMessage[]>;
  createTutoringMessage(message: InsertTutoringMessage): Promise<TutoringMessage>;

  // Homework management
  getHomework(id: number): Promise<Homework | undefined>;
  getHomeworkByStudentId(studentId: number): Promise<Homework[]>;
  createHomework(homework: InsertHomework): Promise<Homework>;
  updateHomework(id: number, homeworkData: Partial<Homework>): Promise<Homework | undefined>;
  deleteHomework(id: number): Promise<boolean>;

  // Role-based data access
  getAccessibleSchools(user: User): Promise<School[]>;
  getAccessibleDepartments(user: User): Promise<Department[]>;
  getAccessibleClasses(user: User): Promise<Class[]>;
  getAccessibleStudents(user: User): Promise<Student[]>;
  getAccessibleEducators(user: User): Promise<Educator[]>;
  getAccessibleGrades(user: User): Promise<Grade[]>;
  getAccessibleAttendance(user: User): Promise<Attendance[]>;
  getAccessibleAchievements(user: User): Promise<Achievement[]>;

  // Session store
  sessionStore: SessionStore;
}

export class MemStorage implements IStorage {
  private districtsMap: Map<number, District>;
  private schoolsMap: Map<number, School>;
  private departmentsMap: Map<number, Department>;
  private usersMap: Map<number, User>;
  private studentsMap: Map<number, Student>;
  private educatorsMap: Map<number, Educator>;
  private classesMap: Map<number, Class>;
  private enrollmentsMap: Map<number, Enrollment>;
  private gradesMap: Map<number, Grade>;
  private attendanceMap: Map<number, Attendance>;
  private achievementsMap: Map<number, Achievement>;
  private tutoringSessionsMap: Map<number, TutoringSession>;
  private tutoringMessagesMap: Map<number, TutoringMessage>;
  private homeworkMap: Map<number, Homework>;

  sessionStore: SessionStore;

  private districtIdCounter: number;
  private schoolIdCounter: number;
  private departmentIdCounter: number;
  private userIdCounter: number;
  private studentIdCounter: number;
  private educatorIdCounter: number;
  private classIdCounter: number;
  private enrollmentIdCounter: number;
  private gradeIdCounter: number;
  private attendanceIdCounter: number;
  private achievementIdCounter: number;
  private tutoringSessionIdCounter: number;
  private tutoringMessageIdCounter: number;
  private homeworkIdCounter: number;

  constructor() {
    this.districtsMap = new Map();
    this.schoolsMap = new Map();
    this.departmentsMap = new Map();
    this.usersMap = new Map();
    this.studentsMap = new Map();
    this.educatorsMap = new Map();
    this.classesMap = new Map();
    this.enrollmentsMap = new Map();
    this.gradesMap = new Map();
    this.attendanceMap = new Map();
    this.achievementsMap = new Map();
    this.tutoringSessionsMap = new Map();
    this.tutoringMessagesMap = new Map();
    this.homeworkMap = new Map();

    this.districtIdCounter = 1;
    this.schoolIdCounter = 1;
    this.departmentIdCounter = 1;
    this.userIdCounter = 1;
    this.studentIdCounter = 1;
    this.educatorIdCounter = 1;
    this.classIdCounter = 1;
    this.enrollmentIdCounter = 1;
    this.gradeIdCounter = 1;
    this.attendanceIdCounter = 1;
    this.achievementIdCounter = 1;
    this.tutoringSessionIdCounter = 1;
    this.tutoringMessageIdCounter = 1;
    this.homeworkIdCounter = 1;
    
    // Use in-memory session storage for local demo (use PostgreSQL for production)
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'postgresql://user:password@localhost:5432/edconnect') {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      this.sessionStore = new PgSession({
        pool,
        createTableIfMissing: true,
        tableName: 'session'
      });
    } else {
      // Use memory store for local development without database
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      });
    }
    
    // Add some seed data for development
    this.seedInitialData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id,
      active: insertUser.active ?? true,
      districtId: insertUser.districtId ?? null,
      schoolId: insertUser.schoolId ?? null,
      departmentId: insertUser.departmentId ?? null,
      adminLevel: insertUser.adminLevel ?? null,
      lastLogin: null
    };
    this.usersMap.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.usersMap.values());
  }

  // Student methods
  async getStudent(id: number): Promise<Student | undefined> {
    return this.studentsMap.get(id);
  }
  
  async getStudentByUserId(userId: number): Promise<Student | undefined> {
    return Array.from(this.studentsMap.values()).find(
      (student) => student.userId === userId,
    );
  }
  
  async createStudent(studentData: Omit<Student, "id">): Promise<Student> {
    const id = this.studentIdCounter++;
    const student: Student = { ...studentData, id };
    this.studentsMap.set(id, student);
    return student;
  }
  
  async getAllStudents(): Promise<Student[]> {
    return Array.from(this.studentsMap.values());
  }

  // Class methods
  async getClass(id: number): Promise<Class | undefined> {
    return this.classesMap.get(id);
  }
  
  async getClassesByEducatorId(educatorId: number): Promise<Class[]> {
    return Array.from(this.classesMap.values()).filter(
      (cls) => cls.educatorId === educatorId,
    );
  }
  
  async createClass(classData: Omit<Class, "id">): Promise<Class> {
    const id = this.classIdCounter++;
    const cls: Class = { ...classData, id };
    this.classesMap.set(id, cls);
    return cls;
  }
  
  async getAllClasses(): Promise<Class[]> {
    return Array.from(this.classesMap.values());
  }

  // Enrollment methods
  async getEnrollment(id: number): Promise<Enrollment | undefined> {
    return this.enrollmentsMap.get(id);
  }
  
  async getEnrollmentsByStudentId(studentId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollmentsMap.values()).filter(
      (enrollment) => enrollment.studentId === studentId,
    );
  }
  
  async getEnrollmentsByClassId(classId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollmentsMap.values()).filter(
      (enrollment) => enrollment.classId === classId,
    );
  }
  
  async createEnrollment(enrollmentData: Omit<Enrollment, "id">): Promise<Enrollment> {
    const id = this.enrollmentIdCounter++;
    const enrollment: Enrollment = { ...enrollmentData, id };
    this.enrollmentsMap.set(id, enrollment);
    return enrollment;
  }

  // Grade methods
  async getGrade(id: number): Promise<Grade | undefined> {
    return this.gradesMap.get(id);
  }
  
  async getGradesByStudentId(studentId: number): Promise<Grade[]> {
    return Array.from(this.gradesMap.values()).filter(
      (grade) => grade.studentId === studentId,
    );
  }
  
  async getGradesByClassId(classId: number): Promise<Grade[]> {
    return Array.from(this.gradesMap.values()).filter(
      (grade) => grade.classId === classId,
    );
  }
  
  async createGrade(gradeData: Omit<Grade, "id">): Promise<Grade> {
    const id = this.gradeIdCounter++;
    const grade: Grade = { ...gradeData, id };
    this.gradesMap.set(id, grade);
    return grade;
  }

  // Attendance methods
  async getAttendance(id: number): Promise<Attendance | undefined> {
    return this.attendanceMap.get(id);
  }
  
  async getAttendanceByStudentId(studentId: number): Promise<Attendance[]> {
    return Array.from(this.attendanceMap.values()).filter(
      (attendance) => attendance.studentId === studentId,
    );
  }
  
  async getAttendanceByClassId(classId: number): Promise<Attendance[]> {
    return Array.from(this.attendanceMap.values()).filter(
      (attendance) => attendance.classId === classId,
    );
  }
  
  async createAttendance(attendanceData: Omit<Attendance, "id">): Promise<Attendance> {
    const id = this.attendanceIdCounter++;
    const attendance: Attendance = { ...attendanceData, id };
    this.attendanceMap.set(id, attendance);
    return attendance;
  }
  
  // District methods
  async getDistrict(id: number): Promise<District | undefined> {
    return this.districtsMap.get(id);
  }

  async getDistrictByCode(code: string): Promise<District | undefined> {
    return Array.from(this.districtsMap.values()).find(
      (district) => district.code === code,
    );
  }

  async createDistrict(districtData: InsertDistrict): Promise<District> {
    const id = this.districtIdCounter++;
    const district: District = { ...districtData, id };
    this.districtsMap.set(id, district);
    return district;
  }

  async getAllDistricts(): Promise<District[]> {
    return Array.from(this.districtsMap.values());
  }

  // School methods
  async getSchool(id: number): Promise<School | undefined> {
    return this.schoolsMap.get(id);
  }

  async getSchoolByCode(code: string): Promise<School | undefined> {
    return Array.from(this.schoolsMap.values()).find(
      (school) => school.code === code,
    );
  }

  async getSchoolsByDistrictId(districtId: number): Promise<School[]> {
    return Array.from(this.schoolsMap.values()).filter(
      (school) => school.districtId === districtId,
    );
  }

  async createSchool(schoolData: InsertSchool): Promise<School> {
    const id = this.schoolIdCounter++;
    const school: School = { ...schoolData, id };
    this.schoolsMap.set(id, school);
    return school;
  }

  async getAllSchools(userContext?: User): Promise<School[]> {
    if (!userContext) {
      return Array.from(this.schoolsMap.values());
    }
    return this.getAccessibleSchools(userContext);
  }

  // Department methods
  async getDepartment(id: number): Promise<Department | undefined> {
    return this.departmentsMap.get(id);
  }

  async getDepartmentsBySchoolId(schoolId: number): Promise<Department[]> {
    return Array.from(this.departmentsMap.values()).filter(
      (department) => department.schoolId === schoolId,
    );
  }

  async createDepartment(departmentData: InsertDepartment): Promise<Department> {
    const id = this.departmentIdCounter++;
    const department: Department = { ...departmentData, id };
    this.departmentsMap.set(id, department);
    return department;
  }

  async getAllDepartments(userContext?: User): Promise<Department[]> {
    if (!userContext) {
      return Array.from(this.departmentsMap.values());
    }
    return this.getAccessibleDepartments(userContext);
  }

  // Educator methods
  async getEducator(id: number): Promise<Educator | undefined> {
    return this.educatorsMap.get(id);
  }

  async getEducatorByUserId(userId: number): Promise<Educator | undefined> {
    return Array.from(this.educatorsMap.values()).find(
      (educator) => educator.userId === userId,
    );
  }

  async getEducatorsBySchoolId(schoolId: number): Promise<Educator[]> {
    return Array.from(this.educatorsMap.values()).filter(
      (educator) => educator.schoolId === schoolId,
    );
  }

  async getEducatorsByDepartmentId(departmentId: number): Promise<Educator[]> {
    return Array.from(this.educatorsMap.values()).filter(
      (educator) => educator.departmentId === departmentId,
    );
  }

  async createEducator(educatorData: InsertEducator): Promise<Educator> {
    const id = this.educatorIdCounter++;
    const educator: Educator = { ...educatorData, id };
    this.educatorsMap.set(id, educator);
    return educator;
  }

  async getAllEducators(userContext?: User): Promise<Educator[]> {
    if (!userContext) {
      return Array.from(this.educatorsMap.values());
    }
    return this.getAccessibleEducators(userContext);
  }

  // Additional class methods
  async getClassesBySchoolId(schoolId: number): Promise<Class[]> {
    return Array.from(this.classesMap.values()).filter(
      (cls) => cls.schoolId === schoolId,
    );
  }

  async getClassesByDepartmentId(departmentId: number): Promise<Class[]> {
    return Array.from(this.classesMap.values()).filter(
      (cls) => cls.departmentId === departmentId,
    );
  }

  // Enhanced student methods
  async getStudentsBySchoolId(schoolId: number): Promise<Student[]> {
    return Array.from(this.studentsMap.values()).filter(
      (student) => student.schoolId === schoolId,
    );
  }

  // Update user method
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.usersMap.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }

  // Enhanced getAllUsers with user context
  async getAllUsers(userContext?: User): Promise<User[]> {
    if (!userContext) {
      return Array.from(this.usersMap.values());
    }

    const users = Array.from(this.usersMap.values());
    
    if (userContext.role === UserRole.ADMIN) {
      // Admins can see all users but filtered by their administration level
      if (userContext.adminLevel === AdminLevel.DISTRICT && userContext.districtId) {
        return users.filter(user => user.districtId === userContext.districtId);
      } else if (userContext.adminLevel === AdminLevel.SCHOOL && userContext.schoolId) {
        return users.filter(user => user.schoolId === userContext.schoolId);
      } else if (userContext.adminLevel === AdminLevel.DEPARTMENT && userContext.departmentId) {
        return users.filter(user => user.departmentId === userContext.departmentId);
      }
    } else if (userContext.role === UserRole.EDUCATOR) {
      // Educators can only see their students and other educators in their school/department
      const educator = await this.getEducatorByUserId(userContext.id);
      if (educator) {
        const classes = await this.getClassesByEducatorId(educator.id);
        const classIds = classes.map(cls => cls.id);
        
        const enrollments = (await Promise.all(
          classIds.map(classId => this.getEnrollmentsByClassId(classId))
        )).flat();
        
        const studentIds = [...new Set(enrollments.map(enrollment => enrollment.studentId))];
        const students = await Promise.all(studentIds.map(id => this.getStudent(id)));
        const studentUserIds = students.filter(Boolean).map(student => student!.userId);
        
        // Educators can see their students' user accounts and other educators in their school
        return users.filter(user => 
          studentUserIds.includes(user.id) || 
          (user.role === UserRole.EDUCATOR && user.schoolId === educator.schoolId)
        );
      }
    }
    
    // Students can only see their own user record
    return [userContext];
  }

  // Enhanced student methods with user context
  async getAllStudents(userContext?: User): Promise<Student[]> {
    if (!userContext) {
      return Array.from(this.studentsMap.values());
    }
    return this.getAccessibleStudents(userContext);
  }

  // Enhanced class methods with user context
  async getAllClasses(userContext?: User): Promise<Class[]> {
    if (!userContext) {
      return Array.from(this.classesMap.values());
    }
    return this.getAccessibleClasses(userContext);
  }

  // Enhanced enrollment methods with user context
  async getAllEnrollments(userContext?: User): Promise<Enrollment[]> {
    if (!userContext) {
      return Array.from(this.enrollmentsMap.values());
    }

    const accessibleClasses = await this.getAccessibleClasses(userContext);
    const classIds = accessibleClasses.map(cls => cls.id);

    if (userContext.role === UserRole.STUDENT) {
      const student = await this.getStudentByUserId(userContext.id);
      if (student) {
        return Array.from(this.enrollmentsMap.values()).filter(
          enrollment => enrollment.studentId === student.id
        );
      }
    } else if (userContext.role === UserRole.EDUCATOR) {
      return Array.from(this.enrollmentsMap.values()).filter(
        enrollment => classIds.includes(enrollment.classId)
      );
    } else if (userContext.role === UserRole.ADMIN) {
      if (userContext.adminLevel === AdminLevel.DEPARTMENT && userContext.departmentId) {
        return Array.from(this.enrollmentsMap.values()).filter(
          enrollment => classIds.includes(enrollment.classId)
        );
      } else if (userContext.adminLevel === AdminLevel.SCHOOL && userContext.schoolId) {
        return Array.from(this.enrollmentsMap.values()).filter(
          enrollment => classIds.includes(enrollment.classId)
        );
      } else if (userContext.adminLevel === AdminLevel.DISTRICT && userContext.districtId) {
        return Array.from(this.enrollmentsMap.values()).filter(
          enrollment => classIds.includes(enrollment.classId)
        );
      }
    }

    return [];
  }

  // Enhanced grade methods with user context
  async getAllGrades(userContext?: User): Promise<Grade[]> {
    if (!userContext) {
      return Array.from(this.gradesMap.values());
    }
    return this.getAccessibleGrades(userContext);
  }

  // Enhanced attendance methods with user context
  async getAllAttendance(userContext?: User): Promise<Attendance[]> {
    if (!userContext) {
      return Array.from(this.attendanceMap.values());
    }
    return this.getAccessibleAttendance(userContext);
  }

  // Achievement methods
  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievementsMap.get(id);
  }

  async getAchievementsByUserId(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievementsMap.values()).filter(
      (achievement) => achievement.userId === userId,
    );
  }

  async getAchievementsBySubject(subject: string): Promise<Achievement[]> {
    return Array.from(this.achievementsMap.values()).filter(
      (achievement) => achievement.subject === subject,
    );
  }

  async getAchievementsByType(type: string): Promise<Achievement[]> {
    return Array.from(this.achievementsMap.values()).filter(
      (achievement) => achievement.type === type,
    );
  }

  async createAchievement(achievementData: InsertAchievement): Promise<Achievement> {
    const id = this.achievementIdCounter++;
    const achievement: Achievement = { ...achievementData, id };
    this.achievementsMap.set(id, achievement);
    return achievement;
  }

  async getAllAchievements(userContext?: User): Promise<Achievement[]> {
    if (!userContext) {
      return Array.from(this.achievementsMap.values());
    }
    return this.getAccessibleAchievements(userContext);
  }

  // Role-based access control methods
  async getAccessibleSchools(user: User): Promise<School[]> {
    const schools = Array.from(this.schoolsMap.values());
    
    if (user.role === UserRole.ADMIN) {
      if (user.adminLevel === AdminLevel.DISTRICT && user.districtId) {
        return schools.filter(school => school.districtId === user.districtId);
      } else if (user.adminLevel === AdminLevel.SCHOOL && user.schoolId) {
        return schools.filter(school => school.id === user.schoolId);
      } else if (user.adminLevel === AdminLevel.DEPARTMENT) {
        if (user.schoolId) {
          return schools.filter(school => school.id === user.schoolId);
        }
        return [];
      }
      return schools; // Super admin
    } else if (user.role === UserRole.EDUCATOR && user.schoolId) {
      return schools.filter(school => school.id === user.schoolId);
    } else if (user.role === UserRole.STUDENT && user.schoolId) {
      return schools.filter(school => school.id === user.schoolId);
    }
    
    return [];
  }

  async getAccessibleDepartments(user: User): Promise<Department[]> {
    const departments = Array.from(this.departmentsMap.values());
    
    if (user.role === UserRole.ADMIN) {
      if (user.adminLevel === AdminLevel.DISTRICT && user.districtId) {
        const schoolIds = (await this.getAccessibleSchools(user)).map(school => school.id);
        return departments.filter(dept => schoolIds.includes(dept.schoolId));
      } else if (user.adminLevel === AdminLevel.SCHOOL && user.schoolId) {
        return departments.filter(dept => dept.schoolId === user.schoolId);
      } else if (user.adminLevel === AdminLevel.DEPARTMENT && user.departmentId) {
        return departments.filter(dept => dept.id === user.departmentId);
      }
      return departments; // Super admin
    } else if (user.role === UserRole.EDUCATOR) {
      const educator = await this.getEducatorByUserId(user.id);
      if (educator && educator.departmentId) {
        return departments.filter(dept => dept.id === educator.departmentId);
      } else if (user.schoolId) {
        return departments.filter(dept => dept.schoolId === user.schoolId);
      }
    } else if (user.role === UserRole.STUDENT && user.schoolId) {
      return departments.filter(dept => dept.schoolId === user.schoolId);
    }
    
    return [];
  }

  async getAccessibleClasses(user: User): Promise<Class[]> {
    if (user.role === UserRole.ADMIN) {
      if (user.adminLevel === AdminLevel.DISTRICT && user.districtId) {
        const schoolIds = (await this.getAccessibleSchools(user)).map(school => school.id);
        return Array.from(this.classesMap.values()).filter(
          cls => schoolIds.includes(cls.schoolId)
        );
      } else if (user.adminLevel === AdminLevel.SCHOOL && user.schoolId) {
        return Array.from(this.classesMap.values()).filter(
          cls => cls.schoolId === user.schoolId
        );
      } else if (user.adminLevel === AdminLevel.DEPARTMENT && user.departmentId) {
        return Array.from(this.classesMap.values()).filter(
          cls => cls.departmentId === user.departmentId
        );
      }
      return Array.from(this.classesMap.values()); // Super admin
    } else if (user.role === UserRole.EDUCATOR) {
      const educator = await this.getEducatorByUserId(user.id);
      if (educator) {
        return await this.getClassesByEducatorId(educator.id);
      }
    } else if (user.role === UserRole.STUDENT) {
      const student = await this.getStudentByUserId(user.id);
      if (student) {
        const enrollments = await this.getEnrollmentsByStudentId(student.id);
        const classIds = enrollments.map(enrollment => enrollment.classId);
        return await Promise.all(
          classIds.map(id => this.getClass(id))
        ).then(classes => classes.filter(Boolean) as Class[]);
      }
    }
    
    return [];
  }

  async getAccessibleStudents(user: User): Promise<Student[]> {
    if (user.role === UserRole.ADMIN) {
      if (user.adminLevel === AdminLevel.DISTRICT && user.districtId) {
        const schoolIds = (await this.getAccessibleSchools(user)).map(school => school.id);
        return Array.from(this.studentsMap.values()).filter(
          student => schoolIds.includes(student.schoolId)
        );
      } else if (user.adminLevel === AdminLevel.SCHOOL && user.schoolId) {
        return Array.from(this.studentsMap.values()).filter(
          student => student.schoolId === user.schoolId
        );
      } else if (user.adminLevel === AdminLevel.DEPARTMENT && user.departmentId) {
        const classes = await this.getClassesByDepartmentId(user.departmentId);
        const classIds = classes.map(cls => cls.id);
        
        const enrollments = (await Promise.all(
          classIds.map(classId => this.getEnrollmentsByClassId(classId))
        )).flat();
        
        const studentIds = [...new Set(enrollments.map(enrollment => enrollment.studentId))];
        return await Promise.all(
          studentIds.map(id => this.getStudent(id))
        ).then(students => students.filter(Boolean) as Student[]);
      }
      return Array.from(this.studentsMap.values()); // Super admin
    } else if (user.role === UserRole.EDUCATOR) {
      const educator = await this.getEducatorByUserId(user.id);
      if (educator) {
        const classes = await this.getClassesByEducatorId(educator.id);
        const classIds = classes.map(cls => cls.id);
        
        const enrollments = (await Promise.all(
          classIds.map(classId => this.getEnrollmentsByClassId(classId))
        )).flat();
        
        const studentIds = [...new Set(enrollments.map(enrollment => enrollment.studentId))];
        return await Promise.all(
          studentIds.map(id => this.getStudent(id))
        ).then(students => students.filter(Boolean) as Student[]);
      }
    } else if (user.role === UserRole.STUDENT) {
      const student = await this.getStudentByUserId(user.id);
      if (student) {
        return [student]; // Students can only see their own student record
      }
    }
    
    return [];
  }

  async getAccessibleEducators(user: User): Promise<Educator[]> {
    if (user.role === UserRole.ADMIN) {
      if (user.adminLevel === AdminLevel.DISTRICT && user.districtId) {
        const schoolIds = (await this.getAccessibleSchools(user)).map(school => school.id);
        return Array.from(this.educatorsMap.values()).filter(
          educator => schoolIds.includes(educator.schoolId)
        );
      } else if (user.adminLevel === AdminLevel.SCHOOL && user.schoolId) {
        return Array.from(this.educatorsMap.values()).filter(
          educator => educator.schoolId === user.schoolId
        );
      } else if (user.adminLevel === AdminLevel.DEPARTMENT && user.departmentId) {
        return Array.from(this.educatorsMap.values()).filter(
          educator => educator.departmentId === user.departmentId
        );
      }
      return Array.from(this.educatorsMap.values()); // Super admin
    } else if (user.role === UserRole.EDUCATOR && user.schoolId) {
      return Array.from(this.educatorsMap.values()).filter(
        educator => educator.schoolId === user.schoolId
      );
    } else if (user.role === UserRole.STUDENT && user.schoolId) {
      // Students can see educators teaching their classes
      const student = await this.getStudentByUserId(user.id);
      if (student) {
        const enrollments = await this.getEnrollmentsByStudentId(student.id);
        const classIds = enrollments.map(enrollment => enrollment.classId);
        const classes = await Promise.all(
          classIds.map(id => this.getClass(id))
        ).then(classes => classes.filter(Boolean) as Class[]);
        
        const educatorIds = [...new Set(classes.map(cls => cls.educatorId))];
        return await Promise.all(
          educatorIds.map(id => this.getEducator(id))
        ).then(educators => educators.filter(Boolean) as Educator[]);
      }
    }
    
    return [];
  }

  async getAccessibleGrades(user: User): Promise<Grade[]> {
    if (user.role === UserRole.ADMIN) {
      if (user.adminLevel === AdminLevel.DISTRICT && user.districtId) {
        const accessibleStudents = await this.getAccessibleStudents(user);
        const studentIds = accessibleStudents.map(student => student.id);
        return Array.from(this.gradesMap.values()).filter(
          grade => studentIds.includes(grade.studentId)
        );
      } else if (user.adminLevel === AdminLevel.SCHOOL && user.schoolId) {
        const accessibleStudents = await this.getAccessibleStudents(user);
        const studentIds = accessibleStudents.map(student => student.id);
        return Array.from(this.gradesMap.values()).filter(
          grade => studentIds.includes(grade.studentId)
        );
      } else if (user.adminLevel === AdminLevel.DEPARTMENT && user.departmentId) {
        const accessibleStudents = await this.getAccessibleStudents(user);
        const studentIds = accessibleStudents.map(student => student.id);
        return Array.from(this.gradesMap.values()).filter(
          grade => studentIds.includes(grade.studentId)
        );
      }
      return Array.from(this.gradesMap.values()); // Super admin
    } else if (user.role === UserRole.EDUCATOR) {
      const educator = await this.getEducatorByUserId(user.id);
      if (educator) {
        const classes = await this.getClassesByEducatorId(educator.id);
        const classIds = classes.map(cls => cls.id);
        return Array.from(this.gradesMap.values()).filter(
          grade => classIds.includes(grade.classId)
        );
      }
    } else if (user.role === UserRole.STUDENT) {
      const student = await this.getStudentByUserId(user.id);
      if (student) {
        return await this.getGradesByStudentId(student.id);
      }
    }
    
    return [];
  }

  async getAccessibleAttendance(user: User): Promise<Attendance[]> {
    if (user.role === UserRole.ADMIN) {
      if (user.adminLevel === AdminLevel.DISTRICT && user.districtId) {
        const accessibleStudents = await this.getAccessibleStudents(user);
        const studentIds = accessibleStudents.map(student => student.id);
        return Array.from(this.attendanceMap.values()).filter(
          attendance => studentIds.includes(attendance.studentId)
        );
      } else if (user.adminLevel === AdminLevel.SCHOOL && user.schoolId) {
        const accessibleStudents = await this.getAccessibleStudents(user);
        const studentIds = accessibleStudents.map(student => student.id);
        return Array.from(this.attendanceMap.values()).filter(
          attendance => studentIds.includes(attendance.studentId)
        );
      } else if (user.adminLevel === AdminLevel.DEPARTMENT && user.departmentId) {
        const accessibleStudents = await this.getAccessibleStudents(user);
        const studentIds = accessibleStudents.map(student => student.id);
        return Array.from(this.attendanceMap.values()).filter(
          attendance => studentIds.includes(attendance.studentId)
        );
      }
      return Array.from(this.attendanceMap.values()); // Super admin
    } else if (user.role === UserRole.EDUCATOR) {
      const educator = await this.getEducatorByUserId(user.id);
      if (educator) {
        const classes = await this.getClassesByEducatorId(educator.id);
        const classIds = classes.map(cls => cls.id);
        return Array.from(this.attendanceMap.values()).filter(
          attendance => classIds.includes(attendance.classId)
        );
      }
    } else if (user.role === UserRole.STUDENT) {
      const student = await this.getStudentByUserId(user.id);
      if (student) {
        return await this.getAttendanceByStudentId(student.id);
      }
    }
    
    return [];
  }

  async getAccessibleAchievements(user: User): Promise<Achievement[]> {
    if (user.role === UserRole.ADMIN) {
      if (user.adminLevel === AdminLevel.DISTRICT && user.districtId) {
        const accessibleUsers = await this.getAllUsers(user);
        const userIds = accessibleUsers.map(u => u.id);
        return Array.from(this.achievementsMap.values()).filter(
          achievement => userIds.includes(achievement.userId)
        );
      } else if (user.adminLevel === AdminLevel.SCHOOL && user.schoolId) {
        const accessibleUsers = await this.getAllUsers(user);
        const userIds = accessibleUsers.map(u => u.id);
        return Array.from(this.achievementsMap.values()).filter(
          achievement => userIds.includes(achievement.userId)
        );
      } else if (user.adminLevel === AdminLevel.DEPARTMENT && user.departmentId) {
        const accessibleUsers = await this.getAllUsers(user);
        const userIds = accessibleUsers.map(u => u.id);
        return Array.from(this.achievementsMap.values()).filter(
          achievement => userIds.includes(achievement.userId)
        );
      }
      return Array.from(this.achievementsMap.values()); // Super admin
    } else if (user.role === UserRole.EDUCATOR) {
      const educator = await this.getEducatorByUserId(user.id);
      if (educator) {
        // Educators can see their students' achievements and their own
        const classes = await this.getClassesByEducatorId(educator.id);
        const classIds = classes.map(cls => cls.id);
        
        const enrollments = (await Promise.all(
          classIds.map(classId => this.getEnrollmentsByClassId(classId))
        )).flat();
        
        const studentIds = [...new Set(enrollments.map(enrollment => enrollment.studentId))];
        const students = await Promise.all(studentIds.map(id => this.getStudent(id)));
        const studentUserIds = students.filter(Boolean).map(student => student!.userId);
        
        return Array.from(this.achievementsMap.values()).filter(
          achievement => studentUserIds.includes(achievement.userId) || achievement.userId === user.id
        );
      }
    } else if (user.role === UserRole.STUDENT) {
      // Students can see their own achievements and any public achievements from their school
      return Array.from(this.achievementsMap.values()).filter(
        achievement => achievement.userId === user.id || achievement.isPublic === true
      );
    }
    
    return [];
  }

  // Tutoring session methods - IN-MEMORY FOR DEMO
  async getTutoringSession(id: number): Promise<TutoringSession | undefined> {
    return this.tutoringSessionsMap.get(id);
  }

  async getTutoringSessionsByStudentId(studentId: number): Promise<TutoringSession[]> {
    return Array.from(this.tutoringSessionsMap.values())
      .filter(session => session.studentId === studentId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }

  async getActiveTutoringSession(studentId: number): Promise<TutoringSession | undefined> {
    return Array.from(this.tutoringSessionsMap.values())
      .find(session => session.studentId === studentId && !session.endedAt);
  }

  async createTutoringSession(sessionData: InsertTutoringSession): Promise<TutoringSession> {
    const id = this.tutoringSessionIdCounter++;
    const session: TutoringSession = {
      id,
      studentId: sessionData.studentId,
      startedAt: sessionData.startedAt || new Date().toISOString(),
      endedAt: sessionData.endedAt || null,
      subject: sessionData.subject || null,
      topic: sessionData.topic || null,
      difficulty: sessionData.difficulty || null,
      totalMessages: sessionData.totalMessages || 0,
      studentQuestions: sessionData.studentQuestions || 0,
      conceptsCovered: sessionData.conceptsCovered || null,
      sessionSummary: sessionData.sessionSummary || null,
      performanceScore: sessionData.performanceScore || null,
      improvementAreas: sessionData.improvementAreas || null,
      strengthAreas: sessionData.strengthAreas || null,
    };
    this.tutoringSessionsMap.set(id, session);
    return session;
  }

  async updateTutoringSession(id: number, sessionData: Partial<TutoringSession>): Promise<TutoringSession | undefined> {
    const existing = this.tutoringSessionsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...sessionData };
    this.tutoringSessionsMap.set(id, updated);
    return updated;
  }

  // Tutoring message methods - IN-MEMORY FOR DEMO
  async getTutoringMessage(id: number): Promise<TutoringMessage | undefined> {
    return this.tutoringMessagesMap.get(id);
  }

  async getTutoringMessagesBySessionId(sessionId: number): Promise<TutoringMessage[]> {
    return Array.from(this.tutoringMessagesMap.values())
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createTutoringMessage(messageData: InsertTutoringMessage): Promise<TutoringMessage> {
    const id = this.tutoringMessageIdCounter++;
    const message: TutoringMessage = {
      id,
      sessionId: messageData.sessionId,
      role: messageData.role,
      content: messageData.content,
      timestamp: messageData.timestamp || new Date().toISOString(),
      conceptsDiscussed: messageData.conceptsDiscussed || null,
    };
    this.tutoringMessagesMap.set(id, message);
    return message;
  }

  // Homework management methods
  async getHomework(id: number): Promise<Homework | undefined> {
    return this.homeworkMap.get(id);
  }

  async getHomeworkByStudentId(studentId: number): Promise<Homework[]> {
    return Array.from(this.homeworkMap.values())
      .filter(hw => hw.studentId === studentId)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  async createHomework(homeworkData: InsertHomework): Promise<Homework> {
    const id = this.homeworkIdCounter++;
    const homework: Homework = {
      id,
      studentId: homeworkData.studentId,
      title: homeworkData.title,
      description: homeworkData.description || null,
      subject: homeworkData.subject || null,
      dueDate: homeworkData.dueDate,
      completed: homeworkData.completed || false,
      completedAt: homeworkData.completedAt || null,
      priority: homeworkData.priority || "medium",
      createdAt: homeworkData.createdAt || new Date().toISOString(),
      notes: homeworkData.notes || null,
      attachmentUrl: homeworkData.attachmentUrl || null,
      attachmentName: homeworkData.attachmentName || null,
    };
    this.homeworkMap.set(id, homework);
    return homework;
  }

  async updateHomework(id: number, homeworkData: Partial<Homework>): Promise<Homework | undefined> {
    const homework = this.homeworkMap.get(id);
    if (!homework) return undefined;

    const updated: Homework = {
      ...homework,
      ...homeworkData,
      id, // Ensure ID cannot be changed
    };
    this.homeworkMap.set(id, updated);
    return updated;
  }

  async deleteHomework(id: number): Promise<boolean> {
    return this.homeworkMap.delete(id);
  }

  // Helper method to seed initial data for development
  private async seedInitialData() {
    // We'll seed this properly from the auth backend
  }
}

export const storage = new MemStorage();

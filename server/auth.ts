import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, UserRole } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "edconnect-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure cookies for production HTTPS
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Allow cross-site for production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Create initial admin user if no users exist
  (async () => {
    const users = await storage.getAllUsers();
    if (users.length === 0) {
      console.log("Creating initial admin, educator, and student users");
      
      // Create admin user
      const adminUser = await storage.createUser({
        username: "admin",
        password: await hashPassword("AdminED2025!"),
        firstName: "Admin",
        lastName: "User",
        role: UserRole.ADMIN,
        email: "admin@edconnect.edu"
      });
      
      // Create educator user
      const educatorUser = await storage.createUser({
        username: "teacher",
        password: await hashPassword("TeachNYC2025!"),
        firstName: "John",
        lastName: "Doe",
        role: UserRole.EDUCATOR,
        email: "john.doe@edconnect.edu"
      });
      
      // Create student user
      const studentUser = await storage.createUser({
        username: "student",
        password: await hashPassword("EdConnect2025!"),
        firstName: "Alex",
        lastName: "Chen",
        role: UserRole.STUDENT,
        email: "alex.chen@edconnect.edu"
      });
      
      // Create student record
      await storage.createStudent({
        userId: studentUser.id,
        grade: "10th",
        dateOfBirth: "2006-04-15"
      });
      
      // Create educator record
      await storage.createEducator({
        userId: educatorUser.id,
        schoolId: 1,
        departmentId: null,
        subjectSpecialty: "Mathematics",
        employeeId: "T12345",
        officeLocation: "Room 101",
        officeHours: "M-F 3:00 PM - 4:00 PM"
      });
      
      // Create classes
      const mathClass = await storage.createClass({
        name: "Mathematics",
        description: "Algebra and Geometry fundamentals",
        educatorId: educatorUser.id
      });
      
      const scienceClass = await storage.createClass({
        name: "Science",
        description: "Physics and Chemistry basics",
        educatorId: educatorUser.id
      });
      
      const englishClass = await storage.createClass({
        name: "English",
        description: "Literature and Composition",
        educatorId: educatorUser.id
      });
      
      const historyClass = await storage.createClass({
        name: "History",
        description: "World History",
        educatorId: educatorUser.id
      });
      
      // Enroll student in classes
      await storage.createEnrollment({
        studentId: 1,
        classId: mathClass.id
      });
      
      await storage.createEnrollment({
        studentId: 1,
        classId: scienceClass.id
      });
      
      await storage.createEnrollment({
        studentId: 1,
        classId: englishClass.id
      });
      
      await storage.createEnrollment({
        studentId: 1,
        classId: historyClass.id
      });
      
      // Add some grades
      await storage.createGrade({
        studentId: 1,
        classId: mathClass.id,
        assignmentName: "Algebraic Equations",
        score: 84,
        maxScore: 100,
        submissionDate: "2023-05-01"
      });
      
      await storage.createGrade({
        studentId: 1,
        classId: scienceClass.id,
        assignmentName: "Chemical Reactions",
        score: 76,
        maxScore: 100,
        submissionDate: "2023-05-05"
      });
      
      await storage.createGrade({
        studentId: 1,
        classId: englishClass.id,
        assignmentName: "Essay Writing",
        score: 92,
        maxScore: 100,
        submissionDate: "2023-05-10"
      });
      
      await storage.createGrade({
        studentId: 1,
        classId: historyClass.id,
        assignmentName: "Historical Analysis",
        score: 79,
        maxScore: 100,
        submissionDate: "2023-05-15"
      });
      
      // Add attendance records
      await storage.createAttendance({
        studentId: 1,
        classId: mathClass.id,
        date: "2023-05-01",
        status: "present"
      });
      
      await storage.createAttendance({
        studentId: 1,
        classId: scienceClass.id,
        date: "2023-05-01",
        status: "present"
      });
      
      await storage.createAttendance({
        studentId: 1,
        classId: englishClass.id,
        date: "2023-05-02",
        status: "present"
      });
      
      await storage.createAttendance({
        studentId: 1,
        classId: historyClass.id,
        date: "2023-05-02",
        status: "absent"
      });
    }
  })();

  // Auth routes
  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      // If user is a student, create a student record
      if (user.role === UserRole.STUDENT) {
        await storage.createStudent({
          userId: user.id,
          grade: req.body.grade || '',
          dateOfBirth: req.body.dateOfBirth || ''
        });
      }
      
      // If user is an educator, create an educator record
      if (user.role === UserRole.EDUCATOR) {
        await storage.createEducator({
          userId: user.id,
          schoolId: req.body.schoolId || 1,
          departmentId: req.body.departmentId || null,
          subjectSpecialty: req.body.subjectSpecialty || null,
          employeeId: req.body.employeeId || null,
          officeLocation: req.body.officeLocation || null,
          officeHours: req.body.officeHours || null
        });
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

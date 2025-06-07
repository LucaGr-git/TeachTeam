import "reflect-metadata";
import { DataSource } from "typeorm";
import { Course } from "./entity/Course";
import { CourseLecturer } from "./entity/CourseLecturer";
import { Experience } from "./entity/Experience";
import { LecturerShortlist } from "./entity/LecturerShortlist";
import { PreferredSkill } from "./entity/PreferredSkill";
import { Qualification } from "./entity/Qualification";
import { ShortlistedTutor } from "./entity/ShortlistedTutor";
import { ShortlistNote } from "./entity/ShortlistNote";
import { Skill } from "./entity/Skill";
import { TutorApplication } from "./entity/TutorApplication";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "209.38.26.237",
  port: 3306,
  /* Change to your own credentials */
  username: "S4095471",
  password: "P20050802!!",
  database: "S4095471",
  // synchronize: true will automatically create database tables based on entity definitions
  // and update them when entity definitions change. This is useful during development
  // but should be disabled in production to prevent accidental data loss.
  synchronize: true,
  logging: true,
  entities: [Course, CourseLecturer, Experience, LecturerShortlist, PreferredSkill, Qualification, ShortlistedTutor, ShortlistNote, Skill, TutorApplication, User],
  migrations: [],
  subscribers: [],
});

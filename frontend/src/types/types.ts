export interface Course {
  courseCode: string;
  courseTitle: string;
  partTimeFriendly: boolean;
  fullTimeFriendly: boolean;
}

export interface User {
  email: string;
  password: string
  firstName: string;
  lastName: string;
  isLecturer: boolean;
  fullTime: boolean;
  dateJoined: string;
}

export interface Experience {
    ID?: number;
    email: string;
    title: string;
    company: string;
    timeStarted: string;
    timeFinished?: string;
}

export interface Skill {
    ID?: number;
    email: string;
    skill: string;
}

export interface NewSkill {
    email: string;
    skill: string;
}

export interface Qualification {
    ID?: number;
    email: string;
    qualification: string;
}

export interface LecturerShortlist {
    courseCode: string;
    lecturerEmail: string;
    tutorEmail: string;
    rank: number;
}

export interface ShortlistNote {
    ID: number;
    courseCode: string;
    lecturerEmail: string;
    tutorEmail: string;
    message: string;
    date: string;
}

export interface ShortlistedTutor {
    courseCode: string;
    tuthorEmail: string;
}

export interface TutorApplication {
    courseCode: string;
    tuthorEmail: string;
}

export interface CourseLecturer {
    courseCode: string;
    tuthorEmail: string;
}

export interface CourseTutor{
    courseCode: string;
    tuthorEmail: string;
}

export interface PreferredSkill {
    courseCode: string;
    skill: string;
}
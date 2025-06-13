import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";


import { Course, CourseLecturer, TutorApplication, ShortlistedTutor, ShortlistNote, PreferredSkill, User, LecturerShortlist, Qualification, Experience, Skill, CourseTutor } from "../types/types";
export const courseService = {

  getAllCourses: async (): Promise<Course[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/courses`);
    return data;
  },

getAllCourseLecturers: async (): Promise<CourseLecturer[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/courseLecturers`);
    return data;
  },

  
  getAllTutorApplications: async (): Promise<TutorApplication[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/tutorApplications`);
    return data;
  },

  getAllCourseTutors: async (): Promise<CourseTutor[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/courseTutors`);
    return data;
  },

  getAllShortlistedTutors: async (): Promise<ShortlistedTutor[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/shortlistedTutors`);
    return data;
  },

  getAllShortlistNotes: async (): Promise<ShortlistNote[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/shortlistNotes`);
    return data;
  },

  getAllLecturerShortlists: async (): Promise<LecturerShortlist[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/lecturerShortlists`);
    return data;
  },

  getAllPreferredSkills: async (): Promise<PreferredSkill[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/preferredSkills`);
    return data;
  },

  getCourseByCode: async (courseCode: string): Promise<Course> => {
    const { data } = await axios.get(`${API_BASE_URL}/courses/${courseCode}`);
    return data;
  },

  createCourse: async (course: Course): Promise<void> => {
    await axios.post(`${API_BASE_URL}/courses`, course);
  },

  updateCourse: async (courseCode: string, course: Partial<{
  courseTitle: string;
  partTimeFriendly: boolean;
  fullTimeFriendly: boolean;
    }>): Promise<Course> => {
    const { data } = await axios.put(`${API_BASE_URL}/courses/${courseCode}`, course);
    return data;
  },

  deleteCourse: async (courseCode: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/courses/${courseCode}`);
  },

  getLecturerByCourseCode: async (courseCode: string): Promise<CourseLecturer[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/courses/${courseCode}/lecturers`);
    return data;
  },

  getCoursesByLecturerEmail: async (lecturerEmail: string): Promise<Course[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/lecturers/${lecturerEmail}/courses`);
    return data;
  },

  createCourseLecturer: async (courseCode: string, lecturer: CourseLecturer): Promise<void> => {
    await axios.post(`${API_BASE_URL}/courses/${courseCode}/lecturers`, lecturer);
  },

  deleteCourseLecturer: async (courseCode: string, lecturerEmail: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/courses/${courseCode}/lecturers/${lecturerEmail}`);
  },

  getTutorByCourseCode: async (courseCode: string): Promise<CourseTutor[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/courses/${courseCode}/tutors`);
    return data;
  },

  getCoursesByTutorEmail: async (tutorEmail: string): Promise<Course[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/tutors/${tutorEmail}/courses`);
    return data;
  },

  createCourseTutor: async (courseCode: string, tutor: CourseTutor): Promise<void> => {
    await axios.post(`${API_BASE_URL}/courses/${courseCode}/tutors`, tutor);
  },



  getTutorApplication: async (courseCode: string, tutorEmail: string) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/courses/${courseCode}/applications/${tutorEmail}`);
      return data;
    }
    catch{
      return null;
    }
    
  },

  getTutorApplicationsByCourseCode: async (courseCode: string): Promise<TutorApplication[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/courses/${courseCode}/applications`);
    return data;
  },

  getCoursesByTutorApplicationEmail: async (tutorEmail: string): Promise<Course[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/applications/${tutorEmail}/courses`);
    return data;
  },

  createTutorApplication: async (courseCode: string, application: TutorApplication): Promise<void> => {
    await axios.post(`${API_BASE_URL}/courses/${courseCode}/applications`, application);
  },

  deleteTutorApplication: async (tutorEmail: string, courseCode: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/applications/${tutorEmail}/${courseCode}`);
  },

  getShortlistedTutorsByCourseCode: async (courseCode: string): Promise<ShortlistedTutor[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/courses/${courseCode}/shortlistedTutors`);
    return data;
  },

  getCoursesByShortlistedTutorEmail: async (tutorEmail: string): Promise<Course[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/shortlistedTutors/${tutorEmail}/courses`);
    return data;
  },

  createShortlistedTutor: async (courseCode: string, tutor: ShortlistedTutor): Promise<void> => {
    await axios.post(`${API_BASE_URL}/courses/${courseCode}/shortlistedTutors`, tutor);
  },

  deleteShortlistedTutor: async (courseCode: string, tutorEmail: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/courses/${courseCode}/shortlistedTutors/${tutorEmail}`);
  },

  getShortlistNoteById: async (noteId: string): Promise<ShortlistNote> => {
    const { data } = await axios.get(`${API_BASE_URL}/shortlistNotes/${noteId}`);
    return data;
  },

  createShortlistNote: async (courseCode: string, tutorEmail: string, note: ShortlistNote): Promise<void> => {
    await axios.post(`${API_BASE_URL}/courses/${courseCode}/shortlisted-tutors/${tutorEmail}/notes`, note);
  },

  updateShortlistNote: async (noteId: string, note: {
        courseCode: string;
        lecturerEmail: string;
        tutorEmail: string;
        message: string;
        date: string;
    }): Promise<ShortlistNote> => {
    const { data } = await axios.put(`${API_BASE_URL}/shortlistNotes/${noteId}`, note);
    return data;
  },

  deleteShortlistNote: async (noteId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/shortlistNotes/${noteId}`);
  },

  getTutorEmailsByCourseAndLecturer: async (courseCode: string, lecturerEmail: string): Promise<LecturerShortlist[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/courses/${courseCode}/lecturers/${lecturerEmail}/shortlist`);
    return data;
  },

  createLecturerShortlist: async (courseCode: string, lecturerEmail: string, shortlist: LecturerShortlist): Promise<void> => {
    await axios.post(`${API_BASE_URL}/courses/${courseCode}/lecturers/${lecturerEmail}/shortlist`, shortlist);
  },

  updateLecturerShortlist: async (courseCode: string, lecturerEmail: string, shortlist: {
        lecturerEmail: string;
        tutorEmail: string;
        rank: number;
    }): Promise<LecturerShortlist> => {
    const { data } = await axios.put(`${API_BASE_URL}/courses/${courseCode}/lecturers/${lecturerEmail}/shortlist/${shortlist.tutorEmail}`, shortlist);
    return data;
  },

  deleteLecturerShortlist: async (courseCode: string, lecturerEmail: string, tutorEmail: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/courses/${courseCode}/lecturers/${lecturerEmail}/shortlist/${tutorEmail}`);
  },

  getPreferredSkills: async (courseCode: string): Promise<PreferredSkill[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/courses/${courseCode}/preferredSkills`);
    return data;
  },

  createPreferredSkill: async (courseCode: string, skill: PreferredSkill): Promise<void> => {
    await axios.post(`${API_BASE_URL}/courses/${courseCode}/preferredSkills`, skill);
  },

  deletePreferredSkill: async (courseCode: string, skill: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/courses/${courseCode}/preferredSkills/${skill}`);
  },
};

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
      const { data } = await axios.get(`${API_BASE_URL}/users`);
      return data;
  },

  getUserByEmail: async (email: string): Promise<User> => {
    const { data } = await axios.get(`${API_BASE_URL}/users/${email}`);
    return data;
  },

  createUser: async (user: User): Promise<void> => {
    await axios.post(`${API_BASE_URL}/users`, user);
  },

  updateUser: async (email: string, updatedData: Partial<User>): Promise<User> => {
    const { data } = await axios.put(`${API_BASE_URL}/users/${email}`, updatedData);
    return data;
  },

  deleteUser: async (email: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/users/${email}`);
  },

  // Experiences
  getUserExperiences: async (email: string): Promise<Experience[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/users/${email}/experiences`);
    return data;
  },

  addExperienceToUser: async (email: string, experience: Experience): Promise<Experience> => {
    const { data } = await axios.post(`${API_BASE_URL}/users/${email}/experiences`, experience);
    return data;
  },

  deleteExperience: async (email: string, experienceId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/users/${email}/experiences/${experienceId}`);
  },

  // Skills
  getUserSkills: async (email: string): Promise<Skill[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/users/${email}/skills`);
    return data;
  },

  addSkillToUser: async (email: string, skill: Skill): Promise<Skill> => {
    const { data } = await axios.post(`${API_BASE_URL}/users/${email}/skills`, skill);
    return data;
  },

  deleteSkill: async (email: string, skillId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/users/${email}/skills/${skillId}`);
  },

  // Qualifications
  getUserQualifications: async (email: string): Promise<Qualification[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/users/${email}/qualifications`);
    return data;
  },

  addQualificationToUser: async (email: string, qualification: Qualification): Promise<Qualification> => {
    const { data } = await axios.post(`${API_BASE_URL}/users/${email}/qualifications`, qualification);
    return data;
  },

  deleteQualification: async (email: string, qualificationId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/users/${email}/qualifications/${qualificationId}`);
  }
};

import axios from "axios";

const API_BASE_URL = "/api"; // Change if needed

import { Course, CourseLecturer, TutorApplication, ShortlistedTutor, ShortlistNote, PreferredSkill } from "../types/types";
import { LecturerShortList } from "@/localStorage-context/classDataProvider";
export const courseService = {

  getAllCourses: async (): Promise<Course[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/courses`);
    return data;
  },

  getCourseByCode: async (courseCode: string): Promise<Course> => {
    const { data } = await axios.get(`${API_BASE_URL}/courses/${courseCode}`);
    return data;
  },

  createCourse: async (course: Course): Promise<void> => {
    await axios.post(`${API_BASE_URL}/courses`, course);
  },

  updateCourse: async (courseCode: string, course: {
  courseTitle: string;
  partTimeFriendly: boolean;
  fullTimeFriendly: boolean;
    }): Promise<Course> => {
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

  getTutorApplicationsByCourseCode: async (courseCode: string): Promise<TutorApplication[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/courses/${courseCode}/applications`);
    return data;
  },

  getCoursesByTutorEmail: async (tutorEmail: string): Promise<Course[]> => {
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
    }): Promise<any> => {
    const { data } = await axios.put(`${API_BASE_URL}/shortlistNotes/${noteId}`, note);
    return data;
  },

  deleteShortlistNote: async (noteId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/shortlistNotes/${noteId}`);
  },

  getTutorEmailsByCourseAndLecturer: async (courseCode: string, lecturerEmail: string): Promise<LecturerShortList[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/courses/${courseCode}/lecturers/${lecturerEmail}/shortlist`);
    return data;
  },

  createLecturerShortlist: async (courseCode: string, lecturerEmail: string, shortlist: LecturerShortList): Promise<void> => {
    await axios.post(`${API_BASE_URL}/courses/${courseCode}/lecturers/${lecturerEmail}/shortlist`, shortlist);
  },

  updateLecturerShortlist: async (courseCode: string, lecturerEmail: string, shortlist: {
        lecturerEmail: string;
        tutorEmail: string;
        rank: number;
    }): Promise<LecturerShortList> => {
    const { data } = await axios.put(`${API_BASE_URL}/courses/${courseCode}/lecturers/${lecturerEmail}/shortlist`, shortlist);
    return data;
  },

  deleteLecturerShortlist: async (courseCode: string, lecturerEmail: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/courses/${courseCode}/lecturers/${lecturerEmail}/shortlist`);
  },

  getPreferredSkills: async (courseCode: string): Promise<PreferredSkill[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/courses/${courseCode}/preferredSkills`);
    return data;
  },

  createPreferredSkill: async (courseCode: string, skill: PreferredSkill): Promise<void> => {
    await axios.post(`${API_BASE_URL}/courses/${courseCode}/preferredSkills`, skill);
  },

  deletePreferredSkill: async (courseCode: string, skillId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/courses/${courseCode}/preferredSkills/${skillId}`);
  },
};

import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { AssignmentList } from '@/components/student/StudentLanding.vue';

const BASE_URL = '';
const get = (path: string, params?: unknown): AxiosRequestConfig => ({
  baseURL: BASE_URL,
  url: path,
  method: 'GET',
  params: params,
});
const post = (path: string, jsonString?: string): AxiosRequestConfig => ({
  baseURL: BASE_URL,
  url: path,
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  data: jsonString,
});

export class SeamApiStudent {
  static getAllAssignments(studentId: number): AxiosPromise<AssignmentList[]> {
    return axios(get('/seam/student/getall', { studentId: studentId }));
  }
}

export class SeamApiTeacher {
  static getAssignments(teacherId: number): AxiosPromise<number> {
    return axios(get('/', { teacherId: teacherId }));
  }
  static updateAssignments(content_id: number) {
    return axios(post('/example'));
  }
}

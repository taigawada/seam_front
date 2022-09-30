import axios, { AxiosPromise, AxiosRequestConfig, CancelToken } from 'axios';
import { AssignmentList } from '@/components/student/StudentLanding.vue';
import { ResourceListAssignments } from '@/components/teacher/mainPage/landingPage/AssignmentResourcelist.vue';
import { AssignmentAllResourcelist } from '@/components/teacher/mainPage/assignmentsList/AssignmentsList.vue';
import { AssignmentStatus } from '@/components/teacher/mainPage/submissionStatus/StatusResourcelist.vue';
import { UserSettings } from '@/components/teacher/settingsPage/SettingsPage.vue';

const BASE_URL = '';
const get = (
  path: string,
  params?: unknown,
  cancelToken?: CancelToken
): AxiosRequestConfig => ({
  baseURL: BASE_URL,
  url: path,
  method: 'GET',
  params: params,
  cancelToken: cancelToken,
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
    return axios(get(`/seam/student/assigned/${studentId}`));
  }
}
export class SeamApiTeacher {
  // user settings
  static getSubmissionMethods(teacherId: number): AxiosPromise<string[]> {
    return axios(get(`/seam/teacher/settings/submission-methods/${teacherId}`));
  }
  // at mainPage
  static getAssignments(
    teacherId: number
  ): AxiosPromise<ResourceListAssignments[]> {
    return axios(get(`/seam/teacher/assignments/${teacherId}`));
  }
  // at assignmentsList
  static searchAssignments(
    teacherId: number,
    querys: object,
    cancelToken: CancelToken
  ): AxiosPromise<AssignmentAllResourcelist[]> {
    return axios(
      get(`/seam/teacher/search/assignments/${teacherId}`, querys, cancelToken)
    );
  }
  // at mainPage edit
  static getAssignment(
    assignmentId: number
  ): AxiosPromise<ResourceListAssignments> {
    return axios(get(`/seam/teacher/assignments/get/${assignmentId}`));
  }
  // at mainPage delete
  static deleteAssignment(
    assignmentIds: number[]
  ): AxiosPromise<ResourceListAssignments[]> {
    const params = new URLSearchParams();
    assignmentIds.map((assignmentId) =>
      params.append('assignmentId', String(assignmentId))
    );
    return axios(get('/seam/teacher/assignments/delete/', params));
  }
  // get classes
  static getClasses(teacherId: number): AxiosPromise<string[]> {
    return axios(get(`/seam/teacher/classes/get/${teacherId}`));
  }
  // assignment create
  static createAssignment(assignments: string): AxiosPromise<number> {
    return axios(post('/seam/teacher/assignments/create', assignments));
  }
  // assignment update
  static updateAssignment(assignments: string): AxiosPromise<number> {
    return axios(post('/seam/teacher/assignments/update', assignments));
  }
  // assignment status
  static getStatus(assignmentId: number): AxiosPromise<AssignmentStatus[]> {
    return axios(get(`/seam/teacher/assignments/status/${assignmentId}`));
  }
  // at settings
  static getUserSettings(teacherId: number): AxiosPromise<UserSettings> {
    return axios(get(`/seam/teacher/settings/${teacherId}`));
  }
}

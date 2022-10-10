import axios, { AxiosPromise, AxiosRequestConfig, CancelToken } from 'axios';

import { AssignmentList } from '../components/student/StudentLanding.vue';
import { ResourceListAssignment } from '../components/teacher/mainPage/landingPage/AssignmentResourcelist.vue';
import { AssignmentAllResourcelist } from '../components/teacher/mainPage/assignmentsList/AssignmentsList.vue';
import { AssignmentStatus } from '../components/teacher/mainPage/submissionStatus/StatusResourcelist.vue';
import { UserSettings } from '../components/teacher/settingsPage/SettingsPage.vue';
import { CyclePeriod } from '@/AssignmentsType';

interface StudentAssignment {
  title: string;
  descriptionHTML: string;
  deadline: Date;
  isRepeat: boolean;
  cyclePeriod: CyclePeriod[];
  submitOnHoliday: boolean;
}

type EmptyObject = { [key: string]: never };
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

// error handler
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    switch (error.response?.status) {
      case 401:
        console.log('401エラー');
        return new Error('');
      case 403:
        return;
      default:
        return;
    }
  }
);

export class SeamApiStudent {
  static getStudentId(): AxiosPromise<string> {
    return axios(get('/seam/student/getid'));
  }
  static getAllAssignments(studentId: number): AxiosPromise<AssignmentList[]> {
    return axios(get(`/seam/student/assigned/${studentId}`));
  }
  static getAssignments(
    assignmentId: number,
    studentId: number
  ): AxiosPromise<StudentAssignment> {
    return axios(
      get(`/seam/student/assignments/${assignmentId}`, {
        studentId: studentId,
      })
    );
  }
}
export class SeamApiTeacher {
  // get teacherId
  static getTeacherId(): AxiosPromise<string> {
    return axios(get('/seam/teacher/getid'));
  }
  // user settings
  static getSubmissionMethods(teacherId: number): AxiosPromise<string[]> {
    return axios(get(`/seam/teacher/settings/submission-methods/${teacherId}`));
  }
  // at mainPage
  static getAssignments(
    teacherId: number
  ): AxiosPromise<ResourceListAssignment[]> {
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
  ): AxiosPromise<ResourceListAssignment | EmptyObject> {
    return axios(get(`/seam/teacher/assignments/get/${assignmentId}`));
  }
  // at mainPage delete
  static deleteAssignment(
    assignmentIds: number[]
  ): AxiosPromise<ResourceListAssignment[]> {
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
  static getUserSettings(
    teacherId: number
  ): AxiosPromise<UserSettings | EmptyObject> {
    return axios(get(`/seam/teacher/settings/${teacherId}`));
  }
}

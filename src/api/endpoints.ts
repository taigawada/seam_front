import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

const BASE_URL = 'https://2961-1-75-229-22.ngrok.io';
const get = (path: string, params?: unknown): AxiosRequestConfig => ({
  baseURL: BASE_URL,
  url: path,
  method: 'GET',
  params: params,
});
const post = (path: string): AxiosRequestConfig => ({
  baseURL: BASE_URL,
  url: path,
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  responseType: 'json',
});

export default class SeamApi {
  static getAssignments(teacherId: number): AxiosPromise<number> {
    return axios(get('/', { teacherId: teacherId }));
  }
  static updateAssignments(content_id: number) {
    return axios(post('/example'));
  }
}

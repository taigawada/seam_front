import Vue from 'vue';
import Router from 'vue-router';

import TeacherLanding from './components/teacher/TeacherLanding.vue';
import TeacherMainPage from './components/teacher/mainPage/MainPage.vue';
import AssignmentsList from './components/teacher/mainPage/assignmentsList/AssignmentsList.vue';
import AssignmentDetail from './components/teacher/mainPage/asignmentDetailSettings/AssignmentDetailSettingsIndex.vue';
import SettingsPage from './components/teacher/settingsPage/SettingsPage.vue';

import Student from './components/student/StudentLanding.vue';
import AssignmentDetailPage from './components/student/assignmentDetailPage/AssignmentDetailPage.vue';
import SubmissionStatus from './components/teacher/mainPage/submissionStatus/StatusIndex.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: TeacherLanding,
      props: (route) => ({
        ...route.params,
      }),
      children: [
        {
          path: '/',
          name: 'teacherLanding',
          component: TeacherMainPage,
        },
        {
          path: '/assignments',
          name: 'assignmentsList',
          component: AssignmentsList,
        },
        {
          path: '/assignments/new',
          name: 'newAssignmentDetailSettings',
          component: AssignmentDetail,
          props: true,
        },
        {
          path: '/assignments/:assignmentId',
          name: 'assignmentDetailSettings',
          component: AssignmentDetail,
        },
        {
          path: '/status/:assignmentId',
          name: 'submissionStatus',
          component: SubmissionStatus,
          props: true,
        },
        {
          path: '/settings',
          name: 'userSettings',
          component: SettingsPage,
        },
      ],
    },
    {
      path: '/stu',
      name: 'student',
      component: Student,
    },
    {
      path: '/student-preview',
      name: 'student-preview',
      component: AssignmentDetailPage,
    },
  ],
});

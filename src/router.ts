import Vue from 'vue';
import Router from 'vue-router';

import TeacherLanding from './components/teacher/TeacherLanding.vue';
import TeacherMainPageSkelton from './components/teacher/mainPage/MainPageSkelton.vue';
import TeacherMainPage from './components/teacher/mainPage/MainPage.vue';
import AssignmentDetailSettings from './components/teacher/mainPage/asignmentDetailSettings/AssignmentDetailSettings.vue';
import SettingsPage from './components/teacher/settingsPage/SettingsPage.vue';

import Student from './components/student/StudentLanding.vue';
import AssignmentDetailPage from './components/student/assignmentDetailPage/AssignmentDetailPage.vue';

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
          component: TeacherMainPageSkelton,
        },
        {
          path: '/home',
          component: TeacherMainPage,
        },
        {
          path: '/assignments/new',
          name: 'newAssignmentDetailSettings',
          component: AssignmentDetailSettings,
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

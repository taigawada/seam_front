import Vue from 'vue';
import Router from 'vue-router';

import Student from './components/student/StudentLanding.vue';
import Teacher from './components/teacher/TeacherLanding.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Teacher,
    },
    {
      path: '/stu',
      name: 'student',
      component: Student,
    },
  ],
});

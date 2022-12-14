import { rest } from 'msw';
import { assignmentsDB } from '@/mock/databaseMocks/assignments';
import { assignmentTeacherDB } from '@/mock/databaseMocks/assignment_teachers';
import { assignmentStudentsDB } from '@/mock/databaseMocks/assignment_students';
import { studentInfoDB } from '@/mock/databaseMocks/students_info';

import { userSettingsDB } from '@/mock/databaseMocks/user_settings';

export const handlers = [
  // shukujitsu.csv
  rest.get('/src/public/syukujitsu.csv', () => {
    console.log('csv取得');
  }),

  // student
  rest.get('/seam/student/assigned/:studentId', (req, res, ctx) => {
    return res(
      ctx.delay(1500),
      ctx.status(200),
      ctx.json(
        assignmentsDB.map((assignment) => {
          return {
            id: assignment.id,
            title: assignment.title,
            deadline: assignment.deadline,
          };
        })
      )
    );
  }),
  rest.get('/seam/student/assignments/:assignmentId', (req, res, ctx) => {
    const { assignmentId } = req.params;
    const studentId = req.url.searchParams.get('studentId');
    const assignment = assignmentsDB.find(
      (assignment) => assignment.id === parseInt(assignmentId as string)
    );
    const submit = assignmentStudentsDB.find((data) => {
      return data.studentId === parseInt(studentId!);
    });
    return res(
      ctx.delay(1500),
      ctx.status(200),
      ctx.json({
        title: assignment?.title,
        deadline: assignment?.deadline,
        submittedAt: submit?.submittedAt ? submit.submittedAt : null,
        descriptionHTML: assignment?.description,
        isRepeat: assignment?.isRepeat,
        cyclePeriod: assignment?.cyclePeriod,
        submitOnHoliday: assignment?.submitOnHoliday,
      })
    );
  }),

  //teacher
  rest.get('/seam/teacher/getid', (req, res, ctx) => {
    return res(ctx.delay(0), ctx.status(200), ctx.json(1));
  }),
  rest.get(
    '/seam/teacher/settings/submission-methods/:teacherId',
    (req, res, ctx) => {
      // eslint-disable-next-line no-unused-vars
      const { teacherId } = req.params;
      const settings = userSettingsDB.find(
        (settings) => settings.userId === parseInt(teacherId as string)
      );
      return res(
        ctx.delay(800),
        ctx.status(200),
        ctx.json(settings!.submissionMethods)
      );
    }
  ),
  rest.get('/seam/teacher/assignments/:teacherId', (req, res, ctx) => {
    const { teacherId } = req.params;
    const assignments = assignmentTeacherDB.filter(
      (table) => table.teacherId === parseInt(teacherId as string)
    );
    return res(
      ctx.delay(800),
      ctx.status(200),
      ctx.json(
        assignmentsDB.map((assignment) => {
          const index = assignments.findIndex(
            (intermediate) => intermediate.assignmentId === assignment.id
          );
          if (index !== -1) {
            return {
              id: assignment.id,
              title: assignment.title,
              deadline: assignment.deadline,
              status: assignment.status,
            };
          }
        })
      )
    );
  }),

  // search
  rest.get('/seam/teacher/search/assignments/:teacherId', (req, res, ctx) => {
    const { teacherId } = req.params;
    const assignments = assignmentTeacherDB.filter(
      (table) => table.teacherId === parseInt(teacherId as string)
    );
    return res(
      ctx.delay(800),
      ctx.status(200),
      ctx.json(
        assignmentsDB.map((assignment) => {
          const index = assignments.findIndex(
            (intermediate) => intermediate.assignmentId === assignment.id
          );
          if (index !== -1) {
            return {
              id: assignment.id,
              title: assignment.title,
              deadline: assignment.deadline,
              status: assignment.status,
            };
          }
        })
      )
    );
  }),
  rest.get('/seam/teacher/assignments/get/:assignmentId', (req, res, ctx) => {
    const { assignmentId } = req.params;
    return res(
      ctx.delay(1500),
      ctx.status(200),
      ctx.json(
        assignmentsDB.filter(
          (assignment) => assignment.id === parseInt(assignmentId as string)
        )[0]
      )
    );
  }),

  rest.get('/seam/teacher/assignments/delete/', (req, res, ctx) => {
    const assignmentIds = req.url.searchParams.getAll('assignmentId');
    return res(
      ctx.delay(1500),
      ctx.status(200),
      ctx.json(
        assignmentsDB.filter(
          (assignment) => assignmentIds.indexOf(String(assignment.id)) === -1
        )
      )
    );
  }),
  rest.post('/seam/teacher/assignments/create', (req, res, ctx) => {
    return res(ctx.delay(1500), ctx.status(200), ctx.json(1));
  }),

  rest.get(
    '/seam/teacher/assignments/status/:assignmentId',
    (req, res, ctx) => {
      const { assignmentId } = req.params;
      const assignment = assignmentsDB.find(
        (data) => data.id === parseInt(assignmentId as string)
      );
      const students = assignmentStudentsDB.filter((data) => {
        return data.assignmentId === parseInt(assignmentId as string);
      });
      const studentInfos = students.map((data) => {
        const student = studentInfoDB.find((info) => {
          return info.id === data.studentId && info.nendo === data.nendo;
        });
        return {
          id: data.id,
          status: assignment?.status,
          deadline: assignment?.deadline,
          studentId: student?.id,
          grade: student?.grade,
          room: student?.room,
          name: student?.name,
          syussekiNo: student?.syusseki_no,
          submittedAt: data.submittedAt,
        };
      });
      return res(ctx.delay(1500), ctx.status(200), ctx.json(studentInfos));
    }
  ),

  rest.get('/seam/teacher/settings/:teacherId', (req, res, ctx) => {
    const { teacherId } = req.params;
    return res(
      ctx.delay(500),
      ctx.status(200),
      ctx.json(
        userSettingsDB.find(
          (settings) => settings.userId === parseInt(teacherId as string)
        )
      )
    );
  }),
];

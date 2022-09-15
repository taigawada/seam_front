import { rest } from 'msw';
import { assignmentsDB } from '@/Assignments';

export const handlers = [
  // shukujitsu.csv
  rest.get('/src/assets/syukujitsu.csv', (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  // student
  rest.get('/seam/student/getall', (req, res, ctx) => {
    return res(
      ctx.delay(1500),
      ctx.status(200),
      ctx.json(
        assignmentsDB.map((assignment) => {
          return {
            id: assignment.id,
            title: assignment.title,
            deadline: assignment.deadline,
            author: assignment.author,
          };
        })
      )
    );
  }),
];

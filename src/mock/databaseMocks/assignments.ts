export const assignmentsDB = [
  {
    id: 1,
    createdAt: new Date(2022, 9, 11, 12, 8),
    updatedAt: new Date(2022, 9, 11, 13, 40),
    status: 'active',
    releaseDate: new Date(2023, 3, 11, 8, 20),
    assignedClasses: ['1-A'],
    title: 'サンプル課題1',
    description:
      '<p>説明文となります。説明文となります。説明文となります。説明文となります。説明文となります。説明文となります。</p>',
    deadline: new Date(2023, 3, 14, 8, 20),
    submissionMethod: 'その他の提出方法',
    isRepeat: false,
    submitOnHoliday: false,
    cyclePeriod: [],
  },
  {
    id: 2,
    createdAt: new Date(2022, 9, 11, 12, 8),
    updatedAt: new Date(2022, 9, 11, 13, 40),
    status: 'draft',
    releaseDate: new Date(2023, 3, 11, 8, 20),
    assignedClasses: ['1-A'],
    title: 'サンプル課題2',
    description:
      '<p>説明文となります。説明文となります。説明文となります。説明文となります。説明文となります。説明文となります。</p>',
    deadline: new Date(2022, 8, 14, 20, 20),
    submissionMethod: 'その他の提出方法',
    isRepeat: false,
    submitOnHoliday: false,
    cyclePeriod: [],
  },
];

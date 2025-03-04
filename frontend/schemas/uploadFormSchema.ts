import { z } from 'zod';

export const uploadFormSchema = z.object({
  year: z
    .number({ invalid_type_error: '年分必須是數字' })
    .min(0, '年分不能早於 0 年')
    .max(new Date().getFullYear() - 1911, '年分不能超過當前年份')
    .default(113),
  semester: z
    .enum(['firstSemester', 'secondSemester'], {
      required_error: '請選擇學期',
    })
    .default('firstSemester'),
  courseName: z.string().min(1, '請填寫課程名稱'),
  courseCode: z.string().min(1, '請填寫課程代碼'),
  courseInstructor: z.string().min(1, '請填寫授課教師'),
  examType: z
    .enum(['midtermExam', 'termExam', 'quizExam', 'other'], {
      required_error: '請選擇考試類型',
    })
    .default('midtermExam'),
  examRange: z.string().optional(), // Not required
  isAnonymous: z
    .enum(['anonymous', 'noAnonymous'], {
      required_error: '請選擇是否匿名',
    })
    .default('noAnonymous'),
});

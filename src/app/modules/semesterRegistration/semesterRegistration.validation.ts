import { z } from 'zod';
import { SemesterRegistrationStatus } from './semesterRegistration.constant';

const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string(),
    status: z.enum([...(SemesterRegistrationStatus as [string, ...string[]])]),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    maxCredit: z.number(),
    minCredit: z.number(),
  }),
});

const updateSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    status: z
      .enum([...(SemesterRegistrationStatus as [string, ...string[]])])
      .optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    maxCredit: z.number().optional(),
    minCredit: z.number().optional(),
  }),
});

export const SemesterRegistrationValidations = {
  createSemesterRegistrationValidationSchema,
  updateSemesterRegistrationValidationSchema,
};

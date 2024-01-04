import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const timeStringSchema = z.string().refine(
  (time) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; //00-09 10-19 20-23: 00-59
    return timeRegex.test(time);
  },
  {
    message: 'Invalid time format. Use HH:MM format for 24 hours format.',
  },
);

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      // academicSemester: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
      // startTime: z.string().refine(
      //   (time) => {
      //     const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; //00-09 10-19 20-23: 00-59
      //     return timeRegex.test(time);
      //   },
      //   {
      //     message: 'Invalid time format. Use HH:MM format for 24 hours format.',
      //   },
      // ), //HH:MM = 00-23: 00-59
      //   endTime: z.string().refine(
      //     (time) => {
      //       const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; //00-09 10-19 20-23: 00-59
      //       return timeRegex.test(time);
      //     },
      //     {
      //       message: 'Invalid time format. Use HH:MM format for 24 hours format.',
      //     },
      //   ), //HH:MM = 00-23: 00-59
    })
    .refine(
      (body) => {
        //startTime:  10: 30  => 1998-04-13T10:30
        //endTime:  12: 30  => 1998-04-13T12:30

        const start = new Date(`1998-04-13T${body.startTime}`);
        const end = new Date(`1998-04-13T${body.endTime}`);
        return start < end;
      },
      {
        message: 'Start time should be before End time.',
      },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
    })
    .refine(
      (body) => {
        const start = new Date(`1998-04-13T${body.startTime}`);
        const end = new Date(`1998-04-13T${body.endTime}`);
        return start < end;
      },
      {
        message: 'Start time should be before End time.',
      },
    ),
});

export const OfferedCourseValidation = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};

import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './OfferedCourse.interface';
import { OfferedCourse } from './OfferedCourse.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../Course/course.model';
import { Faculty } from '../Faculty/faculty.model';
import { hasScheduledConflict } from './offeredCourse.utils';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;

  //Check if the semester registration id es exists

  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester Registration does not exists',
    );
  }

  const academicSemester = isSemesterRegistrationExists.academicSemester;

  //Check if the academicFaculty id es exists
  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);

  if (!isAcademicFacultyExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Faculty does not exists',
    );
  }

  //Check if the academicDepartment id es exists
  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);

  if (!isAcademicDepartmentExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Department does not exists',
    );
  }

  //Check if the Course id es exists
  const isCourseExists = await Course.findById(course);

  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course does not exists');
  }

  //Check if the Faculty id es exists
  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty does not exists');
  }

  //check if the academic department is belong to the academic faculty

  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    academicFaculty,
    _id: academicDepartment,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This ${isAcademicDepartmentExists.name} does not belongs to the ${isFacultyExists.name}`,
    );
  }

  //Check if the same section is set for the different offered course
  const isSameSectionExists = await OfferedCourse.findOne({
    semesterRegistration,
    course,
    section,
  });

  if (isSameSectionExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This section is already set. You can not set it for different offeredcourse!!!',
    );
  }

  //Get the schedules of the faculties

  const assignedScheduled = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newScheduled = {
    days,
    startTime,
    endTime,
  };

  // assignedScheduled.forEach((schedule) => {
  //   const existingStartTime = schedule.startTime;
  //   const existingEndTime = schedule.endTime;
  //   const newStartTime = newScheduled.startTime;
  //   const newEndTime = newScheduled.endTime;

  //   if (newStartTime >= existingStartTime && newEndTime <= existingEndTime) {
  //     throw new AppError(
  //       httpStatus.CONFLICT,
  //       `This faculty does not available for this ${newStartTime}, and ${newEndTime}...Please assigned different schedule`,
  //     );
  //   }
  // });

  if (hasScheduledConflict(assignedScheduled, newScheduled)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty does not available for this start time, and this end time...Please assigned different schedule`,
    );
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

const getAllOfferedCoursesFromDB = async () => {
  const result = await OfferedCourse.find().populate('academicFaculty');
  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id).populate('academicFaculty');
  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'days' | 'startTime' | 'endTime' | 'faculty'>,
) => {
  const { faculty, days, startTime, endTime } = payload;

  const isOfferedourseExists = await OfferedCourse.findById(id);

  if (!isOfferedourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course does not exists');
  }

  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty does not exists');
  }

  const semesterRegistration = isOfferedourseExists.semesterRegistration;

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);
  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update this offered course because it is ${semesterRegistrationStatus}`,
    );
  }

  //Get the schedules of the faculties
  const assignedScheduled = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newScheduled = {
    days,
    startTime,
    endTime,
  };

  if (hasScheduledConflict(assignedScheduled, newScheduled)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty does not available for this start time, and this end time...Please assigned different schedule`,
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
};

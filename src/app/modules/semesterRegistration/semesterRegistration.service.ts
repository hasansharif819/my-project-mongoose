import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  //Check If there any registered semester that is already "UPCOMING" | "ONGOING"
  const isAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
    $or: [
      { status: RegistrationStatus.UPCOMING },
      { status: RegistrationStatus.ONGOING },
    ],
  });

  if (isAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already a ${isAnyUpcomingOrOngoingSemester.status} registered semester`,
    );
  }

  //Check this semester is exists in Academic Sremester
  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);

  if (!isAcademicSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Semester is not found');
  }

  //Check this semster is already exists
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });

  if (isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Semester Registration is already exists',
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  //Check this semster is already exists
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester Registration is not exists',
    );
  }

  //If the requested semester registration status is ENDED then we will not updating it anymore
  const currentSemesterStatus = isSemesterRegistrationExists?.status;
  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Semester Registration is already ${currentSemesterStatus}`,
    );
  }

  const requestedSemesterRegistration = payload?.status;

  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedSemesterRegistration === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Semester Registration cannot be ended before it is started',
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedSemesterRegistration === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not changed the status from ${requestedSemesterRegistration} To ${currentSemesterStatus}`,
    );
  }

  const result = await SemesterRegistration.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  );
  return result;
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
};

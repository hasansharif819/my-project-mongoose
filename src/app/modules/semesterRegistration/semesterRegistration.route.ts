import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';

const router = express.Router();

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
);

router.get(
  '/:id',
  SemesterRegistrationControllers.getSingleSemesterRegistation,
);

router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegistration,
);

router.get('/', SemesterRegistrationControllers.getAllSemesterRegistration);

export const SemesterRegistrationRoutes = router;

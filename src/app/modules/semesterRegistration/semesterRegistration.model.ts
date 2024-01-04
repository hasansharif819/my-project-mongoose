import mongoose, { Schema } from 'mongoose';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationStatus } from './semesterRegistration.constant';

const semesterRegistrationSchema = new mongoose.Schema<TSemesterRegistration>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: SemesterRegistrationStatus,
      default: 'UPCOMING',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    maxCredit: {
      type: Number,
      default: 3,
    },
    minCredit: {
      type: Number,
      default: 16,
    },
  },
  {
    timestamps: true,
  },
);

export const SemesterRegistration = mongoose.model<TSemesterRegistration>(
  'SemesterRegistration',
  semesterRegistrationSchema,
);

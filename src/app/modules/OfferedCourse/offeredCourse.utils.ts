import { TSchedules } from './OfferedCourse.interface';

export const hasScheduledConflict = (
  assignedScheduled: TSchedules[],
  newScheduled: TSchedules,
) => {
  for (const schedule of assignedScheduled) {
    const existingStartTime = new Date(`1998-04-13T${schedule.startTime}`);
    const existingEndTime = new Date(`1998-04-13T${schedule.endTime}`);
    const newStartTime = new Date(`1998-04-13T${newScheduled.startTime}`);
    const newEndTime = new Date(`1998-04-13T${newScheduled.endTime}`);

    if (newStartTime >= existingStartTime && newEndTime <= existingEndTime) {
      return true;
    }
  }
  return false;
};

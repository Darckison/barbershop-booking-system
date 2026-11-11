function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function checkOverlap(startA, endA, startB, endB) {
  return Math.max(startA, startB) < Math.min(endA, endB);
}

function generateDailySlots({
  dateStr,
  serviceDuration,
  availabilityConfig,
  existingAppointments,
}) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const dayOfWeek = targetDate.getDay();

  const isBlocked = availabilityConfig.blockedDates.some(
    (b) => b.date === dateStr
  );
  if (isBlocked) {
    return { isOperational: false, reason: 'Data bloqueada para atendimento', slots: [] };
  }

  const daySchedule = availabilityConfig.workingHours.find(
    (w) => w.dayOfWeek === dayOfWeek
  );

  if (!daySchedule || !daySchedule.isOpen) {
    return { isOperational: false, reason: 'Barbearia fechada neste dia', slots: [] };
  }

  const openMin = timeToMinutes(daySchedule.openTime);
  const closeMin = timeToMinutes(daySchedule.closeTime);
  const breakStartMin = timeToMinutes(daySchedule.breakStart);
  const breakEndMin = timeToMinutes(daySchedule.breakEnd);
  const interval = availabilityConfig.slotIntervalMinutes || 30;

  const activeAppts = existingAppointments.filter((a) => a.status !== 'cancelled');

  const slots = [];

  for (let current = openMin; current + serviceDuration <= closeMin; current += interval) {
    const slotEnd = current + serviceDuration;
    const timeLabel = minutesToTime(current);
    let isAvailable = true;

    if (checkOverlap(current, slotEnd, breakStartMin, breakEndMin)) {
      isAvailable = false;
    }

    if (isAvailable) {
      for (const appt of activeAppts) {
        const apptStart = timeToMinutes(appt.startTime);
        const apptEnd = timeToMinutes(appt.endTime);
        if (checkOverlap(current, slotEnd, apptStart, apptEnd)) {
          isAvailable = false;
          break;
        }
      }
    }

    slots.push({
      time: timeLabel,
      available: isAvailable,
    });
  }

  return { isOperational: true, slots };
}

module.exports = { timeToMinutes, minutesToTime, checkOverlap, generateDailySlots };
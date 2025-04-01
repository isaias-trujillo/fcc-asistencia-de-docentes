import Schedule from "@/modules/groups/domain/Schedule.ts";

const getStateBasedOnScheduleAndTime = ({schedule, date}: { schedule: Schedule, date: Date }) => {
    // check if your give time is between start time + tolerance
    const tolerance = 15; // in minutes
    const d = new Date(date.getTime() - 1000 * 60 * tolerance)
    const [startHours, startMinutes] = schedule.start.split(':').map(d => Math.max(parseInt(d ?? ''), 0))

    const currentHours = d.getHours()
    const currentMinutes = d.getMinutes()

    const isOnTime = currentHours < startHours || (currentHours === startHours && currentMinutes < startMinutes);
    return isOnTime ? 'asistencia' : 'tardanza';
}

export default getStateBasedOnScheduleAndTime
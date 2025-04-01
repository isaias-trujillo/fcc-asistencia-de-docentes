import Chron from "@/modules/chron/domain/Chron.ts";

const dateToChron = (date: Date): Chron => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const partOfDay = hours >= 12 ? 'PM' : 'AM';

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return {
        raw: date.toString(),
        original: date.toString(),
        time: {
            hours,
            minutes,
            seconds,
            partOfDay,
        },
        calendar: {
            day,
            month,
            year,
            weekday: date.toLocaleDateString('es', {weekday: 'long'})
        }
    };
}

export default dateToChron
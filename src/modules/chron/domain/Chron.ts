type Chron = {
    raw: string;
    original: string;
    time: Time
    calendar: Calendar
}

type Time = {
    hours: number
    minutes: number
    seconds: number
    partOfDay: string
}

type Calendar = {
    day: number
    month: number
    year: number
    weekday: string
}

export default Chron
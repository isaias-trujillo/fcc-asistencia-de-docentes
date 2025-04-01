type Args = {
    date: Date;
    period: 'today' | 'this week' | 'this month' | 'all';
    range?: undefined;
} | {
    date: Date;
    period: 'custom range';
    range: Return;
}

type Return = Partial<{
    from: Date;
    to: Date;
}>

export const periodToRange =(
    {date, period, range = {}}: Args
): Return => {
    if (period === 'today') {
        return {
            from: date,
            to: date,
        };
    }
    if (period === 'this week') {
        return {
            from: new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1),
            to: new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 7),
        };
    }
    if (period === 'this month') {
        return {
            from: new Date(date.getFullYear(), date.getMonth(), 1),
            to: new Date(date.getFullYear(), date.getMonth() + 1, 0),
        };
    }
    if (period === 'custom range') {
        return range
    }
    return {};
};

export default periodToRange;
export type Filters = ({
    period: 'today' | 'this week' | 'this month' | 'all'; // default today
    range?: undefined;
} | {
    period: 'custom range';
    range: Partial<{ from: Date; to: Date }>;
}) & {
    term?: string;
    studentId?: string;
    page?: number;
    perPage?: number;
}
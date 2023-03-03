export class DateUtils {
    static getToday(): Date {
        return new Date();
    }

    static getTodayISO(): string {
        return this.getToday().toISOString().substring(0, 10);
    }

    static getCurrentTimestamp(): number {
        return Date.now();
    }

    static getTimestampHoursOffset(timestamp: number, offsetHours: number): number {
        const date = new Date(timestamp);
        date.setHours(date.getHours() - offsetHours)
        return date.getTime();
    }

    static getTimestampMinutesOffset(timestamp: number, offsetHMinutes: number): number {
        const date = new Date(timestamp);
        date.setMinutes(date.getMinutes() - offsetHMinutes)
        return date.getTime();
    }

    static getFormInputDate(date: Date): string {
       const [year, month, day] = date.toISOString().substring(0, 10).split('-');
        return `${month}${day}${year}`;
    }
}

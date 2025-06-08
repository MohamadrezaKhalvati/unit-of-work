// src/core/utils/date-time.utils.ts
export class DateTimeUtils {
	static formatToISO(date: Date): string {
	  return date.toISOString();
	}
  
	static addDays(date: Date, days: number): Date {
	  const result = new Date(date);
	  result.setDate(result.getDate() + days);
	  return result;
	}
  }	
import * as moment from 'moment-timezone';

export const cstToUnixTimestamp = (date: string, hour: number = 0): number =>  {
    return moment(`${date} ${hour}:00`, 'YYYY-MM-DD HH:mm')
      .tz('America/Chicago')
      .unix();
  }
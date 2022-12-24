export interface TfcDelivery {
  id: number;
  name: string;
  comment: string;
  date_received: Date;
  booked_in_by_first_name: string;
  booked_in_by_last_name: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function parseTfcDeliveries(data: any): TfcDelivery[] {
  return data.results.map((d: any) => {
    /* eslint-enable @typescript-eslint/no-explicit-any */
    return {
      id: d.id,
      name: d.package_type.name,
      comment: d.opening_comment,
      date_received: new Date(d.date_opened),
      booked_in_by_first_name: d.opened_by.first_name,
      booked_in_by_last_name: d.opened_by.last_name,
    };
  });
}

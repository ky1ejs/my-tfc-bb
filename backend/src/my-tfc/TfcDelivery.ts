export interface TfcDelivery {
  id: number;
  name: string;
  comment: string;
  date_received: Date;
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
    };
  });
}

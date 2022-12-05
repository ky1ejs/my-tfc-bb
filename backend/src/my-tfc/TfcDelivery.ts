export interface TfcDelivery {
  id: number
  name: string
  comment: string,
  date_received: Date
}

export function parseTfcDeliveries(
  data: any,
): TfcDelivery[] {
  const deliveries: any[] = data.results;
  return deliveries.map((d) => {
    return {
      id: d.id,
      name: d.package_type.name,
      comment: d.opening_comment,
      date_received: new Date(d.date_opened)
    };
  });
}
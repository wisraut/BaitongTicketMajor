export type PriceTier = {
  name: string;
  price: number;
};


export type Event = {
  id: string;
  title: string;
  subtitle?: string;
  banner: string;
  dateRange: string;
  stageImage: string;
  venue: string;
  description: string;
  prices: PriceTier[];
};

export const EVENTS: Event[] = [

];   
export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Property {
  slug: string;
  /** Display name, e.g. "Cassia" */
  name: string;
  number: string;
  area: string;
  city: string;
  type: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  beds: string;
  parking: boolean;
  summary: string;
  description: string[];
  hero: Photo;
  gallery: Photo[];
  amenities: { title: string; text: string }[];
  distances: { value: string; label: string }[];
  airbnbUrl: string;
  mapsUrl?: string;
  address?: string;
  /** True while the photos are still placeholders. */
  draft?: boolean;
}

const img = (src: string, alt: string, width: number, height: number): Photo => ({
  src: `/images/${src}`,
  alt,
  width,
  height,
});

const photos = {
  living: img('livingroom.webp', 'Living room with a pink sofa and a textured feature wall', 639, 654),
  bedroom: img('bedroom.webp', 'A corner of the apartment', 720, 499),
  tv: img('tvunit.webp', 'TV unit in the living room', 720, 507),
  detail: img('interiordetail.webp', 'Interior detail', 731, 499),
  bedroom2: img('bedroom2.webp', 'Bedroom with a double bed', 720, 507),
  dining: img('dining.webp', 'Dining area', 720, 812),
  kitchen: img('kitchen.webp', 'Kitchen with cookware', 720, 1280),
  kitchen2: img('kitchen2.webp', 'Kitchen detail', 523, 405),
};

const coreAmenities = [
  { title: 'High-speed WiFi', text: 'Fast, reliable and free. Good enough for video calls or streaming.' },
  { title: 'Full kitchen', text: 'Well-equipped for cooking your own meals, with a dedicated dining area.' },
  { title: 'Dedicated workspace', text: 'A proper desk and chair, not just a corner of the bed.' },
  { title: 'Free car parking', text: 'Convenient parking in the basement, at no extra cost.' },
  { title: 'Smart TV', text: 'Stream your own shows after a day out.' },
  { title: 'Comfortable living area', text: 'A proper living room to relax in, not just a bed to sleep in.' },
  { title: 'Cosy, quiet bedroom', text: 'A calm space to unwind after work or a day of exploring.' },
  { title: 'Direct WhatsApp support', text: 'A real person, not a chatbot, for anything you need.' },
];

export const properties: Property[] = [
  {
    slug: 'cassia',
    name: 'Cassia',
    number: '01',
    area: 'BTM Layout 1st Stage',
    city: 'Bengaluru',
    type: '1 BHK apartment',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    beds: '1 double + sofa',
    parking: true,
    summary:
      'A comfortable one-bedroom home for small families, business travellers and everyone in between.',
    description: [
      "Marvelous Living sits in BTM Layout, one of Bengaluru's best-connected neighbourhoods: close to metro and bus links, everyday cafés, and the malls and restaurants of Koramangala.",
      'The apartment has a comfortable living room, a well-equipped kitchen, a dedicated dining area, and a cosy bedroom with a clean, functional bathroom. The whole space is yours for the length of your stay.',
    ],
    hero: photos.living,
    gallery: [photos.living, photos.bedroom2, photos.dining, photos.kitchen, photos.tv, photos.detail, photos.kitchen2, photos.bedroom],
    amenities: coreAmenities,
    distances: [
      { value: '450 m', label: 'Kuvempunagara Bus Terminal' },
      { value: '800 m', label: 'Silk Board Metro Station' },
      { value: '~10 min', label: 'Drive to Vega City Mall and Nexus Mall' },
      { value: 'Nearby', label: 'Cafés, restaurants and Koramangala nightlife' },
    ],
    airbnbUrl: 'https://www.airbnb.co.in/h/marvelousliving',
    mapsUrl: 'https://maps.app.goo.gl/ko3RnA2fruG1Bn977',
    address: 'Jaya Bheema Nagar, BTM 1st Stage, Bengaluru',
  },
  {
    slug: 'aurelia',
    name: 'Aurelia',
    number: '02',
    area: 'BTM Layout 2nd Stage',
    city: 'Bengaluru',
    type: '1 BHK apartment',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    beds: 'Queen + sofa',
    parking: false,
    summary:
      'A one-bedroom home a short walk from BTM Metro.',
    description: [
      'Aurelia is in BTM Layout 2nd Stage, about 400 m from BTM Metro, with cafés and restaurants nearby and Vega City Mall a few minutes away. It suits business travellers, visiting academics and families in town for treatment at Jayadeva Hospital.',
      'The apartment sleeps two, with a queen bed in the bedroom, a sofa in the living room, a full kitchen and one bathroom. The whole space is yours for the length of your stay. Parking is on the street only; there is no parking inside the property.',
    ],
    // TODO: replace with Aurelia's own photos when they arrive.
    hero: photos.bedroom2,
    gallery: [photos.bedroom2, photos.dining, photos.kitchen2],
    amenities: coreAmenities.map((a) =>
      a.title === 'Free car parking'
        ? { title: 'On-street parking', text: 'Parking is on the street outside. There is no parking inside the property.' }
        : a,
    ),
    distances: [
      { value: '~400 m', label: 'BTM Metro Station' },
      { value: '5 min', label: 'Jayadeva Hospital' },
      { value: '~7 min', label: 'Vega City Mall' },
      { value: '~10 min', label: 'IIM Bangalore' },
      { value: 'Nearby', label: 'Cafés and restaurants' },
    ],
    airbnbUrl: 'https://www.airbnb.co.in/h/marvelousliving',
    address: '7th Cross, 8th Main, BTM 2nd Stage, Bengaluru',
    /** Photos are still placeholders. */
    draft: true,
  },
];

export const getProperty = (slug: string) => properties.find((p) => p.slug === slug);

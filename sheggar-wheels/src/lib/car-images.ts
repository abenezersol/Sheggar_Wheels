import type { Car } from '@/types';

const LOCAL_CAR_IMAGES: Array<{ match: RegExp; src: string }> = [
  { match: /vitz/i, src: '/Image/Cars/Vitz.png' },
  { match: /dzire/i, src: '/Image/Cars/Suzuki_dzire.png' },
  { match: /tucson/i, src: '/Image/Cars/Hyundai_tucson.png' },
  { match: /corolla|corola/i, src: '/Image/Cars/toyota_corola.png' },
  { match: /pajero/i, src: '/Image/Cars/Mitsubishi_pajero.png' },
  { match: /rio/i, src: '/Image/Cars/Kia_reo.png' },
  { match: /land\s*cruiser|land_cruser/i, src: '/Image/Cars/Land_cruser.png' },
  { match: /fit/i, src: '/Image/Cars/Honda_fit.png' },
  { match: /attrage/i, src: '/Image/Cars/Mitsubishi_attrage.png' },
];

const FALLBACK_IMAGE = '/Image/Cars/toyota_corola.png';

/** Always resolve car photos to files shipped in /public; never load remote car images. */
export function getLocalCarImage(car: Pick<Car, 'make' | 'model' | 'photos'>): string {
  const photo = car.photos?.[0];

  if (photo?.startsWith('/Image/Cars/')) {
    return photo;
  }

  const carName = `${car.make} ${car.model}`;
  return LOCAL_CAR_IMAGES.find(({ match }) => match.test(carName))?.src ?? FALLBACK_IMAGE;
}

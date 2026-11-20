export interface AddressFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    label: string;
    name?: string;
    postcode?: string;
    city?: string;
    citycode?: string;
    score?: number;
  };
}

export interface AddressCollection {
  type: 'FeatureCollection';
  features: AddressFeature[];
}
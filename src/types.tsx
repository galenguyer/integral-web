export interface IJob {
  id: string;
  synopsis: string;
  location: string | undefined;
  callerName: string | undefined;
  callerPhone: string | undefined;
  createdAt: number;
  createdBy: string;
  closedAt: number | undefined;
  closedBy: string | undefined;
  comments: IComment[];
  assignments: IAssignment[];
}

export interface IComment {
  id: string;
  jobId: string;
  comment: string;
  createdAt: number;
  createdBy: string;
}

export interface IResource {
  id: string;
  displayName: string;
  comment: string | undefined;
  inService: boolean;
  currentAssignment: IAssignment;
  location: IGeocodeResponse | undefined
}

export interface IGeocodeResponse {
  lat: string;
  lon: string;
  distance: number,
  address: IRadarAddress
}

export interface IRadarAddress {
  addressLabel: string | undefined;
  city: string | undefined,
  country: string | undefined,
  countryCode: string | undefined,
  county: string | undefined,
  formattedAddress: string | undefined,
  latitude: number | undefined,
  layer: string | undefined,
  longitude: number | undefined,
  number: string | undefined,
  postalCode: string | undefined,
  state: string | undefined,
  stateCode: string | undefined,
  street: string | undefined,
}

export interface IAssignment {
  id: string;
  resourceId: string;
  jobId: string;
  assignedAt: number;
  assignedBy: string;
  removedAt: number | undefined;
  removedBy: string | undefined;
}

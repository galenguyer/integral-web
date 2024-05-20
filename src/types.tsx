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

import { Client, Project, TimeEntry } from '@prisma/client/edge';

export type CacheStrategy =
  | {
      ttl: number;
      swr: number;
    }
  | {
      ttl: number;
    }
  | {
      swr: number;
    };

export type AccelerateInfo = {
  cacheStatus: 'ttl' | 'swr' | 'miss' | 'none';
  lastModified: Date;
  region: string;
  requestId: string;
  signature: string;
};

//Used in the server
export type Data<T> = Omit<T, 'updatedAt' | 'createdAt' | 'userId'>;
export type TimeEntryData = Data<TimeEntry>;
export type ClientData = Data<Client>;
export type ProjectData = Data<Project>;

//Used in the client
export type TimeEntryFormData = Omit<TimeEntryData, 'id'>;

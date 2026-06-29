import { HumanitarianProvider, NormalizedSearchResult, SubmissionPackage } from '@georesponde/shared/src/types.js';

export interface BaseAdapter {
  provider: HumanitarianProvider;
  search(query: string, domain?: string): Promise<NormalizedSearchResult[]>;
  submit(pkg: SubmissionPackage): Promise<boolean>;
}

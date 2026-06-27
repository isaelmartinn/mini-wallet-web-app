export interface LocalStorageService {
  get<T>(key: string): null | T;
  remove(key: string): void;
  set<T>(key: string, value: T): void;
}

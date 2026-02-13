export interface GeneratorContext {
  dryRun: boolean;
  log: (message: string) => void;
}
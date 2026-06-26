export type ActionResult<T = undefined> = {
  success: boolean;
  error?: string;
  data?: T;
};

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected error occurred";
}

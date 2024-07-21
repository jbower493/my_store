type RunQueryReturn<P> =
    | {
          result: P;
          error: null;
      }
    | {
          result: null;
          error: {
              details: unknown;
          };
      };

export async function runQuery<T = any>(
    queryFn: () => Promise<T>
): Promise<RunQueryReturn<T>> {
    try {
        const res = await queryFn();

        return {
            result: res,
            error: null,
        };
    } catch (e) {
        return {
            result: null,
            error: {
                details: e,
            },
        };
    }
}

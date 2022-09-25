const fetchJson = async <Response>(
  path: string,
  parse: (obj: object) => Response,
  method = "GET",
  body?: object
) => {
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return (await res.json()) as Response;
};

export default fetchJson;

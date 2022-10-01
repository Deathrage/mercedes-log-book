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

  const responseText: string = await res.text();

  if (res.status !== 200) throw new Error(responseText);

  const object = responseText ? JSON.parse(responseText) : null;
  return parse(object);
};

export default fetchJson;

import { toApiEndpoint } from "../helpers/api";

const includeBody = (req: RequestInit, body: object | null | undefined) => {
  if (!body) return req;

  req.body = JSON.stringify(body);
  req.headers = {
    ...req.headers,
    "Content-Type": "application/json",
  };

  return req;
};

export const fetchApiString = async <Response extends string | null>(
  path: string,
  method: string,
  body?: object | null
): Promise<Response> => {
  const res = await fetch(toApiEndpoint(path), includeBody({ method }, body));

  const text = (await res.text()) || null;

  if (res.status !== 200)
    throw new Error(`${res.status} - ${method} ${path}: ${text}`);

  return text as Response;
};

export const fetchApiJson = async <Response>(
  path: string,
  parse: (obj: object) => Response,
  method: string,
  body?: object | null
) => {
  const responseText = await fetchApiString(path, method, body);
  const object = responseText ? JSON.parse(responseText) : null;
  return parse(object);
};

export const fetchApiVoid = async (
  path: string,
  method: string,
  body?: object | null
) => {
  const res = await fetch(
    toApiEndpoint(path),
    includeBody(
      {
        method,
      },
      body
    )
  );

  if (res.status !== 200)
    throw new Error(
      `${res.status} - ${method} ${path}: ${(await res.text()) || "No body"}`
    );
};

type Result = { success: true; data: object } | { success: false };

export const tryParseJson = (val: string): Result => {
  try {
    const data = JSON.parse(val);
    return {
      success: true,
      data,
    };
  } catch (e) {
    return {
      success: false,
    };
  }
};

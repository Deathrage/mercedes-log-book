import { HttpRequest as AzureHttpRequest } from "@azure/functions";

class RequiredOrOptionalValue {
  get required() {
    if (!this.#value) throw new Error(this.#requiredError);
    return this.#value;
  }

  get optional() {
    return this.#value;
  }

  constructor(value: string | undefined, requiredError: string) {
    this.#value = value;
    this.#requiredError = requiredError;
  }

  #value: string | undefined;
  #requiredError: string;
}

class RequiredOrOptionalDict {
  get required() {
    return this.#required;
  }

  get optional() {
    return this.#optional;
  }

  constructor(
    dict: Record<string, string>,
    createRequiredError: (key: string) => string
  ) {
    this.#optional = dict;
    this.#required = new Proxy(dict, {
      get: (_, key) => {
        const stringKey = String(key);
        const value = dict[stringKey];
        if (!value) throw new Error(createRequiredError(stringKey));
        return value;
      },
    });
  }

  #required: Record<string, string>;
  #optional: Record<string, string>;
}

export default class HttpRequest {
  get userId() {
    return this.#userId;
  }

  get method() {
    const maybe = this.#original.method;
    if (!maybe) throw new Error("Unknown http method!");
    return maybe;
  }

  get query() {
    return this.#query;
  }

  get params() {
    return this.#params;
  }

  get url() {
    return this.#original.url;
  }

  get body() {
    return this.#original.body;
  }

  constructor(original: AzureHttpRequest) {
    this.#userId = new RequiredOrOptionalValue(
      original.user?.username,
      "UserId is required!"
    );

    this.#query = new RequiredOrOptionalDict(
      original.query,
      (key) => `Query string ${key} is required!`
    );
    this.#params = new RequiredOrOptionalDict(
      original.params,
      (key) => `Parameter ${key} is required!`
    );
    this.#original = original;
  }

  #userId: RequiredOrOptionalValue;
  #query: RequiredOrOptionalDict;
  #params: RequiredOrOptionalDict;
  #original: AzureHttpRequest;
}

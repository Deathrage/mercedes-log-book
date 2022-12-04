import { HttpResponseFull, HttpResponseSimple } from "@azure/functions";

type HttpResponse = HttpResponseSimple | HttpResponseFull;

export default HttpResponse;

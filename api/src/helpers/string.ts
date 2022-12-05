export const extractNumber = (val: string) => val.replace(/\D+/gi, "");

export const extractNotNumbers = (val: string) => val.replace(/\d+/gi, "");

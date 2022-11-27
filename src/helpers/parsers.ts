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

import api from "./axios";

export const executeCode = async (
  language: string,
  code: string
) => {
  const response =
    await api.post(
      "/code/run",
      {
        language,
        code,
      }
    );

  return response.data;
};
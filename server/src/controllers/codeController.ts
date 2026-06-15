import axios from "axios";
import { Request, Response } from "express";

const languageMap: Record<
  string,
  number
> = {
  javascript: 63,
  typescript: 74,
  python: 71,
  java: 62,
  cpp: 54,
};

export const runCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { language, code } =
      req.body;

    const languageId =
      languageMap[language];

    if (!languageId) {
      res.status(400).json({
        message:
          "Unsupported language",
      });
      return;
    }

    const response =
      await axios.post(
        "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
        {
          source_code: code,
          language_id:
            languageId,
        }
      );

    const result =
      response.data;

    res.status(200).json({
      stdout:
        result.stdout || "",
      stderr:
        result.stderr || "",
      compileOutput:
        result.compile_output ||
        "",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Code execution failed",
    });
  }
};
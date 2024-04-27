import { SUPPORTED_FILE_EXTENSION } from "./FileUpload";

export const FILE_EXT_TO_MIME_TYPE: Record<SUPPORTED_FILE_EXTENSION, string> = {
  ".pdf": "application/pdf",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".txt": "text/plain",
};

export const TOO_MANY_FILES_ERROR_MESSAGE =
  "Oops! You can only upload one file at a time.";
export const INVALID_FILE_TYPE_ERROR_MESSAGE =
  "Oops! That file type is not supported.";

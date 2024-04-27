"use client";

import clsx from "clsx";
import { useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";

import {
  FILE_EXT_TO_MIME_TYPE,
  INVALID_FILE_TYPE_ERROR_MESSAGE,
  TOO_MANY_FILES_ERROR_MESSAGE,
} from "./constants";
import { getTextFromDocxString } from "@/lib/docx";

import FileUploadIcon from "./FileUploadIcon";
import { CircleCheck, ShieldAlert, X } from "lucide-react";

export type SUPPORTED_FILE_EXTENSION = ".pdf" | ".docx" | ".txt";

interface FileUploadProps {
  acceptedFileExtensions: NonEmptyArray<SUPPORTED_FILE_EXTENSION>;
  onFileChange: (text: string) => void;
}

export default ({ acceptedFileExtensions, onFileChange }: FileUploadProps) => {
  const [file, setFile] = useState<Maybe<File>>(null);

  const handleFileUpload: DropzoneOptions["onDrop"] = (
    acceptedFiles,
    fileRejections
  ) => {
    if (fileRejections.length) {
      clearFile();
      return;
    }

    setFile(acceptedFiles[0]);

    const reader = new FileReader();
    reader.onload = () => {
      const text = getTextFromDocxString(reader.result as string);
      onFileChange(text);
    };
    reader.readAsArrayBuffer(acceptedFiles[0]);
  };

  const clearFile = () => {
    if (!!file) {
      setFile(null);
      onFileChange("");
    }
  };

  const acceptedMimeTypes: Record<string, []> = {};

  for (const ext of acceptedFileExtensions) {
    acceptedMimeTypes[FILE_EXT_TO_MIME_TYPE[ext]] = [];
  }

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      maxFiles: 1,
      accept: acceptedMimeTypes,
      onDrop: handleFileUpload,
    });

  const error =
    (fileRejections.length > 0 && fileRejections[0].errors[0]) || null;

  let errorText: Maybe<string> = null;
  if (error?.code === "file-invalid-type") {
    errorText = INVALID_FILE_TYPE_ERROR_MESSAGE;
  } else if (error?.code === "too-many-files") {
    errorText = TOO_MANY_FILES_ERROR_MESSAGE;
  }

  return (
    <div className="flex flex-col w-[475px] mx-auto">
      <div
        {...getRootProps()}
        className={clsx(
          "w-[475px] h-[275px] flex flex-col justify-center items-center gap-4 border-[2px] border-dashed bg-white cursor-pointer",
          {
            "border-blue-500": isDragActive,
            "border-red-300": !!error,
          }
        )}
      >
        <FileUploadIcon />
        <div className="space-y-2 text-center">
          <p className="font-medium">Drag and drop your resume file here</p>
          <p className="text-xs text-[#777]">
            Supported File Formats: {acceptedFileExtensions.join(", ")}
          </p>
        </div>
        <input {...getInputProps()} id="file-input" name="file" type="file" />
        <label
          tabIndex={0}
          role="button"
          htmlFor="file-input"
          className="px-4 py-2 shadow border-[1px] border-black cursor-pointer hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 ease-in-out"
        >
          Browse Files
        </label>
      </div>
      {!!file && (
        <div
          data-testid="file-preview"
          className="flex justify-between items-center pl-4 pr-2 py-2 mt-4 text-[#777] bg-white border rounded shadow-sm"
        >
          <p className="flex gap-1 items-center text-sm truncate">
            <CircleCheck className="w-5 h-5 text-green-700" />
            {file.name}
          </p>
          <button
            data-testid="clear-file-button"
            onClick={() => clearFile()}
            className="hover:text-red-500"
          >
            <X />
          </button>
        </div>
      )}
      {!!errorText && (
        <div className="flex items-center gap-1 px-4 py-2 mt-4 text-sm font-medium text-red-500 bg-red-100 rounded shadow-sm">
          <ShieldAlert className="w-5 h-5" />
          <p data-testid="error-text">{errorText}</p>
        </div>
      )}
    </div>
  );
};

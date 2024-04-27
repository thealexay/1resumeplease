"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";

export default () => {
  const [resumeText, setResumeText] = useState("");

  const handleFileChange = (text: string) => {
    setResumeText(text);
  };

  return (
    <form className="flex flex-col gap-8 py-32">
      <FileUpload
        acceptedFileExtensions={[".pdf"]}
        onFileChange={handleFileChange}
      />
      <p className="w-[1000px] mx-auto text-[#777]">{resumeText}</p>
    </form>
  );
};

import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import FileUpload from "./FileUpload";
import { createValidDocxFile } from "@/lib/docx";
import {
  INVALID_FILE_TYPE_ERROR_MESSAGE,
  TOO_MANY_FILES_ERROR_MESSAGE,
} from "./constants";

describe("FileUpload", () => {
  it("renders", () => {
    render(
      <FileUpload acceptedFileExtensions={[".docx"]} onFileChange={jest.fn()} />
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows the file preview and invokes 'onFileChange' with the extracted when a valid .docx file is uploaded", async () => {
    const onFileChangeMock = jest.fn();

    render(
      <FileUpload
        acceptedFileExtensions={[".docx"]}
        onFileChange={onFileChangeMock}
      />
    );

    const fileInput = screen.getByLabelText("Browse Files") as HTMLInputElement;
    const docxFileContents = await createValidDocxFile();

    await waitFor(() =>
      fireEvent.change(fileInput, {
        target: {
          files: [
            new File([docxFileContents], "hello.docx", {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }),
          ],
        },
      })
    );

    await waitFor(() => {
      const filePreviewElement = screen.getByTestId("file-preview");

      expect(filePreviewElement).toHaveTextContent("hello.docx");
      expect(onFileChangeMock).toHaveBeenCalledWith("Hello, World!");
    });
  });

  it("clears the file preview and invokes 'onFileChange' with an empty string when the file is cleared", async () => {
    const onFileChangeMock = jest.fn();

    render(
      <FileUpload
        acceptedFileExtensions={[".docx"]}
        onFileChange={onFileChangeMock}
      />
    );

    const fileInput = screen.getByLabelText("Browse Files") as HTMLInputElement;
    const docxFileContents = await createValidDocxFile();

    await waitFor(() =>
      fireEvent.change(fileInput, {
        target: {
          files: [
            new File([docxFileContents], "hello.docx", {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }),
          ],
        },
      })
    );

    expect(screen.getByTestId("file-preview")).toBeInTheDocument();

    const clearButton = screen.getByTestId("clear-file-button");

    await waitFor(() => fireEvent.click(clearButton));

    expect(screen.queryByTestId("file-preview")).not.toBeInTheDocument();
    expect(onFileChangeMock).toHaveBeenCalledWith("");
  });

  it("shows an error message when an unsupported file is uploaded", async () => {
    const onFileChangeMock = jest.fn();

    render(
      <FileUpload
        acceptedFileExtensions={[".docx"]}
        onFileChange={onFileChangeMock}
      />
    );

    const fileInput = screen.getByLabelText("Browse Files") as HTMLInputElement;

    await waitFor(() =>
      fireEvent.change(fileInput, {
        target: {
          files: [
            new File(["Hello, World!"], "hello.txt", { type: "text/plain" }),
          ],
        },
      })
    );

    expect(screen.queryByTestId("file-preview")).not.toBeInTheDocument();
    expect(
      screen.getByText(INVALID_FILE_TYPE_ERROR_MESSAGE)
    ).toBeInTheDocument();
    expect(onFileChangeMock).not.toHaveBeenCalled();
  });

  it("shows an error message when multiple files are uploaded", async () => {
    const onFileChangeMock = jest.fn();

    render(
      <FileUpload
        acceptedFileExtensions={[".txt"]}
        onFileChange={onFileChangeMock}
      />
    );

    const fileInput = screen.getByLabelText("Browse Files") as HTMLInputElement;

    await waitFor(() =>
      fireEvent.change(fileInput, {
        target: {
          files: [
            new File(["Hello, World!"], "hello1.txt", { type: "text/plain" }),
            new File(["Hello, World! Again!"], "hello2.txt", {
              type: "text/plain",
            }),
          ],
        },
      })
    );

    expect(screen.queryByTestId("file-preview")).not.toBeInTheDocument();
    expect(screen.getByText(TOO_MANY_FILES_ERROR_MESSAGE)).toBeInTheDocument();
    expect(onFileChangeMock).not.toHaveBeenCalled();
  });
});

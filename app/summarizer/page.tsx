"use client";
import { useState, useRef, type FormEvent, useCallback, useEffect } from "react";
import { useChat, useCompletion } from "ai/react";
import Emoji from "@/components/Emoji";
import { Footer } from "@/components/Footer";
import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { 
  ClipIcon, 
  CloudUploadIcon, 
  TextBodyIcon, 
  LinkIcon
} from "@/components/Icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "flowbite-react";
import { useDropzone } from "react-dropzone";
import { Document } from "@langchain/core/documents";

const SummarizerPage = () => {
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);

  const [inputType, setInputType] = useState("text");
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileList | []>([]);
  const [summarizedText, setSummarizedText] = useState("");
  const [inputTextCorpus, setInputTextCorpus] = useState("");
  const [inputUrl, setInputUrl] = useState("");

  // const [apiEndpoint, setApiEndpoint] = useState("/api/chat/summarizer"); //useState("/api/completion/fireworksai");

  // const [sourcesForMessages, setSourcesForMessages] = useState<
  //   Record<string, any>
  // >({});

  // const inputSectionRef = useRef(null);

  // const handleApiEndpointChange = (event: { target: { value: any } }) => {
  //   setApiEndpoint("/api/completion/" + event.target.value);
  // };

  // const {
  //   messages,
  //   input,
  //   setInput,
  //   handleInputChange,
  //   handleSubmit,
  //   isLoading,
  //   stop,
  // } = useChat({
  //   api: apiEndpoint,
  //   onResponse(response) {
  //     const sourcesHeader = response.headers.get("x-sources");
  //     const sources = sourcesHeader ? JSON.parse(atob(sourcesHeader)) : [];
  //     const messageIndexHeader = response.headers.get("x-message-index");

  //     if (sources.length && messageIndexHeader !== null) {
  //       setSourcesForMessages({
  //         ...sourcesForMessages,
  //         [messageIndexHeader]: sources,
  //       });
  //     }
  //   },
  //   onError: (e) => {
  //     toast(e.message, {
  //       theme: "dark",
  //     });
  //   },
  // });

  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    setUploadedFiles(acceptedFiles);
    setSelectedPDF(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (summarizedText?.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [summarizedText]);

  const worker = useRef<Worker | null>(null);

  // We use the `useEffect` hook to set up the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(
        new URL(
          "@/app/api/summarizer/pdf_summary/worker.ts",
          import.meta.url
        ),
        {
          type: "module",
        }
      );
      setLoading(false);
    }
  }, []);

  //process raw text
  const summarizeRawText = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // pass input to API that handles text summarization
    const response = await fetch("/api/summarizer/plain_text_summary", {
      method: "POST",
      body: JSON.stringify({
        text: inputTextCorpus,
      }),
    });

    const response_json = await response.json();

    if (response.status === 200) {
      // set summarized text state
      // console.log(response_json.text);
      setSummarizedText(response_json.text)

      // toast(
      //   `Text summarized successfully!`,
      //   {
      //     theme: "dark",
      //   }
      // );
      setLoading(false);
    } else {
      if (response_json.error) {
        // console.log(response_json.error)
        toast(
          `Unable to summarise text: ${response_json.error}`,
          {
            theme: "dark",
          }
        );
      }
      setLoading(false);
    }
  };

  //extract and process text from a url input
  const summarizeWebPage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(inputUrl);
    setLoading(true);

    // API call to summarize web page content of provided URL
    const response = await fetch("/api/summarizer/webpage_summary", {
      method: "POST",
      body: JSON.stringify({
        text: inputUrl,
      }),
    });

    const json_resp = await response.json();

    if (response.status === 200) {
      // console.log("Success!");

      // set input text content state
      // console.log(json_resp.input_text);
      setInputTextCorpus(json_resp.input_text);

      // set summarized text state
      // console.log(json_resp.output_text);
      setSummarizedText(json_resp.output_text);

      // toast(`Web page summarized successfully!`, {
      //   theme: "dark",
      // });

      setLoading(false);
    } else {
      if (json_resp.error) {
        console.log(json_resp.error);
        // toast(`Unable to summarize web page content : ${json_resp.error}`, {
        //   theme: "dark",
        // });
      }
      setLoading(false);
    }
  };
  
  const summarizePDF = async (e: FormEvent<HTMLFormElement>) => {
    // e.preventDefault();

    // // API call to PDF file summarizer
    // setLoading(true);

    // // file blob
    // const fileBlob = new Blob([JSON.stringify(selectedPDF)], {
    //   type: "text/plain; charset=utf8",
    // });

    // // API call to summarize web page content of provided URL
    // const response = await fetch("/api/summarizer/pdf_summary", {
    //   method: "POST",
    //   body: fileBlob, //formData,
    //   // body: JSON.stringify({
    //   //   pdf: selectedPDF, //formData, pdfFile,
    //   // }),
    // });

    // const json_resp = await response.json();

    // if (response.status === 200) {
    //   // console.log("Success!");

    //   // set input text content state
    //   // console.log(json_resp.input_text);
    //   // setInputTextCorpus(json_resp.input_text);

    //   // set summarized text state
    //   // console.log(json_resp.output_text);
    //   // setSummarizedText(json_resp.output_text);

    //   // toast(`PDF summarized successfully!`, {
    //   //   theme: "dark",
    //   // });

    //   setLoading(false);
    // } else {
    //   if (json_resp.error) {
    //     console.log(json_resp.error);
    //     // toast(`Unable to summarize PDF content : ${json_resp.error}`, {
    //     //   theme: "dark",
    //     // });
    //   }
    //   setLoading(false);
    // }

    e.preventDefault();
   
    if (selectedPDF === null) {
      toast(`You must select a file to summarize.`, {
        theme: "dark",
      });
      return;
    }

    setLoading(true);
    worker.current?.postMessage({ pdf: selectedPDF });
    const onMessageReceived = (e: any) => {
      switch (e.data.type) {
        case "log":
          console.log(e.data);
          break;
        case "error":
          worker.current?.removeEventListener("message", onMessageReceived);
          setLoading(false);
          console.log(e.data.error);
          toast(`There was an issue summarizing your PDF: ${e.data.error}`, {
            theme: "dark",
          });
          break;
        case "input_text":
          // set input text content state
          setInputTextCorpus(e.data.input_text);
          // console.log(e.data.input_text);
          break;
        case "output_text":
          // set summarized text state
          setSummarizedText(e.data.output_text);
          // console.log(e.data.output_text);
          break;
        case "complete":
          worker.current?.removeEventListener("message", onMessageReceived);

          setLoading(false);

          // toast(`Summarization of PDF successful!`, {
          //   theme: "dark",
          // });
          break;
      }
    };
    worker.current?.addEventListener("message", onMessageReceived);
  };

  // input section form specifications
  const summarizerCtrlButtons = (
    <div className="flex flex-row">
      {/*className="flex flex-row"*/}
      {/* <div className="flex mt-2 mr-auto">
        <select
          onChange={handleApiEndpointChange}
          className="inline-flex items-center py-1.5 px-2 font-medium text-center text-gray-200 bg-kaito-brand-ash-green rounded-md hover:bg-kaito-brand-ash-green mr-2 "
          id="llm-selector"
          required
        >
          <option value="">--Select LLM--</option>
          <option value="openai">GPT-3.5</option>
          <option value="fireworksai">Llama-2-Fwks</option>
          <option value="cohere">Co:here</option>
          <option value="huggingface">OpenAssistant-HF</option>
        </select>
      </div> */}

      <div className="flex mt-2 ml-auto space-x-3">
        {/* <div>
          <button
            className=" bg-kaito-brand-ash-green hover:bg-kaito-brand-ash-green items-center font-medium text-gray-200 rounded-full px-4 py-4"
            type="button"
            // onClick={stop}
          >
            <StopIcon />
          </button>
        </div> */}

        <div>
          <button
            className="items-center py-4 px-4 font-medium text-center text-gray-200 bg-kaito-brand-ash-green rounded-full hover:bg-kaito-brand-ash-green"
            type="submit"
          >
            <div
              role="status"
              className={`${loading ? "" : "hidden"} flex justify-center`}
            >
              {/* Send icon  */}
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-white animate-spin dark:text-white fill-kaito-brand-ash-green"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>

            {/* Loading wheel icon*/}
            <span className={`${loading ? "hidden" : ""}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-send-fill "
                viewBox="0 0 16 16"
              >
                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  // sumaary page home button
  const homeButton = (
    <div className="flex mt-2 space-x-3">
      <button
        className="items-center py-4 px-4 font-medium text-center text-gray-200 bg-kaito-brand-ash-green rounded-full hover:bg-kaito-brand-ash-green"
        type="button"
        onClick={() => {
          // setInputTextCorpus("");
          setSummarizedText("");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-house-fill"
          viewBox="0 0 16 16"
        >
          <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
          <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z" />
        </svg>
      </button>
    </div>
  );

  // raw text input form
  const textInputForm = (
    <form className="w-full flex flex-col" onSubmit={summarizeRawText}>
      <div className="w-full mb-4 border border-kaito-brand-ash-green rounded-lg bg-gray-50">
        <div className="px-2 py-2 bg-white rounded-t-lg ">
          <textarea
            id="textInput"
            rows={13}
            className="w-full px-0 text-sm text-black bg-white border-0  focus:ring-0 focus:ring-inset focus:ring-kaito-brand-ash-green"
            value={inputTextCorpus}
            onChange={(e) => setInputTextCorpus(e.target.value)}
            placeholder="Paste in the text you want to summarize..."
            required
          ></textarea>
        </div>

        <div className=" px-3 py-2 border-t ">
          {summarizerCtrlButtons}
        </div>
      </div>
    </form>
  );

  // text file input form
  const fileInputForm = (
    <form
      id="pdfUploadForm"
      onSubmit={summarizePDF}
      className="flex flex-col w-full mb-4 border border-kaito-brand-ash-green rounded-lg bg-gray-50"
    >
      <label
        {...getRootProps({
          htmlFor: "dropzone-file",
          className:
            "grow items-center justify-center  cursor-pointer bg-white border-x-0 border-t-0 border-b border-gray-200 rounded-t-lg  hover:bg-gray-50",
        })}
      >
        <div className="flex flex-col items-center justify-center pt-24 pb-28">
          <CloudUploadIcon />
          <div className="mb-2 text-sm text-gray-500 ">
            <span className="font-semibold">
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Click to upload or drag and drop</p>
              )}
            </span>
          </div>
          {selectedPDF === null ? (
            <p className="text-xs text-gray-500 ">PDF files</p>
          ) : (
            <p>{selectedPDF.name} file attached</p>
          )}
        </div>
        <input
          {...getInputProps({
            id: "dropzone-file",
            // type: "file",
            // accept: "pdf",
            // className: "text-black hidden ",
            // onChange: (e) =>
            //   e.target.files ? setSelectedPDF(e.target.files[0]) : null,
          })}
        ></input>
      </label>

      <div className="px-3 py-2 ">{summarizerCtrlButtons}</div>
    </form>
  );

  const urlInputBox = (
    <>
      <input
        type="url"
        id="urlInput"
        className="bg-white hover:bg-gray-50 text-kaito-brand-ash-green text-sm rounded-t-lg w-full border-x-0 border-t-0 border-b "
        placeholder="Type in the URL (http:// address) of webpage you want to summarize."
        value={inputUrl}
        onChange={(e) => setInputUrl(e.target.value)}
        required
      />
    </>
  );

  const urlInputForm = (
    <form className="w-full flex flex-col" onSubmit={summarizeWebPage}>
      <div className="w-full mb-4 border border-kaito-brand-ash-green rounded-lg bg-gray-50">
        <div className=" bg-white rounded-t-lg">
          {urlInputBox}

          <textarea
            id="pg_content_disp"
            rows={12}
            className="w-full mb-4 text-sm text-black bg-white border-0 focus:ring-0 focus:ring-inset  focus:ring-kaito-brand-ash-green"
            value={inputTextCorpus}
            // onChange={(e) => setInputTextCorpus(e.target.value)}
            placeholder="  Preview of webpage content appears here ..."
            disabled={true}
          ></textarea>
        </div>

        <div className="px-3 py-2 border-t ">{summarizerCtrlButtons}</div>
      </div>
    </form>
  );

  const SideNavBar = (
    <>
      <div className="flex grow-0 gap-2 ml-2.5 border-r border-slate-300 h-screen">
        <ul>
          <li className="p-3">
            <Tooltip content="Upload Text" className="inline-flex">
              <button
                type="button"
                className="inline-flex bg-kaito-brand-ash-green hover:bg-kaito-brand-ash-green items-center font-medium text-gray-200 rounded-full px-4 py-4 "
                onClick={() => {
                  setInputType("text");
                }}
              >
                <TextBodyIcon />
                <span className="sr-only">Paste text</span>
              </button>
            </Tooltip>
          </li>

          <li className="p-3">
            <Tooltip content="Upload PDF" className="inline-flex">
              <button
                type="button"
                className="inline-flex bg-kaito-brand-ash-green hover:bg-kaito-brand-ash-green items-center font-medium text-gray-200 rounded-full px-4 py-4 "
                onClick={() => {
                  setInputType("file");
                }}
              >
                <ClipIcon />
                <span className="sr-only">Attach file</span>
              </button>
            </Tooltip>
          </li>

          <li className="p-3">
            <Tooltip content="Enter Webpage Address" className="inline-flex">
              <button
                type="button"
                className="inline-flex bg-kaito-brand-ash-green hover:bg-kaito-brand-ash-green items-center font-medium text-gray-200 rounded-full px-4 py-4 "
                onClick={() => {
                  setInputType("url");
                }}
              >
                <LinkIcon />
                <span className="sr-only">
                  paste URL of webpage to summarize
                </span>
              </button>
            </Tooltip>
          </li>
          {/* <li className="p-3"></li> */}
        </ul>
      </div>
    </>
  );

  // Display section for orignal input text
  const origTextDisplay = (
    <form className="w-full flex flex-col" onSubmit={summarizeRawText}>
      <div className="w-full h-dvh border-r border-kaito-brand-ash-green bg-gray-50">
        <textarea
          id="textInput"
          // rows={40}
          className="w-full mb-0 px-4 py-4 text-sm text-black bg-white bg-opacity-60 border-0  focus:ring-0 focus:ring-inset focus:ring-kaito-brand-ash-green h-[75%]" //h-[75%]
          value={inputTextCorpus}
          onChange={(e) => setInputTextCorpus(e.target.value)}
          placeholder="Paste in the text you want to summarize..."
        ></textarea>

        <div className=" flex flex-row px-3 py-2 border-t h-[25%] mb-0">
          <div className="flex-1">{homeButton}</div>
          <div className="flex-1">{summarizerCtrlButtons}</div>
        </div>
      </div>
    </form>
  );

  // Summary Flash Card component interface
  const cardColorHexArr = [
    "bg-[#cba3e0]",
    "bg-[#d2ccf2]",
    "bg-[#c8a8d5]",
    "bg-[#e4a8b9]",
    "bg-[#db96b9]",
    "bg-[#afd1e2]",
    "bg-[#feff9c]",
    "bg-[#96b7a5]",
  ];

  // let cardColorHex = cardColorHexArr[0];
  let cardColorHex = cardColorHexArr[Math.floor(Math.random() * cardColorHexArr.length)];
  // console.log(cardColorHex);

  const FlashCard = (
    <div className="flex flex-col h-screen">
      {/* Summarization Flashcard component */}
      <h2 className="text-black text-2xl flex justify-center mt-2">
        Summary Flash Card
      </h2>

      <div className="flex flex-col w-full mt-4 mb-4 overflow-auto transition-[flex-grow] ease-in-out pb-40 text-black">
        {/* <h2 className="text-black text-2xl flex justify-center mt-2">
          Summary Flash Card
        </h2> */}
        {summarizedText.length > 0 ? (
          <div
            className={`${cardColorHex}  text-black rounded px-4 py-2 max-w-[80%] mb-8 ml-auto mr-auto mt-auto flex border-1 border-gray-150`}
            // className="bg-[#c8a8d5] text-black rounded px-4 py-2 max-w-[80%] mb-8 ml-auto mr-auto mt-auto flex border-1 border-gray-300"
          >
            <span className="whitespace-pre-wrap flex flex-col">
              {summarizedText}
            </span>
          </div>
        ) : (
          ""
        )}
        {/* <div ref={bottomRef} /> */}
      </div>
    </div>
  );

  return (
    <>
      {status === "authenticated" && (
        <div className="flex flex-col">
          {/* landing page section */}
          {summarizedText.length == 0 && (
            <div className="flex h-screen">
              {/* side bar */}
              {SideNavBar}

              {/* main section */}
              <div className="flex flex-col p-4 md:p-8 bg-[#25252d00] overflow-hidden grow h-screen max-w-2xl mx-auto flex-auto">
                <h1 className="text-center text-3xl md:text-3xl mb-4 text-gray-700">
                  Summarize your documents and web pages.
                </h1>

                <p className="text-black text-lg text-center">
                  Specify text source on the left. Get a summary. You can ask
                  follow up questions.
                </p>

                <br></br>

                <div className="container max-w-2xl ">
                  {inputType === "text" && textInputForm}
                  {inputType === "file" && fileInputForm}
                  {inputType === "url" && urlInputForm}
                </div>
              </div>
              <ToastContainer />
            </div>
          )}

          {/* Summarization Flashcard component */}
          {summarizedText && (
            <div className="flex flex-col h-screen">
              <div className="flex flex-row h-fit">
                <div className="flex-1">{origTextDisplay}</div>
                <div className="flex-1">{FlashCard}</div>
              </div>
              <div className="flex-auto">
                <Footer />
              </div>
            </div>
          )}

          {/* <ToastContainer /> */}
          {summarizedText.length == 0 && <Footer />}
        </div>
      )}
      {status === "unauthenticated" && redirect("/auth/signIn")}
    </>
  );
}

export default SummarizerPage;

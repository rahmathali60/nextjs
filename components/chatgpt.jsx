"use client";
import { useState } from "react";
import TypingAnimation from "../components/typingAnimation";

export default function ChatGPT() {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [lastCopiedIndex, setLastCopiedIndex] = useState(true);



  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/generate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        setError(true);
        return;
      }

      const data = await res.json();

      setResponses((prevResponses) => [
        { prompt: prompt, response: data.text.trim() },
        ...prevResponses,
      ]);
      setPrompt("");
      setError(false);
      setLastCopiedIndex(false);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setPrompt("");
    setResponses([]);
    setError(false);
    setLastCopiedIndex(null);
  }

  function copyResponse(response, index) {
    navigator.clipboard.writeText(response);
    setLastCopiedIndex(index);
  }

  return (
    <div className="flex flex-col place-items-center py-12 text-black rounded-lg">
      <h1 className="text-2xl text-center font-bold p-3">ChatGPT</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <label htmlFor="prompt" className="block font-bold">
          Prompt:
        </label>
        <input
          type="text"
          id="prompt"
          name="prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="chatgpt-input"
        />

        <button type="submit"  disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {loading && (
        <div className="space-y-3">
          <h2 className="content-center mx-auto text-1xl"><TypingAnimation /></h2>
        </div>
      )}

      {error && (
        <div className="space-y-3">
          <h2 className="font-bold text-red-500">
            Error loading response
          </h2>
          <p>Please try again later.</p>
        </div>
      )}

      {responses.length > 0 && (
        <div className="space-y-3 ">
          <h2 className="font-bold text-slate-500	text-start pl-40">Responses:</h2>
          {responses.map((response, index) => (
            <div key={index} className="bol flex flex-col  px-40 py-3 rounded-md">
              <pre className=" bg-gray-200 px-40 py-3  "><strong>Prompt:</strong> {response.prompt}</pre>
              <div className="flex flex-wrap copy-container bg-gray-200 my-1 rounded-md ">
                <button className={` placeholder-center copy-button ml-auto bg-gray-200 text-3xl p-1 ${lastCopiedIndex === index ? "text-black" : ""}`} title="Copy" onClick={() => copyResponse(response.response, index)}>
  {lastCopiedIndex === index ? <>&#128457;</> : <>&#128458;</>}
</button>
                {/* make chatgpt-naswer stay center same even if copy-button is added */}

                <pre
                  className="chatgpt-answer flex p-20 bg-gray-200 px-40 align-bottom content-  py-3 rounded-md"
                >
                  {response.response}
                </pre>
            

              </div>
            </div>
          ))}
          <div className=" flex place-content-center" title="Reset">
            <button className=""  onClick={handleReset}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}

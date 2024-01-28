import Head from "next/head";
import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";
import { FaRegCopy, FaRegCheckCircle } from 'react-icons/fa';

export default function Home() {
  const [descriptInput, setDescriptInput] = useState("");
  const [result, setResult] = useState("");
  const [toneInput, setToneInput] = useState("relatable");

  const [checked, setChecked] = useState(false);
  const [emojiChecked, setEmojiChecked] = useState(false); // New state for emoji checkbox
  const [wordyChecked, setWordyChecked] = useState(false); // New state for emoji checkbox

  const [loading, setLoading] = useState(false);

  const textAreaRef = useRef(null);
  const [copyStatus, setCopyStatus] = useState([]);
  const [copyText, setCopyText] = useState("");

  useEffect(() => {
    setCopyStatus(new Array(result.split('\n').length).fill(false));
  }, [result]);

  const handleOnChange = () => {
    setChecked(!checked);
  };

  const handleEmojiOnChange = () => {
    setEmojiChecked(!emojiChecked); // New handler function for emoji checkbox
  };

  const handleWordyOnChange = () => {
    setWordyChecked(!wordyChecked); // New handler function for emoji checkbox
  };

  //Dropdownmenu code
  const options = [
    { label: "Relatable", value: "relatable" },
    { label: "Happy", value: "happy" },
    { label: "Sad", value: "sad" },
    { label: "Witty", value: "witty" },
    { label: "Cheeky", value: "cheeky" },
    { label: "Angry", value: "angry" },
    { label: "Dry", value: "dry" },
    { label: "Shakespearian", value: "like a Shakespeare comedian" },
    { label: "Snoop Dogg", value: "like Snoop Dogg" },
  ];

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true); // Set loading before sending API request
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descript: descriptInput,
          tone: toneInput, // Pass tone selection to API
          checkTags: checked ? "Add tags." : "No tags", // Pass hashtags checkbox state to API
          emojiVal: emojiChecked ? " with emojis." : " without emojis", // Pass emoji checkbox state to API
          wordyVal: wordyChecked ? " and each caption wordy. The longer the sentences are, the better the caption is" : "", // Pass emoji checkbox state to API
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setDescriptInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false); // Stop loading after response is received
    }
  }

  useEffect(() => {
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight - 30}px`;
  }, [descriptInput]);


  return (
    <div className={styles.mobilePad}>
      <Head>
        <title>Instagram Caption Generator</title>
        <link rel="icon" href="/instagram.jpeg" />
      </Head>

      <main className={styles.main}>
        <div className={styles.logoHeader}>
          <img src="/instagram.jpeg" className={styles.icon} />
          <h3>Instagram Caption Generator</h3>
        </div>
        <form onSubmit={onSubmit}>
          <textarea
            type="text"
            name="description"
            placeholder="Enter a description of the intended caption"
            ref={textAreaRef}
            value={descriptInput}
            style={{ minHeight: '15px', overflow: 'hidden' }}
            onChange={(e) => setDescriptInput(e.target.value)}
          />
          <div>
            <label className={styles.toneDiv}>
              Choose a tone
              <select
                value={toneInput}
                onChange={(e) => setToneInput(e.target.value)}
              >
                {options.map((option) => (
                  <option value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.helpDiv}>
            <label className={styles.container}>
              <input
                type="checkbox"
                id="addTags"
                checked={checked}
                onChange={handleOnChange}
              />
              Add Hashtags
              <span className={styles.checkmark}></span>
            </label>
            <img src="/circle-help-icon.png" className={styles.icon_help} title="Type in a description that you want to turn into a caption. Then choose a tone that you want the caption in. It will take the a bit to proces so be patient." />
          </div>
          <label className={styles.container}> {/* New checkbox for adding emojis */}
            <input
              type="checkbox"
              id="addEmojis"
              checked={emojiChecked}
              onChange={handleEmojiOnChange}
            />
            Add Emojis
            <span className={styles.checkmark}></span>
          </label>
          <label className={styles.container}> {/* New checkbox for adding emojis */}
            <input
              type="checkbox"
              id="addWordy"
              checked={wordyChecked}
              onChange={handleWordyOnChange}
            />
            Make Wordy
            <span className={styles.checkmark}></span>
          </label>
          <input
            type="submit"
            value={loading ? "Generating . . ." : "Generate caption"}
            disabled={loading}
            className={loading ? styles.grayButton : ""}
          />
          <div className={styles.result}>
            {result && (
              result.split("\n").filter(line => line.trim().length > 0).map((line, index) => {
                const textWithoutNumbering = line.split('.').slice(1).join('.').trim();
                return (
                  <div key={index} className={styles.clipboardCopy}>
                    <p>{textWithoutNumbering}</p>
                    {copyStatus[index] ? (
                      <FaRegCheckCircle color="green" size="1.2em" />
                    ) : (
                      <FaRegCopy
                        color="green"
                        size="1.2em"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(textWithoutNumbering);
                            setCopyStatus(prevState => {
                              const newCopyStatus = new Array(prevState.length).fill(false);
                              newCopyStatus[index] = true;
                              return newCopyStatus;
                            });
                          } catch (err) {
                            console.error('Failed to copy text: ', err);
                          }
                        }}
                      />
                    )}
                  </div>
                );
              })
            )}

          </div>
        </form>
      </main>
    </div>
  );
}

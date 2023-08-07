import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // Use dynamic import to fetch data.json asynchronously
    import("./data.json").then((response) => {
      setData(response.default);
    });
  }, []);

  const onChange = (event) => {
    const searchTerm = event.target.value.slice(0, 64);
    setValue(searchTerm);
    setShowSuggestions(!!searchTerm && !searchTerm.endsWith(" "));
  };

  const onSearch = (searchTerm) => {
    const currentWords = value.trim().split(/\s+/); // Use regex to split on any whitespace (spaces, tabs, etc.)
    const lastWord = currentWords[currentWords.length - 1];
    const newWords = [...currentWords.slice(0, -1), searchTerm];
    const newValue = newWords.join(" ");

    setValue(newValue);
    setShowSuggestions(false);
    // our api to fetch the search result
    console.log("search ", searchTerm);
  };

  const getLastWord = (str) => {
    const words = str.trim().split(/\s+/); // Use regex to split on any whitespace (spaces, tabs, etc.)
    return words[words.length - 1];
  };

  const isTomato = (word) => {
    return word.toLowerCase() === "tomato";
  };

  const renderInputText = () => {
    const words = value.trim().split(/\s+/); // Use regex to split on any whitespace (spaces, tabs, etc.)
    return words.map((word, index) => {
      const wordKey = `word-${index}`;
      return (
        <React.Fragment key={wordKey}>
          {index > 0 && " "} {/* Add a space between words */}
          <span style={{ color: isTomato(word) ? "red" : "black" }}>{word}</span>
        </React.Fragment>
      );
    });
  };

  const filteredData = data.filter((item) => {
    const lastWord = getLastWord(value);
    const searchTerm = lastWord.toLowerCase();
    const fullName = item.word.toLowerCase();
    return lastWord && fullName.startsWith(searchTerm);
  });

  return (
    <div className="App">
      <div className="input-wrapper">
        <div className="search-inner">
          <input
            type="text"
            value={value}
            onChange={onChange}
            ref={inputRef}
            style={{ color: "black" }}
            autoComplete="off"
            placeholder="type here..."
          />
        </div>
        {showSuggestions && (
          <div className="suggestions">
            {filteredData.slice(0, 10).map((item) => (
              <div
                onClick={() => onSearch(item.word)}
                className="suggestion-item"
                key={item.word}
              >
                {item.word}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="output-box">{renderInputText()}</div>
    </div>
  );
}

export default App;

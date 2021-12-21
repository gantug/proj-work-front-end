// import { useEffect } from "react";
import "./App.css";

function App() {
    const apiRequest = async (value) => {
        const resposne = await fetch("http://localhost:8000/", {
            method: "POST",
            body: JSON.stringify({
                value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        return resposne.json();
    };

    const processWords = (data) => {
        const arrayWords = data[0];
        let text = "";

        arrayWords.forEach((object) => {
            if (object.lemma.includes("+")) {
                text += `<span>${object.word}</span> `;
            } else {
                text += `<span class="red-underline">${object.word}</span> `;
            }
        });

        return text;
    };

    const check = async (cleanText) => {
        const data = await apiRequest(cleanText);
        const result = await processWords(data);
        document.getElementById("custom-div-input-box").innerHTML = result;
    };

    function setCaret(length) {
        var el = document.getElementById("custom-div-input-box");
        var range = document.createRange();
        var sel = window.getSelection();

        range.setStart(el.childNodes[0], length);
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);
    }

    const getCleanText = () => {
        let value = document.getElementById("custom-div-input-box").innerHTML;
        let cleanText = value.replace(/<\/?[^>]+(>|$)/g, "");
        cleanText = cleanText.replace("&nbsp;", " ");
        check(cleanText);
        // setCaret(cleanText.length);
    };

    // useEffect(() => {
    //     document
    //         .getElementById("custom-div-input-box")
    //         .addEventListener("input", function () {
    //             let value = document.getElementById(
    //                 "custom-div-input-box",
    //             ).innerHTML;
    //             let cleanText = value.replace(/<\/?[^>]+(>|$)/g, "");

    //             cleanText = cleanText.replace("&nbsp;", " ");

    //             if (
    //                 cleanText.slice(-1) === "." ||
    //                 cleanText.slice(-1) === " " ||
    //                 cleanText.slice(-1) === ","
    //             ) {
    //                 check(cleanText);
    //                 setCaret(cleanText.length);
    //                 return false;
    //             }
    //         });
    // }, []);

    return (
        <div className="App">
            <div
                contentEditable
                id="custom-div-input-box"
                spellCheck="false"
            ></div>
            <button onClick={getCleanText}>Check</button>
        </div>
    );
}

export default App;

import { useState, useEffect } from "react";
import "./App.css";



function App() {
    const [isChecked, setisChecked] = useState(false);

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
        // document.getElementById("custom-div-input-box").innerHTML = result;
        return data;
    };

    function setCaret(length) {
        // var el = document.getElementById("custom-div-input-box");
        // var range = document.createRange();
        // var sel = window.getSelection();

        // range.setStart(el.childNodes[0], length-1);
        // range.collapse(true);

        // sel.removeAllRanges();
        // sel.addRange(range);
    }

    const getCleanText = () => {
        let value = document.getElementById("custom-div-input-box").innerHTML;
        let cleanText = value.replace(/<\/?[^>]+(>|$)/g, "");
        cleanText = cleanText.replace("&nbsp;", " ");
        check(cleanText);
        // setCaret(cleanText.length);
    };

    const realTimeCheck = () => {
        setisChecked(false);
        let value = document.getElementById(
            "custom-div-input-box",
        ).innerHTML;
        let cleanText = value.replace(/<\/?[^>]+(>|$)/g, "");

        cleanText = cleanText.replace("&nbsp;", " ");

        if (
            cleanText.slice(-1) === "." ||
            cleanText.slice(-1) === " " ||
            cleanText.slice(-1) === ","
        ) {
            check(cleanText)
            .then(response => {
                // setisChecked(true)
                console.log(response)})
            .catch(error => (console.log(error)))
            setisChecked(true)
            setCaret(cleanText.length);
            return false;
        }
        console.log(cleanText)
    }

    useEffect(() => {
        document
            .getElementById("custom-div-input-box")
            .addEventListener("keydown", function () {
                const timer = setTimeout(realTimeCheck, 1000)
                if(isChecked == true)
                clearTimeout(timer);
                // let value = document.getElementById(
                //     "custom-div-input-box",
                // ).innerHTML;
                // let cleanText = value.replace(/<\/?[^>]+(>|$)/g, "");
                // cleanText = cleanText.replace("&nbsp;", " ");
                // if (
                //     cleanText.slice(-1) === "." ||
                //     cleanText.slice(-1) === " " ||
                //     cleanText.slice(-1) === ","
                // ) {
                //     check(cleanText)
                //     .then(response => (console.log(response)))
                //     .catch(error => (console.log(error)))
                //     setCaret(cleanText.length);
                //     return false;
                // }
                // console.log(cleanText)
            });
    }, []);

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

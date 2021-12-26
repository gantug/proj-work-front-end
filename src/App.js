import { useEffect } from "react";
import "./App.css";

let timer;

function App() {
	const WAIT_TIME = 500;

	const apiRequest = async (value) => {
		const response = await fetch("http://localhost:8000/", {
			method: "POST",
			body: JSON.stringify({
				value,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response.json();
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
		const result = processWords(data);
		document.getElementById("custom-div-input-box").innerHTML = result;
		return result;
	};

	
	const setCaret = () => {
		var element = document.getElementById("custom-div-input-box");

		var range = document.createRange();
		var sel = window.getSelection();

		range.setStart(element, element.childNodes.length);
		range.collapse(true);

		sel.removeAllRanges();
		sel.addRange(range);
	}

	const getCleanText = () => {
		let value = document.getElementById("custom-div-input-box").innerHTML;

		let cleanText = value.replace(/<\/?[^>]+(>|$)/g, "");
		cleanText = cleanText.replace("&nbsp;", " ");

		check(cleanText);
	};

	const realTimeCheck = () => {
		let value = document.getElementById("custom-div-input-box").innerHTML;

		let cleanText = value.replace(/<\/?[^>]+(>|$)/g, "");
		cleanText = cleanText.replace("&nbsp;", " ");

		check(cleanText)
			.then(() => setCaret())
			.catch(err => console.log(err))
	}

	useEffect(() => {
		document
			.getElementById("custom-div-input-box")
			.addEventListener("keyup", function () {
				clearTimeout(timer);
				timer = setTimeout(() => {
					realTimeCheck();
				}, WAIT_TIME);
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

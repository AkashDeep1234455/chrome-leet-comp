console.log("Content script is executing");

function fetchQuestionInfo() {
    console.log("Timeout finished, looking for elements...");
    let questionElements = document.querySelectorAll(".whitespace-normal");
    console.dir(questionElements);

    if (questionElements.length > 0) {
        let questionTitle = questionElements[0].innerHTML.split('.');
        chrome.runtime.sendMessage({
            type: "QUESTION_INFO",
            data: questionTitle
        });
    } else {
        console.log("Elements not found");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    
    // Adding a slight delay to ensure all dynamic content is loaded
    setTimeout(fetchQuestionInfo, 2000); // Adjust the timeout duration if necessary
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "FETCH_QUESTION_INFO") {
        console.log("Received fetch request");
        setTimeout(fetchQuestionInfo, 2000); // Adding delay if necessary
    }
});
import { useEffect, useState } from "react";
import axios from "axios";
import QuestionBox from "./QuestionBox.jsx"; // Ensure the path is correct

function Hero() {
    const [questionInfo, setQuestionInfo] = useState(null);
    const [companyNames, setCompanyNames] = useState([]); // State variable

    useEffect(() => {
        // Retrieve the active tab ID
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];
            const tabId = currentTab.id;

            // Retrieve the data from chrome.storage.local for the specific tab
            if (chrome && chrome.storage && chrome.storage.local) {
                chrome.storage.local.get([tabId.toString()], (result) => {
                    console.log("Data retrieved from storage:", result[tabId]);
                    setQuestionInfo(result[tabId]);

                    // Ensure questionInfo is updated before making the request
                    if (result[tabId] && result[tabId].length > 0) {
                        const questionSearchData = { questionId: result[tabId][0] };
                        console.log("Question Search Data:", questionSearchData);

                        axios.post("https://leet-comp.onrender.com/company", questionSearchData)
                            .then((res) => {
                                console.log("Response Data:", res.data);
                                setCompanyNames(res.data.companyNames || []); // Use default empty array if undefined
                            })
                            .catch((err) => {
                                console.log("API Error:", err);
                            });
                    }
                });
            } else {
                console.error('chrome.storage.local is not available');
            }
        });
    }, []); // Empty dependency array

    return (
        <div className="hero">
            <div className="company">
                <h2>Leet-Comp</h2>
            </div>
            {questionInfo && (
                <div className="questionDetail">
                    <p style={{ fontSize: "1rem", marginLeft: "0.8rem", fontWeight: "bold" }}>
                        {questionInfo[0] + ". " + questionInfo[1]}
                    </p>
                </div>
            )}
            <div className="questionDisplayBox">
                {companyNames.length > 0 ? (
                    companyNames.map((name, index) => (
                        <QuestionBox key={index} names={name} />
                    ))
                ) : (
                    <p>No companies found</p>
                )}
            </div>
        </div>
    );
}

export default Hero;

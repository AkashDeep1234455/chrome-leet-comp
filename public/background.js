chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "QUESTION_INFO") {
    const tabId = sender.tab.id;
    console.log(tabId);
      console.log("Received question info:", message.data);
      // You can handle the received data here
      // Store the data or forward it to the popup
      chrome.storage.local.set({ [tabId]: message.data }, () => {
        console.log("Data saved in storage.",tabId);
    });
  }
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
      // Example: Check if the tab URL matches your allowed pages
      const allowedPages = ['https://leetcode.com/problems/*'];
      const isAllowed = allowedPages.some(url => tab.url.startsWith(url));

      if (!isAllowed) {
          // Remove data if the page is not allowed
          chrome.storage.local.remove(tabId.toString(), () => {
              console.log("Data removed for tab:", tabId);
          });
      } else {
          // Send message to content script to re-fetch data
          chrome.tabs.sendMessage(tabId, { type: "FETCH_QUESTION_INFO" });
      }
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
      // Send message to content script to re-fetch data
      chrome.tabs.sendMessage(activeInfo.tabId, { type: "FETCH_QUESTION_INFO" });
  });
});
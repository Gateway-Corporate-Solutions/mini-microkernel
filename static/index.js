function hexDecode(hex) {
  var back = new Uint8Array(hex.match(/.{1,4}/g).map(byte => parseInt(byte, 16)));
  return back;
}

window.onload = () => {
  var ws = null;
  if (location.protocol === "https:") {
    ws = new WebSocket(`wss://${location.host}/wss`);
  } else {
    ws = new WebSocket(`ws://${location.host}/wss`);
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Received message:", data);
    if (data.type === "log") {
      console.log(data.message);
    } else if (data.type === "error") {
      console.error(data.message);
    } else if (data.type === "info") {
      console.info(data.message);
    } else if (data.type === "modules") {
      const modulesList = document.getElementById("module-list");
      if (modulesList) {
        modulesList.innerHTML = ""; // Clear existing list
        data.modules.forEach((module) => {
          const div = document.createElement("div");
          div.className = "module";
          const h3 = document.createElement("h3");
          h3.textContent = module.name;
          div.appendChild(h3);
          module.methods.forEach((method) => {
            const h4 = document.createElement("h4");
            h4.textContent = `Includes Method: ${method.name}`;
            div.appendChild(h4);
          });
          modulesList.appendChild(div);
        });
      }
    } else if (data.type === "file") {
      const textContent = document.getElementById("text-content");
      if (textContent) {
        textContent.value = data.content; // Assuming content is a string
      } else {
        console.warn("Text content area not found.");
      }
    } else if (data.type === "formatted") {
      const textContent = document.getElementById("text-content");
      if (textContent) {
        textContent.value = data.content; // Assuming content is a string
      } else {
        console.warn("Text content area not found.");
      }
    } else if (data.type === "hash") {
      const hashOutput = document.getElementById("text-content");
      if (hashOutput) {
        hashOutput.value += "\nSHA-256 HASH: " + data.hash; // Assuming hash is a string
      } else {
        console.warn("Text content area not found.");
      }
    } else {
      console.warn("Unknown message type:", data.type);
    }
  }

  ws.onopen = () => {
    console.log("WebSocket connection established");

    const fileInput = document.getElementById("file-input");
    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          ws.send(JSON.stringify({
            type: "upload",
            fileName: file.name,
            content: e.target.result
          }));
        };
        reader.readAsText(file);
      } else {
        alert("Please select a file to upload.");
      }
    });

    const downloadButton = document.getElementById("download-button");
    downloadButton.addEventListener("click", () => {
      const textContent = document.getElementById("text-content").value;
      const blob = new Blob([textContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileInput.files[0].name; // Default file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    const formatButton = document.getElementById("format-button");
    formatButton.addEventListener("click", () => {
      const textContent = document.getElementById("text-content").value;
      const formattedContent = textContent.replace(/\s+/g, ' ').trim(); // Simple formatting
      document.getElementById("text-content").value = formattedContent;
      ws.send(JSON.stringify({
        type: "format",
        content: formattedContent
      }));
    });

    const hashButton = document.getElementById("hash-button");
    hashButton.addEventListener("click", () => {
      const textContent = document.getElementById("text-content").value;
      ws.send(JSON.stringify({
        type: "hash",
        content: textContent
      }));
    });

    const clearButton = document.getElementById("clear-button");
    clearButton.addEventListener("click", () => {
      const textContent = document.getElementById("text-content");
      if (textContent) {
        textContent.value = ""; // Clear the text area
      } else {
        console.warn("Text content area not found.");
      }
    });
  };
}
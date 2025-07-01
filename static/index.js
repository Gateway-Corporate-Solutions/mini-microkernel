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
    } else if (data.type === "warn") {
      console.warn(data.message);
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

      if (data.modules.some(module => module.name === "editor")) {
        // Find the body element
        const body = document.querySelector("body");
        // Create the editor header
        const header = document.createElement("h2");
        header.textContent = "Editor";
        body.appendChild(header);
        // Create the editor container
        const editorContainer = document.createElement("div");
        editorContainer.id = "editor";
        // Create the file name input
        const fileNameInput = document.createElement("input");
        fileNameInput.type = "text";
        fileNameInput.id = "file-name";
        fileNameInput.placeholder = "File name";
        editorContainer.appendChild(fileNameInput);
        // Create the text content area
        const textContent = document.createElement("textarea");
        textContent.id = "text-content";
        textContent.placeholder = "Your text file will show up here...";
        editorContainer.appendChild(textContent);
        // Create the buttons container
        const buttonsContainer = document.createElement("div");
        buttonsContainer.id = "buttons";
        editorContainer.appendChild(buttonsContainer);
        // Create the file input
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.id = "file-input";
        fileInput.accept = ".txt, .md, .json";
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
        buttonsContainer.appendChild(fileInput);
        // Create the upload button
        const uploadButton = document.createElement("label");
        uploadButton.textContent = "Upload";
        uploadButton.className = "action";
        uploadButton.setAttribute("for", "file-input");
        uploadButton.id = "upload-button";
        buttonsContainer.appendChild(uploadButton);
        // Create the download button
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Download";
        downloadButton.className = "action";
        downloadButton.id = "download-button";
        downloadButton.addEventListener("click", () => {
          const textContent = document.getElementById("text-content").value;
          const fileNameInput = document.getElementById("file-name");
          const blob = new Blob([textContent], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileNameInput.value || "unnamed.txt"; // Default file name
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
        buttonsContainer.appendChild(downloadButton);
        // Create the format button
        if (data.modules.some(module => module.name === "format")) {
          const formatButton = document.createElement("button");
          formatButton.textContent = "Format";
          formatButton.className = "action";
          formatButton.id = "format-button";
          formatButton.addEventListener("click", () => {
            const textContent = document.getElementById("text-content").value;
            const formattedContent = textContent.replace(/\s+/g, ' ').trim(); // Simple formatting
            document.getElementById("text-content").value = formattedContent;
            ws.send(JSON.stringify({
              type: "format",
              content: formattedContent
            }));
          });
          buttonsContainer.appendChild(formatButton);
        }
        // Create the hash button
        if (data.modules.some(module => module.name === "hash")) {
          const hashButton = document.createElement("button");
          hashButton.textContent = "Hash";
          hashButton.className = "action";
          hashButton.id = "hash-button";
          hashButton.addEventListener("click", () => {
            const textContent = document.getElementById("text-content").value;
            ws.send(JSON.stringify({
              type: "hash",
              content: textContent
            }));
          });
          buttonsContainer.appendChild(hashButton);
        }
        // Create the clear button
        const clearButton = document.createElement("button");
        clearButton.textContent = "Clear";
        clearButton.className = "action";
        clearButton.id = "clear-button";
        clearButton.addEventListener("click", () => {
          const fileNameInput = document.getElementById("file-name");
          const textContent = document.getElementById("text-content");
          if (textContent) {
            fileNameInput.value = ""; // Clear the file name input
            textContent.value = ""; // Clear the text area
          } else {
            console.warn("Text content area not found.");
          }
        });
        buttonsContainer.appendChild(clearButton);
        // Append the editor container to the body
        body.appendChild(editorContainer); 
      }

    } else if (data.type === "file") {
      const textContent = document.getElementById("text-content");
      const fileNameInput = document.getElementById("file-name");
      if (textContent) {
        fileNameInput.value = data.fileName; // Assuming fileName is a string
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
  };
}
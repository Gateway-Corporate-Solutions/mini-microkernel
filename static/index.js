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
        // Create a new list item for the header
        const h2 = document.createElement("h2");
        h2.textContent = "Available Modules:";
        modulesList.appendChild(h2);
        // Populate the list with module names
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
    } else {
      console.warn("Unknown message type:", data.type);
    }
  }

  ws.onopen = () => {
    console.log("WebSocket connection established");
  };
}
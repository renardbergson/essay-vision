const serverURI = "http://localhost:8080";

document.getElementById("uploadForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const fileInput = document.querySelector("#file-input");
  const file = fileInput.files[0];
  
  if (!file) {
    const noSelectedFile = document.querySelector("#noSelectedFile");
    noSelectedFile.classList.add("visible");
    return;
  }

  const formData = new FormData();
  formData.append("file", file); 

  const configs = {
    method: "POST",
    body: formData
  }

  fetch(`${serverURI}/file-upload`, configs)
  .then(response => response.json())
  .then(data => {
    handleTextArea(data.text)
    handleSections(1);
  })
  .catch(error => console.error("Erro:", error));
})

document.getElementById("reviseBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  const response = await fetch(`${serverURI}/text-correction`, {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({text: textArea.value})
  });

  const result = await response.json();
  handleTextArea(result);
})

function handleSections(index) {
  const sections = document.querySelectorAll("section");

  sections.forEach(section => {
    section.classList.remove("visible");
    sections[index].classList.add("visible");
  })
}

function handleTextArea(text) {
  const textArea = document.querySelector("#text-area");
  textArea.innerHTML = text;
}
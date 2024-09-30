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

  fetch("http://localhost:8080/file-upload", configs)
  .then(response => response.json())
  .then(data => {
    const textArea = document.querySelector("#text-area");
    textArea.innerHTML = data.text;

    const sections = document.querySelectorAll("section");

    sections.forEach(section => {
      section.classList.remove("visible");
      sections[1].classList.add("visible");
    })
  })
  .catch(error => console.error("Erro:", error));
})
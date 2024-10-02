const serverURI = "http://localhost:8080";
const textArea = document.querySelector("#text-area");

// file upload
document.getElementById("uploadForm").addEventListener("submit", (e) => {
  e.preventDefault();

  sessionStorage.clear();

  const name = document.querySelector("#name");
  const theme = document.querySelector("#theme");
  const fileInput = document.querySelector("#file-input");
  const file = fileInput.files[0];
  const noSelectedFile = document.querySelector("#noSelectedFile");
  const mainBtn = document.querySelector("#sendFileBtn");
  
  if (!name.value || !theme.value || !file) {
    noSelectedFile.classList.add("visible");
    return;
  }

  noSelectedFile.classList.remove("visible");
  mainBtn.classList.add("sending");
  mainBtn.innerText = "Enviando...";

  sessionStorage.setItem("aluno", `${name.value}`);
  sessionStorage.setItem("tema", `${theme.value}`);

  const formData = new FormData();
  formData.append("file", file); 

  fetch(`${serverURI}/file-upload`, {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById("student-name").innerText = name.value;
    document.getElementById("text-theme").innerText = theme.value;
    textArea.innerHTML = data.text;
    mainBtn.classList.remove("sending");
    mainBtn.innerText = "Analisar";
    handleSections(1, true);
  })
  .catch(error => console.error("Erro:", error));
})

// home
document.getElementById("goBackBtn").addEventListener("click", (e) => {
  e.preventDefault();
  sessionStorage.clear();
  handleSections(0, true);
})

// save text
document.getElementById("downloadBtn").addEventListener("click", (e) => {
  e.preventDefault();

  if (handleError(textArea.value.length < 100, "É necessário pelo menos 100 caracteres para realizar o download.")) {
    return;
  }

  // creating blob from text
  const text = textArea.value;
  const blob = new Blob([text], {type: "text/plain"});

  // creating link 
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "texto.txt";

  // simulating click to download
  document.body.appendChild(a);
  a.click();

  // removing element and link after download
  document.removeChild(a);
  URL.revokeObjectURL(url);
})

// format text
document.getElementById("formatBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  if (handleError(textArea.value.length < 100, "Para sugerir ortografia, o texto precisa ter pelo menos 100 caracteres!")) {
    return;
  }

  const currentText = textArea.value;
  textArea.value = "Verificando ortografia..."

  const response = await fetch(`${serverURI}/text-format`, {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({text: currentText})
  });

  const result = await response.json();
  textArea.value = result;
})

// correction
document.getElementById("text-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (handleError(textArea.value.length < 600, "Para obter correção, o texto precisa ter pelo menos 600 caracteres!")) {
    return;
  }

  const currentText = textArea.value;
  textArea.value = "Obtendo correção..."
  
  const name = document.querySelector("#student-name");
  const theme = document.querySelector("#text-theme");
  name.innerText = sessionStorage.getItem("aluno");
  theme.innerText = sessionStorage.getItem("tema");
  
  const response = await fetch(`${serverURI}/text-correction`, {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      theme: sessionStorage.getItem("tema"),
      text: currentText
    })
  });
  
  const correction = await response.json();
  const correctionArea = document.querySelector("#correction");

  textArea.value = currentText;
  correctionArea.innerHTML = correction;
  
  handleSections(2, false);
})

document.getElementById("closeBtn").addEventListener("click", (e) => {
  handleSections(1, true);
})

function handleSections(index, hideAllOthers) {
  const sections = document.querySelectorAll("section");
  
  if (hideAllOthers) {
    sections.forEach(item => {
      item.classList.remove("visible");
    })
    
    sections[index].classList.add("visible");
    return;
  }

  sections[index].classList.add("visible");
}

function handleError(condition, message) {
  const errorMessage = document.querySelector("#errorMessage");
  
  if (condition) {
    errorMessage.innerHTML = message;
    errorMessage.classList.add("visible");
    return true;
  }
  
  errorMessage.classList.remove("visible");
  return false;
}
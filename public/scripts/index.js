// require('dotenv').config();

const dropZone = document.querySelector(".drop-zone");
const fileInput = document.getElementById("file-input");
const browseBtn = document.querySelector(".browseBtn");
const uploadContainer = document.querySelector(".upload-container");
const fileUrlInput = document.querySelector("#fileUrl");


const sharingContainer = document.querySelector(".sharing-container");
const linkCopyBtn = document.querySelector("#linkCopyBtn");
const emailForm = document.querySelector("#emailForm");

const uploadingGif = document.querySelector(".uploading");
const bgProgress = document.querySelector(".bg-progress");
const progressPercent = document.querySelector("#progressPercent");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.querySelector(".progress-bar");
const uploadStatus = document.querySelector(".upload-status");

const toast = document.querySelector(".toast");

const APP_BASE_URL = "https://quick-file-share.herokuapp.com";
// const APP_BASE_URL = "http://localhost:3000";
uploadContainer.addEventListener("drop", (e) => {
  e.preventDefault();
})

// dropZone.addEventListener("dragover", (e) => {
//   e.preventDefault();
//   if (!dropZone.classList.contains("dragged")) {
//     dropZone.classList.add("dragged");
//   }
// });

// dropZone.addEventListener("dragleave", (e) => {
//   dropZone.classList.remove("dragged");
// });

// dropZone.addEventListener("drop", (e) => {
//   e.preventDefault();
//   if (dropZone.classList.contains("dragged")) {
//     dropZone.classList.remove("dragged");
//   }

//   const files = e.dataTransfer.files;
//   if(files.length){
//     fileInput.file = files;
//     uploadFile();
//   }
// });

fileInput.addEventListener("change", (e) => {
    uploadFile();
})

browseBtn.addEventListener("click", (e) => {
    fileInput.click();
})

const uploadFile = async () => {
  if(fileInput.files.length > 1){
    fileInput.value = "";
    showToast("Upload only one file at a time.");
    return;
  }
    const file = fileInput.files[0];

    if(file.size > (100*1024*1024)){
      showToast("File size exceeded limit.")
      return;
    }
    const formData = new FormData();
    const uploadUrl = `${APP_BASE_URL}/api/files`;
    formData.append("myFile", file);

    // const xhr = new XMLHttpRequest();
    // xhr.onreadystatechange = () => {
    //     if(xhr.readyState === XMLHttpRequest.DONE){
    //         console.log(xhr.response);
    //     }
    // }
    // xhr.open("POST", uploadUrl);
    // xhr.send(formData);
    uploadingGif.style.display = "block";
    const res = await fetch(uploadUrl, {
      method: "post",
      body: formData,
    });
    const data = await res.json();
    onUploadSuccess(data);
    console.log(data)
}
const onUploadSuccess = ({file: url}) => {
  console.log(url);
  fileInput.value = "";
  sharingContainer.style.display = 'block';
  uploadingGif.style.display = 'none';
  fileUrlInput.value = url;
}









linkCopyBtn.addEventListener("click", () => {
  fileUrlInput.select();
  document.execCommand("copy");
  showToast("Link copied");
})

emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e)
  const url = fileUrlInput.value;
  const formData = {
    uuid: url.split("/")[4],
    emailTo: emailForm.elements["email-to"].value,
    emailFrom: emailForm.elements["email-from"].value,
  };
  const mailSendUrl = `${APP_BASE_URL}/api/files/send`;
  fetch(mailSendUrl, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }).then(res => res.json())
    .then(({success}) => {
      if(success){
        sharingContainer.style.display = 'none';
        showToast("Email Sent");
      }
    })
  console.log(formData);
})

let toastTimer;
const showToast = (msg) => {
  toast.innerText = msg;
  toast.style.transform = "translate(-50%, 0";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{
    toast.style.transform = "translate(-50%, 60px)";
  }, 2000);
}
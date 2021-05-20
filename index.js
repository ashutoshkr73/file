const dropZone = document.querySelector(".drop-zone");
const browsebtn = document.querySelector(".browsebtn");
const fileinput = document.querySelector("#fileinput");

const progressContainer = document.querySelector(".progress-container");
const bgProgress = document.querySelector(".bg-Progress");
const percentDiv = document.querySelector("#percent");

const fileURLInput = document.querySelector("#fileURL");
const sharingContainer = document.querySelector(".sharing-container");
const copyBtn = document.querySelector("#copyBtn");

const emailForm = document.querySelector("#emailForm");

const toast = document.querySelector(".toast");

const maxAllowedSize = 100 * 1024 * 1024;

const host = " https://innshare.herokuapp.com/"; //it will change after backend
const uploadURL = host + "api/files/send"; //gateway
//const uploadURL = host + "api/files";  //for email, vid 56.15min

const emailURL = host + "api/files"; //emailpi ,vid 2:24 min

dropZone.addEventListener("dragover", e => {
  e.preventDefault();
  //console.log("dragging");
  if (!dropZone.classList.contains("dragged")) {
    dropZone.classList.add("dragged");
  }
});

dropZone.addEventListener("dragleave", () => {
  // console.log("dragging");
  dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", e => {
  // console.log("dragging");
  e.preventDefault();
  dropZone.classList.remove("dragged");
  //console.log(e.dataTransfer.files);
  const files = e.dataTransfer.files;
  //console.log(files);
  if (files.length) {
    fileinput.files = files;
    uploadFile(); //upload function called
  }
});

fileinput.addEventListener("change", () => {
  uploadFile();
});

browsebtn.addEventListener("click", () => {
  fileinput.click();
});

copyBtn.addEventListener("click", () => {
  fileURLInput.select();
  document.execCommand("copy");
  showToast("Link Copied");
});

////////////////////////////////////////////////upload function/////////
const uploadFile = () => {
  if (fileinput.files.length > 1) {
      resetFileInput();
    showToast("Only upload 1 file at a time");
    return;
  }
  const file = fileinput.files[0];

  if (file.size > maxAllowedSize) {
    resetFileInput();
    showToast("Can't upload more then 100mb");
    return;
  }
  progressContainer.style.display = "block";

  const formData = new FormData();
  formData.append("myfile", file); //some backend concept

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    //when event khatam hua
    // console.log(xhr.readyState);

    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      onUploadSuccess(JSON.parse(xhr.response)); //parse lagane se javascript object bngya
    }
  };

  xhr.upload.onprogress = updateProgress; //progress of upload batayega///////////////////////////

  xhr.upload.onerror = () => {
    resetFileInput();
    showToast(`Error in upload: ${xhr.statusText}`);
  };

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

const updateProgress = e => {
  /////progress fnt
  //  console.log(e);
  const percent = Math.round((e.loaded / e.total) * 100);
  bgProgress.style.width = `${percent}%`;
  percentDiv.innerText = percent;
};

const onUploadSuccess = ({ file: url }) => {
  console.log(file);
    resetFileInput();
  emailForm[2].removeAttribute("disabled");
  progressContainer.style.display = "none"; //1:36 hr
  sharingContainer.style.display = "block";
  fileURLInput.value = url;
};

const resetFileInput=()=>{
   resetFileInput();
}

emailForm.addEventListener("submit", e => {
  e.preventDefault();
  console.log("submit form");

  const url = fileURLInput.value;
  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value
  };
  emailForm[2].setAttribute("disabled", "true"); //disable the send button

  console.table(formData);
  fetch(emailURL, {
    method: "POST",
    headers: {
      "content-Type": "application/json"
    },

    body: JSON.stringify(formData)
  })
    .then(res => res.JSON())
    .then(({ success }) => {
      if (success) {
        sharingContainer.style.display = "none";
        showToast("Email Sent");
      }
    });
});

let toastTimer;
const showToast = msg => {
  toast.innerText = msg;
  toast.style.transform = "translate(-50%,0)";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.transform = "translate(-50% ,60px)";
  }, 2000);
};

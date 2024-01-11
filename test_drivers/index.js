const bucketName = 'rag-document-storage';
const clientID = "214849435893-3uebpovmqo39srlrao378i0jl4q7qctg.apps.googleusercontent.com";
const redirectURL = "http://127.0.0.1:5500/test_driver1.html";
const scope = "https://www.googleapis.com/auth/devstorage.read_write";
let accessToken = null;

/**
 * リダイレクトされた URLから、access tokenを切り出す
 */
for (value of location.hash.split("&")) {
  if (value.indexOf("access_token=") === 0) {
    const access_token = value.split("=")[1];
    const ele = document.createElement("p");
    ele.textContent = "Your access token is '" + access_token + "'.";
    accessToken = access_token;
    document.body.appendChild(ele);
    document.getElementById("submit-button").disabled = false;
  }
}

/**
 * ファイルのアップロード
 */
formElem.onsubmit = async (e) => {
  e.preventDefault();
  const file = document.getElementById("file-upload");
  const filename = file.value.split("\\").slice(-1)[0];
  console.log("File Name: " + JSON.stringify(filename));
  const extension = filename.split(".").slice(-1)[0].toLocaleLowerCase();
  let contentType = null;
  // content-typeの判別
  if (extension === "txt") {
    contentType = "txt/plain";
  } else if (extension === "html") {
    contentType = "txt/html";
  } else if (extension === "pdf") {
    contentType = "application/pdf";
  } else if (extension === "pptx") {
    contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  } else {
    alert("このファイルは対応していません。");
  }
  // ファイルの読み込みと、アップロード
  if (contentType) {
    const reader = new FileReader();
    reader.addEventListener("load", async (event) => {
      const bytes = event.target.result;
      let response = await fetch(
        `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${filename}`,
        {
          method: "POST",
          headers: {
            "Content-Type": contentType,
            Authorization: `Bearer ${accessToken}`,
          },
          body: bytes,
        }
      );

      let result = await response.json();
      if (result.mediaLink) {
        alert(
          `Success to upload ${filename}. You can access it to ${result.mediaLink}`
        );
      } else {
        alert(`Failed to upload ${filename}`);
      }
    });

    reader.readAsArrayBuffer(file.files[0]);
  }
};

/**
 * ここから下のコードは、ほとんどそのまま
 * https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#oauth-2.0-endpoints
 * から引用しています。
 *
 */
/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function oauthSignIn() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  var form = document.createElement("form");
  form.setAttribute("method", "GET"); // Send as a GET request.
  form.setAttribute("action", oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  var params = {
    client_id: clientID,
    redirect_uri: redirectURL,
    response_type: "token",
    scope: scope,
    include_granted_scopes: "true",
    state: "pass-through value",
  };

  // Add form parameters as hidden input values.
  for (var p in params) {
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
}

  
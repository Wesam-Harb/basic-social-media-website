const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postid");

load();

function load() {
  fetch(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    .then((res) => res.json())
    .then((res) => {
      console.log(res.data.comments);
      let data = res.data;
      let container = document.querySelector(".container");
      let avatar;
      let postImage;
      let edit;
      let comments = ``;
      let input;

      Object.keys(data.author.profile_image).length > 0
        ? (avatar = `<img loading="lazy" class="avatar" src="${data.author.profile_image}"/>`)
        : (avatar = `<i class="fa-solid fa-user avatar-Font-Icon"></i>`);

      Object.keys(data.image).length > 0
        ? (postImage = `<img class = "postImage" src = "${data.image}" />`)
        : (postImage = ``);

      data.author.name == document.querySelector(".loggedName").textContent
        ? (edit = `<button class="edit">edit</button><button class="delete">delete</button>`)
        : (edit = ``);

      let commentImage;
      for (let comment of res.data.comments) {
        Object.keys(comment.author.profile_image).length > 0
          ? (commentImage = `<img loading="lazy" class="avatar" src="${comment.author.profile_image}"/>`)
          : (commentImage = `<i class="fa-solid fa-user avatar-Font-Icon"></i>`);

        comments += `<li><div onclick = "userClicked(${comment.author.id})">${commentImage}
      <span>${comment.author.name}</span></div>
        <p>${comment.body}</p>
        </li>`;
      }

      if (localStorage.getItem("token"))
        input =
          '<div class="comment" style="display:flex"><input type = "text" placeholder="add your comment"/><button onclick="addComment()">Send</button></div>';
      else
        input =
          '<div class="comment" style="display:none"><input type = "text" placeholder="add your comment"/><button onclick="addComment()">Send</button></div>';

      container.innerHTML = `<div class="post" data-id=${data.id} >
            <nav><div onclick = "userClicked(${data.author.id})">${avatar}<h4>${data.author.name}</h4></div>
            <div>${edit}</div></nav>
            <div>
              <span class="date">${data.created_at}</span>
              ${postImage}
              <h4>${data.title}</h4>
              <p>${data.body}</p>
              <footer><span>(${data.comments_count}) Comments</span></footer>
              </div>
              ${input}
              <ul>${comments}</ul>
            </div>`;
    });
}

function userClicked(userid) {
  location.href = `profile.html?userid=${userid}`;
}

async function addComment() {
  let comment = document.querySelector(".comment input").value;
  console.log(comment);
  console.log(id);
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

  var formdata = new FormData();
  formdata.append("body", comment);
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  await new Promise((res) => {
    document.querySelector(".loader").style.display = "block";
    res();
  });

  let response = await fetch(
    `https://tarmeezacademy.com/api/v1/posts/${id}/comments`,
    requestOptions
  );
  let json = await response.json();
  console.log(json);
  await new Promise((res) => {
    if (response.ok) {
      document.querySelector(".message").textContent =
        "comment added successfuly";
    } else {
      document.querySelector(".message").textContent = json.message;
      document.querySelector(".message").style.backgroundColor = "#ebb3b1";
    }
    document.querySelector(".loader").style.display = "none";
    setTimeout(() => {
      document.querySelector(".blackCover").style.cssText +=
        "visibility:hidden;z-index:-1";
      document.body.style.overflow = "";
    }, 300);
    load();
    res();
  });

  await new Promise(() => {
    document.querySelector(".message").style.right = "5%";
    setTimeout(() => {
      document.querySelector(".message").style.right = "-50%";
    }, 3000);
  });
}

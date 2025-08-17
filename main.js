let container = document.querySelector(".container");
let limit = 1;
let id;

loadPosts();

async function loadPosts(pageLimit = 1) {
  let posts = await fetch(
    `https://tarmeezacademy.com/api/v1/posts?limit=4&page=${pageLimit}`
  ).then((response) => response.json());
  console.log(posts);
  for (data of posts.data) {
    let avatar;
    let postImage;
    let edit;
    Object.keys(data.author.profile_image).length > 0
      ? (avatar = `<img loading="lazy" class="avatar" src="${data.author.profile_image}"/>`)
      : (avatar = `<i class="fa-solid fa-user avatar-Font-Icon"></i>`);

    Object.keys(data.image).length > 0
      ? (postImage = `<img class = "postImage" src = "${data.image}" />`)
      : (postImage = ``);

    data.author.name == document.querySelector(".loggedName").textContent
      ? (edit = `<button class="edit">edit</button><button class="delete">delete</button>`)
      : (edit = ``);

    container.innerHTML += `<div class="post" data-id=${data.id} >
        <nav><div onclick = "userClicked(${data.author.id})">${avatar}<h4>${data.author.name}</h4></div>
        <div>${edit}</div></nav>
        <div onclick = "postClicked(${data.id})">
          <span class="date">${data.created_at}</span>
          ${postImage}
          <h4>${data.title}</h4>
          <p>${data.body}</p>
          <footer><span>(${data.comments_count}) Comments</span></footer>
          </div>
        </div>`;
  }

  //edit post
  document.querySelectorAll(".post .edit").forEach((el) => {
    el.addEventListener("click", () => {
      id = el.closest(".post").getAttribute("data-id");
      document.querySelector(".addPost h4").textContent = "Edit Post";
      document.querySelector(".addPost .edit").style.display = "block";
      document.querySelector(".addPost .create").style.display = "none";

      document.querySelector(".addPost").style.top = `50%`;
      document.querySelector(".blackCover").style.cssText +=
        "visibility:visible;z-index:2";
      document.body.style.overflow = "hidden";
    });
  });

  //delete post
  document.querySelectorAll(".post .delete").forEach((el) => {
    el.addEventListener("click", () => {
      id = el.closest(".post").getAttribute("data-id");
      deletePost(id);
    });
  });
}

//load posts on scrolling
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    limit = limit + 1;
    console.log(`limit : ${limit}`);
    loadPosts(limit);
  }
});

//create new post
document.querySelector(".addPost .create").addEventListener("click", newPost);

//show add form
document.querySelector(".add-post-button").addEventListener("click", () => {
  document.querySelector(".addPost h4").textContent = "Create New Post";
  document.querySelector(".addPost .edit").style.display = "none";
  document.querySelector(".addPost .create").style.display = "block";
  document.querySelector(".addPost").style.top = `50%`;
  document.querySelector(".blackCover").style.cssText +=
    "visibility:visible;z-index:2";
  document.body.style.overflow = "hidden";
});

async function newPost() {
  console.log("create");
  let title = document.querySelector(".addPost input[type=text]").value;
  let body = document.querySelector(".addPost textarea").value;
  let image = document.querySelector(".addPost input[type=file]").files[0];

  var formdata = new FormData();
  formdata.append("image", image);
  formdata.append("body", body);
  formdata.append("title", title);

  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

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
    "https://tarmeezacademy.com/api/v1/posts",
    requestOptions
  );

  fetchResponse(response, "post added successfuly");
}

async function editPost(id) {
  console.log("edit");
  let title = document.querySelector(".addPost input[type=text]").value;
  let body = document.querySelector(".addPost textarea").value;
  let image = document.querySelector(".addPost input[type=file]").files[0];

  var formdata = new FormData();
  formdata.append("image", image);
  formdata.append("body", body);
  formdata.append("title", title);
  formdata.append("_method", "PUT");

  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

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
    `https://tarmeezacademy.com/api/v1/posts/${id}`,
    requestOptions
  );

  fetchResponse(response, "post edited successfuly");
}

async function deletePost(id) {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

  var requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  await new Promise((res) => {
    document.querySelector(".blackCover").style.cssText +=
      "visibility:visible;z-index:2";
    document.querySelector(".loader").style.display = "block";
    res();
  });

  let response = await fetch(
    `https://tarmeezacademy.com/api/v1/posts/${id}`,
    requestOptions
  );

  fetchResponse(response, "post deleted successfully");
}

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("userid");

fetch(`https://tarmeezacademy.com/api/v1/users/${id}`)
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
    let avatar;
    Object.keys(res.data.profile_image).length > 0
      ? (avatar = `<div class="avatar" style="background-image:URL(${res.data.profile_image});"></div>`)
      : (avatar = `<i class="fa-solid fa-user avatar-Font-Icon"></i>`);

    document.querySelector(".info .userImage").innerHTML = avatar;
    document.querySelector(".info .email").textContent = res.data.email;
    document.querySelector(".info .name").textContent = res.data.name;
    document.querySelector(".info .posts").textContent =
      res.data.posts_count + " posts";
    document.querySelector(".info .comments").textContent =
      res.data.comments_count + " comments";
  });

fetch(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
    let container = document.querySelector(".container");
    let postImage;

    for (data of res.data) {
      Object.keys(data.image).length > 0
        ? (postImage = `<img class = "postImage" src = "${data.image}" />`)
        : (postImage = ``);
      console.log(data.image);
      container.innerHTML += `<div class="post" data-id=${data.id} onclick = "postClicked(${data.id})">
          <span class="date">${data.created_at}</span>
          ${postImage}
          <h4>${data.title}</h4>
          <p>${data.body}</p>
          <footer><span>(${data.comments_count}) Comments</span></footer>
        </div>`;
    }
  });

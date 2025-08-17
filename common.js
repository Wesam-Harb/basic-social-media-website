window.onload = function () {
  console.log(window.localStorage.getItem("token"));
  if (window.localStorage.getItem("token") != null) {
    let data = JSON.parse(window.localStorage.getItem("user"));
    change_UI(data);
  }
  if (!window.localStorage.getItem("theme"))
    localStorage.setItem("theme", "light");
  if (localStorage.getItem("theme") == "light") {
    document.querySelector(".theme").src = "icon-sun.svg";
    console.log(localStorage.getItem("theme"));
    changeTheme("dark");
  } else if (localStorage.getItem("theme") == "dark") {
    document.querySelector(".theme").src = "icon-moon.svg";
    console.log(localStorage.getItem("theme"));
    changeTheme("light");
  }
};

function userClicked(userid) {
  location.href = `profile.html?userid=${userid}`;
}

function postClicked(postid) {
  location.href = `postDetail.html?postid=${postid}`;
}

//show response message
async function fetchResponse(response, message) {
  console.log("fetch");
  let json = await response.json();
  await new Promise((res) => {
    if (response.ok) {
      document.querySelector(".message").textContent = message;
    } else {
      document.querySelector(".message").textContent = json.message;
      document.querySelector(".message").style.backgroundColor = "#ebb3b1";
    }
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".addPost").style.top = "-100%";
    setTimeout(() => {
      document.querySelector(".blackCover").style.cssText +=
        "visibility:hidden;z-index:-1";
      document.body.style.overflow = "";
    }, 300);

    // limit = 1;
    container.innerHTML = "";
    loadPosts();
    res();
  });
  await new Promise(() => {
    document.querySelector(".message").style.right = "5%";
    setTimeout(() => {
      document.querySelector(".message").style.right = "-200%";
    }, 3000);
  });
}

async function register() {
  const file = document.querySelector(".register .file").files[0];
  const name = document.querySelector(".register .name").value;
  const userName = document.querySelector(".register .userName").value;
  const password = document.querySelector(".register .password").value;

  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");

  var formdata = new FormData();
  formdata.append("username", userName);
  formdata.append("password", password);
  formdata.append("name", name);
  formdata.append("image", file);

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
    "https://tarmeezacademy.com/api/v1/register",
    requestOptions
  );
  console.log(response.ok);
  let json = await response.json();
  if (response.ok) {
    window.localStorage.setItem("token", json.token);
    window.localStorage.setItem("user", JSON.stringify(json.user));
    await new Promise(() => {
      change_UI(json.user);
    });
  } else {
    document.querySelector(".message").textContent = json.message;
    document.querySelector(".message").style.backgroundColor = "#ebb3b1";
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".login").style.top = "-100%";
    document.querySelector(".register").style.top = "-100%";
    document.querySelector(".blackCover").style.cssText +=
      "visibility: hidden;z-index:-1";
    document.body.style.overflow = "";
  }
  document.querySelector(".message").style.right = "5%";
  setTimeout(() => {
    document.querySelector(".message").style.right = "-50%";
  }, 3000);
}

async function logout() {
  const name = document.querySelector(".login .userName").value;
  const password = document.querySelector(".login .password").value;

  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

  var formdata = new FormData();
  formdata.append("username", name);
  formdata.append("password", password);

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

  await fetch("https://tarmeezacademy.com/api/v1/logout", requestOptions);

  await new Promise(() => {
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".login").style.top = "-100%";
    document.querySelector(".register").style.top = "-100%";
    document.querySelector(".blackCover").style.cssText +=
      "visibility: hidden;z-index:-1";
    document.body.style.overflow = "";
    document.querySelector("body > nav .avatar").style.display = "none";
    document.querySelector(".loginBtn").style.display = "block";
    document.querySelector(".registerBtn").style.display = "block";
    document.querySelector(".logoutBtn").style.display = "none";
        if (document.querySelector(".leftNav > div a:last-of-type"))
      document.querySelector(".leftNav > div a:last-of-type").style.display =
        "none";
    if (document.querySelector(".menu a:last-of-type"))
      document.querySelector(".menu a:last-of-type").style.display = "none";
    document.querySelector(".loggedName").textContent = "";
    if (document.querySelector(".comment") != null)
      document.querySelector(".comment").style.display = "none";
    if (document.querySelector(".add-post-button") != null)
      document.querySelector(".add-post-button").style.display = "none";
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
  });
}

async function login(name, password) {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");

  var formdata = new FormData();
  formdata.append("username", name);
  formdata.append("password", password);

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
    "https://tarmeezacademy.com/api/v1/login",
    requestOptions
  );
  let json = await response.json();

  //change UI to logged in status
  if (response.ok) {
    window.localStorage.setItem("token", json.token);
    window.localStorage.setItem("user", JSON.stringify(json.user));
    await new Promise(() => {
      change_UI(json.user);
    });
  } else {
    document.querySelector(".message").textContent = json.message;
    document.querySelector(".message").style.backgroundColor = "#ebb3b1";
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".login").style.top = "-100%";
    document.querySelector(".register").style.top = "-100%";
    document.querySelector(".blackCover").style.cssText +=
      "visibility: hidden;z-index:-1";
    document.body.style.overflow = "";
  }
  document.querySelector(".message").style.right = "5%";
  setTimeout(() => {
    document.querySelector(".message").style.right = "-50%";
  }, 3000);
}

document.querySelector(".reg").addEventListener("click", register);

document.querySelector(".logoutBtn").addEventListener("click", logout);

//login
document.querySelector(".log").addEventListener("click", () => {
  const name = document.querySelector(".login .userName").value;
  const password = document.querySelector(".login .password").value;
  login(name, password);
});

//close windows
document.addEventListener("click", (e) => {
  if (e.target.matches(".close") || e.target.matches(".blackCover")) {
    document.querySelector(".login").style.top = "-100%";
    document.querySelector(".register").style.top = "-100%";
    document.querySelector(".addPost").style.top = "-100%";
    setTimeout(() => {
      document.querySelector(".blackCover").style.cssText +=
        "visibility:hidden;z-index:-1";
      document.body.style.overflow = "";
    }, 300);
  }
  if (e.target.matches(".addPost .edit")) editPost(id);
});

function change_UI(json) {
  document.querySelector(".loader").style.display = "none";
  document.querySelector(".login").style.top = "-100%";
  document.querySelector(".register").style.top = "-100%";
  document.querySelector(".blackCover").style.cssText +=
    "visibility: hidden;z-index:-1";
  document.body.style.overflow = "";
  document.querySelector("body > nav .avatar").style.display = "block";
    console.log(json.profile_image);

  document.querySelector("body > nav .avatar").src = json.profile_image;
  if (document.querySelector(".leftNav > div a:last-of-type"))
    document.querySelector(".leftNav > div a:last-of-type").style.display =
      "inline";
  if (document.querySelector(".leftNav > div a:last-of-type"))
    document.querySelector(
      ".leftNav > div a:last-of-type"
    ).href = `profile.html?userid=${json.id}`;
  if (document.querySelector(".bottomMenu a:last-of-type"))
    document.querySelector(
      ".bottomMenu a:last-of-type"
    ).href = `profile.html?userid=${json.id}`;
  document.querySelector(".loggedName").textContent = json.name;
  document.querySelector(".loginBtn").style.display = "none";
  document.querySelector(".registerBtn").style.display = "none";
  document.querySelector(".logoutBtn").style.display = "block";
  if (document.querySelector(".comment") != null)
    document.querySelector(".comment").style.display = "flex";
  if (document.querySelector(".add-post-button") != null)
    document.querySelector(".add-post-button").style.display = "inline-flex";
}

//show login window
document.querySelector(".loginBtn").addEventListener("click", () => {
  document.querySelector(".login").style.top = `50%`;
  document.querySelector(".blackCover").style.cssText +=
    "visibility:visible;z-index:2";
  document.body.style.overflow = "hidden";
});

//show register window
document.querySelector(".registerBtn").addEventListener("click", () => {
  document.querySelector(".register").style.top = `50%`;

  document.querySelector(".blackCover").style.cssText +=
    "visibility:visible;z-index:2";
  document.body.style.overflow = "hidden";
});

//change theme
function changeTheme(theme = localStorage.getItem("theme")) {
  if (theme == "light") {
    document.documentElement.style.setProperty("--body_theme", "#121212");
    document.documentElement.style.setProperty("--rest_theme", "black");
    document.documentElement.style.setProperty("--font_color", "white");
    document.querySelector(".theme").src = "icon-moon.svg";
    localStorage.setItem("theme", "dark");
  } else if (theme == "dark") {
    document.documentElement.style.setProperty("--body_theme", "aliceblue");
    document.documentElement.style.setProperty("--rest_theme", "white");
    document.documentElement.style.setProperty("--font_color", "black");
    document.querySelector(".theme").src = "icon-sun.svg";
    localStorage.setItem("theme", "light");
  }
}

if (window.innerWidth < 650) {
  let bottomMenu = document.querySelector(".bottomMenu");
  let links = document.querySelector(".leftNav > div");
  bottomMenu.append(links);
  document.querySelectorAll("nav ul li").forEach((el) => {
    bottomMenu.append(el);
  });
}

function showMenu() {
  document.querySelector(".menu").classList.toggle("clicked");
  if (document.querySelector(".menu").classList.contains("clicked")) {
    document.querySelector("nav").style.height = "70px";
    document.body.offsetHeight;
    document.querySelector("nav").style.height = "250px";
    document.querySelector(".bottomMenu").style.bottom = "5%";
  } else {
    document.querySelector("nav").style.height = "250px";
    document.body.offsetHeight;
    document.querySelector("nav").style.height = "70px";
    document.querySelector(".bottomMenu").style.bottom = "-250%";
  }
}





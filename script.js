// --- Post storage and rendering helpers ---
function getStoredPosts() {
    return JSON.parse(localStorage.getItem('posts') || '[]');
  }
  function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
  }
  
  
  
  // Static list of items
  const redemptionTokens = [
    {
      code: "DRYFT1",
      name: "Blossom Park Token",
      redeemImage: "images/FIXEDParkgif.gif",
    },
    {
      code: "DRYFT2",
      name: "Sushi Haven Token",
      redeemImage: "images/FIXEDSushigif.gif",
    },
    {
      code: "DRYFT3",
      name: "Morning Roast Token",
      redeemImage: "images/FIXEDCoffeegif.gif",
    },
  ];
  
  // Elements for redemption
  const redeemButton = document.getElementById("redeem-button");
  const codeInput = document.getElementById("redemption-code");
  const errorMessage = document.getElementById("redemption-message");
  const tokenDetails = document.getElementById("token-info");
  const tokenName = document.getElementById("token-name");
  const tokenDescription = document.getElementById("token-description");
  const tokenImage = document.getElementById("token-image");
  const addToCollectionButton = document.getElementById("addToCollectionButton");
  
  // Handle redemption button click
  redeemButton.addEventListener("click", function () {
    const code = codeInput.value.trim().toUpperCase();
    const redemptionItem = redemptionTokens.find((item) => item.code === code);
  
    if (redemptionItem) {
      // Show token details
      tokenName.textContent = redemptionItem.name;
      tokenDescription.textContent = redemptionItem.description;
      tokenImage.src = redemptionItem.redeemImage;
      tokenDetails.style.display = "block";
      errorMessage.textContent = ""; // Clear error message
  
      // Hide the redemption form
      document.querySelector(".redemption-form").style.display = "none";
    } else {
      // Show error message if code is not found
      tokenDetails.style.display = "none";
      errorMessage.textContent = "Code not found!";
    }
  });
  
  // Add to collection button click handler
  addToCollectionButton.addEventListener("click", function () {
    alert(`You have added the ${tokenName.textContent} to your collection!`);
  });
  
  // Show a given page by ID, hide others
  const PROFILE_KEY_NAME = 'profile_name';
  const PROFILE_KEY_USERNAME = 'profile_username';
  const PROFILE_KEY_BIO = 'profile_bio';
  const PROFILE_KEY_PIC = 'profile_pic';
  
  function getStoredProfile() {
    return {
      name: localStorage.getItem(PROFILE_KEY_NAME) || '',
      username: localStorage.getItem(PROFILE_KEY_USERNAME) || '',
      bio: localStorage.getItem(PROFILE_KEY_BIO) || '',
      pic: localStorage.getItem(PROFILE_KEY_PIC) || 'images/profile.jpg',
    };
  }
  
  function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll(".page").forEach((page) => {
      page.classList.remove("active-page");
    });
    // Show the requested page
    document.getElementById(pageId).classList.add("active-page");
  
    // Hide or show the nav bar based on page
    const navBar = document.getElementById("globalNavBar");
    if (pageId === "landing" || pageId === "login" || pageId === "signup") {
      navBar.style.display = "none";
    } else {
      navBar.style.display = "flex";
    }
    if (pageId === "profile") {
      const profile = getStoredProfile();
      document.querySelector('#profile .username').innerText =
        profile.username ? '@' + profile.username : '@user';
      document.querySelector('#profile #bio').innerText = profile.bio;
      document.querySelector('#profile .profile-pic').src = profile.pic;
  
          
      // Populate gallery with this user's posts
      const galleryGrid = document.querySelector('#profile .gallery-grid');
      if (galleryGrid) {
        galleryGrid.innerHTML = '';
        const allPosts = getStoredPosts();
        const userKey = profile.username || 'user';
        const userPosts = allPosts.filter(p => p.username === userKey);
        userPosts.forEach(post => {
          const box = document.createElement('div');
          box.className = 'gallery-box';
          const imgEl = document.createElement('img');
          imgEl.src = post.image;
          imgEl.alt = 'Gallery Image';
          imgEl.className = 'gallery-image';
          galleryGrid.appendChild(imgEl);
          box.appendChild(imgEl);
          galleryGrid.appendChild(box);
        });
      }
    }
    if (pageId === "redemption") {
      tokenDetails.style.display = "none";
      errorMessage.textContent = "";
      codeInput.value = "";
      document.querySelector(".redemption-form").style.display = "block";
    }
    if (pageId === 'feed') {
      renderPosts();
    }
  }
  
  // Initialize with landing page
  document.addEventListener("DOMContentLoaded", () => {
    showPage("landing");
  });
  
  // Function to go back to the previous page
  function goBack() {
    // Hide token info details when going back
    tokenDetails.style.display = "none";
    const pages = [
      "landing",
      "login",
      "signup",
      "home",
      "feed",
      "map",
      "profile",
      "tokens",
    ];
    const currentPage = document.querySelector(".active-page").id;
  
    // Determine the previous page based on the current page
    let previousPage = "landing"; // Default fallback
    switch (currentPage) {
      case "login":
      case "signup":
        previousPage = "landing";
        break;
      case "home":
        previousPage = "landing";
        break;
      case "feed":
      case "map":
      case "profile":
      case "tokens":
      case "starOfTheWeek":
        previousPage = "home";
        break;
      case "settings":
        previousPage = "profile";
        break;
      case "editProfile":
      case "favorites":
      case "friends":
      case "contactUs":
        previousPage = "settings";
        break;
      case "scanToken":
        previousPage = "tokens";
        break;
      case "redemption":
        previousPage = "scanToken";
        break;
    }
  
    showPage(previousPage);
  }
  
  document.querySelectorAll(".account-button").forEach((button) => {
    button.addEventListener("click", function () {
      document
        .querySelectorAll(".account-button")
        .forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });
  
  // script.js like button
  function toggleLike(button) {
    const heartIcon = button.querySelector("i");
    const likeCount = button.querySelector(".like-count");
  
    if (heartIcon.classList.contains("far")) {
      heartIcon.classList.remove("far");
      heartIcon.classList.add("fas");
      likeCount.textContent = parseInt(likeCount.textContent) + 1;
      button.classList.add("liked");
    } else {
      heartIcon.classList.remove("fas");
      heartIcon.classList.add("far");
      likeCount.textContent = parseInt(likeCount.textContent) - 1;
      button.classList.remove("liked");
    }
  }
  
  function logOut() {
    showPage("landing"); // Redirect to the landing page
  }
  
  // Submit Contact Form
  function submitContactForm() {
    const fullName = document.querySelector(
      '#contactUs input[placeholder="Full Name"]'
    ).value;
    const email = document.querySelector(
      '#contactUs input[placeholder="Email Address"]'
    ).value;
    const subject = document.querySelector(
      '#contactUs input[placeholder="Subject"]'
    ).value;
    const message = document.querySelector("#contactUs .message-input").value;
  
    if (!fullName || !email || !subject || !message) {
      alert("Please fill out all fields.");
      return;
    }
  
    console.log("Form Submitted:", { fullName, email, subject, message });
    alert("Thank you for contacting us! We will get back to you soon.");
  
    // Clear the form
    document.querySelector('#contactUs input[placeholder="Full Name"]').value =
      "";
    document.querySelector(
      '#contactUs input[placeholder="Email Address"]'
    ).value = "";
    document.querySelector('#contactUs input[placeholder="Subject"]').value = "";
    document.querySelector("#contactUs .message-input").value = "";
  
    showPage("home");
  }
  
  // Toggle Follow button text
  function toggleFollow() {
    const btn = document.getElementById("follow-button");
    if (btn.innerText === "Follow") {
      btn.innerText = "Unfollow";
    } else {
      btn.innerText = "Follow";
    }
  }
  
  // Save Edit Profile changes
  function saveProfileChanges() {
    const name = document.getElementById('full-name').value.trim();
    const username = document.getElementById('username').value.trim();
    const bio = document.getElementById('edit-bio').value.trim();
    // Persist
    localStorage.setItem(PROFILE_KEY_NAME, name);
    localStorage.setItem(PROFILE_KEY_USERNAME, username);
    localStorage.setItem(PROFILE_KEY_BIO, bio);
    alert('Profile updated!');
    showPage('profile');
  }
  
  function handleProfilePicUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target.result;
      // Update every image with class "profile-pic"
      document.querySelectorAll('.profile-pic').forEach(img => {
        img.src = dataUrl;
      });
      // Save for next time
      localStorage.setItem('profile_pic', dataUrl);
    };
    reader.readAsDataURL(file);
  }
  
  // Authentication Functions
  
  // Login User: Collects credentials, sends them to the server, and handles response.
  async function loginUser() {
    // Grab login inputs from the #login page.
    const inputs = document.querySelectorAll("#login .auth-input");
    const email = inputs[0] ? inputs[0].value.trim().toLowerCase() : "";
    const password = inputs[1] ? inputs[1].value : "";
  
    if (!email || !password) {
      alert("Please enter both your email and password.");
      return;
    }
  
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Save token and current user's email to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUserEmail", email);
        alert("Login successful!");
        showPage("home");
      } else {
        alert(data.error || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    }
  }
  
  // Register User: Collects new user details and sends them to the server.
  async function registerUser() {
    // Grab signup inputs from the #signup page.
    // Expected order: Full Name, EMAIL, USERNAME, PASSWORD.
    const inputs = document.querySelectorAll("#signup .auth-input");
    const fullName = inputs[0] ? inputs[0].value.trim() : "";
    const email = inputs[1] ? inputs[1].value.trim().toLowerCase() : "";
    // We'll ignore the USERNAME field in this implementation.
    const password = inputs[3] ? inputs[3].value : "";
  
    if (!fullName || !email || !password) {
      alert("Please fill out all required fields.");
      return;
    }
  
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password, preferences: "" }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration successful! Please log in.");
        // Create a default profile for this user using a unique key.
        const userProfile = {
          name: fullName,
          email: email,
          bio: "",
          profilePic: "", // Blank initially
          followers: 0,
          following: 0,
        };
        localStorage.setItem("userProfile_" + email, JSON.stringify(userProfile));
        // Optionally, set the current user's email so that subsequent logins use this profile.
        localStorage.setItem("currentUserEmail", email);
        showPage("login");
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  }
  
  // Profile Functions
  
  // Load user profile data from localStorage and update the Profile and Edit Profile pages.
  async function loadUserProfile() {
    try {
      const userProfile = getStoredProfile();
      // Update the profile picture in all elements with class "profile-pic"
      const profilePicSrc =
        userProfile.pic || "images/placeholder-profile.png";
      document.querySelectorAll(".profile-pic").forEach((img) => {
        img.src = profilePicSrc;
      });
      // Update the Profile page fields
      const profilePage = document.querySelector("#profile");
      if (profilePage) {
        // Display the username. If no username exists, fall back to name.
        profilePage.querySelector(".username").innerText =
          userProfile.username || userProfile.name || "";
        profilePage.querySelector(".tokens-count").innerText =
          userProfile.followers;
        profilePage.querySelector(".ranking-number").innerText =
          userProfile.following;
          profilePage.querySelector("#bio").innerText = 
          userProfile.bio || "";
      }
      // Update the Edit Profile form fields
      if (document.getElementById("full-name"))
        document.getElementById("full-name").value = userProfile.name || "";
      if (document.getElementById("username"))
        document.getElementById("username").value = userProfile.username || "";
      if (document.getElementById("edit-bio"))
        document.getElementById("edit-bio").value = userProfile.bio || "";
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  }
  
  document.querySelectorAll(".account-button").forEach((button) => {
    button.addEventListener("click", function () {
      document
        .querySelectorAll(".account-button")
        .forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });
  
  // Save updated profile data from the Edit Profile page into localStorage.
  function saveUserProfile() {
    const currentUserEmail = localStorage.getItem("currentUserEmail");
    if (!currentUserEmail) {
      alert("No user is logged in!");
      return;
    }
  
    const name = document.getElementById("full-name").value;
    const email = document.getElementById("email").value;
    const bio = document.getElementById("edit-bio").value;
    const profileKey = "userProfile_" + currentUserEmail;
  
    // Retrieve existing profile to preserve profilePic, followers, and following.
    let existingProfile = localStorage.getItem(profileKey);
    let profilePic = "";
    let followers = 0,
      following = 0;
    if (existingProfile) {
      const parsedProfile = JSON.parse(existingProfile);
      profilePic = parsedProfile.profilePic || "";
      followers = parsedProfile.followers || 0;
      following = parsedProfile.following || 0;
    }
  
    const userProfile = {
      name: name,
      email: email,
      bio: bio,
      profilePic: profilePic,
      followers: followers,
      following: following,
    };
  
    localStorage.setItem(profileKey, JSON.stringify(userProfile));
    alert("Profile saved!");
    showPage("profile");
    loadUserProfile();
  }
  
  //Make a Post 
  function renderPosts() {
    const feedContent = document.querySelector('#feed .feed-content');
    if (!feedContent) return;
    feedContent.innerHTML = '';  // clear out old
  
    // Use current profile picture for all posts
    const profilePicUrl = localStorage.getItem('profile_pic') || 'images/profile.jpg';
  
    // newest first
    getStoredPosts().forEach((post, idx) => {
      const card = document.createElement('div');
      card.className = 'post-card';
      card.innerHTML = `
        <div class="post-header">
          <img src="${profilePicUrl}" class="user-avatar" alt="${post.username}" />
          <span class="username">${post.username}</span>
        </div>
        <div class="post-image">
          <img src="${post.image}" alt="Post Image" />
        </div>
        <div class="post-actions">
          <button class="like-button" onclick="toggleLike(this)">
            <i class="far fa-heart"></i>
            <span class="like-count">0</span>
          </button>
        </div>
        
        <!-- Add this delete icon overlay -->
        <button class="delete-button-overlay" onclick="deletePost(${idx})">
          <i class="fas fa-trash"></i>
        </button>
        <div class="post-caption">
          <strong>${post.username}</strong> ${post.content}
        </div>
      `;
      feedContent.appendChild(card);
    });
  }
  
  function submitPost() {
    const content = document.getElementById('postContent').value.trim();
    const fileInput = document.getElementById('postImage');
    const file = fileInput.files[0];
  
    if (!content && !file) {
      alert('Please add a caption or image.');
      return;
    }
  
    // pull username from wherever you stored it (e.g. profile_username)
    const username = localStorage.getItem('profile_username') || 'user';
  
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const imageData = e.target.result;
        const posts = getStoredPosts();
        posts.unshift({ username, content, image: imageData });
        savePosts(posts);
  
        // reset form
        document.getElementById('postContent').value = '';
        fileInput.value = '';
  
        // go to feed (which will call renderPosts)
        showPage('feed');
      };
      reader.readAsDataURL(file);
    } else {
      const posts = getStoredPosts();
      posts.unshift({ username, content, image: 'images/default-post.jpg' });
      savePosts(posts);
  
      document.getElementById('postContent').value = '';
  
      showPage('feed');
    }
  }
  
  // Delete a post by index and refresh feed/profile
  function deletePost(index) {
    const posts = getStoredPosts();
    posts.splice(index, 1);
    savePosts(posts);
    // Re-render feed
    renderPosts();
    // If profile page is active, update its gallery
    if (document.getElementById('profile').classList.contains('active-page')) {
      showPage('profile');
    }
  }
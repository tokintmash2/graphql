import { fetchChartData, fetchUserProfile } from "./js/js.js";

document.getElementById("logoutButton").addEventListener("click", LogOutProfile);

document
  .getElementById("loginForm")
  
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the form from submitting the default way

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("https://01.kood.tech/api/auth/signin", {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(username + ":" + password),
        },
      });

      if (response.ok) {
        const data = await response.json();

        console.log("Response data received:", !!data);
        console.log("JWT property exists:", !!data.jwt);

        // localStorage.setItem("jwt", data.jwt);
        const token = data;
        // console.log("Token:", token);
        localStorage.setItem("jwt", token);

        // const token = localStorage.getItem("jwt");
        console.log(
          "Token exists and starts with:",
          token?.substring(0, 10) + "..."
        );

        console.log(
          "Token stored successfully:",
          !!localStorage.getItem("jwt")
        );

        alert("Login successful!");

        fetchUserProfile();
        fetchChartData();

        // Redirect or load a new page
        // window.location.href = 'profile.html'; // Change to your profile page
      } else {
        document.getElementById("errorMessage").style.display = "block";
      }
    } catch (error) {
      console.error("Error during login:", error);
      document.getElementById("errorMessage").style.display = "block";
    }
  });

  export function LogOutProfile() {
    window.location.href = './index.html';
    localStorage.removeItem('jwt');
}

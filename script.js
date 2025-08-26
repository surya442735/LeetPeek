/// leetmetric logic starts---->
document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("LM-search");
  const usernameInput = document.getElementById("LM-username");
  const easyLabel = document.getElementById("easy-label");
  const easyCircle = document.querySelector(".easy-circle");
  const mediumLabel = document.getElementById("medium-label");
  const mediumCircle = document.querySelector(".medium-circle");
  const hardLabel = document.getElementById("hard-label");
  const hardCircle = document.querySelector(".hard-circle");
  const statsContainer = document.querySelector(".stats");

  function validateUsername(name) {
    if (name.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    const regrex = /^[a-zA-Z0-9_]{3,16}$/;
    const isMatching = regrex.test(name);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }
  async function fetchUserDetails(name) {
    // const url="https://leetcode.com/graphql/";
    try {
      searchButton.textContent = "searching...";
      searchButton.disabled = true;
      // const res=await fetch(url);
      const targeturl =
        "https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql/";
      const myheader = new Headers();
      myheader.append("content-type", "application/json");
      const graphql = JSON.stringify({
        query:
          "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
        variables: { username: `${name}` },
      });
      const requestOptions = {
        method: "POST",
        headers: myheader,
        body: graphql,
        redirect: "follow",
      };

      const res = await fetch(targeturl, requestOptions);

      if (!res.ok) {
        throw new Error("Unable to get details");
      }
      const parseddata = await res.json();
      console.log("DATA:", parseddata);
      showDetails(parseddata);
    } catch (err) {
      statsContainer.innerHTML = `<p>No Data found</p>`;
      console.log("ERROR", err);
    } finally {
      searchButton.textContent = "search";
      searchButton.disabled = false;
    }
  }
  function Updatecircle(solved, total, label, circle) {
    progPercentage = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progPercentage}%`);
    label.textContent = `${solved} / ${total}`;
  }
  function showDetails(parseddata) {
    const totalques = parseddata.data.allQuestionsCount[0].count;
    const totalEasyques = parseddata.data.allQuestionsCount[1].count;
    const totalMediumques = parseddata.data.allQuestionsCount[2].count;
    const totalHardques = parseddata.data.allQuestionsCount[3].count;

    const totalsolved =
      parseddata.data.matchedUser.submitStats.acSubmissionNum[0].count;
    const totalEasysolved =
      parseddata.data.matchedUser.submitStats.acSubmissionNum[1].count;
    const totalMediumsolved =
      parseddata.data.matchedUser.submitStats.acSubmissionNum[2].count;
    const totalHardsolved =
      parseddata.data.matchedUser.submitStats.acSubmissionNum[3].count;

    Updatecircle(totalEasysolved, totalEasyques, easyLabel, easyCircle);
    Updatecircle(totalMediumsolved, totalMediumques, mediumLabel, mediumCircle);
    Updatecircle(totalHardsolved, totalHardques, hardLabel, hardCircle);
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
    console.log(username);
  });
});
//<---leetmetric ends

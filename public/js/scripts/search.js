import {  ajax } from "/services/ajax.js";

var userNames =[]
var allUsers = {}
ajax.postData("../user/getusers" , {}).then(data =>{
    data.users.forEach(user=>{
        userNames.push(user.Usernaem)
        allUsers[user.Usernaem] = user.ID
})
})


let suggestionSystem = {
  searchInput: document.querySelector(".search>input"),
  autocompleteList: document.querySelector(".search-modal>ul"),
  suggestions: userNames,

  displaySuggestions(suggestions) {
    this.autocompleteList.innerHTML = "";
    suggestions.forEach((suggestion) => {
      const listItem = document.createElement("li");
      listItem.classList.add("autocomplete-item");
      listItem.textContent = suggestion;

      listItem.addEventListener("click", () => {
        this.searchInput.value = suggestion;
        
        this.searchInput.focus();
        document.querySelector(".search-modal").style.display = "none";
      });

      this.autocompleteList.appendChild(listItem);
    });

    document.querySelector(".search-modal").style.display = "block";
  },

  sugest(ev) {
    
    document.querySelector(".search-modal").style.display = "block";

    const searchTerm = ev.target.value.trim().toLowerCase();
    let suggestions = this.suggestions;
    if (searchTerm === "") {
     document.querySelector(".search-modal").style.display = "none";
      return;
    }

    const startsWithLetter = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().startsWith(searchTerm)
    );

    const containsLetter = suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(searchTerm) &&
        !startsWithLetter.includes(suggestion)
    );

    const filteredSuggestions = startsWithLetter.concat(containsLetter);

    this.displaySuggestions(filteredSuggestions);
  },

  autocomplete(ev) {
    let recs = this.autocompleteList.querySelector("li");
    if (recs == null) {
      return;
    }
    this.searchInput.value = recs.innerHTML;
    document.querySelector(".search-modal").style.display = "none";

    searchInput.focus();
  },
  
};

suggestionSystem.searchInput.addEventListener("input", (ev) =>
  suggestionSystem.sugest(ev)
);

document.addEventListener("keydown", async function (event) {
    if (event.key == "Tab") {
      event.preventDefault();
      suggestionSystem.autocomplete(event)
    }
  })

document.querySelector(".searchForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    var userID = allUsers[document.querySelector(".search>input").value]
    if(userID == undefined){
        alert('userName not found')
    }
    window.location.replace(`../user/userprofile?id=${userID}`)
   
})
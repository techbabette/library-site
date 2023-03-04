var mainPage;
var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
var favoritesOnly = false;
const JSONPATH = "assets/"
let books = new Array();
let sortOptions = ["Najpopularnije","Najmanje popularno","Po nazivu (od a)","Po nazivu (od z)", "Najnovije", "Najstarije"];
let currentSort = sanitizeForIdentifier(sortOptions[0]);
let searchBoxes = new Array(
   {"title" : "Kategorije", "prop" : "category", "complex" : true, "holder" : "categoryHolder"},
   {"title" : "Autori", "prop" : "author", "complex" : true, "holder" : "authorHolder"},
   {"title" : "Godine", "prop" : "releaseDate", "complex" : false, "holder" : "yearHolder"});
let currentPage = 1;
let perPage = 4;
window.onload = function(){
  mainPage = sPage == "index.html" || sPage.length == 0 ? true : false;
  callback("navbar.json", generateNavBar, ["#actual-navbar"]);
  callback("footer.json", generateFooter, ["icon-holder"])
  callback("books.json", initializeBooks);
  window.onscroll = function(){
      let upButton = $("#goBackUp");
      if ($(window).scrollTop()>300){
         upButton.removeClass("invisible");
      } 
      else{
         upButton.addClass("invisible");
      }
   }
   let upButton = $("#goBackUp");
   upButton.click(function(event){
      event.preventDefault();
      $(window).scrollTop(0);
   })
   //If currently on index page
if(sPage === "index.html" || sPage.length === 0){

}
if(sPage === "knjiga.html"){
   $('#openModal').click(function(event) {
      event.preventDefault();
      $("#myModal").show("fast")
   });; 
   $('.mk-close').click(function(event){
      event.preventDefault();
      $("#myModal").hide("fast")
   }) 
   $(window).click(function(event){
      if (event.target === $('#myModal')[0])
      $("#myModal").hide("fast")
   })
   $(".mk-send").click(function(event){
      event.preventDefault();
      checkForm();
   })
   let deliveryRadios = $("input[name='delivery']");
   deliveryRadios[0].addEventListener("click",function(){addressRequired(true)});
   deliveryRadios[1].addEventListener("click",function(){addressRequired(false)});
   let reName = /^[A-ZŠĆČĐŽ][a-zšđčćž]{2,13}(\s[A-ZŽŠĆČĐ][a-zžšđčć]{2,13}){0,3}$/
   let firstName = document.querySelector("#firstName")
   let lastName = document.querySelector("#lastName")
   let address = document.querySelector("#address")
   let reserveDate = document.querySelector("#reserveStart");
   let length = document.querySelector("#length");
   let radioSelected;
   for(let radio of deliveryRadios){
      if(radio.checked){
         radioSelected = radio.value;
         break;
      }
   }
   addressBool = radioSelected>0? true:false;
   addressRequired(addressBool);
   firstName.addEventListener("blur", function(){checkFormRegex(firstName, reName,"Ime sme da sadrži samo slova i ne sme biti prazno");})
   lastName.addEventListener("blur", function(){checkFormRegex(lastName, reName,"Prezime sme da sadrži samo slova i ne sme biti prazno");})
   address.addEventListener("blur", checkAddress);
   reserveDate.addEventListener('blur', checkDate);
   length.addEventListener('blur', checkLength);
}
}
//Funkcija .zoom plugina se vidi samo u globalnom scopu iz nekog razloga
if(sPage === "knjiga.html"){
   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   const urlBook = urlParams.get('knjiga')
   if(urlBook != undefined)
   {
      zoomOnHover("#bookImage", urlBook.toLowerCase());
   }
}
function book(name, category, author, description, copies, releaseDate){
   var name, category, author;
   this.name = name;
   this.category = category;
   this.author = author;
   this.description = description;
   this.copies = copies;
   this.releaseDate = releaseDate;
}

function saveToLocalStorage(value, args){
   localStorage.setItem(args[0], JSON.stringify(value));
}

function getFromLocalStorage(args){
  return JSON.parse(localStorage.getItem(args[0]));
}

function callback(file, handler, args = [], asynchronicity = true){
   let request = createRequest();
   request.onreadystatechange = function(){
      if(request.readyState == 4){
         if(request.status >= 200 && request.status < 300){
            if(args == []){
               handler(JSON.parse(this.responseText));
            }
            else{
               handler(JSON.parse(this.responseText), args);
            }
         }
         else if(request.status >= 400 && request.status < 600){
           let errorModal = $("#errorModal");
            errorModal.show("fast");
         }
      }
   }
   request.open("GET", `${mainPage? "" : "../"}${JSONPATH+file}`, asynchronicity)
   request.send();
}

function createRequest(){
   let request = false;
   try{
      request = new XMLHttpRequest();
   }
   catch(windows){
      try{
         request = new ActiveXObject("Msxml2.XMLHTTP");
      }
      catch(otherWindows){
         try{
            request = new ActiveXObject("Microsoft.XMLHTTP");
         }
         catch{
            console.log("Ajax nije podrzan");
         }
      }
   }
   return request;
}

function zoomOnHover(zoomElement, zoomImg)
{
   $(zoomElement)
   .wrap('<span class="zoom-span"></span>')
   .css('display', 'block')
   .parent()
   .zoom({
     url: `../imgs/${zoomImg}.jpg`
   })
}
function limitToFullWords(text, length){
   let textSplit = text.split(" ");
   text = "";
   for(let word of textSplit){
      if(word.length + text.length <= length) text += word + ' ';
      else{
         text = text.trim() + '...';
         break;
      }
   }
   return text;
}
function negativeToBCE(year){
   return Math.abs(year) + (year < 0 ? ". P.N.E." : ".")
}
function fillColumns(elementList, columns, numberOfColumns){
   for(let column of columns){
      column.innerHTML = "";
   }
   for(let element in elementList){
      columns[element % numberOfColumns].innerHTML += elementList[element];
   }
}

function fillBooks(elementList, holder){
   holder.innerHTML = "";
   for(let element of elementList){
      $(element).hide();
      holder.append(element)
   }
   for(let element of elementList){
      $(element).slideDown(200);
   }
   let newElementList = document.getElementsByClassName("mk-favorite-icon-holder")
   for(let element of newElementList){
      if(element.hasAttribute('listener')) continue;
      element.addEventListener("click", function(event){
         event.preventDefault();
         eventAddToFavorite(element);
         if(favoritesOnly){
            loadMore(false);
         }
      });
      element.setAttribute('listener', true);
   }
}

function eventAddToFavorite(element){
   addToFavorite(element);
   displayNumberOFavorites(['favoriti', '#Favoriti'])
}

function displayNumberOFavorites(args){
   let element = document.querySelector(args[1]);
   element.innerHTML = `Favoriti: ${getNumberOfFavorites()}`
   function getNumberOfFavorites(){
      let arrayFromLocalStorage = getFromLocalStorage([args[0]]);
      if(arrayFromLocalStorage == null){
         return 0
      }
      return arrayFromLocalStorage.length;
   }
}

function addToFavorite(element){
   let idOfBookFavorited = element.dataset.id;
   //Kod za vizuelni prikaz promene na već prikazanim knjigama
   let allLoadedBookElements = document.getElementsByClassName("mk-favorite-icon-holder");
   for(let iconHolder of allLoadedBookElements){
      if(iconHolder.dataset.id == idOfBookFavorited){
         var iconElement = iconHolder.firstElementChild;
         if(iconElement.dataset.icon == "mdi:cards-heart-outline"){
            iconElement.dataset.icon = "mdi:cards-heart";
            element.setAttribute('favorite', true);
            continue;
         }
            iconElement.dataset.icon = "mdi:cards-heart-outline"
            element.setAttribute('favorite', false);
      }
   }
   //Kod za dodavanje u local storage
   addToLocalStorage(["favoriti", idOfBookFavorited, false, true]);
}

function generateUrl(object, redirect = ""){
   let url = "";
   if(object["primary"]){
      url += mainPage? '' : '../';
   }
   else{
      url += mainPage? `${redirect}` : '';
   }
   url += object["url"];
   return url;
}

function generateNavBar(objects, args){
   let htmlContent = "";
   let holderElement = document.querySelector(args[0]);
   let active;
   let url;
   let id;
   for(object in objects){
      active = false;
      url = generateUrl(objects[object], 'pages/');
      id = objects[object]["text"].replaceAll(" ", "_");
      if(objects[object]["url"] == sPage) active = true;
      if(object === "0"){
         htmlContent += 
         `<a class="navbar-brand" id=${id} href="${url}"><h1 class="h4">${objects[object]["text"]}</h1></a>
         <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
         </button><div class="collapse navbar-collapse" id="navbarSupportedContent"><ul class="navbar-nav ms-auto mb-2 mb-lg-0">`
      }
      else if(object == objects.length - 1){
         htmlContent += 
         `<li class="nav-item">
         <a class="nav-link ${active ? "active" : ""}" id=${id} href="${url}">
            ${objects[object]["text"]}
         </a>
         </li></ul></div>`
      }
      else{
         htmlContent += 
         `<li class="nav-item">
         <a class="nav-link ${active ? "active" : ""}" id=${id} href="${url}">
            ${objects[object]["text"]}
         </a>
         </li>`
      }
   }
   holderElement.innerHTML = htmlContent;
   displayNumberOFavorites(['favoriti', '#Favoriti']);
}
function generateFooter(objects, args){
   let columns = document.getElementsByClassName(args[0]);
   let elementList = new Array();
   for(let i = 0; i < objects.length; i++){
   elementList.push(
      `<a class="text-light" href="${generateUrl(objects[i])}" ><span class="iconify" id="${objects[i]["name"]}-icon" data-icon="${objects[i]["icon"]}"></span></a>`)
   };
   fillColumns(elementList, columns, 4);
}
function generateBooks(args){
   let elementList = new Array();
   let returnCode = false;
   let filteredBooks = args[0];
   let columns = args[1];
   let paginate = args[2];
   let searchable = args[3];
   if(favoritesOnly){
      favorites = getFromLocalStorage(['favoriti']);
      if(favorites != null){
         filteredBooks = filteredBooks.filter(b => favorites.includes(b.id));
      }
      else{
         displayNoBooksFitYourParamaters([columns, "Nemate sacuvanu ni jednu knjigu"]);
         return true;
      }
   }
   if(searchable){
      let numberOfSearchFactors = 0;
      let activeSearches = new Array();
      let textSearch = document.querySelector("#textSearch");
      let textToSearch 
      if(textSearch != null){
         textToSearch = textSearch.value.toLowerCase();      
      }
      for(let search of searchBoxes){
         search.active = false;
         let categorySearchBoxes = document.getElementsByName(search.title);
         let acceptedCategories = new Array();
         for(let catBox of categorySearchBoxes){
            if(catBox.checked){
               acceptedCategories.push(parseInt(catBox.value));
               search.active = true;
            }
         }
         if(search.active) {
            activeSearches.push(search);
            numberOfSearchFactors++;
         }
         if(acceptedCategories.length > 0){
            if(search.complex){
               filteredBooks = filteredBooks.filter(b => acceptedCategories.some(c => b[search.prop].id == c))
            }
            else{
               filteredBooks = filteredBooks.filter(b => acceptedCategories.some(c => b[search.prop] == c));
            }
            for(let searchY of searchBoxes){
               if(search.active == true){
                  if(searchY.title != search.title){
                     let properties = getPropertiesFromBooks([searchY.prop, searchY.complex, filteredBooks]);
                     let propertyHolder = document.getElementById(searchY.holder);
                     showCategories([propertyHolder, properties, searchY.title]);
                  }
               }
            }
         }
         saveValueOfFilter([search.title]);
      }
      if(textToSearch){
         numberOfSearchFactors++;
         filteredBooks = filteredBooks.filter(b => b.name.toLowerCase().includes(textToSearch));
      }

      if(numberOfSearchFactors < 2){
         generateAllFilters([activeSearches, books]);
      }
      if(numberOfSearchFactors >= 2 || textToSearch){
         generateAllFilters([searchBoxes, filteredBooks]);
      }
      if(numberOfSearchFactors == 0){
         generateAllFilters([searchBoxes, books]);
      }

      if(filteredBooks.length < 1){
         displayNoBooksFitYourParamaters([columns, "Ni jedna knjiga ne odgovara pretrazi"]);
         if(paginate){
            fillPageButtons(0, searchable);
         };
         return;
      }
   }
   filteredBooks = sort([filteredBooks, currentSort]);
   numberOfPages = Math.ceil(filteredBooks.length / perPage);
   if(numberOfPages == 1) currentPage = 1;
   for(let booksLoaded = (currentPage - 1) * perPage; booksLoaded<currentPage*perPage;booksLoaded++){
      if(booksLoaded>=filteredBooks.length){returnCode = true; break;}
      if(booksLoaded== filteredBooks.length - 1){returnCode = true;}
      let currentBook = filteredBooks[booksLoaded];
      elementList.push(bookToElement(currentBook));
   }
   fillBooks(elementList, columns);
   if(paginate){
         fillPageButtons(numberOfPages, searchable);
   }
   return returnCode;
}

function generateAllFilters(args){
   let searchBoxes = args[0];
   let filteredBooks = args[1];
   for(let searchY of searchBoxes){
      let properties = getPropertiesFromBooks([searchY.prop, searchY.complex, filteredBooks]);
      let propertyHolder = document.getElementById(searchY.holder);
      showCategories([propertyHolder, properties, searchY.title]);
}
}

function fillPageButtons(numberOfPages, searchable){
   let holder = document.querySelector("#loadMore");
   holder.innerHTML = "";
   if(numberOfPages < 2){
      return;
   }
   for(let i = 1; i <= numberOfPages; i++){
      let pageButton = document.createElement("a");
      pageButton.dataset.page = i;
      pageButton.innerText = i;
      pageButton.href = "#";
      pageButton.addEventListener("click", function(event){
         event.preventDefault();
         currentPage = this.dataset.page;
         loadMore(searchable);
      })
      if(pageButton.dataset.page == currentPage) pageButton.classList.add("active");
      holder.appendChild(pageButton);
   }
}

function displayNoBooksFitYourParamaters(args){
   args[0].innerHTML = `<p>${args[1]}</p>`;
}

function setLinkValue(selector,filter, href, text)
{
   document.querySelector(selector).setAttribute("href",`knjige.html?${filter}=${href}`);
   document.querySelector(selector).innerText = text;
}
function loadMore(searchable = true){
   let holder = document.querySelector("#event-div")
   generateBooks([books, holder, true, searchable]);
}
let addressBool;
function addressRequired(req){
   let address = document.querySelector("#addDesc");
   let addressInput = document.querySelector("#address")
   addressBool = req;
   if(req){
      address.innerHTML = `Adresa (ulica i broj)<span class="mk-red">*</span>`;
      addressInput.setAttribute("required", "required");
      addressInput.removeAttribute("disabled")
      addressInput.setAttribute("placeholder", "Kralja Aleksandra 13");
      addressInput.classList.remove("success");
   }
   else{
      address.innerHTML = `Adresa (ulica i broj)`;
      removeError(addressInput);
      addressInput.setAttribute("disabled", "disabled");
      addressInput.value = "";
      addressInput.removeAttribute("required");
      addressInput.removeAttribute("placeholder");
   }
}
function checkForm(){
   let success = 0;
   let deliveryRadios = document.getElementsByName("delivery");;
   let firstName = document.querySelector("#firstName");
   let lastName = document.querySelector("#lastName");
   let radioSelected;
   let reName = /^[A-ZŠĆČĐŽ][a-zšđčćž]{2,13}(\s[A-ZŽŠĆČĐ][a-zžšđčć]{2,13}){0,3}$/
   for(let radio of deliveryRadios){
      if(radio.checked){
         radioSelected = radio.value;
         break;
      }
   }
   if(typeof radioSelected !== 'undefined'){
      addressBool = radioSelected>0? true:false;
   }
   else success-=1;
   if(firstName.value == ""){displayError(firstName, "Ime ne sme biti prazno")
   success--};
   if(lastName.value == ""){displayError(lastName, "Prezime ne sme biti prazno")
   success--};
   if(radioSelected == null){
      let errorHolder = deliveryRadios[0].parentNode.parentNode.lastElementChild;
      errorHolder.innerText = 'Morate odabrati način preuzimanja'
      errorHolder.removeAttribute("hidden");
      success -= 1;
   }
   else{
      let errorHolder = deliveryRadios[0].parentNode.parentNode.lastElementChild;
      errorHolder.setAttribute("hidden", "hidden");
   }
   success += checkFormRegex(firstName, reName,"Ime sme da sadrži samo slova i ne sme biti prazno");
   success += checkFormRegex(lastName, reName,"Prezime sme da sadrži samo slova i ne sme biti prazno");
   success += checkAddress();
   success += checkDate();
   success += checkLength();
   if(success == 0){
      showSuccess();
   }
   else{
      hideSuccess();
   }
}
function showSuccess(){
   let element = document.querySelector("#successAlert");
   element.innerText = "Uspešno ste rezervisali knjigu";
   show(element);
}
function hideSuccess(){
   let element = document.querySelector("#successAlert");
   hide(element);
}
function checkLength(){
   let reserveLength = document.querySelector("#length");
   if(reserveLength.value == ""){
      displayError(reserveLength,"Morate odabrati trajanje rezervacije [1-40]");
      return -1;
   }
   if(reserveLength.value < 0 || reserveLength.value > 40){
      displayError(reserveLength,"Broj dana trajanja rezervacije može biti od 1 do 40");
      return -1;
   }
   removeError(reserveLength);
   return 0;
}
function checkAddress(){
   let reAddress = /^(([A-ZŠĐČĆŽ][a-zščćđž\d]+)|([0-9][1-9]*\.?))(\s[A-Za-zŠĐŽĆČščćđž\d]+){0,7}\s(([1-9][0-9]{0,5}[\/-]?[A-Z])|([1-9][0-9]{0,5})|(BB))\.?$/
   let address = document.querySelector("#address");
   if(addressBool){
      if(address.value === ""){
         displayError(address,"Adresa ne sme biti prazna za preuzimanje dostavom");
         return -1;
      }
      else{
         return checkFormRegex(address, reAddress, "Adresa ne odgovara formatu, primer: 'Kralja Aleksandra 13'");
      }
   }
   return 0;
}
function checkDate(){
   if(reserveStart.value === ""){
      displayError(reserveStart, "Morate odabrati datum početka rezerve");
      return -1;
   }
   let inputDate = new Date(reserveStart.value);
   let currentDate = new Date()
   if(inputDate < currentDate){
      displayError(reserveStart, "Rezerva ne može početi pre sutradašnjeg dana")
      return -1;
   }
   else{
      removeError(reserveStart);
      return 0;
   }
}
function displayError(element, message){
   let errorHolder = element.nextElementSibling;
   element.classList.add("failure");
   element.classList.remove("success");
   errorHolder.innerText = message;
   show(errorHolder)
}
function removeError(element){
   let errorHolder = element.nextElementSibling;
   element.classList.remove("failure");
   element.classList.add("success");
   hide(errorHolder);
}
function show(element){
   if(element.classList.contains("hidden")) element.classList.remove("hidden");
}
function hide(element){
   element.classList.add("hidden");
}
function checkFormRegex(element, test, message){
   if(test.test(element.value)){
      removeError(element);
      return 0;
   }
   else{
      displayError(element, message);
      return -1;
   }
}
function countTo(element, from, to, timeToLoad){
   let interval = timeToLoad/Math.abs(to - from);
   let step = to > from ? 1 : -1;
   if(from === to){
       element.textContent = from;
       return;
   }
   let counter = setInterval(function(){
       from += step;
       element.textContent = from;
       if(from == to){
           clearInterval(counter);
       }
   }, interval);
}
function bookToElement(currentBook){
   let bookDescription = currentBook.description;
   let wrapper = document.createElement("div");
   let href = `${mainPage ? "pages/" : ""}knjiga.html?knjiga=${currentBook.name}`;
   let favorites = getFromLocalStorage(['favoriti']);
   let favorite = false;
   if(favorites != null){
      favorite = favorites.includes(currentBook.id);
   }
   let imgPart;
   wrapper.classList.add("flex", "col-12", "col-md-6", "col-lg-3", "justify-content-center")
   wrapper.href = `knjiga.html?knjiga=${currentBook.name}`
   if (currentBook.description.length > 30){
      bookDescription = limitToFullWords(currentBook.description, 30);
   }
   imgPart = `
   <div class="position-relative">
   <a href=${href}><img src="${mainPage ? "" : "../"}imgs/${currentBook.name.toLowerCase()}.jpg" alt="${currentBook.name.replaceAll('_', ' ')}" class="card-img-top book-prev img-fluid" alt="..."></a>
   <a href="#" data-id="${currentBook.id}" class="mk-favorite-icon-holder">
   <span class="iconify mk-favorite-icon" data-icon="${favorite ? "mdi:cards-heart" : "mdi:cards-heart-outline"}">Heart</span>
   </a>`
   wrapper.innerHTML = `
   <div class="card book mk-card-limit">
   ${imgPart}
   <div class="card-body book-body">
         <a href="${href}"> <h5 class="card-title book-title">${currentBook.name.replaceAll("_", " ")}</h5> </a>
         <p class="card-text book-desc"><em>${bookDescription}</em></p>
         <p class="card-text mk-light-yellow">
         <a href="${mainPage ? "pages/" : ""}knjige.html?kategorija=${currentBook.category.name}"> ${currentBook.category.name.replaceAll("_", " ")} </a>
         </p>
         <p class="card-text">
         <a href="${mainPage ? "pages/" : ""}knjige.html?autor=${currentBook.author.name}">${currentBook.author.name.replaceAll("_", " ")}</a>
         </p>
   </div>
   </div>
   `
   return wrapper;
}
let bookId = 0;
function moveBooks(books, holder, direction){
   holder.innerHTML = '';
   let elementList = new Array()
   if(direction === 1){
      bookId++;
      for(let i = 0; i<4; i++){
         elementList.push(bookToElement(books[(i+bookId)%books.length]));
      }
   }
   if(direction === -1){
      bookId--;
      if(bookId < 0)bookId = books.length - 1;
      for(let i = 0; i<4; i++){
         elementList.push(bookToElement(books[(i+bookId)%books.length]));
      }
   }
   fillBooks(elementList, holder);
}
//Used for getting categories, authors and years
function getPropertiesFromBooks(args){
   let uniqueProperties = new Array();
   let saughtProperty = args[0];
   let complex = args[1];
   let booksToSearch = args[2];
   let propertyOfBook;
   if(complex){
      for(let b of booksToSearch){
         if(uniqueProperties.some(cat => cat.id == b[saughtProperty].id)){
            propertyOfBook = uniqueProperties.filter(c => c.id == b[saughtProperty].id)[0];
            propertyOfBook.count += 1;
         }
         else{
            b[saughtProperty].count = 1;
            uniqueProperties.push(b[saughtProperty]);
         }
      }
   }
   else{
      for(let b of booksToSearch){
         if(uniqueProperties.some(cat => cat.name == b[saughtProperty])){
            propertyOfBook = uniqueProperties.filter(c => c.name == b[saughtProperty])[0];
            propertyOfBook.count += 1;
         }
         else{
            uniqueProperties.push({"name" : b[saughtProperty], "count" : 1});
         }
      }
   }
   uniqueProperties = uniqueProperties.sort((a,b) => 
   {
      return b.count-a.count;
   })
   return uniqueProperties;
}

function showSortOptions(args){
   let resultHolder = args[0];
   resultHolder.innerHTML = "";
   let active;
   for(let opt of args[1]){
      let li = document.createElement("li");
      let dataName = sanitizeForIdentifier(opt)
      active = dataName == currentSort;
      li.innerHTML = `
      <div class="d-flex flex-row justify-content-between dropdown-item">
      <a id="${dataName}" class="w-100 ${active ? "active" : ""}" data-sort="${dataName}" href="#">${opt}</a>
      </div>
      `
      resultHolder.appendChild(li);
      document.querySelector(`#${dataName}`).addEventListener("click", function(){
         currentSort = this.dataset.sort;
         currentPage = 1;
         showSortOptions([sortHolder, sortOptions]);
         saveValueOfSort(["sacuvanSort"]);
         loadMore();
      })
   }
}

function sanitizeForIdentifier(string){
   let replaceRegex = new RegExp(/[()]/, "g");
   string = string.replaceAll(" ", "_").replaceAll(replaceRegex, "");
   return string
}

function sort(args){
   let booksToSort = args[0];
   let sortType = args[1];
   if(sortType == sanitizeForIdentifier(sortOptions[0])){
      return sortBooksByPopularity([booksToSort, ["desc"]]);
   }
   if(sortType == sanitizeForIdentifier(sortOptions[1])){
      return sortBooksByPopularity([booksToSort, ["asc"]]);
   }
   if(sortType == sanitizeForIdentifier(sortOptions[2])){
      return booksToSort.sort((a,b) => 
         a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      )
   }
   if(sortType == sanitizeForIdentifier(sortOptions[3])){
      return booksToSort.sort((b,a) =>          
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      )
   }
   if(sortType == sanitizeForIdentifier(sortOptions[4])){
      return booksToSort.sort((a,b) => {
         return b.releaseDate - a.releaseDate;
      })
   }
   if(sortType == sanitizeForIdentifier(sortOptions[5])){
      return booksToSort.sort((a,b) => {
         return a.releaseDate - b.releaseDate;
      })
   }
   return booksToSort;
}

function showCategories(args){
   let resultHolder = args[0];
   let storeName = args[2];
   let currentlySelected = getFromLocalStorage([storeName]);
   tempHolder = document.createDocumentFragment();
   for(let cat of args[1]){
      let checked;
      let value = cat.id ? cat.id : cat.name;
      if(currentlySelected != null){
         if(currentlySelected.includes(value)) {
            currentPage = 1;
            checked = true
         };
      }
      let li = document.createElement("li")
      li.innerHTML += `
      <div class="d-flex flex-row justify-content-between dropdown-item">
      <label class="form-check-label text-wrap" for="s${cat.name}">${String(cat.name).replaceAll("_", " ")} (${cat.count})</label>
      <input class="form-check-input float-right" type="checkbox" ${checked? "checked='checked'" : ""} id="s${cat.name}" name="${args[2]}" value="${value}"/>
      </div>`
      tempHolder.appendChild(li);
   }
   resultHolder.innerHTML = "";
   resultHolder.appendChild(tempHolder);
   for(let elem of resultHolder.children){
      elem = elem.firstElementChild.lastElementChild;
      elem.addEventListener("change", function(){
         currentPage = 1;
         saveValueOfFilter([storeName]);
         loadMore();
      });
   }
}

function saveValueOfSort(args){
   let storeName = args[0];
   localStorage.removeItem(storeName);
   addToLocalStorage([storeName, currentSort, true, false]);
}

function saveValueOfFilter(args){
   let storeName = args[0];
   let elems = document.getElementsByName(storeName);
   localStorage.removeItem(storeName);
   let exists = false;
   for(let elem of elems){
      if(elem.checked){
         addToLocalStorage([storeName, elem.value, true, true]);
         exists = true;
      }
   }
   if(!exists){
      localStorage.removeItem(storeName);
   }
}

function addToLocalStorage(args){
   let storeName = args[0];
   let value = args[1];
   let alreadyFiltered = args[2];
   let numeric = args[3];
   let arrayFromLocalStorage = getFromLocalStorage([storeName]);
   if(numeric) value = parseInt(value);
   if(alreadyFiltered){
      addAlreadyFiltered();
   }
   else{
      addIfNotThereElseRemove();
   }
   //Removes items if clicked twice
   function addIfNotThereElseRemove(){
      if(arrayFromLocalStorage == null){
         let arrayOfFavorites = new Array();
         arrayOfFavorites.push(value);
         saveToLocalStorage(arrayOfFavorites, [storeName]);
         return;
      }
      if(arrayFromLocalStorage.includes(value)){
         arrayFromLocalStorage = arrayFromLocalStorage.filter(x => x != value);
         if(arrayFromLocalStorage.length == 0){
            localStorage.removeItem(storeName);
            return;
         }
         saveToLocalStorage(arrayFromLocalStorage, [storeName]);
         return;
      }
      arrayFromLocalStorage.push(value);
      saveToLocalStorage(arrayFromLocalStorage, [storeName]);
      return;
   }
   //Doesn't remove items, doesn't add copies
   function addAlreadyFiltered(){
      if(arrayFromLocalStorage == null){
         let arrayOfFavorites = new Array();
         arrayOfFavorites.push(value);
         saveToLocalStorage(arrayOfFavorites, [storeName]);
         return;
      }
      if(arrayFromLocalStorage.includes(value)){;
         return;
      }
      arrayFromLocalStorage.push(value);
      saveToLocalStorage(arrayFromLocalStorage, [storeName]);
      return;
   }
   
}

function initializeBooks(data){
   books = data;
   popularBooks = sortBooksByPopularity([books, "desc"]);
   if(mainPage){
      let timeToLoad = 2500;
      $("#moveLeftButton").click(function(event){
         event.preventDefault(); 
         moveBooks(popularBooks, popularHolder, -1);
      });
      $("#moveRightButton").click(function(event){
         event.preventDefault();
         moveBooks(popularBooks, popularHolder, 1);
      })
      let popularHolder = document.querySelector("#pop")
      generateBooks([popularBooks, popularHolder, false, false]);
      recentHolder = document.querySelector("#rec")
      let copyOfBooks = [...books];
      sortedByDate = books.sort(function(a ,b){
         if(a.releaseDate > b.releaseDate){
            return -1
         }
         else if (a.releaseDate < b.releaseDate){
            return 1;
         }
         else return 0;
      })
      books = copyOfBooks;
      let numberOfLentBooks = 0;
      books.forEach(el => numberOfLentBooks += el.timeLoaned);
      generateBooks([sortedByDate, recentHolder, false, false]);
      countTo(document.querySelector("#titNum"), 0, books.length, timeToLoad);
      countTo(document.querySelector("#memNum"), 0, 75, timeToLoad);
      countTo(document.querySelector("#yrNum"), 0, new Date().getFullYear() - 1930, timeToLoad);
      countTo(document.querySelector("#leNum"), 0, numberOfLentBooks, timeToLoad);
      countTo(document.querySelector("#leNum"), numberOfLentBooks, 1000, 7000000);
   }
   if(sPage == "knjige.html"){
      let localSort = getFromLocalStorage(["sacuvanSort"]);
      if(localSort) {
         currentSort = localSort[0];
      };
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      let resetFilterButton = document.querySelector("#resetFilterButton");
      resetFilterButton.addEventListener("click", function () {
         currentPage = 1;
         clearAllFilters();
         loadMore();
      });
      let textSearch = document.querySelector("#textSearch");
      let savedTextSearch = localStorage.getItem("savedText");
      if(savedTextSearch){
         textSearch.text = savedTextSearch;
      }
      let sortHolder = document.querySelector("#sortHolder");
      textSearch.addEventListener("input", function(){
         currentPage = 1;
         if(textSearch.value.length > 0){
            localStorage.setItem("savedText", textSearch.value);
         }
         else{
            localStorage.removeItem("savedText");
         }
         loadMore();
      })
      showSortOptions([sortHolder, sortOptions])
      let urlFilter = false;
      //If the category paramater is set, filter the books by category, else show all books
      if(urlParams.has('kategorija')){
         urlFilter = true;
         let kategorija = urlParams.get('kategorija')
         clearAllFilters();
         automaticallyCheckValue(["Kategorije", kategorija]);
         loadMore();
         return;
      }
      if(urlParams.has('autor')){
         urlFilter = true;
         let autor = urlParams.get('autor');
         clearAllFilters();
         automaticallyCheckValue(["Autori", autor])
         loadMore();
         return;
      }
      if(urlParams.has('godina')){
         urlFilter = true;
         let year = urlParams.get('godina');
         clearAllFilters();
         automaticallyCheckValue(["Godine", year]);
         loadMore();
         return;
      }
      if(!urlFilter){
         generateAllFilters([searchBoxes, books]);
         loadMore();
      }
      function clearAllFilters(){
         for(let sb of searchBoxes){
            localStorage.removeItem(sb.title);
         }
         localStorage.removeItem("savedText");
         generateAllFilters([searchBoxes, books]);
      }
   }
   if(sPage == "knjiga.html"){
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const urlBook = urlParams.get('knjiga')
      let currentBook = books.filter(book => book.name === urlBook)[0] 
      if(!currentBook)window.location.href = "https://techbabette.github.io/library-site/pages/knjige.html";
      document.querySelector("#bookImage").src=`../imgs/${currentBook.name.toLowerCase()}.jpg`
      document.title = currentBook.name.replaceAll("_", " ");
      document.querySelector("#book-title").innerHTML = currentBook.name.replaceAll("_", " ");
      document.querySelector('#book-description').innerHTML = currentBook.description;
      var iconHolder = document.querySelector(".mk-favorite-icon-holder");
      iconHolder.dataset.id = currentBook.id;
      iconHolder.addEventListener("click", function(event){
         event.preventDefault();
         eventAddToFavorite(iconHolder);
      });
      var favorite;
      var favorites = getFromLocalStorage(["favoriti"]);
      if(favorites != null){
         favorite = favorites.includes(currentBook.id);
      }
      document.querySelector(".mk-favorite-icon").dataset.icon = favorite ? "mdi:cards-heart" : "mdi:cards-heart-outline";
      setLinkValue("#author-link","autor", currentBook.author.name, currentBook.author.name.replaceAll("_", " "));
      setLinkValue("#category-link","kategorija", currentBook.category.name, currentBook.category.name.replaceAll("_", " "))
      setLinkValue("#date-link","godina", currentBook.releaseDate, negativeToBCE(currentBook.releaseDate));
      document.querySelector("#availability-field").innerHTML = "Broj kopija: " +currentBook.copies;
      let relatedHolder = document.querySelector("#relatedBooks");
      relatedHolder.style.visibility = currentBook.relatedBooks.length > 0;
      let relatedBookHolder = document.querySelector("#event-div");
      document.querySelector("#loaned-field").innerText = `Pozajmljena ${currentBook.timeLoaned} ${currentBook.timeLoaned != 1 ? "puta" : "put"}`
      if(currentBook.relatedBooks.length > 0){
         let bookList = findBooksFromId([currentBook.relatedBooks]);
         generateBooks([bookList, relatedBookHolder, false, false]);
      }
      else{
         relatedHolder.classList.add("hidden");
      }
   }
   if(sPage == "favoriti.html"){
      favoritesOnly = true;
      loadMore(false);
   }
}

function automaticallyCheckValue(args){
   let search = args[0];
   let value = args[1];
   let elements = document.getElementsByName(search)
   for(let ele of elements){
      if(ele.id.toLowerCase() == "s" + value.toLowerCase()){
         ele.checked = true;
         return;
      }
   }
}

function findBooksFromId(args){
   let arrayOfIds = args[0];
   let bookList = new Array();
   bookList = books.filter(b => arrayOfIds.includes(b.id));
   return bookList;
}

function sortBooksByPopularity(args){
   let arrayOfBooks = args[0];
   let direction = args[1];
   let helperVariable = -1;
   if (direction == "asc") helperVariable = 1;
   let booksToReturn = arrayOfBooks.sort((a,b) => {
      return (a.timeLoaned - b.timeLoaned) * helperVariable;
   })
   return booksToReturn;
}
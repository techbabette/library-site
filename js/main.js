var mainPage;
var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
const JSONPATH = "assets/"
window.onload = function(){
  console.log(sPage);
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
if(sPage === "knjige.html"){
   //Prepare the books to be displayed
   const loadMoreButton = $("#loadMore");
   loadMoreButton.click(function(event){
      event.preventDefault();
      loadMore();
   })
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

function callback(file, handler, args = [], asynchronicity = true){
   let request = createRequest();
   request.onreadystatechange = function(){
      if(request.readyState == 4){
         if(args == []){
            handler(JSON.parse(this.responseText));
         }
         else{
            handler(JSON.parse(this.responseText), args);
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
   for(let element of elementList){
      $(element).hide();
      holder.append(element)
   }
   for(let element of elementList){
      $(element).fadeIn(1000);
   }
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
   for(object in objects){
      active = false;
      url = generateUrl(objects[object], 'pages/');
      if(objects[object]["url"] == sPage) active = true;
      if(object === "0"){
         htmlContent += 
         `<a class="navbar-brand" href="${url}"><h1 class="h4">${objects[object]["tekst"]}</h1></a>
         <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
         </button><div class="collapse navbar-collapse" id="navbarSupportedContent"><ul class="navbar-nav ms-auto mb-2 mb-lg-0">`
      }
      else if(object == objects.length - 1){
         htmlContent += 
         `<li class="nav-item">
         <a class="nav-link ${active ? "active" : ""}" href="${url}">
            ${objects[object]["tekst"]}
         </a>
         </li></ul></div>`
      }
      else{
         htmlContent += 
         `<li class="nav-item">
         <a class="nav-link ${active ? "active" : ""}" href="${url}">
            ${objects[object]["tekst"]}
         </a>
         </li>`
      }
   }
   holderElement.innerHTML = htmlContent;
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
let booksLoaded = 0;
function generateBooks(columns){
   let elementList = new Array();
   let startingId = booksLoaded;
   let increment = 4;
   let returnCode = false;
   for(booksLoaded; booksLoaded<startingId+increment;booksLoaded++){
      if(booksLoaded>=books.length){returnCode = true; break;}
      if(booksLoaded== books.length - 1){returnCode = true;}
      let currentBook = books[booksLoaded];
      elementList.push(bookToElement(currentBook));
   }
   fillBooks(elementList, columns);
   return returnCode;
}
function setLinkValue(selector,filter, href, text)
{
   document.querySelector(selector).setAttribute("href",`knjige.html?${filter}=${href}`);
   document.querySelector(selector).innerText = text;
}
function loadMore(){
   let holder = document.querySelector("#event-div")
   let button = document.querySelector("#loadMore")
   if(generateBooks(holder)){
      hide(button);
   }
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
   let wrapper = document.createElement("a");
   let imgPart;
   wrapper.classList.add("flex", "col-12", "col-md-6", "col-lg-3", "justify-content-center")
   wrapper.href = `knjiga.html?knjiga=${currentBook.name}`
   if (currentBook.description.length > 30){
      bookDescription = limitToFullWords(currentBook.description, 30);
   }
   if(!mainPage){
      wrapper.href = `knjiga.html?knjiga=${currentBook.name}`
      imgPart = `<img src="../imgs/${currentBook.name.toLowerCase()}.jpg" alt="${currentBook.name.replaceAll('_', ' ')}" class="card-img-top book-prev" alt="...">`
   }
   else{
      wrapper.href = `pages/knjiga.html?knjiga=${currentBook.name}`
      imgPart = `<img src="imgs/${currentBook.name.toLowerCase()}.jpg" alt="${currentBook.name.replaceAll('_', ' ')}" class="card-img-top book-prev" alt="...">`
   };
   wrapper.innerHTML = `
   <div class="card book mk-card-limit">
   ${imgPart}
   <div class="card-body book-body">
         <h5 class="card-title book-height book-title">${currentBook.name.replaceAll("_", " ")}</h5>
         <p class="card-text book-height"><em>${bookDescription}</em></p>
         <p class="card-text mk-light-yellow">${currentBook.category.replaceAll("_", " ")}</p>
         <p class="card-text">${currentBook.author.replaceAll("_", " ")}</p>
   </div>
   </div>
   `
   return wrapper;
}
let bookId = 0;
function moveBooks(holder, direction){
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

function initializeBooks(data){
   books = data;
   if(mainPage){
      let timeToLoad = 2500;
      $("#moveLeftButton").click(function(event){
         event.preventDefault(); 
         moveBooks(popularHolder, -1);
      });
      $("#moveRightButton").click(function(event){
         event.preventDefault();
         moveBooks(popularHolder, 1);
      })
      let popularHolder = document.querySelector("#pop")
      generateBooks(popularHolder);
      recentHolder = document.querySelector("#rec")
      let copyOfBooks = new Array(...books);
      books = books.sort(function(a ,b){
         if(a.releaseDate > b.releaseDate){
            return -1
         }
         else if (a.releaseDate < b.releaseDate){
            return 1;
         }
         else return 0;
      })
      generateBooks(recentHolder);
      countTo(document.querySelector("#titNum"), 0, books.length, timeToLoad);
      countTo(document.querySelector("#memNum"), 0, 75, timeToLoad);
      countTo(document.querySelector("#yrNum"), 0, new Date().getFullYear() - 1930, timeToLoad);
      countTo(document.querySelector("#leNum"), 0, 131, timeToLoad);
      countTo(document.querySelector("#leNum"), 131, 1000, 7000000);
      books = copyOfBooks;
   }
   if(sPage == "knjige.html"){
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      //If the category paramater is set, filter the books by category, else show all books
      if(urlParams.has('kategorija')){
         let kategorija = urlParams.get('kategorija')
         document.title = kategorija.replaceAll("_", " ");
         books = books.filter(book => book.category.toLowerCase() == kategorija.toLowerCase());
         document.getElementById('mk-book-category').innerHTML = kategorija.replaceAll("_"," ") ;
      }
      if(urlParams.has('autor')){
         let autor = urlParams.get('autor');
         document.title = autor.replaceAll("_", " ");
         books = books.filter(book => book.author.toLowerCase() == autor.toLowerCase());
         document.getElementById('mk-book-category').innerHTML = autor.replaceAll("_"," ") ;
      }
      if(urlParams.has('godina')){
         let year = urlParams.get('godina');
         document.title = "Knjige iz " + negativeToBCE(year) + ". godine";
         books = books.filter(book => book.releaseDate === parseInt(year));
         document.getElementById('mk-book-category').innerHTML = "Knjige iz " + negativeToBCE(year) + " godine";
      }
      loadMore();
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
      setLinkValue("#author-link","autor", currentBook.author, currentBook.author.replaceAll("_", " "));
      setLinkValue("#category-link","kategorija", currentBook.category, currentBook.category.replaceAll("_", " "))
      setLinkValue("#date-link","godina", currentBook.releaseDate, negativeToBCE(currentBook.releaseDate));
      document.querySelector("#availability-field").innerHTML = "Broj kopija: " +currentBook.copies;
   }
}
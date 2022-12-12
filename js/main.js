var prefix = "";
var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
window.onload = function(){
   var categories = ['Jezici', 'Popularna_nauka', 'Popularna_psihologija', 'Istorijska_dela'];
   if(sPage === "index.html" || sPage.length === 0) prefix = "pages/";
   var holder = document.querySelector('.dropdown-menu');
   let element =`<li><a class="dropdown-item" href="${prefix}knjige.html">Sve</a></li>`;
   holder.innerHTML += element;
   for(category of categories){
   let element =`<li><a class="dropdown-item" href="${prefix}knjige.html?kategorija=${category}">${category.replace("_", " ")}</a></li>`;
   holder.innerHTML += element;
   }
   generateFooter();
   if(sPage === knjiga.html){
      
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
   for(let element in elementList){
      columns[element % numberOfColumns].innerHTML += elementList[element];
   }
}
function generateFooter(){
   let links = new Array('https://www.facebook.com/','https://www.twitter.com/','#', 'sitemap.xml');
   let names = new Array('facebook', 'twitter', 'fa-light', 'sitemap');
   let icons = new Array('icomoon-free:facebook', 'la:twitter', 'fa-file', 'bx:sitemap')
   let columns = document.getElementsByClassName("icon-holder");
   let elementList = new Array();
   for(let i = 0; i < links.length; i++){
   elementList.push(
      `<a class="text-light" href="${links[i]}" ><span class="iconify" id="${names[i]}-icon" data-icon="${icons[i]}"></span></a>`)
   };
   fillColumns(elementList, columns, 4);
}
function getRandomInt(max){
   return Math.floor(Math.random() * max);
}
let addressBool;
function addressRequired(req){
   let address = document.querySelector("#addDesc");
   let addressInput = document.querySelector("#address")
   addressBool = req;
   if(req){
      address.innerHTML = `Adresa (ulica i broj)<span class="mk-red">*</span>`;
      addressInput.setAttribute("required", "required");
      addressInput.removeAttribute("disabled");
      addressInput.classList.remove("success");
   }
   else{
      address.innerHTML = `Adresa (ulica i broj)`;
      removeError(addressInput);
      addressInput.setAttribute("disabled", "disabled");
      addressInput.value = "";
      addressInput.removeAttribute("required");
   }
}
function checkForm(){
   let success = 0;
   let deliveryRadios = document.getElementsByName("delivery");;
   let firstName = document.querySelector("#firstName");
   let lastName = document.querySelector("#lastName");
   let radioSelected;

   for(let radio of deliveryRadios){
      if(radio.checked){
         radioSelected = radio.value;
         break;
      }
   }
   addressBool = radioSelected>0? true:false;
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
      console.log(radioSelected);
      let errorHolder = deliveryRadios[0].parentNode.parentNode.lastElementChild;
      errorHolder.setAttribute("hidden", "hidden");
   }
   success += checkAddress();
   success += checkDate();
   success += checkLength();
   console.log(success);
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
   element.removeAttribute("hidden");
}
function hideSuccess(){
   let element = document.querySelector("#successAlert");
   element.setAttribute("hidden", "hidden");
}
function checkLength(){
   let reserveLength = document.querySelector("#length");
   console.log(reserveLength.value);
   if(reserveLength.value == ""){
      displayError(reserveLength,"Morate odabrati trajanje rezervacije [1-40]");
      return -1;
   }
   if(reserveLength.value < 0 || reserveLength.value > 40){
      displayError(reserveLength,"Broj ne pripada opsegu od 1 do 40");
      return -1;
   }
   removeError(reserveLength);
   return 0;
}
function checkAddress(){
   let reAddress = /^(([A-ZŠĐČĆŽ][\wŠĐŽĆČščćđž\d\.\-]+)|([\d]+\.?))(\s[\wŠĐŽĆČščćđž\d\.\-]+){0,7}\s(([\d]{1,5}((\/(([\d]{1,5}[\w]?)|([\w]{1,2}))))?)|((BB)|(bb)))(\.)?$/
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
      displayError(reserveStart, "Datum rezerve ne može biti u prošlosti")
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
   errorHolder.removeAttribute("hidden");
}
function removeError(element){
   let errorHolder = element.nextElementSibling;
   errorHolder.setAttribute("hidden", "hidden");
   element.classList.remove("failure");
   element.classList.add("success");
}
function checkFormRegex(element, test, message){
   let errorHolder = element.nextElementSibling;
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
function bookToElement(currentBook, prefix, size){
   let bookDescription = currentBook.description;
   if (currentBook.description.length > 30){
      bookDescription = limitToFullWords(currentBook.description, 30);
   }
   if(prefix == undefined){
      return(`
      <a class="flex align-center justify-content-center"  href="knjiga.html?knjiga=${currentBook.name}">
      <div class="card book mk-card-limit">
      <img src="../imgs/${currentBook.name.toLowerCase()}.jpg" alt=${currentBook.name.replaceAll("_", " ")} class="card-img-top book-prev" alt="...">
      <div class="card-body ${size} book-body">
          <h5 class="card-title book-title">${currentBook.name.replaceAll("_", " ")}</h5>
          <p class="card-text"><em>${bookDescription}</em></p>
          <p class="card-text mk-light-yellow">${currentBook.category.replaceAll("_", " ")}</p>
          <p class="card-text">${currentBook.author.replaceAll("_", " ")}</p>
      </div>
      </div>
      </a>`)
   }
   else{
      return(`
      <a class="flex align-center justify-content-center"  href="${prefix}knjiga.html?knjiga=${currentBook.name}">
      <div class="card book mk-card-limit">
      <img src="imgs/${currentBook.name.toLowerCase()}.jpg" alt=${currentBook.name.replaceAll("_", " ")} class="card-img-top book-prev" alt="...">
      <div class="card-body book-body">
          <h5 class="card-title book-title">${currentBook.name.replaceAll("_", " ")}</h5>
          <p class="card-text"><em>${bookDescription}</em></p>
          <p class="card-text mk-light-yellow">${currentBook.category.replaceAll("_", " ")}</p>
          <p class="card-text">${currentBook.author.replaceAll("_", " ")}</p>
      </div>
      </div>
      </a>`)};
}
let bookId = 0;
function moveBooks(columns, direction){
   if(direction === 1){
      bookId++;
      for(let i = 0; i<columns.length; i++){
         console.log((i+bookId)%books.length);
         columns[i].innerHTML = bookToElement(books[(i+bookId)%books.length], "pages/");
      }
      console.log("Break");
   }
   if(direction === -1){
      bookId--;
      if(bookId < 0)bookId = books.length - columns.length;
      for(let i = 0; i<columns.length; i++){
         console.log((i+bookId)%books.length);
         columns[i].innerHTML = bookToElement(books[(i+bookId)%books.length], "pages/");
      }
      console.log("Break");
   }
}
//Initializing all books
var books = 
[new book("Francuski_jezik", "Jezici", "Biljana_Aksentijević", "Udžbenik iz francuskog", 2, 2022),
new book("Umeće_ratovanja", "Istorijska_dela", "Sun_Tzu", "Sun Tzuova knjiga Umeće ratovanja, je jedno od najznačajnijih klasičnih kineskih dela.Ova knjiga ne sadrži ni jednu zastarelu maksimu ili nejasno uputstvo. Najbolje je pobediti bez borbe, rekao je Sun Tzu. Za njega je rat bio sastavni deo života.Pažljivo pročitajte ovu knjigu, i sve savremene knjige koje govore o upravljanju državom više vam se neće činiti dostojne pažnje.", 3, -500),
new book('Intelektom_ispred_svih', 'Popularna_psihologija', 'Henrik Feksevs', "Potreba da ostanete u formi na mentalnom nivou, koja se poslednjih decenija uvukla u kolektivnu svest, dobar je pristup i malim sivim ćelijama.Kao kada je reč o fizičkom zdravlju, postoje svojevrsni metodi za unapređenje mentalnog: vežbe i alatke koje možete koristiti da bi vaše misli postale jače, hitrije i prilagodljivije, što će vam pomoći da ostvarite i održite vrhunski učinak u životu, a koji će vas zaštititi od stresa i teškoća, s kojima ćete se neizostavno susretati.", 4, 2022),
new book('Brojevi_ne_lažu', 'Popularna_nauka', 'Vaclav_Smit', "Kako da bolje shvatite moderni svet. Moj omiljeni autor. Bez imalo dvoumljenja preporučujem ovu knjigu svima koji vole da saznaju nešto novo.“– Bil Gejts", 2, 2020),
new book('Stari_gradovi_srbije', 'Istorijska_dela', "Dragan_Bosnić", "„Nema grada na svetu oko koga su se jagmili toliki narodi, pod čijim su se bedemima vodile tolike bitke, koji je toliko puta menjao vlasnika i pedeset puta uništavan da bi se svih pedeset puta ponovo iz istorijskog groba podigao – kao što je naš Beograd. Pa zar ta činjenica što je taj grad srpski ni najmanje o Srbima ne govori?“ – Borislav Pekić", 2, 2019)
];
//If currently on index page
if(sPage === "index.html" || sPage.length === 0){
   prefix = "pages/";
   let popularColumns = document.querySelectorAll(".pop")
   let numberOfColumns = popularColumns.length;
   let elementList = new Array();
   for(let i = 0; i < numberOfColumns; i++){
      elementList[i] = bookToElement(books[i], prefix);
   }
   fillColumns(elementList, popularColumns, numberOfColumns)
   elementList = new Array();
   recentColumns = document.querySelectorAll(".rec")
   numberOfColumns = recentColumns.length;
   let sortedBooks = books.sort(function(a ,b){
      if(a.releaseDate > b.releaseDate){
         console.log("Sorted");
         return -1
      }
      else if (a.releaseDate < b.releaseDate){
         console.log("Sorted");
         return 1;
      }
      else return 0;
   })
   for(let i = 0; i < numberOfColumns; i++){
      elementList[i] = bookToElement(sortedBooks[i], prefix);
   }
   fillColumns(elementList, recentColumns, numberOfColumns)
   let timeToLoad = 2500;
   document.getElementById("moveLeftButton").addEventListener("click", function(){moveBooks(popularColumns, -1)});
   document.getElementById("moveRightButton").addEventListener("click", function(){moveBooks(popularColumns, 1)});
   countTo(document.querySelector("#memNum"), 0, 75, timeToLoad);
   countTo(document.querySelector("#yrNum"), 0, new Date().getFullYear() - 1930, timeToLoad);
   countTo(document.querySelector("#titNum"), 0, books.length, timeToLoad);
   countTo(document.querySelector("#leNum"), 0, 131, timeToLoad);
   countTo(document.querySelector("#leNum"), 131, 1000, 7000000);
}
if(sPage === "knjige.html"){
   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   //If the category paramater is set, filter the books by category, else show all books
   if(urlParams.has('kategorija')){
      let kategorija = urlParams.get('kategorija')
      document.title = kategorija.replaceAll("_", " ");
      books = books.filter(book => book.category == kategorija);
      document.getElementById('mk-book-category').innerHTML = kategorija.replaceAll("_"," ") ;
   }
   if(urlParams.has('autor')){
      let autor = urlParams.get('autor');
      document.title = autor.replaceAll("_", " ");
      books = books.filter(book => book.author == autor);
      document.getElementById('mk-book-category').innerHTML = autor.replaceAll("_"," ") ;
   }
   if(urlParams.has('godina')){
      let year = urlParams.get('godina');
      document.title = "Knjige iz " + negativeToBCE(year) + ". godine";
      books = books.filter(book => book.releaseDate === parseInt(year));
      document.getElementById('mk-book-category').innerHTML = "Knjige iz " + negativeToBCE(year) + " godine";
   }
   //Dynamically generate the books
   let columns = document.querySelectorAll(".mk-book-holder")
   let elementList = new Array();
   //Prepare the books to be displayed
   for(let i = 0; i<books.length;i++){
      let currentBook = books[i];
      elementList.push(bookToElement(currentBook));
   }
   //Display the books
   fillColumns(elementList, columns, 4);
}
if(sPage === "knjiga.html"){
   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   const urlBook = urlParams.get('knjiga')
   let currentBook = books.filter(book => book.name === urlBook)[0] 
   console.log(currentBook);
   document.querySelector("#bookImage").src=`../imgs/${currentBook.name.toLowerCase()}.jpg`
   document.title = currentBook.name.replaceAll("_", " ");
   $('#bookImage')
    .wrap('<span class="zoom-span"></span>')
    .css('display', 'block')
    .parent()
    .zoom({
      url: `../imgs/${currentBook.name.toLowerCase()}.jpg`
    });
   document.querySelector("#book-title").innerHTML = currentBook.name.replaceAll("_", " ");
   document.querySelector('#book-description').innerHTML = currentBook.description;
   document.querySelector('#author-field').innerHTML = "Autor: " +  ` <a class='mk-yellow' href='knjige.html?autor=${currentBook.author}'>${currentBook.author.replaceAll("_", " ")}</a>`;
   document.querySelector("#availability-field").innerHTML = "Broj kopija: " +currentBook.copies;
   document.querySelector('#date-field').innerHTML = "Godina izdavanja: " + `<a class='mk-yellow' href='knjige.html?godina=${currentBook.releaseDate}'>` + negativeToBCE(currentBook.releaseDate) + "</a>"
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
   let reName = /^[A-ZŠĆČĐ][a-zšđčć]{2,13}(\s[A-ZŠĆČĐ][a-zšđčć]{2,13}){0,3}$/
   let firstName = document.querySelector("#firstName")
   let lastName = document.querySelector("#lastName")
   let address = document.querySelector("#address")
   let reserveDate = document.querySelector("#reserveStart");
   let length = document.querySelector("#length");
   let radioSelected;
   for(let radio of deliveryRadios){
      if(radio.checked){
         radioSelected = radio.value;
         console.log(radio.value);
         break;
      }
   }
   addressBool = radioSelected>0? true:false;
   console.log(addressBool);
   addressRequired(addressBool);
   firstName.addEventListener("blur", function(){checkFormRegex(firstName, reName,"Ime sme da sadrži samo slova i ne sme biti prazno");})
   lastName.addEventListener("blur", function(){checkFormRegex(lastName, reName,"Prezime sme da sadrži samo slova i ne sme biti prazno");})
   address.addEventListener("blur", checkAddress);
   reserveDate.addEventListener('blur', checkDate);
   length.addEventListener('blur', checkLength);
}

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
function fillColumns(elementList, columns, numberOfColumns){
   for(let element in elementList){
      columns[element % numberOfColumns].innerHTML += elementList[element];
   }
}
function generateFooter(){
   let links = new Array('https://www.facebook.com/','https://www.twitter.com/','https://www.linkedin.com/', 'sitemap.xml');
   let names = new Array('facebook', 'twitter', 'linkedin', 'sitemap');
   let icons = new Array('icomoon-free:facebook', 'la:twitter', 'mdi:linkedin', 'bx:sitemap')
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
   addressBool = req;
   if(req){address.innerHTML = `Adresa<span class="mk-red">*</span>`;}
   else{address.innerHTML = `Adresa`;}
}
function checkForm(){
   let deliveryRadios = $("input[name='delivery']");
   let reserveStart = $("#reserveStart");
   let firstName = document.querySelector("#firstName");
   let email = document.querySelector("#email");
   console.log(email);
   let reEmail = /^[A-Z]$/

   let reAddress = /^(([A-ZŠĐĆČ][[a-zšđćč]\d\.\-]+)|([\d]+\.?))(\s[\w\d]+){0,7}\s(([\d]{1,3}((\/?(([\d]{1,2}[\w]?)|([\w]{1,2}))))?)|((BB)|(bb)))$/

   checkFormRegex(firstName, reEmail, "Pogresan mejl");
   checkFormRegex(address, reAddress, "Pogresna adresa");
}
function checkFormRegex(element, test, message){
   let errorHolder = element.nextElementSibling;
   if(test.test(element.value)){
      element.classList.add("success");
      element.classList.remove("failure");
      errorHolder.setAttribute("hidden", "hidden");
   }
   else{
      element.classList.remove("success");
      element.classList.add("failure");
      errorHolder.innerText = message;
      errorHolder.removeAttribute("hidden");
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
      document.title = "Knjige iz " + year.replaceAll("_", " ") + ". godine";
      books = books.filter(book => book.releaseDate === parseInt(year));
      document.getElementById('mk-book-category').innerHTML = "Knjige iz " + Math.abs(year) + (year < 0 ? " PNE" : "") + ". godine";
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
   document.title = currentBook.name.replaceAll("_", " ");
   document.querySelector("#bookImage").src=`../imgs/${currentBook.name.toLowerCase()}.jpg`
   document.querySelector('#bookInfo').innerHTML += `<div class="w-100 mk-yellow"><h2>${currentBook.name.replaceAll("_", " ")}</h2></div><p style="padding: 5%;">${currentBook.description.replaceAll("\n", '</br>')}</p><div><p>Autor: <a class='mk-yellow' href='knjige.html?autor=${currentBook.author}'>${currentBook.author.replaceAll("_", " ")}</a></p><p>Godina izdavanja: <a class='mk-yellow' href='knjige.html?godina=${currentBook.releaseDate}'>${Math.abs(currentBook.releaseDate)} ${currentBook.releaseDate < 0 ? "PNE" : ""}</a></p><p>Dostupnost: ${currentBook.copies} kopije</p><a href='rezervacije.html?Knjiga=${currentBook.name}'><button class="btn btn-light" id="openModal" style="width:100%;">Rezerviši</button></a></div>`
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
   deliveryRadios[0].addEventListener("click",function(){addressRequired(false)});
   deliveryRadios[1].addEventListener("click",function(){addressRequired(true)});
}

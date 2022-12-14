var prefix = "";
var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
window.onload = function(){
   var categories = ['Jezici', 'Popularna_nauka', 'Popularna_psihologija', 'Istorijska_dela'];
   var holder = document.querySelector('.dropdown-menu');
   if(sPage === "index.html" || sPage.length === 0) prefix="pages/";
   let element =`<li><a class="dropdown-item" href="${prefix}knjige.html">Sve</a></li>`;
   holder.innerHTML += element;
   for(category of categories){
   let element =`<li><a class="dropdown-item" href="${prefix}knjige.html?kategorija=${category}">${category.replace("_", " ")}</a></li>`;
   holder.innerHTML += element;
   }
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
   generateFooter();
   //If currently on index page
if(sPage === "index.html" || sPage.length === 0){
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
   books = copyOfBooks;
   let timeToLoad = 2500;
   $("#moveLeftButton").click(function(event){
      event.preventDefault(); 
      moveBooks(popularHolder, -1);
   });
   $("#moveRightButton").click(function(event){
      event.preventDefault();
      moveBooks(popularHolder, 1);
   })
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
   //Prepare the books to be displayed
   loadMore();
   const loadMoreButton = $("#loadMore");
   loadMoreButton.click(function(event){
      event.preventDefault();
      loadMore();
   })
}
if(sPage === "knjiga.html"){
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
   let reName = /^[A-Z??????????][a-z??????????]{2,13}(\s[A-Z??????????][a-z??????????]{2,13}){0,3}$/
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
   firstName.addEventListener("blur", function(){checkFormRegex(firstName, reName,"Ime sme da sadr??i samo slova i ne sme biti prazno");})
   lastName.addEventListener("blur", function(){checkFormRegex(lastName, reName,"Prezime sme da sadr??i samo slova i ne sme biti prazno");})
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
function generateFooter(){
   let links = new Array('https://www.facebook.com/','https://www.twitter.com/',(prefix?'' : '../') + 'documentation.pdf', (prefix?'' : '../') + 'sitemap.xml');
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
   let reName = /^[A-Z??????????][a-z??????????]{2,13}(\s[A-Z??????????][a-z??????????]{2,13}){0,3}$/
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
      errorHolder.innerText = 'Morate odabrati na??in preuzimanja'
      errorHolder.removeAttribute("hidden");
      success -= 1;
   }
   else{
      let errorHolder = deliveryRadios[0].parentNode.parentNode.lastElementChild;
      errorHolder.setAttribute("hidden", "hidden");
   }
   success += checkFormRegex(firstName, reName,"Ime sme da sadr??i samo slova i ne sme biti prazno");
   success += checkFormRegex(lastName, reName,"Prezime sme da sadr??i samo slova i ne sme biti prazno");
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
   element.innerText = "Uspe??no ste rezervisali knjigu";
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
      displayError(reserveLength,"Broj dana trajanja rezervacije mo??e biti od 1 do 40");
      return -1;
   }
   removeError(reserveLength);
   return 0;
}
function checkAddress(){
   let reAddress = /^(([A-Z??????????][a-z??????????\d]+)|([0-9][1-9]*\.?))(\s[A-Za-z????????????????????\d]+){0,7}\s(([1-9][0-9]{0,5}[\/-]?[A-Z])|([1-9][0-9]{0,5})|(BB))\.?$/
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
      displayError(reserveStart, "Morate odabrati datum po??etka rezerve");
      return -1;
   }
   let inputDate = new Date(reserveStart.value);
   let currentDate = new Date()
   if(inputDate < currentDate){
      displayError(reserveStart, "Rezerva ne mo??e po??eti pre sutrada??njeg dana")
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
   wrapper.classList.add("flex", "col-12", "col-md-6", "col-lg-3", "justify-content-center")
   wrapper.href = `knjiga.html?knjiga=${currentBook.name}`
   if (currentBook.description.length > 30){
      bookDescription = limitToFullWords(currentBook.description, 30);
   }
   if(prefix.length < 1){
      wrapper.href = `knjiga.html?knjiga=${currentBook.name}`
      wrapper.innerHTML = `
      <div class="card book mk-card-limit">
      <img src="../imgs/${currentBook.name.toLowerCase()}.jpg" alt="${currentBook.name.replaceAll('_', ' ')}" class="card-img-top book-prev" alt="...">
      <div class="card-body book-body">
          <h5 class="card-title book-title">${currentBook.name.replaceAll("_", " ")}</h5>
          <p class="card-text"><em>${bookDescription}</em></p>
          <p class="card-text mk-light-yellow">${currentBook.category.replaceAll("_", " ")}</p>
          <p class="card-text">${currentBook.author.replaceAll("_", " ")}</p>
      </div>
      </div>
      `
   }
   else{
      wrapper.href = `${prefix}knjiga.html?knjiga=${currentBook.name}`
      wrapper.innerHTML = `
      <div class="card book mk-card-limit">
      <img src="imgs/${currentBook.name.toLowerCase()}.jpg" alt="${currentBook.name.replaceAll('_', ' ')}" class="card-img-top book-prev" alt="...">
      <div class="card-body book-body">
          <h5 class="card-title book-title">${currentBook.name.replaceAll("_", " ")}</h5>
          <p class="card-text bookDescription"><em>${bookDescription}</em></p>
          <p class="card-text mk-light-yellow">${currentBook.category.replaceAll("_", " ")}</p>
          <p class="card-text">${currentBook.author.replaceAll("_", " ")}</p>
      </div>
      </div>
      `};
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
//Initializing all books
var books = 
[
new book('Manipulacija_i_mo??', 'Popularna_psihologija', 'Henrik_Feksevs', '??elite da odmah primetite da vas neko la??e? Flertujete na pravi na??in? Prodate svoju pri??u svima? Naravno, re??i ??ete, ko ne ??eli da poseduje ove ve??tine? Henrik Feksevs je fascinantna li??nost. Neki bi ga mogli opisati kao pomalo luckastog ekscentrika, ali ako pro??itate njegovu knjigu, otkri??ete da on savr??eno dobro zna o ??emu pri??a. A uz to je i duhovit.Verovatno se pitate da li je ova knjiga prakti??ni vodi?? za iluzioniste? Ili mo??da priru??nik za ma??ioni??are po??etnike? Ili ??ak neki ezoterijski tekst? Ne, ova knjiga nije ni??ta od toga. Ona je namenjena svima koji ??ele da ??itaju misli, bez potrebe da budu ??arobnjaci. Polo??aj tela, intonacija govora, korak, pogled i pokreti otkrivaju na??a ose??anja. ??esto ??e ti neverbalni signali biti u direktnom sukobu sa porukom koju izra??avamo re??ima. ', 5, 2022),
new book("Francuski_jezik", "Jezici", "Biljana_Aksentijevi??", "Ud??benik iz francuskog", 2, 2021),
new book('Prosve??eni_svet', 'Popularna_nauka','Steven_Pinker', 'U ovoj elegantnoj proceni stanja ??ove??anstva na po??etku tre??eg milenijuma, kognitivni psiholog, intelektualac i mislilac Stiven Pinker poziva nas da se odaljimo od zastra??uju??ih naslova kojima smo zasuti i crnih proro??anstava ???stru??njaka???, koji igraju na kartu na??ih psiholo??ki uslovljenih predrasuda. Umesto toga, on predla??e da jednostavno pratimo podatke. Pinker pokazuje da su ??ivot, zdravlje, prosperitet, sigurnost, mir, znanje i sre??a u porastu, ne samo na Zapadu, ve?? u ??itavom svetu. Taj napredak nije rezultat neke kosmi??ke sile. To je dar prosvetiteljstva, uverenja da razum i nauka mogu da dovedu do procvata ??ove??anstva.', 2, 2019),
new book("Homo_Deus", 'Popularna_nauka', 'Juval_Noa_Harari','??ta ??e sada biti prioritetni problemi ??ove??anstva umesto gladi, bolesti i rata? Kakvu ??emo sudbinu nameniti ljudskom rodu, kao samoproklamovani bogovi planete Zemlje, koje korake ??emo preduzimati da to ostvarimo? Homo Deus istra??uje projekte, snove i no??ne more koji ??e oblikovati dvadeset prvi vek ??? od prevazila??enja smrti do stvaranja ve??ta??kog ??ivota. Pred nama su osnovna pitanja na koja moramo da damo odgovore: u kom pravcu ??emo se dalje kretati? I kako c??emo za??tititi ovaj krhki svet od sopstvenih destruktivnih mo??i? Pred nama je sledec??a faza evolucije: Homo Deus.', 3, 2022),
new book('Sapijens', 'Istorijska_dela', 'Juval_Noa_Harari', 'Pre stotinu hiljada godina na Zemlji je ??ivelo najmanje ??est ljudskih vrsta. Danas postoji samo jedna ??? homo sapijens. Kako je na??a vrsta uspela da pobedi u bici za prevlast? Za??to su na??i preci lovci-sakuplja??i udru??ili snage da bi gradili gradove i osnivali carstva? Kako smo po??eli da verujemo u bogove, nacije i ljudska prava, u novac, knjige i zakone; kako smo pali u ropstvo birokratije, radnog vremena i konzumerizma? Kako ??e na?? svet izgledati u budu??nosti?', 3, 2022),
new book("Ume??e_ratovanja", "Istorijska_dela", "Sun_Tzu", "Sun Tzuova knjiga Ume??e ratovanja, je jedno od najzna??ajnijih klasi??nih kineskih dela.Ova knjiga ne sadr??i ni jednu zastarelu maksimu ili nejasno uputstvo. Najbolje je pobediti bez borbe, rekao je Sun Tzu. Za njega je rat bio sastavni deo ??ivota.Pa??ljivo pro??itajte ovu knjigu, i sve savremene knjige koje govore o upravljanju dr??avom vi??e vam se ne??e ??initi dostojne pa??nje.", 3, -500),
new book('Intelektom_ispred_svih', 'Popularna_psihologija', 'Henrik_Feksevs', "Potreba da ostanete u formi na mentalnom nivou, koja se poslednjih decenija uvukla u kolektivnu svest, dobar je pristup i malim sivim ??elijama.Kao kada je re?? o fizi??kom zdravlju, postoje svojevrsni metodi za unapre??enje mentalnog: ve??be i alatke koje mo??ete koristiti da bi va??e misli postale ja??e, hitrije i prilagodljivije, ??to ??e vam pomo??i da ostvarite i odr??ite vrhunski u??inak u ??ivotu, a koji ??e vas za??tititi od stresa i te??ko??a, s kojima ??ete se neizostavno susretati.", 4, 2021),
new book('Brojevi_ne_la??u', 'Popularna_nauka', 'Vaclav_Smit', "Kako da bolje shvatite moderni svet. Moj omiljeni autor. Bez imalo dvoumljenja preporu??ujem ovu knjigu svima koji vole da saznaju ne??to novo.?????? Bil Gejts", 2, 2022),
new book('Stari_gradovi_srbije', 'Istorijska_dela', "Dragan_Bosni??", "???Nema grada na svetu oko koga su se jagmili toliki narodi, pod ??ijim su se bedemima vodile tolike bitke, koji je toliko puta menjao vlasnika i pedeset puta uni??tavan da bi se svih pedeset puta ponovo iz istorijskog groba podigao ??? kao ??to je na?? Beograd. Pa zar ta ??injenica ??to je taj grad srpski ni najmanje o Srbima ne govori???? ??? Borislav Peki??", 2, 2019),
new book('Isus_to_nije_rekao','Istorijska_dela','Bart_D._Erman', 'Rafinirano, ali i na jedan krajnje izazovan na??in, Erman iznosi dokaze o tome kako je puno omiljenih biblijskih pri??a i ??iroko prihva??enih verovanja koje se odnose na Isusovu bo??anstvenost, Trojstvo, bo??ansko poreklo i nadahnutost Biblije, nastalo kao plod namernih i slu??ajnih izmena na??injenih od strane drevnih pisara - a ove izmene su, pak, dramati??no uticale na sve naredne verzije Biblije.', 1, 2019),
new book("Nema??ki_za_neupu??ene", 'Jezici', 'Wendy_Foster', 'Guten Tag! Ukoliko ??elite da nau??ite nema??ki jezik ??? bilo radi posla, putovanja ili zabave ??? Nema??ki za neupu??ene ??e zadovoljiti sve va??e potrebe. Pored poglavlja koja obja??njavaju gramatiku i njenu primenu, knjiga sadr??i i dijaloge koji ??e vam omogu??iti da koristite i govorite nema??ki jezik kao maternji. Osim toga, ona sadr??i i CD koji pru??a dodatne mogu??nosti za ve??banje govornog jezika. ', 1, 2018)
];

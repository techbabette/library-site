var prefix = "";
var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
window.onload = function(){
   var categories = ['Jezici', 'Popularna_nauka', 'Popularna_psihologija', 'Istorijska_dela'];
   var holder = document.querySelector('.dropdown-menu');
   let element =`<li><a class="dropdown-item" href="${prefix}knjige.html">Sve</a></li>`;
   holder.innerHTML += element;
   for(category of categories){
   let element =`<li><a class="dropdown-item" href="${prefix}knjige.html?kategorija=${category}">${category.replace("_", " ")}</a></li>`;
   holder.innerHTML += element;
   }
   let upButton = $("#goBackUp");
   upButton.click(function(event){
      console.log("Caught click");
      event.preventDefault;
      $(window).scrollTop(0);
   })
   generateFooter();
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
      holder.innerHTML+=element
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
let numberOfBooksToLoad = 0;
function generateBooks(columns, numberOfBooks){
   let elementList = new Array();
   let returnCode = false;
   for(let i = 0; i<numberOfBooks;i++){
      if(i>=books.length){returnCode = true; break;}
      if(i== books.length - 1){returnCode = true;}
      let currentBook = books[i];
      elementList.push(bookToElement(currentBook));
   }
   fillBooks(elementList, columns);
   return returnCode;
}
function loadMore(){
   let holder = document.querySelector("#event-div")
   let button = document.querySelector("#loadMore")
   numberOfBooksToLoad += 4;
   if(generateBooks(holder, numberOfBooksToLoad)){
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
      console.log("Fail");
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
      displayError(reserveLength,"Broj ne pripada opsegu od 1 do 40");
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
         console.log(checkFormRegex(address, reAddress, "Adresa ne odgovara formatu, primer: 'Kralja Aleksandra 13'"));
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
   if (currentBook.description.length > 30){
      bookDescription = limitToFullWords(currentBook.description, 30);
   }
   if(prefix.length < 1){
      return(`
      <div class="mk-mb col-12 col-md-6 col-lg-3">
      <a class="flex align-center justify-content-center" href="knjiga.html?knjiga=${currentBook.name}">
      <div class="card book mk-card-limit">
      <img src="../imgs/${currentBook.name.toLowerCase()}.jpg" alt="${currentBook.name.replaceAll('_', ' ')}" class="card-img-top book-prev" alt="...">
      <div class="card-body book-body">
          <h5 class="card-title book-title">${currentBook.name.replaceAll("_", " ")}</h5>
          <p class="card-text"><em>${bookDescription}</em></p>
          <p class="card-text mk-light-yellow">${currentBook.category.replaceAll("_", " ")}</p>
          <p class="card-text">${currentBook.author.replaceAll("_", " ")}</p>
      </div>
      </div>
      </a>
      </div>
      `)
   }
   else{
      return(`
      <div class="mk-mb col-12 col-md-6 col-lg-3">
      <a class="flex align-center justify-content-center" href="${prefix}knjiga.html?knjiga=${currentBook.name}">
      <div class="card book mk-card-limit">
      <img src="imgs/${currentBook.name.toLowerCase()}.jpg" alt="${currentBook.name.replaceAll('_', ' ')}" class="card-img-top book-prev" alt="...">
      <div class="card-body book-body">
          <h5 class="card-title book-title">${currentBook.name.replaceAll("_", " ")}</h5>
          <p class="card-text"><em>${bookDescription}</em></p>
          <p class="card-text mk-light-yellow">${currentBook.category.replaceAll("_", " ")}</p>
          <p class="card-text">${currentBook.author.replaceAll("_", " ")}</p>
      </div>
      </div>
      </a>
      </div>`
      )};
}
let bookId = 0;
function moveBooks(holder, direction){
   holder.innerHTML = '';
   if(direction === 1){
      bookId++;
      for(let i = 0; i<4; i++){
         holder.innerHTML += bookToElement(books[(i+bookId)%books.length]);
      }
   }
   if(direction === -1){
      bookId--;
      if(bookId < 0)bookId = books.length - 1;
      for(let i = 0; i<4; i++){
         holder.innerHTML += bookToElement(books[(i+bookId)%books.length]);
      }
   }
}
//Initializing all books
var books = 
[
new book('Manipulacija_i_moć', 'Popularna_psihologija', 'Henrik_Feksevs', 'Želite da odmah primetite da vas neko laže? Flertujete na pravi način? Prodate svoju priču svima? Naravno, reći ćete, ko ne želi da poseduje ove veštine? Henrik Feksevs je fascinantna ličnost. Neki bi ga mogli opisati kao pomalo luckastog ekscentrika, ali ako pročitate njegovu knjigu, otkrićete da on savršeno dobro zna o čemu priča. A uz to je i duhovit.Verovatno se pitate da li je ova knjiga praktični vodič za iluzioniste? Ili možda priručnik za mađioničare početnike? Ili čak neki ezoterijski tekst? Ne, ova knjiga nije ništa od toga. Ona je namenjena svima koji žele da čitaju misli, bez potrebe da budu čarobnjaci. Položaj tela, intonacija govora, korak, pogled i pokreti otkrivaju naša osećanja. Često će ti neverbalni signali biti u direktnom sukobu sa porukom koju izražavamo rečima. ', 5, 2022),
new book("Francuski_jezik", "Jezici", "Biljana_Aksentijević", "Udžbenik iz francuskog", 2, 2021),
new book('Prosvećeni_svet', 'Popularna_nauka','Steven Pinker', 'U ovoj elegantnoj proceni stanja čovečanstva na početku trećeg milenijuma, kognitivni psiholog, intelektualac i mislilac Stiven Pinker poziva nas da se odaljimo od zastrašujućih naslova kojima smo zasuti i crnih proročanstava „stručnjaka“, koji igraju na kartu naših psihološki uslovljenih predrasuda. Umesto toga, on predlaže da jednostavno pratimo podatke. Pinker pokazuje da su život, zdravlje, prosperitet, sigurnost, mir, znanje i sreća u porastu, ne samo na Zapadu, već u čitavom svetu. Taj napredak nije rezultat neke kosmičke sile. To je dar prosvetiteljstva, uverenja da razum i nauka mogu da dovedu do procvata čovečanstva.', 2, 2019),
new book("Homo_Deus", 'Popularna_nauka', 'Juval_Noa_Harari','Šta će sada biti prioritetni problemi čovečanstva umesto gladi, bolesti i rata? Kakvu ćemo sudbinu nameniti ljudskom rodu, kao samoproklamovani bogovi planete Zemlje, koje korake ćemo preduzimati da to ostvarimo? Homo Deus istražuje projekte, snove i noćne more koji će oblikovati dvadeset prvi vek – od prevazilaženja smrti do stvaranja veštačkog života. Pred nama su osnovna pitanja na koja moramo da damo odgovore: u kom pravcu ćemo se dalje kretati? I kako ćemo zaštititi ovaj krhki svet od sopstvenih destruktivnih moći? Pred nama je sledeća faza evolucije: Homo Deus.', 3, 2022),
new book('Sapijens', 'Istorijska_dela', 'Juval_Noa_Harari', 'Pre stotinu hiljada godina na Zemlji je živelo najmanje šest ljudskih vrsta. Danas postoji samo jedna – homo sapijens. Kako je naša vrsta uspela da pobedi u bici za prevlast? Zašto su naši preci lovci-sakupljači udružili snage da bi gradili gradove i osnivali carstva? Kako smo počeli da verujemo u bogove, nacije i ljudska prava, u novac, knjige i zakone; kako smo pali u ropstvo birokratije, radnog vremena i konzumerizma? Kako će naš svet izgledati u budućnosti?', 3, 2022),
new book("Umeće_ratovanja", "Istorijska_dela", "Sun_Tzu", "Sun Tzuova knjiga Umeće ratovanja, je jedno od najznačajnijih klasičnih kineskih dela.Ova knjiga ne sadrži ni jednu zastarelu maksimu ili nejasno uputstvo. Najbolje je pobediti bez borbe, rekao je Sun Tzu. Za njega je rat bio sastavni deo života.Pažljivo pročitajte ovu knjigu, i sve savremene knjige koje govore o upravljanju državom više vam se neće činiti dostojne pažnje.", 3, -500),
new book('Intelektom_ispred_svih', 'Popularna_psihologija', 'Henrik_Feksevs', "Potreba da ostanete u formi na mentalnom nivou, koja se poslednjih decenija uvukla u kolektivnu svest, dobar je pristup i malim sivim ćelijama.Kao kada je reč o fizičkom zdravlju, postoje svojevrsni metodi za unapređenje mentalnog: vežbe i alatke koje možete koristiti da bi vaše misli postale jače, hitrije i prilagodljivije, što će vam pomoći da ostvarite i održite vrhunski učinak u životu, a koji će vas zaštititi od stresa i teškoća, s kojima ćete se neizostavno susretati.", 4, 2021),
new book('Brojevi_ne_lažu', 'Popularna_nauka', 'Vaclav_Smit', "Kako da bolje shvatite moderni svet. Moj omiljeni autor. Bez imalo dvoumljenja preporučujem ovu knjigu svima koji vole da saznaju nešto novo.“– Bil Gejts", 2, 2022),
new book('Stari_gradovi_srbije', 'Istorijska_dela', "Dragan_Bosnić", "„Nema grada na svetu oko koga su se jagmili toliki narodi, pod čijim su se bedemima vodile tolike bitke, koji je toliko puta menjao vlasnika i pedeset puta uništavan da bi se svih pedeset puta ponovo iz istorijskog groba podigao – kao što je naš Beograd. Pa zar ta činjenica što je taj grad srpski ni najmanje o Srbima ne govori?“ – Borislav Pekić", 2, 2019),
new book('Isus_to_nije_rekao','Istorijska_dela','Bart_D._Erman', 'Rafinirano, ali i na jedan krajnje izazovan način, Erman iznosi dokaze o tome kako je puno omiljenih biblijskih priča i široko prihvaćenih verovanja koje se odnose na Isusovu božanstvenost, Trojstvo, božansko poreklo i nadahnutost Biblije, nastalo kao plod namernih i slučajnih izmena načinjenih od strane drevnih pisara - a ove izmene su, pak, dramatično uticale na sve naredne verzije Biblije.', 1, 2019),
new book("Nemački_za_neupućene", 'Jezici', 'Wendy Foster', 'Guten Tag! Ukoliko želite da naučite nemački jezik – bilo radi posla, putovanja ili zabave – Nemački za neupućene će zadovoljiti sve vaše potrebe. Pored poglavlja koja objašnjavaju gramatiku i njenu primenu, knjiga sadrži i dijaloge koji će vam omogućiti da koristite i govorite nemački jezik kao maternji. Osim toga, ona sadrži i CD koji pruža dodatne mogućnosti za vežbanje govornog jezika. ', 1, 2018)
];
//If currently on index page
if(sPage === "index.html" || sPage.length === 0){
   prefix = "pages/";
   let popularHolder = document.querySelector("#pop")
   generateBooks(popularHolder, 4);
   recentHolder = document.querySelector("#rec")
   let copyOfBooks = new Array(...books);
   books = books.sort(function(a ,b){
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
   generateBooks(recentHolder, 4);
   books = copyOfBooks;
   let timeToLoad = 2500;
   document.getElementById("moveLeftButton").addEventListener("click", function(){moveBooks(popularHolder, -1)});
   document.getElementById("moveRightButton").addEventListener("click", function(){moveBooks(popularHolder, 1)});
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
   if(currentBook === undefined)window.location.href = "https://techbabette.github.io/library-site/pages/knjige.html";
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

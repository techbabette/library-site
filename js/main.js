var categories = ['Jezici', 'Popularna_nauka', 'Popularna_psihologija', 'Istorijska_dela'];
//Actual good code
var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
var holder = document.querySelector('.dropdown-menu');
var prefix = ""
function book(name, category, author, description, copies, releaseDate){
   var name, category, author;
   this.name = name;
   this.category = category;
   this.author = author;
   this.description = description;
   this.copies = copies;
   this.releaseDate = releaseDate;
}
function fillColumns(elementList, columns){
   for(let element in elementList){
      columns[element % 4].innerHTML += elementList[element];
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
   fillColumns(elementList, columns);
}
generateFooter();
//Initializing all books
var books = 
[new book("Francuski_jezik", "Jezici", "Biljana Aksentijević", "Udžbenik iz francuskog", 2),
new book("Umeće_ratovanja", "Istorijska_dela", "Sun Tzu", "Sun Tzuova knjiga Umeće ratovanja, je jedno od najznačajnijih klasičnih kineskih dela.Ova knjiga ne sadrži ni jednu zastarelu maksimu ili nejasno uputstvo. Najbolje je pobediti bez borbe, rekao je Sun Tzu. Za njega je rat bio sastavni deo života.Pažljivo pročitajte ovu knjigu, i sve savremene knjige koje govore o upravljanju državom više vam se neće činiti dostojne pažnje.", 3),
new book('Intelektom_Ispred_Svih', 'Popularna_psihologija', 'Henrik Feksevs', "Potreba da ostanete u formi na mentalnom nivou, koja se poslednjih decenija uvukla u kolektivnu svest, dobar je pristup i malim sivim ćelijama.Kao kada je reč o fizičkom zdravlju, postoje svojevrsni metodi za unapređenje mentalnog: vežbe i alatke koje možete koristiti da bi vaše misli postale jače, hitrije i prilagodljivije, što će vam pomoći da ostvarite i održite vrhunski učinak u životu, a koji će vas zaštititi od stresa i teškoća, s kojima ćete se neizostavno susretati.", 4, "2011"),
new book('Brojevi_ne_lažu', 'Popularna_nauka', 'Vaclav Smit', "Kako da bolje shvatite moderni svet. Moj omiljeni autor. Bez imalo dvoumljenja preporučujem ovu knjigu svima koji vole da saznaju nešto novo.“– Bil Gejts", 2),
new book('Brojevi_ne_lažu', 'Popularna_nauka', 'Vaclav Smit', "Kako da bolje shvatite moderni svet. Moj omiljeni autor. Bez imalo dvoumljenja preporučujem ovu knjigu svima koji vole da saznaju nešto novo.“– Bil Gejts", 2),
new book('Brojevi_ne_lažu', 'Popularna_nauka', 'Vaclav Smit', "Kako da bolje shvatite moderni svet. Moj omiljeni autor. Bez imalo dvoumljenja preporučujem ovu knjigu svima koji vole da saznaju nešto novo.“– Bil Gejts", 2),
new book('Brojevi_ne_lažu', 'Popularna_nauka', 'Vaclav Smit', "Kako da bolje shvatite moderni svet. Moj omiljeni autor. Bez imalo dvoumljenja preporučujem ovu knjigu svima koji vole da saznaju nešto novo.“– Bil Gejts", 2)];
//If currently on index page
if(sPage === "index.html" || sPage.length === 0){
   prefix = "pages/";
}
let element =`<li><a class="dropdown-item" href="${prefix}knjige.html">Sve</a></li>`;
holder.innerHTML += element;
for(category of categories){
   let element =`<li><a class="dropdown-item" href="${prefix}knjige.html?kategorija=${category}">${category.replace("_", " ")}</a></li>`;
   holder.innerHTML += element;
}
if(sPage === "dešavanja.html"){
   
}
if(sPage === "knjige.html"){
   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   //If the category paramater is set, filter the books by category, else show all books
   if(urlParams.has('kategorija')){
      let kategorija = urlParams.get('kategorija')
      books = books.filter(book => book.category === String(kategorija));
      document.getElementById('mk-book-category').innerHTML = kategorija.replaceAll("_"," ") ;
   }
   //Dynamically generate the books
   let columns = document.querySelectorAll(".mk-event-holder")
   let elementList = new Array();
   //Prepare the books to be displayed
   for(let i = 0; i<books.length;i++){
      let currentBook = books[i];
      let bookDescription = currentBook.description.substr(0,30);
      if (currentBook.description.length > 30){
         bookDescription += "...";
      }
      elementList.push(`
      <a class="flex align-center justify-content-center"  href="knjiga.html?knjiga=${currentBook.name}">
      <div class="card book mk-card-limit">
      <img src="../imgs/dani_knjiga.jpg" class="card-img-top" alt="...">
      <div class="card-body ">
          <h5 class="card-title">${currentBook.name.replaceAll("_", " ")}</h5>
          <p class="card-text">${bookDescription}</p>
          <p class="card-text">${currentBook.author}</p>
      </div>
      </div>
      </a>`)
   }
   //Display the books
   fillColumns(elementList, columns);
}
if(sPage === "knjiga.html"){
   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   const urlBook = urlParams.get('knjiga')
   let currentBook = books.filter(book => book.name === urlBook)[0] 
   console.log(currentBook);
   document.querySelector('.mk-holder').innerHTML += `<div style="width:100%"><h2>${currentBook.name.replaceAll("_", " ")}</h2></div><p style="padding: 5%;">${currentBook.description.replaceAll("\n", '</br>')}</p><div><p>Autor: ${currentBook.author}</p><p>Godina izdavanja: ${currentBook.releaseDate}</p><p>Dostupnost: ${currentBook.copies} kopije</p><a href='rezervacije.html?Knjiga=${currentBook.name}'><button class="btn btn-light" style="width:100%;">Rezerviši</button></a></div>`
}

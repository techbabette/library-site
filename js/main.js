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
   var columns = document.querySelectorAll(".mk-event-holder")
   for(let i = 0; i<books.length;i++){
      let currentBook = books[i];
      let bookDescription = currentBook.description.substr(0,30);
      let columnPosition = i % 4;
      if (currentBook.description.length > 30){
         bookDescription += "...";
      }
      let element = `
      <a href="knjiga.html?knjiga=${currentBook.name}">
      <div class="card mk-card-limit" style="width: 90%;">
      <div class="card-body book">
          <h5 class="card-title">${currentBook.name.replaceAll("_", " ")}</h5>
          <p class="card-text">${bookDescription}</p>
          <p class="card-text">${currentBook.author}</p>
      </div>
      </a>`
      columns[columnPosition].innerHTML += element;
   }
}
if(sPage === "knjiga.html"){
   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   const urlBook = urlParams.get('knjiga')
   let currentBook = books.filter(book => book.name === urlBook)[0] 
   console.log(currentBook);
   document.querySelector('.mk-events').innerHTML += `<div style="width:100%"><h2>${currentBook.name.replaceAll("_", " ")}</h2></div><p style="padding: 5%;">${currentBook.description.replaceAll("\n", '</br>')}</p><div><p>Autor: ${currentBook.author}</p><p>Godina izdavanja: ${currentBook.releaseDate}</p><p>Dostupnost: ${currentBook.copies} kopije</p><a href='rezervacije.html?Knjiga=${currentBook.name}'><button class="btn btn-light" style="width:100%;">Rezerviši</button></a></div>`
}

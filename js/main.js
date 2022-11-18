var categories = ['Popularna_nauka', 'Popularna_psihologija', 'Jezici', 'Istorijska_dela'];
//Actual good code
var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
var holder = document.querySelector('.dropdown-menu');
var prefix = ""
if(sPage === "index.html" || sPage===""){
   prefix = "pages/";
}
let element =`<li><a class="dropdown-item" href="${prefix}knjige.html">Sve</a></li>`;
holder.innerHTML += element;
for(category of categories){
   let element =`<li><a class="dropdown-item" href="${prefix}knjige.html?kategorija=${category}">${category.replace("_", " ")}</a></li>`;
   holder.innerHTML += element;
}
if(sPage === "knjige.html"){
   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   function book(name, category, author){
      var name, category, author;
      this.name = name;
      this.category = category;
      this.author = author;
   }
   books = [new book("Francuski jezik", "Jezici", "Biljana Aksentijević"), new book("Umeće ratovanja", "Istorijska_dela", "Sun Tzu"), new book('Intelektom Ispred Svih', 'Popularna_psihologija', 'Henrik Feksevs'), new book('Brojevi ne lažu', 'Popularna_nauka', 'Vaclav Smit')];
   if(urlParams.has('kategorija')){
      console.log("Ovde smo!");
      let kategorija = urlParams.get('kategorija')
      books = books.filter(book => book.category === String(kategorija));
      document.getElementById('mk-book-category').innerHTML = kategorija.replace("_"," ") ;
   }
   var columns = document.querySelectorAll(".mk-event-holder")
   for(let i = 0; i<books.length;i++){
      let currentBook = books[i];
      let columnPosition = i % 4;
      let element = `<div class="card" style="width: 90%;">
      <img src="../imgs/${currentBook.name}.jpg" class="card-img-top" alt="${currentBook.name}">
      <div class="card-body">
          <h5 class="card-title">${currentBook.name}</h5>
          <p class="card-text">${currentBook.author}</p>
      </div>`
      columns[columnPosition].innerHTML += element;
   }
}

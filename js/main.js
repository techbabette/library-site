var categories = ['Popularna nauka', 'Popularna psihologija', 'Jezici'];
var links = ['popsci.html', 'poppsy.html', 'jezici.html'];
var holder = document.querySelector('.dropdown-menu');
for(category in categories){
   let element =`<li><a class="dropdown-item" href="${links[category]}">${categories[category]}</a></li>`;
   holder.innerHTML += element;
}
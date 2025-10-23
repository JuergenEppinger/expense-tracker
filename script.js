const form = document.getElementById('entry-form');
const desc = document.getElementById('desc');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const list = document.getElementById('list');
const balance = document.getElementById('balance');
const outEl = document.getElementById('out');
const inEl = document.getElementById('in');
const exportBtn = document.getElementById('export');
const clearBtn = document.getElementById('clear');


let entries = JSON.parse(localStorage.getItem('entries') || '[]');


function render(){
list.innerHTML = '';
let total = 0, out = 0, inn = 0;
entries.forEach((e, i)=>{
total += e.amount;
if(e.amount < 0) out += e.amount;
else inn += e.amount;
const li = document.createElement('li');
li.innerHTML = `<div class="meta"><strong>${e.desc}</strong><div style="font-size:.8rem;opacity:.8">${e.category}</div></div><div>${e.amount.toFixed(2)} € <button data-i="${i}" class="del">✖</button></div>`;
list.appendChild(li);
});
balance.textContent = total.toFixed(2) + ' €';
outEl.textContent = Math.abs(out).toFixed(2) + ' €';
inEl.textContent = inn.toFixed(2) + ' €';
}


form.addEventListener('submit', e=>{
e.preventDefault();
const a = parseFloat(amount.value);
if(!desc.value || isNaN(a)) return;
entries.unshift({desc: desc.value, amount: a, category: category.value, date: new Date().toISOString()});
localStorage.setItem('entries', JSON.stringify(entries));
desc.value = '';
amount.value = '';
render();
});


list.addEventListener('click', e=>{
if(e.target.matches('.del')){
const i = e.target.dataset.i;
entries.splice(i,1);
localStorage.setItem('entries', JSON.stringify(entries));
render();
}
});


exportBtn.addEventListener('click', ()=>{
const csv = ['Beschreibung,Betrag,Kategorie,Datum', ...entries.map(e=>`"${e.desc.replace(/"/g,'""')}",${e.amount},${e.category},${e.date}`)].join('\n');
const blob = new Blob([csv],{type:'text/csv'});
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'entries.csv';
a.click();
});


clearBtn.addEventListener('click', ()=>{
if(confirm('Wirklich alles löschen?')){
entries = [];
localStorage.removeItem('entries');
render();

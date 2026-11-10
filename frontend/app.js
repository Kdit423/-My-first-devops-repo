// Запрашиваем данные у Go-API и выводим в список
fetch('/api/items')
  .then(r => r.json())
  .then(items => {
    const ul = document.getElementById('items');
    ul.innerHTML = '';
    items.forEach(it => {
      const li = document.createElement('li');
      li.textContent = it.id + '. ' + it.name;
      ul.appendChild(li);
    });
  })
  .catch(e => {
    document.getElementById('items').textContent = 'Ошибка: ' + e;
  });

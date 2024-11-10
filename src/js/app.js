import List from './components/list_create/list_create';
import Sortable from 'sortablejs';

const lists = document.querySelectorAll('.list-container');

lists.forEach((li) => {
  const newList = new List(li);
  newList.bindDOM();

  const body = li.querySelector('.list-body');
  new Sortable(body, {
    group: 'shared',
    ghostClass: 'rotating',
    animation: 150,
    onStart: function (e) {
      let itemEl = e.item;
      this.oldlist = itemEl.closest('.list-container');
      this.oldlistBody = this.oldlist.querySelector('.list-body');
      console.log(this.oldlist.dataset.locStorKey);
    },
    onEnd: function (e) {
      let itemEl = e.item;
      let newList = itemEl.closest('.list-container');
      let newListBody = newList.querySelector('.list-body');

      localStorage.setItem(this.oldlist.dataset.locStorKey, this.oldlistBody.innerText);
      localStorage.setItem(newList.dataset.locStorKey, newListBody.innerText);
    },
  });
});

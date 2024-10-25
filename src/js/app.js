import List from './components/list_create/list_create'
import DnD from './components/DnD/DnD'

const lists = document.querySelectorAll('.list-container')

lists.forEach((li) => {
  const newList = new List(li)
  newList.bindDOM()
})

const listBody = document.querySelector('.container')
const newDnD = new DnD(listBody)
newDnD.onMouseDown();
newDnD.onMouseMove();
newDnD.onMouseUp();
newDnD.getCardBack();
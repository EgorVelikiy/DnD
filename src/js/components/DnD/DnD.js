export default class DnD {
    constructor(body) {
        this.body = body;
        this.list = this.body.querySelectorAll('.list-body')
        this.items = this.body.querySelectorAll('.list-card')
        this.drag;
        this.flyingEl;
        this.elInfo = {}
        this.template;
    }

    insert(e, closest, el) {
        const card = closest.closest('.list-card');
        let list;
        if (!card) {
            list = closest;
            let upCor = document.elementFromPoint(e.clientX, e.clientY);
            if (upCor.className.startsWith('list-card')) {
                upCor = upCor.closest('.list-card');
                if (upCor) {
                    list.insertBefore(el, upCor.nextElementSibling);
                }
            } else {
                list.insertAdjacentElement('afterbegin', el);
            }
        } else {
            list = card.closest('.list-body');
            const top = card.getBoundingClientRect().top;

            if (e.pageY > top + card.offsetHeight / 2) {
                list.insertBefore(el, card.nextElementSibling)
            } else {
                list.insertBefore(el, card);
            }
        }
    }

    onMouseDown() {
        this.body.addEventListener('mousedown', (e) => {
            e.preventDefault();

            const card = e.target.closest('.list-card');

            if (
                !card ||
                e.target.classList.contains('list-card-remover') ||
                e.target.className.startsWith('card-create')
            ) {
                return;
            }

            if (
                card.nextElementSibling && 
                card.nextElementSibling.classList.contains('list-card')
            ) {
                this.elInfo.position = 'beforebegin';
                this.elInfo.target = card.nextElementSibling;
            } else if (
                card.previousElementSibling &&
                card.previousElementSibling.classList.contains('list-card')
            ) {
                this.elInfo.position  = 'afterend'
                this.elInfo.target = card.previousElementSibling;
            } else {
                this.elInfo.position = 'afterbegin'
                this.elInfo.target = card.closest('.list-body')
            }

            this.elInfo.shiftX = e.clientX - card.getBoundingClientRect().left;
            this.elInfo.shiftY = e.clientY - card.getBoundingClientRect().top;
            this.elInfo.left = e.pageX - this.elInfo.shiftX;
            this.elInfo.top = e.pageY - this.elInfo.shiftY;

            this.drag = card;

            this.flyingEl = card.cloneNode(true);
            this.flyingEl.classList.add('dragged');
            document.body.appendChild(this.flyingEl);
            this.flyingEl.style.left = this.elInfo.left + 'px';
            this.flyingEl.style.top = this.elInfo.top + 'px';

            this.template = card.cloneNode(true);
            this.template.style.backgroundColor = 'rgb(200, 209, 216)';
            this.template.style.boxShadow = "none";
            this.template.lastElementChild.style.display = "none";
            this.template.style.cursor = "grabbing";
            const title = this.template.querySelector(".list-card-title");
            title.style.color = "rgb(200, 209, 216)";
            card.replaceWith(this.template);

            document.body.parentElement.classList.toggle('grabbing')
        });
    }
    
    onMouseMove() {
        this.body.addEventListener('mousemove', (e) => {
            e.preventDefault();
            
            if (!this.drag) {
                return;
            }

            this.flyingEl.classList.add('rotating');

            this.template.remove();

            const closest = document.elementFromPoint(e.clientX, e.clientY);
            if (closest.className.startsWith('list-card')) {
                this.insert(e, closest, this.template);
            }

            this.drag.style.left = e.pageX;
            this.drag.style.top = e.pageY;
        });
    }

    getCardBack() {
        this.body.addEventListener('mouseleave', () => {
            if (!this.drag) {
                return;
            }

            this.template.remove();

            const target = this.elInfo.target;
            target.insertAdjacentElement(this.elInfo.position, this.drag)

            document.body.removeChild(this.flyingEl);

            document.body.parentElement.classList.toggle('grabbing')

            this.flyingEl = null;
            this.drag = null;
            this.template = null;
            this.elInfo = {};
        });
    }

    onMouseUp() {
        this.body.addEventListener('mouseup', (e) => {
            if(!this.drag) {
                return;
            }
            console.log(e.target)
            this.template.remove();

            const closest = document.elementFromPoint(e.clientX, e.clientY);
            if (
                this.elInfo.left == this.flyingEl.style.left &&
                this.elInfo.top == this.flyingEl.style.top
            ) {
                const target = this.elInfo.target;
                console.log(target)
                target.insertAdjacentElement(this.elInfo.position, this.drag);
            } else if (closest.className.startsWith('list-card')) {
                this.insert(e, closest, this.drag);

                const originalCardsList = this.elInfo.target.closest('.list-container');
                const listBodyOrigin = originalCardsList.querySelector('.list-body')
                localStorage.setItem(originalCardsList.dataset.locStorKey, 
                    listBodyOrigin.innerText);
                
                const newCardsList = closest.closest('.list-container');
 
                const listBodyNew = newCardsList.querySelector('.list-body')
               
                if (originalCardsList != newCardsList) {
                    localStorage.setItem(newCardsList.dataset.locStorKey, 
                        listBodyNew.innerText);
                }
            } else {
                const target = this.elInfo.target;
                target.insertAdjacentElement(this.elInfo.position, this.drag);
            }

            document.body.removeChild(this.flyingEl)

            this.flyingEl = null;
            this.drag = null;
            this.template = null;
            this.elInfo = {};

            document.body.parentElement.classList.toggle('grabbing') 
        })
    }
}
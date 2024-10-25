export default class List {
    constructor(list) {
        this._list = list;
    }

    static listMarkup(listName, locStorKey) {
        return `
            <div class="list">
                <div class="header">
                    <h1 class="header-title">${listName}</h1>
                </div>
                <div class="list-body data-key=${locStorKey}">
                    <div class="card-create-active hide">
                        <div class="card-create-active card-opened">
                            <textarea class="card-create-textarea hover" placeholder="Ввести заголовок для этой карточки"></textarea>
                        </div>
                        <div class="card-create-tools">
                            <div class="tools">
                                <input class="add-new-card hover" type="button" value="Добавить карточку">
                                <button class="close-card hover"></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-create-container">
                    <a class="open-card-create hover">
                        <span class="plus-card"></span>
                        <span class="add-card">Добавить карточку</span>
                    </a>
                </div>
            </div>
        `
    }

    static cardMarkup(title) {
        if (title) {
            return `
                <a class="list-card hover" href="#">
                    <div class="list-card-details">
                        <span class="list-card-title">
                            ${title}
                        </span>
                    </div>
                    <div class="list-card-remover hover"></div>
                </a>
            `
        }

        return
    }

    bindDOM() {
        const { listName, locStorKey } = this._list.dataset;
        this._list.innerHTML = this.constructor.listMarkup(listName, locStorKey);

        const key = localStorage.getItem(locStorKey);
        const cardCreateActive = this._list.querySelector('.card-create-active');

        if(key) {
            this.init(cardCreateActive, key)
        }

        const cardCreateContainer = this._list.querySelector('.card-create-container');
        const CardCreateTextArea = this._list.querySelector('.card-create-textarea');


        cardCreateContainer.addEventListener('click', () => {
            this.onAddCardClick(cardCreateContainer, cardCreateActive, CardCreateTextArea)
        })

        const closeAddCard = this._list.querySelector('.close-card');

        closeAddCard.addEventListener('click', () => {
            this.onCloseCardClick(cardCreateContainer, cardCreateActive)
        })

        const addNewCardBtn = this._list.querySelector('.add-new-card');
        const listBody = this._list.querySelector('.list-body')
        
        addNewCardBtn.addEventListener('click', () => {
            this.addNewCard(listBody, CardCreateTextArea, cardCreateActive, locStorKey)
        })


        listBody.addEventListener('click', (e) => {
            this.cardDelete(e, listBody, locStorKey)
        })

    }

    init(cardCreateActive, key) {
        let markup = ""
        const titles = key.split('\n')

        titles.forEach(title => {
            markup += this.constructor.cardMarkup(title)
        });

        cardCreateActive.insertAdjacentHTML("beforebegin", markup);
    }

    onAddCardClick(container, active, textarea) {
        container.classList.add('hide');
        active.classList.remove('hide')
        textarea.focus()
    }

    onCloseCardClick(container, active) {
        container.classList.remove('hide');
        active.classList.add('hide')
    }

    addNewCard(listBody, textarea, cardCreateActive, locStorKey) {
        const cardTitle = textarea.value;
        if (cardTitle) {
            const markup = this.constructor.cardMarkup(cardTitle);
            cardCreateActive.insertAdjacentHTML("beforebegin", markup);
            localStorage.setItem(locStorKey, listBody.innerText);
            textarea.value = "";
        } else {
            textarea.focus();
        }

        this.closeAddCard = this._list.querySelector('.close-card');
    }

    cardDelete(event, listBody, locStorKey) {
        const { target } = event;
        if (target.className.includes('.list-card-remover'.slice(1))) {
            target.closest('.list-card').remove();
        }

        if (listBody.children.length > 0) {
            localStorage.setItem(locStorKey, listBody.innerText);
        }
    }
}
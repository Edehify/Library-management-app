
function createBook(title, author, pages, status) {
    return {
        id: crypto.randomUUID(),
        title,
        author,
        pages,
        status : status === true ? "Read" : "Not read" 
    };

}


const libraryModule =(()=> {
    let libraryBook = loadBook();

    function saveBooks() {
        const result = JSON.stringify(libraryBook);
        localStorage.setItem("libraryBook", result);

    }

    function loadBook() {
        const result = localStorage.getItem("libraryBook");
        if(result){
             return JSON.parse(result);
             
        }else
            return [];
    }

    function addBook(book) {
    libraryBook.push(book);
    saveBooks();
    };

    function findBook(id) {
       return libraryBook.findIndex(item => item.id === id);
    }

    function removeBook(book) {
        const index = findBook(book.id);

        if(index !== -1) {
            libraryBook.splice(index, 1);
            console.log("Book deleted");
            saveBooks();
        }else {
            console.log("book not found in the collections");
            return;
        }
    }

    function toggleReadStatus(book) {
        const index = findBook(book.id);
        if(index !== -1){
        libraryBook[index].status = libraryBook[index].status === "Read" ? "Not read" : "Read";
        saveBooks();
        }else {
            console.log("Book not found on collection");
        }
    }

    function searchBooks(item = ""){
        const searchItems = libraryBook.filter(book => book.title.toLowerCase().includes(item.toLowerCase()) || book.author.toLowerCase().includes(item.toLowerCase()));
        return searchItems;

    }
    return {
        getBook: () => [...libraryBook],
        addBook,
        findBook,
        removeBook,
        toggleReadStatus,
        searchBooks
    }
}) ();

const displayController = (() => {
        const bookDialog = document.getElementById("book-dialog");

        const openDialog = document.getElementById("open-book-dialog");
        openDialog.addEventListener("click", () => {
            bookDialog.showModal();
        });

        const closeDialog = document.getElementById("cancel-form-button");
        closeDialog.addEventListener("click", () => {
            bookDialog.close();
        })


        const form = document.querySelector("#book-form");
        form.addEventListener("submit" ,(event) => {
            event.preventDefault();
            const data = new FormData(form);
            const title = data.get('title').trim();
            const author = data.get('author').trim();
            const pages = Number(data.get('pages'));
            const status = data.has('status');

            const newBook = createBook(title, author, pages, status);
            libraryModule.addBook(newBook);
            render(libraryModule.searchBooks(searchInput.value), searchInput.value);
        

            form.reset();
            bookDialog.close();

        });

        function display(book) {
    // create new div
    const bookCard = document.createElement("div");
    // add class to the div
    bookCard.classList.add("book-card");

    // create new h2 for the title
    const titleElement = document.createElement("h2");
    titleElement.textContent = `${book.title}`;

    // create new p for the author
    const authorElement = document.createElement("p");
    authorElement.textContent = `By ${book.author}`;

    // create new p for the pages
    const pagesElement = document.createElement("p");
    pagesElement.textContent = `${book.pages} pages`;

     // create new p for the status       
    const statusElement = document.createElement("p");
    statusElement.textContent = book.status == "Read" ? "Read" : "Not Read";

    // create div for button for easy styling
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    // create update status button
    const statusButton = document.createElement("button");
    statusButton.textContent = book.status === "Read"  ? "Mark as not read" : "Mark as read";
    statusButton.addEventListener("click", () => {
        libraryModule.toggleReadStatus(book);
         // update display text for read status
        statusElement.textContent = book.status;      
        // Update the button text
        statusButton.textContent = book.status == "Read" ? "Mark as not read" : "Mark as read";
    });

    // create delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
        libraryModule.removeBook(book);
        render(libraryModule.searchBooks(searchInput.value), searchInput.value);

    });

    buttonContainer.appendChild(statusButton);
    buttonContainer.appendChild(deleteButton)

    // append elements to the card
    bookCard.appendChild(titleElement);
    bookCard.appendChild(authorElement);
    bookCard.appendChild(pagesElement);
    bookCard.appendChild(statusElement);
     bookCard.appendChild(buttonContainer);

    // finally append the card to the library container
  bookLibrary.appendChild(bookCard);
}

    function render(books, searchTerm = "") {
        bookLibrary.replaceChildren();
        if(libraryModule.getBook().length != 0){
            if(searchTerm === ""){
                updateStatus("all");
            } else if(books.length != 0){
                    updateStatus(books.length);
                
            } else updateStatus("no match");
        
           
        }else  updateStatus("empty");

          books.forEach(display);
        
    }

    const statusMessage = document.getElementById("status-message")
    function updateStatus(status) {
        const bookLength = libraryModule.getBook().length;
         if(status === "empty") {
            statusMessage.textContent = "Your library is empty. Add a book to get started.";
        }else if(status === "all") {
            if(bookLength > 1)
            statusMessage.textContent = `Showing all ${bookLength} books`;
            else if(bookLength === 1)
                 statusMessage.textContent = `Showing all ${bookLength} book`;
        }else if(status === "no match") {
             statusMessage.textContent = "No books found matching your search.";
        }else if(status === 1) {
        
            statusMessage.textContent = `${status} book found out of ${bookLength} total books`;
        }else if(status > 1) {
            statusMessage.textContent = `${status} books found out of ${bookLength} total books`;
        }
    }

    // Get liibrary Container in the html
    const bookLibrary = document.getElementById("library"); 
     
    return {
        display,
        render,
        updateStatus
    }
     
}
)();

// connect the search
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", () => {
    const result = libraryModule.searchBooks(searchInput.value);
    displayController.render(result, searchInput.value);
});

displayController.render(libraryModule.getBook(), searchInput.value);


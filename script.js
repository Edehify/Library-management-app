function createBook(title, author, pages, status) {
    return {
        id: crypto.randomUUID(),
        title,
        author,
        pages,
        status : status == true ? "Read" : "Not read" 
    };

}


const libraryModule =(()=> {
    let libraryBook = [];

    function addBook(book) {
    libraryBook.push(book);
    };

    function findBook(id) {
       return libraryBook.findIndex(item => item.id === id);
    }

    function removeBook(book) {
        const index = findBook(book.id);

        if(index !== -1) {
            libraryBook.splice(index, 1);
            console.log("Book deleted");
        }else {
            console.log("book not found in the collections");
            return;
        }
    }

    function toggleReadStatus(book) {
        const index = findBook(book.id);
        if(index !== -1){
        libraryBook[index].status = libraryBook[index].status === "Read" ? "Not read" : "Read";
        }else {
            console.log("Book not found on collection");
        }
    }

    function searchBooks(item){
        const searchItems = libraryBook.filter(book => book.title.toLowerCase().includes(item.toLowerCase()) || book.author.toLowerCase().includes(item.toLowerCase()));
        return searchItems

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




const person1 = createBook("Shake Spear", "am getting Bettrer", 430, false);
const person2 = createBook("favour", "Sugar", 650, true);
const person3 = createBook("njuhgfy", "hggtghjk",879, false);
const person5 = createBook("oke","manager", 789, true);
libraryModule.addBook(person1);
libraryModule.addBook(person2);
libraryModule.addBook(person3);
libraryModule.addBook(person5);

//libraryModule.getBook()[1].status = "Not read";


//console.log(libraryModule.getBook()[1]);

//console.log(libraryModule.getBook());

console.log(libraryModule.searchBooks(""));



libraryModule.removeBook(person2);


//console.log(libraryModule.getBook());

//console.log(libraryModule.findBook(person3.id));

libraryModule.toggleReadStatus(person3);
libraryModule.toggleReadStatus(person3);




//console.log(libraryModule.getBook());

 

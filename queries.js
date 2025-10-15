 // Find books in a specific genre:
    const genre = 'Fiction';
    const genrebooks = await collection.find({ genre: { $eq: genre } }).toArray();
    console.log(`\nBooks in the genre ${genre}:`);
    genrebooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year})`);
    });

    // Find books published after 1949 year
    const year = 1949;
    const recentBooks = await collection.find({ published_year: { $gt: year } }).toArray();
    console.log(`\nBooks published after ${year}:`);
    recentBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year})`);
    });

    // Find books by a specific author:
    const author = 'George Orwell';
    const orwellBooks = await collection.find({ author }).toArray();
    console.log(`\nBooks by ${author}:`);
    orwellBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year})`);
    });

    // Update the price of The Great Gatsby book
    const priceUpdate = await collection.updateOne(
      { title: 'The Great Gatsby' },
      { $set: { price: 15.99 } }
    );
    console.log(`\nUpdated ${priceUpdate.modifiedCount} document(s) - Updated price of "The Great Gatsby"`);  

   
    // Delete a book by its title:Wuthering Heights
    const deleteBook = await collection.deleteOne({title: 'Wuthering Heights'});
    console.log(`\nDeleted ${deleteBook.deletedCount} document(s) - Deleted "Wuthering Heights" book`);


    // Write a query to find books that are both in stock and published after 2010
    const inStockRecentBooks = await collection.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray();
    console.log(`\nBooks that are in stock and published after 2010:`);
    inStockRecentBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year}")`);

    });

    // Use projection to return only the title, author, and price fields in your queries
    const projectedBooks = await collection.find({}, { projection: { _id: 0, title: 1, author: 1, price: 1 } }).toArray();
    console.log(`\nBooks with only title, author, and price fields:`);
    projectedBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} - $${book.price}`);
    });

    // Implement sorting to display books by price (both ascending and descending)
    const sortedBooksAsc = await collection.find({}).sort({ price: 1 }).toArray();
    console.log(`\nBooks sorted by price (ascending):`);  
    sortedBooksAsc.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} - $${book.price}`);
    });

    const sortedBooksDesc = await collection.find({}).sort({ price: -1 }).toArray();
    console.log(`\nBooks sorted by price (descending):`);
    sortedBooksDesc.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} - $${book.price}`);
    });

    // Use the limit and skip methods to implement pagination (5 books per page)
    const pageSize = 5;
    const pageNumber = 1;

    const paginatedBooks = await collection.find({})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    console.log(`\nBooks - Page ${pageNumber}:`);
    paginatedBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} - $${book.price}`);
    });

    // Create an aggregation pipeline to calculate the average price of books by genre
    const avgPriceByGenre = await collection.aggregate([
      { $group: { _id: "$genre", averagePrice: { $avg: "$price" } } }
    ]).toArray();

    console.log(`\nAverage price of books by genre:`);
    avgPriceByGenre.forEach((item) => {
      console.log(`- ${item._id}: $${item.averagePrice.toFixed(2)}`);
    });

    // Create an aggregation pipeline to find the author with the most books in the collection
    const authorWithMostBooks = await collection.aggregate([
      { $group: { _id: "$author", bookCount: { $sum: 1 } } },
      { $sort: { bookCount: -1 } },
      { $limit: 1 }
    ]).toArray();

    console.log(`\nAuthor with the most books:`);
    authorWithMostBooks.forEach((item) => {
      console.log(`- ${item._id}: ${item.bookCount} books`);
    });

    // Implement a pipeline that groups books by publication decade and counts them
    const booksByDecade = await collection.aggregate([
      {
        $group: {
          _id: { $subtract: [ "$published_year", { $mod: [ "$published_year", 10 ] } ] },
          bookCount: { $sum: 1 }
        }
      }
    ]).toArray();

    console.log(`\nBooks by publication decade:`);
    booksByDecade.forEach((item) => {
      console.log(`- ${item._id}s: ${item.bookCount} books`);
    });

    // Create an index on the title field for faster searches
    await collection.createIndex({ title: 1 });
    console.log('\nIndex created on the title field for faster searches');

    // Create a compound index on author and published_year
    await collection.createIndex({ author: 1, published_year: -1 });
    console.log('Compound index created on author and published_year fields');

    // Use the explain() method to demonstrate the performance improvement with your indexes
    const explainResult = await collection.find({ title: '1984' }).explain('executionStats');
    console.log('\nExplain output for query on title "1984":');
    console.log(JSON.stringify(explainResult, null, 2));  
    
const { MongoClient } = require('mongodb');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// MongoDB connection URI and database/collection details
const uri = "mongodb+srv://Cluster53292:Tk5lclVaRlFi@cluster53292.1mfur.mongodb.net/";
const database = '20109017_CA2';
const collectionName = 'Movies';

// MongoDB client instance
const client = new MongoClient(uri);
let collection;

// Menus
const mainMenu = `
Welcome to the Movie Database
Please select an option:
1. Create
2. Read (Find)
3. Read (Aggregation)
4. Update
5. Delete
6. Exit
`;

const createMenu = `
Create Options:
1. Add Movie 20109017_M_1
2. Add Movie 20109017_M_2
3. Add User 1 20109017_u_1
4. Add User 2 20109017_u_2
5. Add User 3 20109017_u_3
6. Go Back
`;

const readMenu = `
Read (Search) Options:
1. Movies with more than 30 characters in title (to screen)
2. Movies with run time greater than 120 (to json)
3. Movies with Director starting with 'B' (to json)
4. Movies with rating higher than 7 (to json)
5. Movies with fewer than 500 votes in IMDB (to json)
6. Any movie with genre of 'short' (to json)
7. Go Back
`;

const aggregateMenu = `
Aggregation Options:
1. Count movies before 1900 with avg runtime & avg votes by genre (to screen)
2. Top 50 Writers by frequency, with avg IMDB rating (to screen)
3. Go Back
`;

const updateMenu = `
Update Options:
1. Update IMDB Rating and Votes for 20109017_M_1
2. Add Favourite Movie 20109017_M_2 to User 20109017_u_3
3. Update Writer of Movie 20109017_M_1 to "William Shakespear"
4. Update Genre of Movie 20109017_M_2 to "Spoof"
5.  Go Back
`;

const deleteMenu = `
Delete Options:
1. Delete Movie 20109017_M_1
2. Delete Movie 20109017_M_2
3. Go Back
`;

// Display a menu and handle user input
function displayMenu(menuText, handlerFunction) {
    rl.question(menuText, (input) => {
        if (handlerFunction) {
            handlerFunction(input);
        }
    });
}

// Main menu handler
function handleMainMenu(input) {
    switch (input) {
        case '1':
            displayMenu(createMenu, handleCreateMenu);
            break;
        case '2':
            displayMenu(readMenu, handleReadMenu);
            break;
        case '3':
            displayMenu(aggregateMenu, handleAggregateMenu);
            break;
        case '4':
            displayMenu(updateMenu, handleUpdateMenu);
            break;
        case '5':
            displayMenu(deleteMenu, handleDeleteMenu);
            break;
        case '6':
            console.log("Exiting... Goodbye!");
            rl.close();
            client.close(); // Close MongoDB connection when exiting
            break;
        default:
            console.log("Incorrect key, please try again.");
            displayMenu(mainMenu, handleMainMenu);
    }
}

// Create menu handler
function handleCreateMenu(input) {
    switch (input) {
        case '1':
            addMovie_20109017_M_1()
                .then(() => displayMenu(createMenu, handleCreateMenu))
                .catch((err) => console.error(err));
            break;
        case '2':
            addMovie_20109017_M_2()
                .then(() => displayMenu(createMenu, handleCreateMenu))
                .catch((err) => console.error(err));
            break;
        case '3':
            addUser1()
                .then(() => displayMenu(createMenu, handleCreateMenu))
                .catch((err) => console.error(err));
            break;
        case '4':
            addUser2()
                .then(() => displayMenu(createMenu, handleCreateMenu))
                .catch((err) => console.error(err));
            break;
        case '5':
            addUser3()
                .then(() => displayMenu(createMenu, handleCreateMenu))
                .catch((err) => console.error(err));
            break;
        case '6': // Go Back
            displayMenu(mainMenu, handleMainMenu);
            break;
        default:
            console.log("Incorrect key, please try again.");
            displayMenu(createMenu, handleCreateMenu);
    }
}

// Read menu handler
function handleReadMenu(input) {
    switch (input) {
        case '1':
            findLongTitles()
                .then(() => displayMenu(readMenu, handleReadMenu))
                .catch((err) => console.error(err));
            break;
        case '2':
            findMoviesOverTwoHours()
                .then(() => displayMenu(readMenu, handleReadMenu))
                .catch((err) => console.error(err));
            break;
        case '3':
            findDirectorsStartingWithB()
                .then(() => displayMenu(readMenu, handleReadMenu))
                .catch((err) => console.error(err));
            break;
        case '4':
            findMoviesWithHighRatings()
            .then(() => displayMenu(readMenu, handleReadMenu))
            .catch((err) => console.error(err));
            break;
        case '5':
            findMoviesWithFewVotes()
                .then(() => displayMenu(readMenu, handleReadMenu))
                .catch((err) => console.error(err));
            break;
        case '6':
            findMoviesWithGenreShort()
            .then(() => displayMenu(readMenu, handleReadMenu))
            .catch((err) => console.error(err));
            break;
        case '7': // Go Back
            displayMenu(mainMenu, handleMainMenu);
            break;
        default:
            console.log("Incorrect key, please try again.");
            displayMenu(readMenu, handleReadMenu);
    }
}

// Aggregate menu handler
function handleAggregateMenu(input) {
    switch (input) {
        case '1':
            aggregateMoviesBefore1900()
                .then(() => displayMenu(aggregateMenu, handleAggregateMenu))
                .catch((err) => console.error(err));
            break;
        case '2':
            listWritersByFrequencyAndRating()
                .then(() => displayMenu(aggregateMenu, handleAggregateMenu))
                .catch((err) => console.error(err));
            break;
        case '3': // Go Back to Main Menu
            displayMenu(mainMenu, handleMainMenu);
            break;
        default:
            console.log("Incorrect key, please try again.");
            displayMenu(aggregateMenu, handleAggregateMenu);
    }
}

// Update menu handler
function handleUpdateMenu(input) {
    switch (input) {
        case '1':
            updateMovieRatingAndVotes()
                .then(() => displayMenu(updateMenu, handleUpdateMenu))
                .catch((err) => console.error(err));
            break;
        case '2':
            addFavouriteToUser()
                .then(() => displayMenu(updateMenu, handleUpdateMenu))
                .catch((err) => console.error(err));
            break;
        case '3':
            updateMovieWriter()
                .then(() => displayMenu(updateMenu, handleUpdateMenu))
                .catch((err) => console.error(err));
            break;
        case '4':
            updateMovieGenre()
                .then(() => displayMenu(updateMenu, handleUpdateMenu))
                .catch((err) => console.error(err));
            break;
        case '5': //Go back
            displayMenu(mainMenu, handleMainMenu);
            break;
        default:
            console.log("Incorrect key, please try again.");
            displayMenu(updateMenu, handleUpdateMenu);
    }
}

// Delete menu handler
function handleDeleteMenu(input) {
    switch (input) {
        case '1':
            deleteMovie_20109017_M_1()
                .then(() => displayMenu(deleteMenu, handleDeleteMenu))
                .catch((err) => console.error(err));
            break;
        case '2':
            deleteMovie_20109017_M_2()
                .then(() => displayMenu(deleteMenu, handleDeleteMenu))
                .catch((err) => console.error(err));
            break;
        case '3': // Go Back
            displayMenu(mainMenu, handleMainMenu);
            break;
        default:
            console.log("Incorrect key, please try again.");
            displayMenu(deleteMenu, handleDeleteMenu);
    }
}
// Mongo Create Functions
async function addMovie_20109017_M_1() {
    const movie = {
        _id: "20109017_M_1",
        title: "Avengers: Endgame",
        year: 2019,
        runtime: 181,
        cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth"],
        plot: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
        genres: ["Action", "Adventure", "Drama"],
        imdb: {
            rating: 9.3,
            votes: 546
        }
    };

    try {
        // Check if the movie already exists
        const existingMovie = await collection.findOne({ _id: movie._id });
        if (existingMovie) {
            console.log(`Movie with ID ${movie._id} already exists. Insertion skipped.`);
            return;
        }

        // Count movies before insertion
        const initialCount = await collection.countDocuments();
        console.log(`Current number of movies: ${initialCount}`);
        console.log("Press return key to add the movie...");
        await new Promise(resolve => rl.once("line", resolve)); // Wait for user input

        // Insert the movie
        await collection.insertOne(movie);

        // Count movies after insertion
        const newCount = await collection.countDocuments();
        console.log(`Movie added successfully! New movie total is: ${newCount}`);
    } catch (error) {
        console.error("An error occurred while adding the movie:", error);
    }
}

async function addMovie_20109017_M_2() {
    const movie = {
        _id: "20109017_M_2",
        title: "Inside Out 2",
        year: 2024,
        runtime: 100, // Placeholder runtime; verify and update
        cast: ["Amy Poehler", "Phyllis Smith", "Bill Hader", "Lewis Black"],
        plot: "Riley, now a teenager, navigates new emotions and challenges as she enters adolescence, with her emotions guiding her through the complexities of growing up.",
        genres: ["Animation", "Adventure", "Comedy"],
        imdb: {
            rating: 7.6,
            votes: 178
        }
    };

    try {
        // Check if the movie already exists
        const existingMovie = await collection.findOne({ _id: movie._id });
        if (existingMovie) {
            console.log(`Movie with ID ${movie._id} already exists. Insertion skipped.`);
            return;
        }

        // Count movies before insertion
        const initialCount = await collection.countDocuments();
        console.log(`Current number of movies: ${initialCount}`);
        console.log("Press return key to add the movie...");
        await new Promise(resolve => rl.once("line", resolve)); // Wait for user input

        // Insert the movie
        await collection.insertOne(movie);

        // Count movies after insertion
        const newCount = await collection.countDocuments();
        console.log(`Movie added successfully! New movie total is: ${newCount}`);
    } catch (error) {
        console.error("An error occurred while adding the movie:", error);
    }
}

// Create users code
async function addUser1() {
    const user = {
        _id: "20109017_u_1",
        name: "Alice Johnson",
        email: "alice.johnson@nomail.com",
        password: "securepassword123",
        userRole: "viewer",
        mobile: "1234567890",
        preferredName: "AJ",
        gender: "she/her",
        favourites: ["573a1390f29313caabcd4178", "573a1390f29313caabcd414a"] 
    };

    try {
        // Check if the user already exists
        const existingUser = await collection.findOne({ _id: user._id });
        if (existingUser) {
            console.log(`User with ID ${user._id} already exists. Skipping creation.`);
            return;
        }

        // Insert the user document
        await collection.insertOne(user);
        console.log(`User ${user._id} added successfully.`);
    } catch (error) {
        console.error("An error occurred while adding the user:", error);
    }
}

async function addUser2() {
    const user = {
        _id: "20109017_u_2",
        name: "Conor Leonard",
        email: "conor.leonard@setu.com",
        password: "password123",
        userRole: "admin",
        mobile: "087654321",
        preferredName: "Conor",
        gender: "he/him",
        favourites: ["573a1390f29313caabcd4192", "573a1390f29313caabcd4178", "573a1390f29313caabcd414a"]
    };

    try {
        // Check if the user already exists
        const existingUser = await collection.findOne({ _id: user._id });
        if (existingUser) {
            console.log(`User with ID ${user._id} already exists. Skipping creation.`);
            return;
        }

        // Insert the user document
        await collection.insertOne(user);
        console.log(`User ${user._id} added successfully.`);
    } catch (error) {
        console.error("An error occurred while adding the user:", error);
    }
}

async function addUser3() {
    const user = {
        _id: "20109017_u_3",
        name: "Charlie Brown",
        email: "charlie.brown@enotrealmail.com",
        password: "password789",
        userRole: "editor",
        mobile: "0862288228",
        preferredName: "CT",
        gender: "they/them",
        favourites: ["573a1390f29313caabcd418c", "573a1390f29313caabcd4192", "573a1390f29313caabcd418c"]
    };

    try {
        // Check if the user already exists
        const existingUser = await collection.findOne({ _id: user._id });
        if (existingUser) {
            console.log(`User with ID ${user._id} already exists. Skipping creation.`);
            return;
        }

        // Insert the user document
        await collection.insertOne(user);
        console.log(`User ${user._id} added successfully.`);
    } catch (error) {
        console.error("An error occurred while adding the user:", error);
    }
}


// MongoDB query functions
async function findLongTitles() {
    try {
        const query = { title: { $regex: /^.{31,}$/, $options: "s" } };
        const projection = { title: 1, directors: 1, runtime: 1, _id: 0 };
        const results = await collection.find(query, { projection }).sort({ title: 1 }).toArray();
        console.log("Movies with titles longer than 30 characters:");
        console.log(results);
    } catch (err) {
        console.error("Error executing query:", err);
    }
}

async function findMoviesOverTwoHours() {
    try {
        const query = { runtime: { $gte: 120 } };
        const projection = { title: 1, runtime: 1, _id: 0 };

        const results = await collection.find(query, { projection }).sort({ runtime: -1 }).toArray();
        fs.writeFileSync('movies_over_two_hours.json', JSON.stringify(results, null, 2));
        
        console.log("Movies over two hours saved to 'movies_over_two_hours.json'.");
    } catch (err) {
        console.error("Error executing query:", err);
    }
}

async function findDirectorsStartingWithB() {
    try {
        const query = { directors: { $regex: /^B/i } }; // Case-insensitive regex for names starting with 'B'
        const projection = { title: 1, directors: 1, _id: 0 };

        const results = await collection.find(query, { projection }).sort({ title: 1 }).toArray();
        fs.writeFileSync('directors_starting_with_b.json', JSON.stringify(results, null, 2));
        
        console.log("Movies with directors starting with 'B' saved to 'directors_starting_with_b.json'.");
    } catch (err) {
        console.error("Error executing query:", err);
    }
}

async function findMoviesWithHighRatings() {
    try {
        const query = { "imdb.rating": { $gte: 7 } };
        const projection = { title: 1, "imdb.rating": 1, _id: 0 };

        const results = await collection.find(query, { projection }).sort({ "imdb.rating": -1 }).toArray();
        fs.writeFileSync('movies_high_ratings.json', JSON.stringify(results, null, 2));
        
        console.log("Movies with ratings of 7 or more saved to 'movies_high_ratings.json'.");
    } catch (err) {
        console.error("Error executing query:", err);
    }
}

async function findMoviesWithFewVotes() {
    try {
        const query = { "imdb.votes": { $lte: 500 } };
        const projection = { title: 1, "imdb.votes": 1, _id: 0 };

        const results = await collection.find(query, { projection }).sort({ "imdb.votes": 1 }).toArray();
        fs.writeFileSync('movies_few_votes.json', JSON.stringify(results, null, 2));
        
        console.log("Movies with less than 500 votes saved to 'movies_few_votes.json'.");
    } catch (err) {
        console.error("Error executing query:", err);
    }
}
async function findMoviesWithGenreShort() {
    try {
        const query = { genres: "Short" }; // Matches movies with 'Short' in the genres array
        const projection = { title: 1, genres: 1, _id: 0 };

        const results = await collection.find(query, { projection }).sort({ title: 1 }).toArray();
        fs.writeFileSync('movies_genre_short.json', JSON.stringify(results, null, 2));
        
        console.log("Movies with the genre 'Short' saved to 'movies_genre_short.json'.");
    } catch (err) {
        console.error("Error executing query:", err);
    }
}

async function aggregateMoviesBefore1900() {
    try {
        const pipeline = [
            // Match movies made before 1900
            { $match: { year: { $lt: 1900 } } },
            
            // Unwind the genres array to process each genre individually
            { $unwind: "$genres" },
            
            // Group by genre
            {
                $group: {
                    _id: "$genres", // Group by genre
                    count: { $sum: 1 }, // Count of movies in this genre
                    avgRuntime: { $avg: "$runtime" }, // Average runtime
                    avgVotes: { $avg: "$imdb.votes" } // Average IMDb votes
                }
            },
            
            // Project the output in a readable format
            {
                $project: {
                    genre: "$_id", // Rename _id to genre
                    count: 1,
                    avgRuntime: { $round: ["$avgRuntime", 2] }, // Round average runtime to 2 decimals
                    avgVotes: { $round: ["$avgVotes", 2] }, // Round average votes to 2 decimals
                    _id: 0 // Exclude _id from the output
                }
            },
            
            // Sort by genre alphabetically
            { $sort: { genre: 1 } }
        ];

        const results = await collection.aggregate(pipeline).toArray();
        console.log("Movies made before 1900 - Aggregated by Genre:");
        console.table(results); // Use table for better console output
    } catch (err) {
        console.error("Error executing aggregation:", err);
    }
}

async function listWritersByFrequencyAndRating() {
    try {
        const pipeline = [
            // Unwind the writers array
            { $unwind: "$writers" },

            // Extract the first two words from the writer's name
            {
                $project: {
                    writerName: {
                        $reduce: {
                            input: { $slice: [{ $split: ["$writers", " "] }, 0, 2] }, // Get first two words
                            initialValue: "",
                            in: {
                                $concat: [
                                    "$$value",
                                    { $cond: [{ $eq: ["$$value", ""] }, "", " "] }, // Add space if not empty
                                    "$$this"
                                ]
                            }
                        }
                    },
                    imdbRating: "$imdb.rating" // Preserve IMDb rating
                }
            },

            // Group by writerName
            {
                $group: {
                    _id: "$writerName", // Group by the extracted name
                    count: { $sum: 1 }, // Count occurrences
                    totalRating: { $sum: "$imdbRating" } // Sum IMDb ratings
                }
            },

            // Calculate the average IMDb rating for each writer
            {
                $project: {
                    writer: "$_id", // Rename _id to writer
                    count: 1,
                    avgRating: { $round: [{ $divide: ["$totalRating", "$count"] }, 2] },
                    _id: 0 // Exclude _id from the output
                }
            },

            // Sort by frequency (descending) and then by average rating (descending)
            { $sort: { count: -1, avgRating: -1 } },

            // Limit to the top 50 writers
            { $limit: 50 }
        ];

        // Execute the aggregation pipeline
        const results = await collection.aggregate(pipeline).toArray();

        // Display results
        console.log("Top 50 Writers by Frequency and Average IMDb Rating:");
        console.table(results);
    } catch (err) {
        console.error("Error executing aggregation:", err);
    }
}

async function updateMovieRatingAndVotes() {
    try {
        const result = await collection.updateOne(
            { _id: "20109017_M_1" }, // Match movie with ID 20109017_M_1
            { $set: { "imdb.rating": 11 }, $inc: { "imdb.votes": 1 } } // Update rating and increment votes
        );
        console.log(`IMDB rating updated and votes incremented: ${result.modifiedCount} document(s) modified.`);
    } catch (error) {
        console.error("Error updating movie rating and votes:", error);
    }
}

async function addFavouriteToUser() {
    try {
        const result = await collection.updateOne(
            { _id: "20109017_u_3" }, // Match user with ID 20109017_u_3
            { $addToSet: { favourites: "20109017_M_2" } } // Add the movie ID to favourites array
        );
        console.log(`Favourite added to user: ${result.modifiedCount} document(s) modified.`);
    } catch (error) {
        console.error("Error adding favourite to user:", error);
    }
}

async function updateMovieWriter() {
    try {
        const result = await collection.updateOne(
            { _id: "20109017_M_1" }, // Match movie with ID 20109017_M_1
            { $set: { writer: "William Shakespear" } } // Update writer field
        );
        console.log(`Writer updated: ${result.modifiedCount} document(s) modified.`);
    } catch (error) {
        console.error("Error updating movie writer:", error);
    }
}
async function updateMovieGenre() {
    try {
        const result = await collection.updateOne(
            { _id: "20109017_M_2" }, // Match movie with ID 20109017_M_2
            { $set: { genres: ["Spoof"] } } // Update genres to "Spoof"
        );
        console.log(`Genre updated: ${result.modifiedCount} document(s) modified.`);
    } catch (error) {
        console.error("Error updating movie genre:", error);
    }
}

async function deleteMovie_20109017_M_1() {
    try {
        // Check if the movie exists
        const movie = await collection.findOne({ _id: "20109017_M_1" });
        if (!movie) {
            console.log("Movie with ID 20109017_M_1 does not exist. Deletion skipped.");
            return;
        }

        // Delete the movie
        const result = await collection.deleteOne({ _id: "20109017_M_1" });
        console.log(`Movie 20109017_M_1 deleted: ${result.deletedCount} document(s) removed.`);
    } catch (error) {
        console.error("Error deleting movie 20109017_M_1:", error);
    }
}


async function deleteMovie_20109017_M_2() {
    try {
        // Check if the movie exists
        const movie = await collection.findOne({ _id: "20109017_M_2" });
        if (!movie) {
            console.log("Movie with ID 20109017_M_2 does not exist. Deletion skipped.");
            return;
        }

        // Delete the movie
        const result = await collection.deleteOne({ _id: "20109017_M_2" });
        console.log(`Movie 20109017_M_2 deleted: ${result.deletedCount} document(s) removed.`);
    } catch (error) {
        console.error("Error deleting movie 20109017_M_2:", error);
    }
}



// Start the application
async function start() {
    try {
        await client.connect(); // Connect to MongoDB
        console.log("Connected to MongoDB");
        const db = client.db(database);
        collection = db.collection(collectionName);

        // Start the main menu
        displayMenu(mainMenu, handleMainMenu);
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        rl.close();
        client.close();
    }
}

start();

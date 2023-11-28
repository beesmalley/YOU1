<?php
// Connect to the database
define('DB_NAME', 'GSUPoster');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost');

$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//gonna add poster db setup here

// Check if the posters table exists, if not, create it
$checkTableQuery = "SHOW TABLES LIKE 'posters'";
$tableResult = $conn->query($checkTableQuery);

if ($tableResult->num_rows == 0) {
    $createTableQuery = "CREATE TABLE posters (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        event_id INT(6) UNSIGNED,
        user_id INT(6) UNSIGNED,
        title VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        poster_image VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    if ($conn->query($createTableQuery) === TRUE) {
        echo "Posters table created successfully";
    } else {
        echo "Error creating table: " . $conn->error;
    }
}

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $event_id = $_POST["event"];
    $user_id = $_COOKIE["userID"];
    $title = $_POST["title"];
    $name = $_POST["name"];
    $poster_image = $_FILES["posterImage"];
    $description = $_POST["description"];

    // Handle the uploaded image
    $posterImagePath = '';

    if ($poster_image['error'] === UPLOAD_ERR_OK) {
        $tmp_name = $poster_image["tmp_name"];
        $target_dir = "poster_uploads/";

        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }

        $target_file = $target_dir . basename($poster_image["name"]);
        
        if (move_uploaded_file($tmp_name, $target_file)) {
            $posterImagePath = $target_file;
        } else {
            echo "Sorry, there was an error uploading your file.";
            exit;
        }
    }

    // Insert the poster information into the posters table
    $insertQuery = "INSERT INTO posters (event_id, user_id, title, name, poster_image, description) VALUES ('$event_id','$user_id','$title', '$name', '$posterImagePath', '$description')";

    if ($conn->query($insertQuery) === TRUE) {
        echo "Poster added successfully";
    } else {
        echo "Error: " . $insertQuery . "<br>" . $conn->error;
    }
}

$conn->close();
?>
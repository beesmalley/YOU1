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

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $description = $_POST["description"];
    $thumbnail = $_FILES["thumbnail"];

    // Handle the uploaded image
    $thumbnailPath = ''; // Initialize the variable to store the image path in the database

    if ($thumbnail['error'] === UPLOAD_ERR_OK) {
        $tmp_name = $thumbnail["tmp_name"];
        $target_dir = "uploads/";

        // Check if the directory doesn't exist, then create it
        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true); // Creates the directory recursively with full permissions
        }

        $target_file = $target_dir . basename($thumbnail["name"]);

        // Check if the file is an image
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
        if ($imageFileType !== "jpg" && $imageFileType !== "png" && $imageFileType !== "jpeg") {
            echo "Sorry, only JPG, JPEG, PNG files are allowed.";
            exit;
        }

        // Move the uploaded file to the specified directory
        if (move_uploaded_file($tmp_name, $target_file)) {
            $thumbnailPath = $target_file;
        } else {
            echo "Sorry, there was an error uploading your file.";
            exit;
        }
    }

    // Insert the event information into the events table
    $insertQuery = "INSERT INTO events (Name, Description, Thumbnail) VALUES ('$name', '$description', '$thumbnailPath')";

    if ($conn->query($insertQuery) === TRUE) {
        echo "Event added successfully";
    } else {
        echo "Error: " . $insertQuery . "<br>" . $conn->error;
    }
}

$conn->close();
?>

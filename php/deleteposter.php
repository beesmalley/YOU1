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

// Handle the request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $posterId = $_POST["posterId"];

    // Prepare and execute SQL statement to delete the poster
    $deleteQuery = "DELETE FROM posters WHERE id = $posterId";

    if ($conn->query($deleteQuery) === TRUE) {
        echo json_encode(array("message" => "Poster deleted successfully"));
    } else {
        echo json_encode(array("error" => "Error deleting poster: " . $conn->error));
    }
}

$conn->close();
?>

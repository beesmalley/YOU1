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

$user_id = $_COOKIE["userID"];

$fetchQuery = "SELECT * FROM posters WHERE user_id = $user_id"; // Assuming 'event_id' is the field to match user IDs

$result = $conn->query($fetchQuery);

$posters = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $imageData = base64_encode($row['poster_image']);

        $poster = array(
            'ID' => $row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'image' => $imageData, // Include the base64 encoded image data
        );
        $posters[] = $poster;
    }
}

echo json_encode($posters);

$conn->close();
?>

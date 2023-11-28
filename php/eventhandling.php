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

// Check if the events table exists
$table_name = "events"; // Your events table name
$table_exists_query = "SHOW TABLES LIKE '$table_name'";
$table_exists_result = $conn->query($table_exists_query);

if ($table_exists_result->num_rows == 0) {
    // If the table doesn't exist, create it
    $create_table_query = "CREATE TABLE $table_name (
                            ID INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                            Name VARCHAR(100) NOT NULL,
                            Description TEXT,
                            Thumbnail MEDIUMBLOB,
                            Posted_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        )";

    if ($conn->query($create_table_query) === TRUE) {
        echo "Table created successfully";
    } else {
        echo "Error creating table: " . $conn->error;
    }
} else {
    // Fetch events data from the table if it exists
    $fetch_events_query = "SELECT * FROM $table_name";
    $fetch_events_result = $conn->query($fetch_events_query);

    $events = array();

    if ($fetch_events_result->num_rows > 0) {
        // Output data of each row
        while ($row = $fetch_events_result->fetch_assoc()) {
            $events[] = $row;
        }
        // Convert to JSON and send back to frontend
        echo json_encode($events);
    } else {
        // If no events exist, communicate that to the frontend
        echo json_encode([]);
    }
}

$conn->close();
?>
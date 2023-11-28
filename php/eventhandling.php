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
                            Posted_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            IsOpen TINYINT(1) NOT NULL,
                            OpenDate TIMESTAMP NULL DEFAULT NULL
                        )";

    if ($conn->query($create_table_query) === TRUE) {
        echo "Table created successfully";
    } else {
        echo "Error creating table: " . $conn->error;
    }
} else {
    // Fetch events from the database
$fetch_events_query = "SELECT * FROM events WHERE IsOpen = 1"; // Modify this query as needed
$result = $conn->query($fetch_events_query);

$events = array();

if ($result->num_rows > 0) {
    // Fetch event details and encode the image data to base64
    while ($row = $result->fetch_assoc()) {
        $event = array(
            'ID' => $row['ID'],
            'Name' => $row['Name'],
            'Description' => $row['Description'],
            // Other event details...

            // Fetch and encode the image data to base64
            'Thumbnail' => base64_encode($row['Thumbnail'])
        );

        // Add the event to the events array
        $events[] = $event;
    }
}

// Output events array as JSON
echo json_encode($events);

}

$conn->close();
?>
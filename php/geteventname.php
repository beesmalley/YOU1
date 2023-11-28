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

// Fetch event names from the events table
$fetch_events_query = "SELECT ID, Name FROM events WHERE IsOpen = 1"; // Modify this query as needed
$result = $conn->query($fetch_events_query);

$events = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $events[] = array(
            'id' => $row['ID'],
            'name' => $row['Name']
        );
    }
}

// Output events array as JSON
echo json_encode($events);

$conn->close();
?>

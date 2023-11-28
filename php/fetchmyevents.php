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

$fetchQuery = "SELECT * FROM user_event WHERE UserID = $user_id"; // Assuming 'event_id' is the field to match user IDs

$result = $conn->query($fetchQuery);

$myevents = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $eventId = $row['EventID'];

        // Fetch details of the event using its ID from the events table
        $eventQuery = "SELECT * FROM events WHERE ID = $eventId";
        $eventResult = $conn->query($eventQuery);

        if ($eventResult->num_rows > 0) {
            $eventRow = $eventResult->fetch_assoc();

            // Construct the event details
            $event = array(
                'EventID' => $eventId,
                'Name' => $eventRow['Name'],
                'Description' => $eventRow['Description'],
            );

            // Add the event to the events array
            $myevents[] = $event;
        }
    }
}

echo json_encode($myevents);

$conn->close();
?>

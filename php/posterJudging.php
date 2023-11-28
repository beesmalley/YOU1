<?php
define('DB_NAME', 'GSUPoster');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost');

$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

//check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

function getEventsFollowedByJudge($conn, $judgeId) {
    $stmt = $conn->prepare("SELECT EventID FROM user_event WHERE UserID = ?");
    $stmt->bind_param("i", $judgeId);
    $stmt->execute();
    $result = $stmt->get_result();
    $events = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    
    return array_column($events, 'EventID');
}

function assignPostersToJudges($conn, $eventIds) {
    if (empty($eventIds)) {
        return [];
    }

    $placeholders = implode(',', array_fill(0, count($eventIds), '?'));
    $types = str_repeat('i', count($eventIds));

    // Check if the judge_poster table exists, if not, create it
    $table_check_query = "SHOW TABLES LIKE 'judge_poster'";
    $table_check_result = $conn->query($table_check_query);

    if ($table_check_result->num_rows == 0) {
        // Table doesn't exist, create it
        $create_table_query = "CREATE TABLE judge_poster (
                                id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                                judge_id INT(6) NOT NULL,
                                poster_id INT(6) NOT NULL,
                                judged_status BOOLEAN DEFAULT FALSE
                            )";

        if ($conn->query($create_table_query) === FALSE) {
            // Handle error while creating table
            return [];
        }
    }
    //fetch all posters for the events
    $stmt = $conn->prepare("SELECT * FROM posters WHERE event_id IN ($placeholders)");
    $stmt->bind_param($types, ...$eventIds);
    $stmt->execute();
    $result = $stmt->get_result();
    $posters = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    if (empty($posters)) {
        return []; //return empty array if no posters
    }

    $assignments = [];
    foreach ($posters as $poster) {
        foreach ($eventIds as $eventId) {
            if ($poster['event_id'] == $eventId) {
                $assignments[$eventId][] = $poster;
            }
        }
    }

    return $assignments;
}

$judgeId = $_COOKIE["userID"];
$followedEvents = getEventsFollowedByJudge($conn, $judgeId);
$assignments = assignPostersToJudges($conn, $followedEvents);

echo json_encode(isset($assignments[$judgeId]) ? $assignments[$judgeId] : []);
?>

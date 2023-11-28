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
    $stmt = $conn->prepare("SELECT event_id FROM events_followed WHERE judge_id = ?");
    $stmt->bind_param("i", $judgeId);
    $stmt->execute();
    $result = $stmt->get_result();
    $events = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    
    return array_column($events, 'event_id');
}

function assignPostersToJudges($conn, $eventIds) {
    if (empty($eventIds)) {
        return [];
    }

    $placeholders = implode(',', array_fill(0, count($eventIds), '?'));
    $types = str_repeat('i', count($eventIds));

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

$judgeId = isset($_GET['judgeId']) ? intval($_GET['judgeId']) : 0;
$followedEvents = getEventsFollowedByJudge($conn, $judgeId);
$assignments = assignPostersToJudges($conn, $followedEvents);

echo json_encode(isset($assignments[$judgeId]) ? $assignments[$judgeId] : []);
?>

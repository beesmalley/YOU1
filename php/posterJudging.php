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

function assignPostersToJudges($conn, $eventIds) {
    $placeholders = implode(',', array_fill(0, count($eventIds), '?'));
    $types = str_repeat('i', count($eventIds));

    //fetch all posters for the events
    $stmt = $conn->prepare("SELECT * FROM posters WHERE event_id IN ($placeholders)");
    $stmt->bind_param($types, ...$eventIds);
    $stmt->execute();
    $result = $stmt->get_result();
    $posters = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    //fetch all judges for the events
    $stmt = $conn->prepare("SELECT * FROM judges WHERE event_id IN ($placeholders)");
    $stmt->bind_param($types, ...$eventIds);
    $stmt->execute();
    $result = $stmt->get_result();
    $judges = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    if (empty($posters) || empty($judges)) {
        return []; //return empty array if no posters or judges
    }

    $assignments = [];
    $totalJudges = count($judges);
    $totalPosters = count($posters);
    $postersPerJudge = ceil($totalPosters * 2 / $totalJudges);

    foreach ($judges as $judge) {
        $judgePosters = [];
        while (count($judgePosters) < $postersPerJudge) {
            foreach ($posters as $poster) {
                if (!in_array($poster, $judgePosters)) {
                    $judgePosters[] = $poster;
                    if (count($judgePosters) == $postersPerJudge) {
                        break;
                    }
                }
            }
        }
        $assignments[$judge['id']] = $judgePosters;
    }

    return $assignments;
}

$eventIds = isset($_GET['eventIds']) ? explode(',', $_GET['eventIds']) : [];
$judgeId = isset($_GET['judgeId']) ? intval($_GET['judgeId']) : 0;
array_walk($eventIds, function(&$id){ $id = intval($id); }); //rnsure all event IDs are integers

$assignments = assignPostersToJudges($conn, $eventIds);

if ($judgeId > 0 && isset($assignments[$judgeId])) {
    //return only the posters for the specific judge
    echo json_encode($assignments[$judgeId]);
} else {
    //return the entire assignment mapping
    echo json_encode($assignments);
}
?>

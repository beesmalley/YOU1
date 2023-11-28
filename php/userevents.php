<?php
define('DB_NAME', 'GSUPoster');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost');

$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$table_name = 'User_Event';

// Check if the table exists
$table_check_query = "SHOW TABLES LIKE '$table_name'";
$table_check_result = mysqli_query($conn, $table_check_query);

if (!$table_check_result) {
    die("Error checking table existence: " . mysqli_error($conn));
}

if (mysqli_num_rows($table_check_result) == 0) {
    // Table doesn't exist, create it
    $create_table_query = "CREATE TABLE $table_name (
                            ID INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                            UserID INT(6) NOT NULL,
                            EventID INT(6) NOT NULL,
                            UNIQUE KEY unique_user_event (UserID, EventID)
                        )";

    if (mysqli_query($conn, $create_table_query)) {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $event_id = $_POST["EventID"];
            $user_id = $_COOKIE["userID"];
    
            $insertQuery = "INSERT INTO User_Event (EventID, UserID) VALUES ('$event_id', '$user_id')";
            if ($conn->query($insertQuery) === TRUE) {
                echo "Event added successfully";
            } else {
                echo "Error: " . $insertQuery . "<br>" . $conn->error;
            }
        }
    } else {
        echo "Error creating table: " . mysqli_error($conn);
    }
} else {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $event_id = $_POST["EventID"];
        $user_id = $_COOKIE["userID"];

        $insertQuery = "INSERT INTO User_Event (EventID, UserID) VALUES ('$event_id', '$user_id')";
        if ($conn->query($insertQuery) === TRUE) {
            echo "Event added successfully";
        } else {
            echo "Error: " . $insertQuery . "<br>" . $conn->error;
        }
    }
}

mysqli_close($conn);
?>

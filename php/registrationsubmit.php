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
$table_name = "users"; // Your events table name
$table_exists_query = "SHOW TABLES LIKE '$table_name'";
$table_exists_result = $conn->query($table_exists_query);

if ($table_exists_result->num_rows == 0) {
    $create_table_query = "CREATE TABLE $table_name (
        id INT AUTO_INCREMENT PRIMARY KEY,
        account_type VARCHAR(255) NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255)
    )";
    if ($conn->query($create_table_query) === TRUE) {
        echo "Table created successfully";
    } else {
        echo "Error creating table: " . $conn->error;
    }
}

// Handle user registration
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $account_type = $_POST["account_type"];
    $first_name = $_POST["first_name"];
    $last_name = $_POST["last_name"];
    $email = $_POST["email"];
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);

    // Check if the email already exists in the users table
    $checkEmailQuery = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($checkEmailQuery);

    if ($result->num_rows > 0) {
        echo "Email already registered. Please use a different email address.";
    } else {
        // Email is not registered, proceed with registration
        $insertUserQuery = "INSERT INTO users (account_type, first_name, last_name, email, password)
            VALUES ('$account_type', '$first_name', '$last_name', '$email', '$password')";

        if ($conn->query($insertUserQuery) === TRUE) {
            echo "User registered successfully";
        } else {
            echo "Error registering user: " . $conn->error;
        }
    }
}

$conn->close();
?>

<?php
// Connect to the database
define('DB_NAME', 'ssmalley1');
define('DB_USER', 'ssmalley1');
define('DB_PASSWORD', 'ssmalley1');
define('DB_HOST', 'localhost');

$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

// Check if the properties table exists
$sql = "SELECT 1 FROM users LIMIT 1";
$result = mysqli_query($conn, $sql);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (!$result) {
    $createTableQuery = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        account_type VARCHAR(255) NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255)
    )";
    mysqli_query($conn, $createTableQuery);
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

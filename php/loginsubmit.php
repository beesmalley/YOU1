<?php
// Connect to the database
// Connect to the database
define('DB_NAME', 'ssmalley1');
define('DB_USER', 'ssmalley1');
define('DB_PASSWORD', 'ssmalley1');
define('DB_HOST', 'localhost');

$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    // Retrieve user data from the database based on the provided email
    $getUserQuery = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($getUserQuery);

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();

        // Verify the provided password against the hashed password in the database
        if (password_verify($password, $row["password"])) {
            // Password is correct, log in the user
            echo "Login successful!"; // You can customize this response
            setcookie("isLoggedIn", "true", time() + 86400);
            setcookie("accountType",$row["accountType"], time() + 86400);
            // Store user session or token for authentication
            // Example: $_SESSION["user_id"] = $row["id"];
        } else {
            echo "Incorrect password";
        }
    } else {
        echo "User not found";
    }
}

$conn->close();
?>
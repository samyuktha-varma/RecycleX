<?php
$host = "localhost";
$username = "root";
$password = "";  // or your MySQL password
$dbname = "recycleDB";

// Connect to DB
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Get POST data
$item = $_POST['item'];
$location = $_POST['location'];

// Insert into DB
$sql = "INSERT INTO recycle_items (item_name, location) VALUES ('$item', '$location')";
if ($conn->query($sql) === TRUE) {
  echo "Recycling data submitted successfully!";
} else {
  echo "Error: " . $conn->error;
}

$conn->close();
?>

try {
  db.createUser({
    user: "root",
    pwd: "rootpassword",
    roles: [{ role: "root", db: "admin" }]
  });
} catch (error) {
  if (error.code === 11000) {
    print('User already exists');
  } else {
    print('Error creating user: ' + error.message);
  }
}
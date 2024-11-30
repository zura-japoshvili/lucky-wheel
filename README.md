# Project Overview

**Lucky Wheel Betting** is a backend API built with **Node.js** and **Express.js** for a betting system where users can place bets on a wheel with 8 sections, each section having different multipliers (1x, 2x, 3x, 5x). The system manages user registration, login, and transaction history while handling bets and verifying the wheel spin results.

## Technologies Used:
- **Backend Framework**: Node.js and Express.js
- **Database**: MongoDB
- **Infrastructure**: Docker for containerization
- **Testing**: Jest for unit and integration testing

## Key Features:
- Configurable wheel with 8 sections and multipliers stored in the database
- User registration and authentication system
- Betting functionality with minimum and maximum bet limits
- Secure, random, and verifiable wheel spin mechanism
- User transaction history management

## Technical Requirements and Setup

### Requirements
To run this project locally, ensure the following are installed on your system:
- **Node.js** 
- **Docker** 

Optional but recommended for development:
- **TypeScript** (if you plan to modify the code)

### Technologies Used
- **Backend Framework**: Node.js and Express.js
- **Database**: MongoDB (can be swapped with PostgreSQL)
- **Testing**: Jest for unit and integration testing
- **Containerization**: Docker and Docker Compose

### Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/zura-japoshvili/lucky-wheel

   cd lucky-wheel
2. Create a .env file from the provided .env.example:
    ```bash
        cp .env.example .env
    ```
    Update the .env file with your specific environment variables, if necessary.

3. Build and start the application using Docker Compose:
    ```bash
    docker-compose up --build
    ```
    Access the API: The API should be running at http://localhost:3000 (or the port specified in your .env file).

### Notes

- Ensure Docker is running on your machine before executing the setup commands.
- If you need to stop the application, use:  
  ```bash
  docker-compose down
### For testing, run
 ```bash
    docker exec -it <container_name> npm test
```


## API Documentation

This project includes **Swagger** for API testing and documentation. Swagger provides an interactive interface to test endpoints, review request/response schemas, and understand the application's functionality.

> [!INFO]
> Each field in the request payload undergoes validation using **DTO (Data Transfer Object)** classes to ensure the data meets the required format and constraints. This helps maintain data integrity and enhances the reliability of the application.

**Accessing Swagger Documentation**
Once the application is running, access the Swagger UI at:

```bash
    http://localhost:<PORT>/api/swagger/#/
```
**The PORT** is defined in your .env file. By default, it is set to 3000.


For example, if PORT=3000, the Swagger documentation will be available at:
**http://localhost:3000/api/swagger/#/**

### Features in Swagger:

- **Interactive exploration:** View and test all available API endpoints.
- **Real data testing:** Send test requests to endpoints and receive responses.
- **Detailed request/response examples:** Review examples to understand expected data structures and interactions.

## Endpoints:

- POST /api/auth/login
- GET /api/wheel/config
- POST /api/bets/place
- POST /api/wheel/spin
- GET /api/user/history
- GET /api/user/balance
- POST /api/auth/register
- POST /api/migration/run 

 **Description:**   endpoint triggers the **migration** process to initialize the database with the required data. It is essential to run this step when setting up the application for the first time to ensure the database is properly configured.

 > [!WARNING]
 > Important: Before using the application, you must run the initial migration using the **/api/migration/run** endpoint to load the default wheel configuration into the database. Failure to do so may result in unexpected behavior.


 

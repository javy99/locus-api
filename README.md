# Locus API

## Description

This NestJS-based API provides a GET endpoint (`/locus`) for retrieving locus data from the PostgreSQL database. It allows filtering, pagination, sorting, and sideloading of related data. The API also implements JWT authentication with role-based access control, providing different levels of access for `admin`, `normal`, and `limited` users.  OpenAPI documentation is automatically generated using Swagger.

## Features

*   **GET /locus Endpoint:** Retrieves locus data with filtering, pagination, and sorting options.
*   **Filtering:** Supports filtering by `id`, `assemblyId`, `regionId`, and `membershipStatus`.
*   **Pagination:** Implements pagination with a default page size of 1000.
*   **Sorting:** Allows sorting by multiple fields in ascending or descending order.
*   **Sideloading:** Supports sideloading of `locusMembers` data.
*   **JWT Authentication:** Securely protects the API with JWT authentication.
*   **Role-Based Access Control:** Restricts access based on user roles (`admin`, `normal`, `limited`).
*   **OpenAPI/Swagger Documentation:**  Automatically generates API documentation using Swagger.

## Technologies

*   NestJS
*   PostgreSQL
*   TypeORM
*   JWT (JSON Web Tokens)
*   Swagger

## Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/javy99/locus-api.git
    cd locus-api
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    Create a `.env` file in the root directory with the following variables:

    ```
    DB_HOST=<database_host>
    DB_PORT=<database_port>
    DB_NAME=<database_name>
    DB_USER=<database_user>
    DB_PASSWORD=<database_password>
    JWT_SECRET=<your_jwt_secret>
    ```

4.  **Run the application:**

    ```bash
    npm run start:dev
    ```

## Usage

1.  **Access the API:**

    The API will be running at `http://localhost:3000`.

2.  **View Swagger documentation:**

    Open your browser and navigate to `http://localhost:3000/api` to view the automatically generated Swagger documentation. This is the easiest way to explore the available endpoints and parameters.

3.  **Authenticate:**

     You **must** authenticate to access the `/locus` endpoint. Use the `/auth/login` endpoint to obtain a JWT token. Provide the username and password for one of the predefined users (`admin`, `normal`, or `limited`).

    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password": "admin"}' http://localhost:3000/auth/login
    ```

    Example Response:

    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODIzNDU2NzAsImV4cCI6MTY4MjM0OTI3MH0.ExampleToken"
    }
    ```

4.  **Make API requests:**

    Include the JWT token in the `Authorization` header of your requests:

    ```bash
    curl -H "Authorization: Bearer <your_jwt_token>" "http://localhost:3000/locus?assemblyId=Macaca_fascicularis_6.0&page=1&rows=10"
    ```

    Example request to get locus data:

    ```
    GET /locus?assemblyId=Macaca_fascicularis_6.0&page=1&rows=10
    ```

## Predefined Users

The API includes three predefined users:

*   **admin:** Full access to all data and features.  Username: `admin`, Password: `admin`
*   **normal:** Access to a restricted set of columns in the `rnc_locus` table.  Cannot use sideloading. Username: `normal`, Password: `normal`
*   **limited:** Access only to data with `regionId` in (86118093, 86696489, 88186467). Username: `limited`, Password: `limited`

## Testing

To run the tests:

```bash
npm run test
```
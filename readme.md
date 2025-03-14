# API Documentation

## Table of Contents

- [Patient Routes](#patient-routes)
- [Login Routes](#login-routes)
- [Doctor Routes](#doctor-routes)
- [Department Routes](#department-routes)
- [Admin Routes](#admin-routes)

## Patient Routes

### Add Patient

- **Route:** `POST /add-patient`
- **Payload:**
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "gender": "Male",
    "age": 30,
    "blood_group": "A+",
    "treatment": "General Checkup",
    "mobile": "1234567890",
    "email": "john.doe@example.com",
    "address": "123 Main St"
  }
  ```
- **Response:**
  ```json
  {
    "status": true,
    "message": "Patient created successfully",
    "desc": "Patient Created Successfully",
    "tittle": "Success",
    "data": {
      // ...patient data...
    }
  }
  ```

### Delete Patient

- **Route:** `DELETE /delete-patient/:id`
- **Response:**
  ```json
  {
    "message": "Patient deleted successfully"
  }
  ```

### Update Patient

- **Route:** `PUT /update-patient/:id`
- **Payload:** (Any fields to update)
  ```json
  {
    "first_name": "John",
    "last_name": "Doe"
    // ...other fields...
  }
  ```
- **Response:**
  ```json
  {
    "message": "Patient updated successfully",
    "data": {
      // ...updated patient data...
    }
  }
  ```

### Get All Patients

- **Route:** `GET /get-patient`
- **Response:**
  ```json
  {
    "message": "Patients retrieved successfully",
    "data": [
      // ...list of patients...
    ]
  }
  ```

## Login Routes

### Login

- **Route:** `POST /login`
- **Payload:**
  ```json
  {
    "email_username": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "status": true,
    "message": "Login Success",
    "desc": "Welcome back! You are successfully logged in.",
    "token": "jwt-token"
  }
  ```

### Add Admin

- **Route:** `POST /add`
- **Payload:**
  ```json
  {
    "admin": {
      "first_name": "John",
      "last_name": "Doe"
    },
    "role": "admin",
    "email": "john.doe@example.com",
    "username": "johndoe",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "status": true,
    "message": "Admin created successfully",
    "desc": "new admin created successfully"
  }
  ```

### Check Token

- **Route:** `POST /check-token`
- **Response:**
  ```json
  {
    "status": true,
    "message": "valid token",
    "desc": ""
  }
  ```

### Logout

- **Route:** `POST /logout`
- **Response:**
  ```json
  {
    "status": true,
    "message": "Logout Successful",
    "desc": "You have been logged out"
  }
  ```

## Doctor Routes

### Add Doctor

- **Route:** `POST /add-doctor`
- **Payload:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "age": 40,
    "gender": "Male",
    "email": "john.doe@example.com",
    "mobile": "1234567890",
    "specialization": "Cardiology",
    "experience": 15,
    "qualifications": "MBBS, MD",
    "license": "12345",
    "schedule": [
      // ...schedule data...
    ],
    "username": "johndoe",
    "password": "password123",
    "about": "Experienced cardiologist"
  }
  ```
- **Response:**
  ```json
  {
    "status": true,
    "message": "Doctor created successfully",
    "doctorId": "doctor-id",
    "desc": "Doctor profile has been created successfully."
  }
  ```

### Get All Doctors

- **Route:** `GET /get-doctor`
- **Response:**
  ```json
  {
    "message": "Doctors retrieved successfully",
    "doctors": [
      // ...list of doctors...
    ],
    "pagination": {
      "totalDoctors": 100,
      "currentPage": 1,
      "totalPages": 10
    },
    "status": true,
    "desc": "List of doctors fetched successfully."
  }
  ```

### Delete Doctor

- **Route:** `DELETE /delete-doctor/:id`
- **Response:**
  ```json
  {
    "message": "Doctor deleted successfully"
  }
  ```

## Department Routes

### Add Department

- **Route:** `POST /add`
- **Payload:**
  ```json
  {
    "name": "Cardiology",
    "desc": "Heart related treatments"
  }
  ```
- **Response:**
  ```json
  {
    "status": true,
    "message": "Added Successfully",
    "desc": "Department Added Successfully"
  }
  ```

### Get All Departments

- **Route:** `GET /all-department`
- **Response:**
  ```json
  [
    {
      "department": "Cardiology",
      "desc": "Heart related treatments"
    }
    // ...other departments...
  ]
  ```

### Delete Department

- **Route:** `DELETE /delete-department/:departmentId`
- **Response:**
  ```json
  {
    "status": true,
    "message": "Deleted Department",
    "desc": "Department deleted successfully."
  }
  ```

## Admin Routes

### Add Admin

- **Route:** `POST /signup`
- **Payload:**
  ```json
  {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "username": "johndoe",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "status": true,
    "message": "Admin created",
    "desc": "new admin created successfully"
  }
  ```

# Md. Faizanuddin (Backend S3 bucket Project)
#### md.faizan9t9@gmail.com / 7000114161

## Table of Contents

1. [Getting Started](#getting-started)
2. [API Endpoints](#api-endpoints)
    - [1. Upload Files](#1-upload-files)
    - [2. Create Bucket](#2-create-bucket)
    - [3. Create List of Buckets](#3-create-list-of-buckets)
    - [4. Create Folder](#4-create-folder)
    - [5. Create List of Folders](#5-create-list-of-folders)
    - [6. Retrieve All Buckets](#6-retrieve-all-buckets)
    - [7. Retrieve Single File](#7-retrieve-single-file)
    - [8. Retrieve All Data in a Bucket or Folder](#8-retrieve-all-data-in-a-bucket-or-folder)
    - [9. Update Bucket or Folder Name](#9-update-bucket-or-folder-name)
    - [10. Update File](#10-update-file)
    - [11. Delete File or Folder](#11-delete-file-or-folder)
    - [12. Fetch Object by Filename](#12-fetch-object-by-filename)
3. [File Structure](#file-structure)
4. Support Video (Explain APIs and it's responses)
[Link Text](https://drive.google.com/file/d/1IQtaXIlOm3P8RJgRWGPw2wvQuXZYa9vT/view?usp=sharing)

## Getting Started

To get started with JK-Tech S3 API, follow the steps below:

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Start the server: `npm run server`

Now, the API is running locally, and you can start making requests to the endpoints described in the following sections.

## API Endpoints

### 1. Upload Files

#### Endpoint: `POST /upload/:bucketId`
- **Description**: Upload one or multiple files to a specified bucket or folder.
- **Request Type**: `POST`
- **Parameters**:
  - `bucketId`: ID of the bucket or folder where files will be uploaded.
- **Request Body**: Files to be uploaded using `multipart/form-data`.
- **Response**: JSON indicating the status of the upload.

### 2. Create Bucket

#### Endpoint: `POST /create/bucket`
- **Description**: Create a new bucket.
- **Request Type**: `POST`
- **Request Body**: JSON object containing the name of the bucket.
- **Response**: JSON indicating the status of the bucket creation.

### 3. Create List of Buckets

#### Endpoint: `POST /create/bucket-list`
- **Description**: Create multiple buckets at once.
- **Request Type**: `POST`
- **Request Body**: JSON object containing an array of bucket names.
- **Response**: JSON indicating the status of the bucket creation.

### 4. Create Folder

#### Endpoint: `POST /create/folder/:bucketId`
- **Description**: Create a new folder inside a specified bucket.
- **Request Type**: `POST`
- **Parameters**:
  - `bucketId`: ID of the bucket where the folder will be created.
- **Request Body**: JSON object containing the name of the folder.
- **Response**: JSON indicating the status of the folder creation.

### 5. Create List of Folders

#### Endpoint: `POST /create/folder-list/:bucketId`
- **Description**: Create multiple folders inside a specified bucket.
- **Request Type**: `POST`
- **Parameters**:
  - `bucketId`: ID of the bucket where the folders will be created.
- **Request Body**: JSON object containing an array of folder names.
- **Response**: JSON indicating the status of the folder creation.

### 6. Retrieve All Buckets

#### Endpoint: `GET /all-bucket`
- **Description**: Retrieve a list of all buckets with optional search, pagination, and filtering.
- **Request Type**: `GET`
- **Query Parameters**:
  - `search`: Optional string to filter buckets by name.
  - `page`: Optional page number for pagination.
  - `limit`: Optional limit for the number of buckets per page.
- **Response**: JSON containing the list of buckets and total count.

### 7. Retrieve Single File

#### Endpoint: `GET /file/:id`
- **Description**: Retrieve details of a single file by its ID.
- **Request Type**: `GET`
- **Parameters**:
  - `id`: ID of the file.
- **Response**: JSON containing details of the file.

### 8. Retrieve All Data in a Bucket or Folder

#### Endpoint: `GET /all-data/:id`
- **Description**: Retrieve all files and folders inside a specified bucket or folder with optional search, pagination, and filtering.
- **Request Type**: `GET`
- **Parameters**:
  - `id`: ID of the bucket or folder.
- **Query Parameters**:
  - `search`: Optional string to filter files and folders by name, filename, file URL, or file type.
  - `page`: Optional page number for pagination.
  - `limit`: Optional limit for the number of files and folders per page.
- **Response**: JSON containing the list of files and folders and total count.

### 9. Update Bucket or Folder Name

#### Endpoint: `PATCH /update/bucket`
- **Description**: Update the name of a bucket or folder by its ID.
- **Request Type**: `PATCH`
- **Request Body**: JSON object containing the `_id` and `name` to be updated.
- **Response**: JSON indicating the status of the update.

### 10. Update File

#### Endpoint: `PATCH /update-file`
- **Description**: Update the details of a file by its filename.
- **Request Type**: `PATCH`
- **Query Parameters**:
  - `filename`: Name of the file to be updated.
- **Request Body**: Files to be uploaded using `multipart/form-data`.
- **Response**: JSON indicating the status of the update.

### 11. Delete File or Folder

#### Endpoint: `DELETE /delete/:fileId`
- **Description**: Delete a file or folder by its ID with all associated files and folders.
- **Request Type**: `DELETE`
- **Parameters**:
  - `fileId`: ID of the file or folder.
- **Response**: JSON indicating the status of the deletion.

### 12. Fetch Object by Filename

#### Endpoint: `GET /fetch/:filename`
- **Description**: Fetch the object (file) using the provided filename.
- **Request Type**: `GET`
- **Parameters**:
  - `filename`: Name of the file to be fetched.


- **Response**: Binary data of the file.

## File Structure

The project has the following structure:

- `middleware`: Contains middleware functions for file upload and update.
- `models`: Contains the Mongoose model for buckets and files.
- `utils`: Contains utility functions, including the function to delete a folder and its associated files.
- `upload`: Directory where uploaded files are stored.
- `routes`: Contains the API routes and controllers.

## Support Video (Explain APIs and it's responses)

[Link Text](https://drive.google.com/file/d/1IQtaXIlOm3P8RJgRWGPw2wvQuXZYa9vT/view?usp=sharing)

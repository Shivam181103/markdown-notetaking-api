# Markdown Note-Taking Backend API

This is a **Node.js & Express.js** based backend application for a **Markdown Note-Taking System** with the following features:

- **Save Markdown Notes** in MongoDB
- **List Saved Notes**
- **Check Grammar** using LanguageTool API
- **Convert Markdown to HTML**

---

## **Setup & Installation**

### **1. Clone the Repository**
```sh
git clone <your-repository-url>
cd <your-repository-folder>
```

### **2. Install Dependencies**
```sh
npm install
```

### **3. Start MongoDB** (if running locally)
Ensure you have **MongoDB** installed and running:
```sh
mongod --dbpath=/path/to/your/mongo/data
```

### **4. Start the Server**
```sh
npm start
```
The server will run on **http://localhost:5000**.

---

## **API Endpoints**

### **1. Get List of Notes**
**Endpoint:** `GET /list`

#### **Response:**
```json
[
  {
    "_id": "651234abcd5678ef9012",
    "title": "Sample Note",
    "content": "# Hello\nThis is a markdown note.",
    "createdAt": "2024-03-19T12:34:56.789Z"
  }
]
```

---

### **2. Check Grammar of a Markdown Note**
**Endpoint:** `POST /check`

#### **Request Body:**
```json
{
  "content": "This is a sample text with mistake in it."
}
```

#### **Response (if grammar mistakes exist):**
```json
{
  "message": "Please correct your Content",
  "details": { "matches": [...] }
}
```

#### **Response (if no mistakes found):**
```json
{
  "message": "OK"
}
```

---

### **3. Save a Markdown Note**
**Endpoint:** `POST /add`

#### **Request Body:**
```json
{
  "title": "My Note",
  "content": "# Hello World\nThis is a markdown note."
}
```

#### **Response:**
```json
{
  "message": "Saved Successfully"
}
```

##### **Validation Rules:**
- **Title & Content** are required.
- Content must be **10-2000 characters long**.
- No duplicate titles allowed.
- Grammar check must pass before saving.

---

### **4. Convert Markdown to HTML**
**Endpoint:** `POST /md-to-html`

#### **Request Body:**
```json
{
  "content": "# Hello World\nThis is **bold** text."
}
```

#### **Response:**
```json
{
  "html": "<h1>Hello World</h1>\n<p>This is <strong>bold</strong> text.</p>"
}
```

---

## **Environment Variables (Optional)**
Modify `.env` file to set MongoDB connection URL:
```sh
MONGO_URI=mongodb://localhost:27017/markdown-notetaking-db
```

---

## **Technologies Used**
- **Node.js & Express.js** (Backend API)
- **MongoDB & Mongoose** (Database)
- **Marked.js** (Markdown to HTML Conversion)
- **LanguageTool API** (Grammar Checking)

---
 
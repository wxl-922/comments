# Comments

## Database Setup
#### Step 1: Create the comments_db database in PostgreSQL
```
CREATE DATABASE comments_db;
```
#### Step 2: Enter backend directory
```
cd backend
```
#### Step 3: Convert the JSON file into database table
```
python database.py
```

## Backend Setup
#### Step 1: Enter backend directory
```
cd backend
```
#### Step 2: Install all the requirements
```
pip install -r requirements.txt
```
#### Step 3: Run Flask server
```
python app.py
```

## Frontend Setup
#### Step 1: Enter frontend directory
```
cd frontend
```
#### Step 2: Install all dependencies
```
npm install
```
#### Step 3: Start React
```
npm start
```

## Note
I didn’t have time to complete Part 3. If I had more time, 
I would finish Part 3 and conduct additional testing on the backend API. 
For example, I would not allow comments to be submitted 
when the user input is empty or contains only spaces. 
I would also make the frontend page look better.

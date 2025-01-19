# railway-grievance-system

A web application using the following tech stack: Flask (Python), SQLite, HTML, CSS, and JavaScript. The web app should serve as an Indian Railways Grievance Management System with the following features and workflow:     

1. **User Registration and Authentication**:  
   - Passengers register with a username and password, which are stored securely in an SQLite database.  
   - Provide login functionality for registered users.  

2. **Complaint Submission**:  
   - After logging in, passengers fill out a form to submit complaints related to their train journey, including personal details and complaint details.  

3. **Complaint Categorization and Prioritization**:  
   - Perform keyword-based **complaint categorization** into predefined departments: Health, Pantry, Safety, Cleanliness, and Convenience.  
   - Implement a **priority score** system considering the passenger’s gender, age, and complaint severity to prioritize complaints.  

4. **Staff Assignment System**:  
   - Implement an algorithm to assign complaints only to **available railway staff members**.  
   - Multiple staff members can exist in a department, but complaints should be routed to free members only.  

5. **Complaint Tracking**:  
   - Provide passengers with a way to **track the status of their complaints** from submission to resolution.  

6. **Feedback and Sentiment Analysis**:  
   - Allow passengers to submit feedback after complaint resolution.  
   - Implement **sentiment analysis** on feedback to evaluate satisfaction.  

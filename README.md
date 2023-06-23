# GameReviews
A game review application made with React for frontend, Asp.net Core for backend, and Microsoft SQL.
 
Installation Guide:
Firstly, clone the repository on your own machine.

For Backend:
1. Run the CreateDatabase.sql script to have access to the database 
1. Create an appsettings.development.json and add in it a "frontend_url": "http://localhost:3000", a jwtkey value and connectionStrings
for DefaultConnection with database, AzureStorageConnection, and Email App password key
2. Open the folder GameReviewsAPI with Visual Studio and restore the NuGet Dependencies 
3. Run the application

For Frontend:
1. Open the folder game-reviews-client in Visual Studio Code
2. Restore the dependencies using the command npm install in a new terminal
3. Run the application with npm start command


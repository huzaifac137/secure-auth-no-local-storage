# secure auth no local storage
 

`npm install`

Do this in both frontend and backend folders so project can install all required dependencies
 
` .env File`

Include your own .env file with the same variable names as in my code to run the code properly


`Description`

1) When user is logged in , its info is not stored in local storage thus discarding the beginners friendly auth approach which is not so secure.
2) A refresh token is stored on the server side when user is logged in , which is longer lived token and access token is sent back to the frontend client for the auth purpose.
3) Everytime page is refreshed or any new page is visited which requires user login info a request to the backend is made to check if the refresh token exists .
4) If the refresh token is existing , a new access token is sent back to client containing the logged in info of user and that info is used to authenticate the user.
5) The best part is that we eliminate the risk of cross-site-scripting ( XSS) .

`When not to use it`

It is not always an ideal approach because sometimes app is big enough that sending request to server for new token many times may affect the user experience of app as loading time may increase. 


` Combining both approaches for convinience and security `

What you can rather do is when user is logged in first time , access token sent back to the client you can store in in local storage but for short time and only demand new access toen from server using refresh token when the access token time has been expired. You can check that in my another repository which is realtime private chat app 

https://github.com/huzaifac137/realtime_private_chat_app


Thanks for paying attention to my work , i really appreciate it!


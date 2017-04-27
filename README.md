Show of Hands
---

####David Ivey, Asad Mehdi, Joseph Noel, Nathan Strelser, Max Wang
ITWS4500 Spring 2017 Group Project

Visit http://159.203.84.202:3000/

Github: https://github.com/mwang25277/ShowOfHands

Instructions to run (after downloading files):

1. npm install
2. npm start 
3. There is an admin page (admin.html. the server is hosted on port 3000 so go to localhost:3000/admin.html) which just has a button which creates the database. It takes a sec (we don't have a way to tell when it's done besides checking the collections).
4. Go to index.html or just localhost:3000/ and have fun!

---

###Overview and Reasoning
The project will be a web application that provides analytics on United States federal legislative data, with a main focus on congressional voting data. The web application will include data visualizations on a variety of different interesting metrics. For example, one such metric could be how much a particular congressman voted in/out of his/her party. Essentially, the application will give users an easy way to understand and interpret the data that is analyzed.

The motivation for this project is to provide an interface which gives users an easy way to view different data metrics in a visually engaging way. Currently there are some websites which let you search this type of data, but the proposed application will present some interpretations and analysis of the data, rather than just showing it.

---

###Planned Functionality
####*Functional Requirements*

 - The application will display various interpretations of the data
 - A user will be able to view information on bill voting data in a concise and easy to understand way
 - Application will include a brief summary of every congressman and data related to each of them

####*Non-Functional Requirements*

- User should be able to view data analytics and not be confused or
   overwhelmed
- User should find it easy to find and view a summary of
   different bills and their associated voting data

---

###Technical Details
We will be utilizing the MEAN  stack for development of the application.

We will primarily be making use of the ProPublica Congress API (https://propublica.github.io/congress-api-docs/) which provides legislative data from the House of Represenatives, the Senate, and the Library of Congress. The API includes details about members, votes, bills, and other aspects of congressional activity. 

The ProPublica API responds with JSON and XML, so we will be using AJAX in order to parse the data. We will use HTML5, CSS3, and JavaScript for the frontend.



Closing Thoughts:

Joe: A good exercise and experience with an API that isn't Twitter. With more time the site could use some UI polishing, but overall is useable and meaningful as is.

Asad: Overall it was a good experience working on this project. I learned a lot about querying from a third-party API, and managing a database. Although we ran into some issues regarding the asynchronous nature of the application, I think our overall product was well done.

Nathan: upon finishing the project for the semesyter  i learned alot about other ways api's send data, besides the twitter api which is the only one we used in class. node is annoying sometimes with synch issues. id like to add a search button to the bills page where you can search keywords in the title of bills to make it more usable, but for now it works and people can find bills. i believe its a useful site that with more work could be something people could use

David: This project gave me a wonderful opportunity to further improve the skills I have developed in the course. I enjoyed working with the Propublica API as well working more with MongoDB. Creating the information visualized in the application from the data given by the API proved to be a fun challenge, and I believe the knowledge I gained from doing so will prove helpful in the future.

Max: I learned a lot from this semester. Being able to develop applications using the MEAN stack is super helpful and useful for the future.
	 In addition, a lot of this was learning how to use various APIs, getting the data, analyzing the data, and then displaying the data. That
	 was also super cool. Overall, I'm pretty satisfied with how this turned out.


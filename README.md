Show of Hands
---

####David Ivey, Asad Mehdi, Joseph Noel, Nathan Strelser, Max Wang
ITWS4500 Spring 2017 Group Project

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

We will primarily be making use of the ProPublica Congress API (https://propublica.github.io/congress-api-docs/) which provides legislative data from the House of Represenatives, the Senate, and the Library of Congress. The API includes details about members, votes, bills, and other aspects of congressional activity. We may also make use of the congress-legislators project (https://github.com/unitedstates/congress-legislators) and the congress project (https://github.com/unitedstates/congress).

The ProPublica API responds with JSON and XML, so we will be using AJAX in order to parse the data. We will use HTML5, CSS3, and JavaScript for the frontend.

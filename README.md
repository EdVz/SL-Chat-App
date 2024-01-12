This is a chat app developed with react for the frontend part, and express for the backend part. 
The chat app uses web sockets for real-time messages.

A pre-trained machine learning model is used for detecting toxicty in the messages about to being sent.
If the model determines that the message is toxic (is an insult, includes sexual content or is racist) the message will not be sent and the sender gets a warning indicating the message was inappropriate.

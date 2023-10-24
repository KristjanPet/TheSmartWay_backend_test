# Learning App API

This API is designed to support a learning application where users can register, log in, create notes, and within those notes, add cards with questions and answers. Users can also grade cards based on their understanding, with a grade of 5 indicating that the card topic is fully understood or "finished".

## Endpoints

### Auth

- **GET** `/api/auth`: Fetch the current loged in user.
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Log in an existing user.
- **POST** `/api/auth/signout`: signout user.

### User

- **GET** `/api/user`: Fetch all user's details.
- **GET** `/api/user/:id`: Fetch the current user's details.
- **PATCH** `/api/user`: Update the current user's details.
- **POST** `/api/user`: create a user.
- **DELETE** `/api/user`: Delete the current user's account.

### Notes

- **GET** `/api/note/:id/percent`: Get percent of finished questions.
- **POST** `/api/v1/note`: Create a new note.

### Cards

- **GET** `/api/card/:id`: Fetch all cards for the current user.
- **GET** `/api/card/:id/marks`: Fetch all cards for the current user with marks.
- **POST** `/api/card/:id`: Create a new card.
- **PATCH** `/api/card/:id/reset`: Reset all cards in note.

### Marks

- **POST** `/api/mark`: Create a new mark.

## Grading System

Users can grade cards on a scale of 1 to 5, with the following interpretations:
- **1**: Needs more review.
- **2**: Partially understood.
- **3**: Fairly understood but needs more practice.
- **4**: Well understood with minor uncertainties.
- **5**: Fully understood (Finished).

Once a card is graded as 5, it's considered "finished".

## Rate Limiting

To ensure fair usage and prevent abuse, the API has rate limiting in place. Each IP is limited to 100 requests every 15 minutes. Exceptions may apply to certain routes.

## Versioning

The current version of the API is `v1`.

---

For more details on request payloads, headers, and specific response structures, refer to the API documentation available at `/api/v1/docs`.

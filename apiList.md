# API List 

## authRouter:
- POST/singUp
- POST/login
- POST/logout

## profileRouter:
- GET/profile/view
- PATCH/profile/edit
- PATCH/profile/password // Forget Password API

## connectionRequestRouter:
// From my feed either I ignored the profile or request the profile (status : Ignored, Intersted)
// From my requestReceived either I can accept or reject the profile (status: Accepted, Rejected)

- POST/request/send/:status/:toUserId
 // POST/request/send/interested/:userId
 // POST/request/send/ignored/:userId

- POST/request/review/:status/:requestId
 // POST/request/review/accepted/:requestId
 // POST/request/review/rejected/:requestId

## userRouter:
- GET/user/connections // list of users who are connected means have status accecpted
- GET/user/request/received // list of users who send the interested request
- GET/user/feed (all the profile visible for reject / accept or gets the profiles of other users on the platform)

## pagination in the feed 
- GET/user/feed?page=1&limit=10 -> 1-10 -> .skip(0) .limit(10)
- GET/user/feed?page=2&limit=20 -> 11-20 -> .skip(10) .limit(20)
- GET/user/feed?page=3&limit=30 -> 21-30 -> .skip(20) .limit(30)
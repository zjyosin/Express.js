# Express Router: 

As application grows, maintaining all routes in a single file can become unmanageable.
express.Router() provides a way to organize related routes together and apply middleware to them efficiently.

Handle routing in a proper way using express.Router. We use this to manage the API and we will group the API different type of routers.
- refer apiList.md where grouping of API is done and based on that different routers are created.

NOTE: using express.Router is same as we use express to create API.


# Mongoose

## Operator: 
There are multiple opertors provided by mongodb few mentioned below and link of others: 
Logial Operators : $or, $and, $not, $nor
Comparison Operator: $eq, $in etc..
- https://www.mongodb.com/docs/manual/reference/operator/

## pre: https://mongoosejs.com/docs/middleware.html
few which we used in the application : pre -> its a middleware and it will execute everytime any Schema or data is saved (
    calling this method to execute before save
)
If you are using pre middleware always call next() so the next function which is save or anyother will get called


# Adding indexes in the database:
## indexes:
As data grow into database, we need indexes into database for better search or for executing query efficiently. 
Using index, API will become fast.
we have to add index = true in the Schema.

if we add unqiue = true to any of the field it will create index automatically. 
example:  we added unique = true in emailId,
so whenever we search or find anything with email id it uses emailId as indexes

## Compound indexes: 
Compound indexes collect and sort data from two or more fields.
Data is grouped by the first field in the index and then by each subsequent field.
example: { userid: 1, score: -1}
        documents are first grouped by userid in ascending order (alphabetically).
        Then, the scores for each userid are sorted in descending order:

## ref and populate
- Ref: Refering any of the schema field to other schema, creating link between two schemas(tables) which will ease fetching data based on that. In our project we use ref to connect connectionRequest Schema to user Schema by adding ref in fromUserId and toUserId.
With the help of ref moongoose lets you to reference documents in other collection.

- Populate: Use to populate data from different collections based on any id.
example: we have two collections("connectionRequest", "user"), where we have use ref for the field toUserId and fromUserId so they linked with _id of user collection, we can use populate() to get full user information from the Users collection. This makes it easier to access related data without having to manually query each collection.


## .Skip() and .limit()
- Skip and limit in monogodb helps in paginations. 
.skip() means how many documnets we want to skip from start/first
.limit() means how many documents you want



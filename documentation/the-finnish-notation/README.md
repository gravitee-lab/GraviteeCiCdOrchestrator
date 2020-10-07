# About the Finnish notation and `rxjs`

This is a code convention named **Finnish Notation**, apparently due to the origin of the developer that is attributed for first using it. It's used to indicate the `Observable` type of a variable or function.

The idea is that an Observable usually represents a stream of multiple Values and a pluralized variable / function name would indicate this. To not be confused with array variables (which are usually also pluralized), the `$` character is used instead of the s. When reading the variable, you'd read the `$` as an `s`. Example:

When naming an array, you'll most likely use the proper plural form of a single element's name, as in:

```JavaScript
const pets = ['cat', 'dog', 'turtle']
```

While, if you had an observable that emitted those three values, you'd use:

```JavaScript
const pet$ = from(['cat', 'dog', 'turtle']) // read: pets
```

It's up to you and your team whether you want to use it. I guess there is no explicit consensus as of now, so you can have a long and meaningful argument about it ;-). There are already `tslint` rules available that allow you to enforce your decision.


## References

* https://stackoverflow.com/questions/43083577/what-does-sign-at-the-end-of-function-name-indicate/43083604
* https://medium.com/@benlesh/observables-and-finnish-notation-df8356ed1c9b

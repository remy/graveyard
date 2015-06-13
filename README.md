# graveyard

This simple express middleware will cache those 410 (gone) requests.

Usage: 

Where app is your express app, add this middleware nice and high in the middleware stack.

```js
app.use(require('graveyard')(['/url/to/ignore']));
```

## 主要介绍response
fetch().then(response)

**response Properties**
1. Resonse.body (read only)
   A ReadableStream of the body contents

2. Response.bodyUsed (read only)
   Stores a boolean value that declares whether the body has been used in a response yet

3. Response.headers
   The Headers object associated with the response.

4. Response.ok
   A boolean indicating whether the response was successful(status in the range 200 -299)

5. Response.type
   The type of the response

6. Response.url
   The URL of the response

Static methods
  1. Response.error()
  2. Response.redirect()

Instance methods

1. Response.arrayBuffer()
   Returns a promise that resolve with an ArrayBuffer representation of the response body

2. Response.blob()
   Returns a promise that resolves with a Blob representation of the response body

3. Response.clone()
   Creates a clone of a Response object

4. Response.formData()
   Returns a promise that resolves with a FormData representation of the response body

5. Response.json()
   Ruturns a promise that resolves with the result of parsing the response body text as JSON

6. Response.text()
   Returns a promise that resolves with a text representation of the response body.

# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
```Hello S3!```

HTTP/1.1 201
[Asserts]
header "Location" matches "^localhost:8080\/v1\/fragments\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 9
[Captures]
url: header "Location"

# 2. Try to GET the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Length: 9
[Asserts]
header "Content-Type" matches "^.*text\/plain.*$"
body == "Hello S3!"

# 3. Try to DELETE the fragment we just posted by its URL
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

# 2. Try to GET the fragment we just deleted by its URL
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404

[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error" exists
jsonpath "$.error.code" == 404
jsonpath "$.error.message" isString
# Unauthenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
Content-Type: multipart/form-data
```This is a fragment!```

HTTP/1.1 401
# We have various assertions about the response that we want to check
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error" exists
jsonpath "$.error.code" == 401
jsonpath "$.error.message" isString
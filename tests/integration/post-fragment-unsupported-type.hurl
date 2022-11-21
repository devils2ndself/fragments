# Unsupported type POST to /v1/fragments
POST http://localhost:8080/v1/fragments
Content-Type: multipart/form-data
[BasicAuth]
user1@email.com:password1
```This is a fragment!```

# We expect to get back an HTTP 415
HTTP/1.1 415
# We have various assertions about the response that we want to check
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error" exists
jsonpath "$.error.code" == 415
jsonpath "$.error.message" isString
# 404 Test
GET http://localhost:8080/test

# We should get back an HTTP 1.1 404 response
HTTP/1.1 404

# Extra checks to perform against the response
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error" exists
jsonpath "$.error.code" == 404
jsonpath "$.error.message" isString
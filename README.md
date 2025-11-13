# Mozilor-Test
QA assesment
1. need to install dependencies:"@faker-js/faker" and "exceljs"
2. oginValidation.spec.js - scenariosn for the login validation message
3. auth-signup-and-login.spec.js - create a new user and login as valid user
4. checkoutProduct.spec.js - logged-in and guest users. It ensures the correct navigation, product details, cart validation,    payment flow, and guest login prompts.

5. please look into package.json.


note:

execute the script as below order becuase, the test is dependant on test dat created by the "auth-signup-and-login.spec.js"
1. auth-signup-and-login.spec.js
2. loginValidation.spec.js
3. checkoutProduct.spec.js


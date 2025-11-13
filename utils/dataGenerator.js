import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

export function generateUser() {
  
  const trimText = (text, maxLength) => text.substring(0, maxLength);

  const userDetails =  {
    username: trimText(faker.internet.username(), 15),
    email: faker.internet.email(),
    password: 'Password_1!',
    confirmPassword: 'Password_1!',
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phoneNumber: '+9112549865',
    country: 'India',
    city: 'Thrissur',
    address: faker.location.streetAddress(),
    state: 'Kerala',
    postalCode: faker.location.zipCode('######')
  };

  const filePath = path.resolve(__dirname, '../test-data/latestUser.json');
  fs.writeFileSync(filePath, JSON.stringify(
      { 
        username: userDetails.username,
        password: userDetails.password,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        phoneNumber: userDetails.phoneNumber,
        country: userDetails.country,
        city: userDetails.city,
        address: userDetails.address,
        state: userDetails.state,
        postalCode: userDetails.postalCode
      },null,2)
  );

  return userDetails;

}


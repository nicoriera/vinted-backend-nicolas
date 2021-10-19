# Vinted API

Vinted API is a miniature-scale reproduction of the Vinted API to make my [Vinted replica work](https://nicolas-riera-vinted-training.netlify.app/). This API allows users to : create an account, log to this account, create an offer, update this offer (including uploading pictures), filter the offers and delete an offer.

Frontend project is here: 👉 [Frontend](https://github.com/nicoriera/training-vinted-frontend)

## Prerequisties

Before you begin, ensure you have met the following requirements:
* You have installed the latest version of `node.js`, `MongoDB` and you have a [Cloudinary](https://cloudinary.com/) account 
* You have a `Windowd/Linux/Mac` machine.

*Option : you can install [Postman](https://www.postman.com/) to easily make requests.*

## Installing Vinted API

To install Vinted API, follow these steps:
1. Download the code

2. Install all the npm packages needed typing the following install command in a terminal (make sure you are in the good folder):
```
npm i
```
3. Create a `.env` file at the root of the project and store the following environment variables:
```
CLOUDINARY_NAME = <your-cloudinary-name>
CLOUDINARY_API_KEY = <your-cloudinary-api-key>
CLOUDINARY_API_SECRET = <your-cloudinary-api-secret>
MONGODB_URI = <your-mongodb-uri>
PORT = <the-listening-port-of-your-server>
```


## Using Vinted API

To use Vinted API, follow these steps:
1. Start your server typing the following command in a terminal (make sure you are in the good folder):
```
npx nodemon index.js
```

2. Make requests using `Postman` (this is not mandatory, but it is an easy way to send requests):



## Route details

</br>

### User routes

#### Signup route
* URL: `http://localhost:<your-port>/user/signup`
* Method HTTP: POST
* Goal: Enable a user to create an account
* Request parameters:
  
  Key name | Parameter type | Value type |  Value example
  ---------------|--------------- | --------- | --------
  email | body | string | nicolas@example.com
  username |  body | string | Nicolas
  phone |  body | string | 660550110
  password | body | string | azerty

  </br>

#### Login route
* URL: `http://localhost:<your-port>/user/login`
* Method HTTP: POST
* Goal: Enable a user to log in to his/her account
* Request parameters:
  
  Key name | Parameter type | Value type |  Value example
  ---------------|--------------- | --------- | -------
  email |  body | string | nicolas@example.com
  password |  body |string | azerty
  
</br>

### Offer routes

#### Create-an-offer route

* URL: `http://localhost:<your-port>/offer/publish`
* Method HTTP: POST
* Goal: Create a new offer
* Headers: Authorization Bearer Token
* Request parameters:
  
  Key name | Parameter type | Value type |  Value example
  ---------------|--------------- | --------- | --------
  title |  body |string | T-shirt 
  description |  body | string | T-shirt en coton bio
  price |  body | number | 30
  condition |  body | string | Peu utilisé
  city |  body | string| Paris
  brand |  body | string | Carhartt
  size |  body | string | M
  color |  body | string | rouge
  picture |  body | picture file | picture.png

  
  **NB:**
  * **You must specify the following parameters: price, description and title**
  
  ⚠️ Do not forget to add a Bearer Token in your request:
  
</br>

#### Update-an-offer route (Route create but not yet use in Frontend)

* URL: `http://localhost:<your-port>/offer/update`
* Headers: Authorization Bearer Token
* Method HTTP: PUT
* Goal: Update an offer. The image stored in `Cloudinary` as well as the image data stored in `MongoDB` are updated.
* Request parameters:
  
  Key name | Parameter type | Value type |  Value example
  ---------------|--------------- | --------- | --------
  title |  body |string | Nike Air Max
  description |  body | string | Nike Air Max 180 grise comme neuve
  price |  body | number | 130
  condition |  body | string | Neuf
  city |  body | string| Paris
  brand | body |  string | Nike
  size | body |  string | 42
  color | body | string | Gris
  picture |  body | picture file | picture.png
  picture-to-delete | body | `Cloudinary` public_id | vinted/offers/60a92672bbc1c248b41534c4/zbx5fvdw4qnvazykxwju
  id |  body | `MongoDB` ObjectId of the offer you want to update | 60a92672bbc1c248b41534c4
   
  
  **NB:**
  * **You can specify as many parameters as you please (ie none or all). Only the `id` parameter is mandatory**
  
  ⚠️ Do not forget to add a Bearer Token in your request.
  
  </br>
  
#### Delete-an-offer route (Route create but not yet use in Frontend)
  
* URL: `http://localhost:<your-port>/offer/delete`
* Headers: Authorization Bearer Token
* Method HTTP: DELETE
* Goal: Delete an offer. The image(s) stored in `Cloudinary` as well as the data stored in `MongoDB` are deleted.
* Request parameters:
  
  Key name | Parameter type | Value type |  Value example
  ---------------|--------------- | --------- | ------
  id |  body | `MongoDB` ObjectId of the offer you want to delete | 60a92672bbc1c248b41534c4
  
  ⚠️ Do not forget to add a Bearer Token in your request.
 
</br>

#### Filter-offer route

* URL: `http://localhost:<your-port>/offers`
* Method HTTP: GET
* Goal: Filter the offers according to different parameters. Send back the number `count` of offers that match input parameters
* Request parameters:
  
  Key name | Parameter type | Value type |  Value example | Effect
  ---------------|--------------- | --------- | ------ | -----
  title |  query | string | chemise | filters the offers according to their title: only the offers of which the title match with this parameter will be send back
  priceMin |  query | number | 20 | filters the offers according to their price: only the offers of which the price is greater or equal to priceMin will be send back
  priceMax |  query | number | 100  | filters the offers according to their price: only the offers of which the price is lower or equal to priceMax will be send back
  page |  query | number | 1  | sends back only the offers which correspond to the number of the page specified
  limit |  query | number | 8 | enables to specify the number of offers which can be displayed on a single page
  sort |  query | string | `price-desc` OR `price-asc` | enables to sort the offers in ascending order (`price-asc`) or in descending order (`price-desc`) according to their price

 </br>
  
#### Read-one-offer route

* URL: `http://localhost:<your-port>/offer/:id`
* Method HTTP: GET
* Goal: Read one specific offer
* Request parameters:
  
  Key name | Parameter type | Value type |  Value example 
  ---------------|--------------- | --------- | ------
  id |  params | `MongoDB` ObjectId of the offer you want to read | 6097d297358ed95c0cc17dc1
  
  **NB:**
  * **If you don't specify an `id`, all the offers will be send back**


  ```

## Enjoy! 🙂

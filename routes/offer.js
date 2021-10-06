// Import of the 'express' package
const express = require("express");
// Call the Router() function, from the 'express' package
const router = express.Router();

// Import of the cloudinary package
const cloudinary = require("cloudinary").v2;

// Import the User and Offer model
// to avoid errors (especially due to possible references between collections)
const User = require("../models/User");
const Offer = require("../models/Offer");

// Import middleware isAuthenticated
const isAuthenticated = require("../middleware/isAuthenticated");

// Route that allows us to get a list of ads, according to filters
// If no filter is sent, this route will return all the ads
router.get("/offers", async (req, res) => {
  try {
    // creation of an object in which we will sotcker our different filters
    let filters = {};

    if (req.query.title) {
      filters.product_name = new RegExp(req.query.title, "i");
    }

    if (req.query.priceMin) {
      filters.product_price = {
        $gte: req.query.priceMin,
      };
    }

    if (req.query.priceMax) {
      if (filters.product_price) {
        filters.product_price.$lte = req.query.priceMax;
      } else {
        filters.product_price = {
          $lte: req.query.priceMax,
        };
      }
    }

    let sort = {};

    if (req.query.sort === "price-desc") {
      sort = { product_price: -1 };
    } else if (req.query.sort === "price-asc") {
      sort = { product_price: 1 };
    }

    let page;
    if (Number(req.query.page) < 1) {
      page = 1;
    } else {
      page = Number(req.query.page);
    }

    let limit = Number(req.query.limit);

    const offers = await Offer.find(filters)
      .populate({
        path: "owner",
        select: "account",
      })
      .sort(sort);
    // .skip((page - 1) * limit) // ignore the x results
    // .limit(limit); // return y results

    // this line will return the number of ads found according to the filters
    const count = await Offer.countDocuments(filters);

    res.json({
      count: count,
      offers: offers,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// route that allows to get the information of an offer according to its id
router.get("/offer/:id", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate({
      path: "owner",
      select: "account.username account.phone account.avatar",
    });
    res.json(offer);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  // route that allows to post a new ad
  try {
    const { title, description, price, brand, size, condition, color, city } =
      req.fields;

    console.log(req.fields);

    if (title && price) {
      // Creation of the new ad (without the image)
      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          { MARQUE: brand },
          { TAILLE: size },
          { ÉTAT: condition },
          { COULEUR: color },
          { EMPLACEMENT: city },
        ],
        owner: req.user,
      });

      // Send the image to cloudinary
      const result = await cloudinary.uploader.upload(req.files.picture.path, {
        folder: `api/vinted/offers/${newOffer._id}`,
        public_id: "vintedpicture",
        function(error, result) {
          console.log(result, error);
        },
      });

      // add the image in newOffer
      newOffer.product_image = result;

      await newOffer.save();
      console.log(newOffer);

      res.json(newOffer);
    } else {
      res
        .status(400)
        .json({ message: "title, price and picture are required" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.put("/offer/update/:id", isAuthenticated, async (req, res) => {
  const offerToModify = await Offer.findById(req.params.id);
  try {
    if (req.fields.title) {
      offerToModify.product_name = req.fields.title;
    }
    if (req.fields.description) {
      offerToModify.product_description = req.fields.description;
    }
    if (req.fields.price) {
      offerToModify.product_price = req.fields.price;
    }

    const details = offerToModify.product_details;
    for (i = 0; i < details.length; i++) {
      if (details[i].MARQUE) {
        if (req.fields.brand) {
          details[i].MARQUE = req.fields.brand;
        }
      }
      if (details[i].TAILLE) {
        if (req.fields.size) {
          details[i].TAILLE = req.fields.size;
        }
      }
      if (details[i].ÉTAT) {
        if (req.fields.condition) {
          details[i].ÉTAT = req.fields.condition;
        }
      }
      if (details[i].COULEUR) {
        if (req.fields.color) {
          details[i].COULEUR = req.fields.color;
        }
      }
      if (details[i].EMPLACEMENT) {
        if (req.fields.location) {
          details[i].EMPLACEMENT = req.fields.location;
        }
      }
    }

    // Notify Mongoose that we have modified the product_details array
    offerToModify.markModified("product_details");

    if (req.files.picture) {
      const result = await cloudinary.uploader.upload(req.files.picture.path, {
        public_id: `api/vinted/offers/${offerToModify._id}/preview`,
      });
      offerToModify.product_image = result;
    }

    await offerToModify.save();

    res.status(200).json("Offer modified succesfully !");
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

router.delete("/offer/delete/:id", isAuthenticated, async (req, res) => {
  try {
    //I delete what is in the folder
    await cloudinary.api.delete_resources_by_prefix(
      `api/vinted/offers/${req.params.id}`
    );
    //Once the folder is empty, I can delete it!
    await cloudinary.api.delete_folder(`api/vinted/offers/${req.params.id}`);

    offerToDelete = await Offer.findById(req.params.id);

    await offerToDelete.delete();

    res.status(200).json("Offer deleted succesfully !");
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

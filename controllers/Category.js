const match = require("nodemon/lib/monitor/match");
const Category = require("../models/Category");
const { populate } = require("../models/Course");
const RatingAndRaview = require("../models/RatingAndRaview");
const Course = require("../models/Course");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

exports.showAllCategories = async (req, res) => {
	try {
        console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await Category.find({});
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


// exports.categoryPageDetails = async (req, res) => {
//     try {
//       const { categoryId } = req.body
//       console.log("PRINTING CATEGORY ID: ", categoryId);
//       // Get courses for the specified category
//       const selectedCategory = await Category.findById(categoryId)
//         .populate({
//           path: "courses",
//           match: { status: "Published" },
//           populate: "ratingAndReviews",
//         })
//         .exec()
  
//       console.log("SELECTED COURSE", selectedCategory)
//       // Handle the case when the category is not found
//       if (!selectedCategory) {
//         console.log("Category not found.")
//         return res
//           .status(404)
//           .json({ success: false, message: "Category not found" })
//       }
//       // Handle the case when there are no courses
//       if (selectedCategory.courses.length === 0) {
//         console.log("No courses found for the selected category.")
//         return res.status(404).json({
//           success: false,
//           message: "No courses found for the selected category.",
//         })
//       }
  
//       // Get courses for other categories
//       const categoriesExceptSelected = await Category.find({
//         _id: { $ne: categoryId },
//       })
//       let differentCategory = await Category.findOne(
//         categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
//           ._id
//       )
//         .populate({
//           path: "courses",
//           match: { status: "Published" },
//         })
//         .exec()
//         //console.log("Different COURSE", differentCategory)
//       // Get top-selling courses across all categories
//       const allCategories = await Category.find()
//         .populate({
//           path: "courses",
//           match: { status: "Published" },
//           populate: {
//             path: "instructor",
//         },
//         })
//         .exec()
//       const allCourses = allCategories.flatMap((category) => category.courses)
//       const mostSellingCourses = allCourses
//         .sort((a, b) => b.sold - a.sold)
//         .slice(0, 10)
//        // console.log("mostSellingCourses COURSE", mostSellingCourses)
//       res.status(200).json({
//         success: true,
//         data: {
//           selectedCategory,
//           differentCategory,
//           mostSellingCourses,
//         },
//       })
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: "Internal server error",
//         error: error.message,
//       })
//     }
//   }

// utils/helper.js
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// controller
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;
    console.log("PRINTING CATEGORY ID: ", categoryId);

    // 1. Get selected category info
    const selectedCategory = await Category.findById(categoryId);
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 2. Get published courses for the selected category
    const selectedCategoryCourses = await Course.find({
      category: categoryId,
      status: "Published",
    })
      .populate("instructor")
      .populate("ratingAndReviews");

    if (selectedCategoryCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No published courses found for this category",
      });
    }

    // 3. Get a different random category and its courses
    const otherCategories = await Category.find({ _id: { $ne: categoryId } });
    let differentCategory = null;

    if (otherCategories.length > 0) {
      const randomIndex = getRandomInt(otherCategories.length);
      const randomCategory = otherCategories[randomIndex];

      const differentCourses = await Course.find({
        category: randomCategory._id,
        status: "Published",
      })
        .populate("instructor")
        .populate("ratingAndReviews");

      differentCategory = {
        category: randomCategory,
        courses: differentCourses,
      };
    }

    // 4. Get top-selling courses globally
    const topSellingCourses = await Course.find({ status: "Published" })
      .sort({ sold: -1 })
      .limit(10)
      .populate("instructor")
      .populate("ratingAndReviews");

    // 5. Final response
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory: {
          category: selectedCategory,
          courses: selectedCategoryCourses,
        },
        differentCategory,
        mostSellingCourses: topSellingCourses,
      },
    });
  } catch (error) {
    console.error("CATEGORY PAGE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};













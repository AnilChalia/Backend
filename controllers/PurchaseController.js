const Purchase  = require("../models/Purchase")
const Course = require("../models/Course")

exports.getPurchaseHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const purchases = await Purchase.find({ user: userId })
      .populate("course", "title thumbnail")
      .sort({ purchasedAt: -1 });

    res.status(200).json({
      success: true,
      message: "Purchase history fetched successfully",
      data: purchases,
    });
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



exports.savePurchase = async (req, res) => {
  try {
    const userId = req.user.id
    const { courses, paymentMode, paymentId } = req.body

    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No courses provided for purchase",
      })
    }

    const purchaseData = []

    for (let courseId of courses) {
      const course = await Course.findById(courseId)

      if (!course) {
        return res.status(404).json({
          success: false,
          message: `Course not found: ${courseId}`,
        })
      }

      const purchase = await Purchase.create({
        user: userId,
        course: courseId,
        price: course.price,
        paymentMode,
        paymentId,
      })

      purchaseData.push(purchase)
      console.log("puerchase data is ->",purchaseData);
    }

    res.status(200).json({
      success: true,
      message: "Courses purchased successfully",
      data: purchaseData,
    })
  } catch (error) {
    console.error("Error saving purchase:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}
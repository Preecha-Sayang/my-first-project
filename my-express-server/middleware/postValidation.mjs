function validatePostData(req, res, next) {
  const { title, image, category_id, description, content, status_id } =
    req.body;

  // Check for required fields
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (!image) {
    return res.status(400).json({ message: "Image is required" });
  }

  if (!category_id) {
    return res.status(400).json({ message: "Category ID is required" });
  }

  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  if (!status_id) {
    return res.status(400).json({ message: "Status ID is required" });
  }

  // type validations
  if (typeof title !== "string") {
    return res.status(400).json({ message: "Title must be a string" });
  }

  if (typeof image !== "string") {
    return res.status(400).json({ message: "Image must be a string URL" });
  }

  if (typeof category_id !== "number") {
    return res.status(400).json({ message: "Category ID must be a number" });
  }

  if (typeof description !== "string") {
    return res.status(400).json({ message: "Description is must be a string" });
  }

  if (typeof content !== "string") {
    return res.status(400).json({ message: "Content is must be a string" });
  }

  if (typeof status_id !== "number") {
    return res.status(400).json({ message: "Status ID must be a number" });
  }

  next();
}

export default validatePostData;
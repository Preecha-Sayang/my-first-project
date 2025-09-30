import { Router } from "express";
import validatePostData from "../middleware/postValidation.mjs";
import connectionPool from "../utils/db.mjs";
import protectUser from "../middleware/protectUser.mjs";

const postRouter = Router();

postRouter.post("/", validatePostData, protectUser, async (req, res) => {
  // ลอจิกในการเก็บข้อมูลของโพสต์ลงในฐานข้อมูล
  console.log("Body:", req.body);
  // 1) Access ข้อมูลใน Body จาก Request ด้วย req.body
  const newPost = req.body;

  // 2) เขียน Query เพื่อ Insert ข้อมูลโพสต์ ด้วย Connection Pool
  try {
    const query = `INSERT INTO posts (title, image, category_id, description, content, status_id)
      values ($1, $2, $3, $4, $5, $6)`;

    const values = [
      newPost.title,
      newPost.image,
      newPost.category_id,
      newPost.description,
      newPost.content,
      newPost.status_id,
    ];

    await connectionPool.query(query, values);
  } catch {
    return res.status(500).json({
      message: `Server could not create post because database connection`,
    });
  }

  // 3) Return ตัว Response กลับไปหา Client ว่าสร้างสำเร็จ
  return res.status(201).json({ message: "Created post successfully" });
});

postRouter.get("/", async (req, res) => {
  // ลอจิกในอ่านข้อมูลโพสต์ทั้งหมดในระบบ
  try {
    // 1) Access ข้อมูลใน Body จาก Request ด้วย req.body
    const category = req.query.category || "";
    const keyword = req.query.keyword || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    // 2) ทำให้แน่ใจว่า query parameter page และ limit จะมีค่าอย่างต่ำเป็น 1
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(100, limit));
    const offset = (safePage - 1) * safeLimit;
    // offset คือค่าที่ใช้ในการข้ามจำนวนข้อมูลบางส่วนตอน query ข้อมูลจาก database
    // ถ้า page = 2 และ limit = 6 จะได้ offset = (2 - 1) * 6 = 6 หมายความว่าต้องข้ามแถวไป 6 แถวแรก และดึงแถวที่ 7-12 แทน

    // 3) เขียน Query เพื่อ Insert ข้อมูลโพสต์ ด้วย Connection Pool
    let query = `
        SELECT posts.id, posts.image, categories.name AS category, posts.title, posts.description, posts.date, posts.content, statuses.status, posts.likes_count
        FROM posts
        INNER JOIN categories ON posts.category_id = categories.id
        INNER JOIN statuses ON posts.status_id = statuses.id
      `;
    let values = [];

    // 4) เขียน query จากเงื่อนไขของการใส่ query parameter category และ keyword
    if (category && keyword) {
      query += `
          WHERE categories.name ILIKE $1 
          AND (posts.title ILIKE $2 OR posts.description ILIKE $2 OR posts.content ILIKE $2)
        `;
      values = [`%${category}%`, `%${keyword}%`];
    } else if (category) {
      query += " WHERE categories.name ILIKE $1";
      values = [`%${category}%`];
    } else if (keyword) {
      query += `
          WHERE posts.title ILIKE $1 
          OR posts.description ILIKE $1 
          OR posts.content ILIKE $1
        `;
      values = [`%${keyword}%`];
    }

    // 5) เพิ่มการ odering ตามวันที่, limit และ offset
    query += ` ORDER BY posts.date DESC LIMIT $${values.length + 1} OFFSET $${
      values.length + 2
    }`;

    values.push(safeLimit, offset);

    // 6) Execute the main query (ดึงข้อมูลของบทความ)
    const result = await connectionPool.query(query, values);

    // 7) สร้าง Query สำหรับนับจำนวนทั้งหมดตามเงื่อนไข พื่อใช้สำหรับ pagination metadata
    let countQuery = `
        SELECT COUNT(*)
        FROM posts
        INNER JOIN categories ON posts.category_id = categories.id
        INNER JOIN statuses ON posts.status_id = statuses.id
      `;
    let countValues = values.slice(0, -2); // ลบค่า limit และ offset ออกจาก values

    if (category && keyword) {
      countQuery += `
          WHERE categories.name ILIKE $1 
          AND (posts.title ILIKE $2 OR posts.description ILIKE $2 OR posts.content ILIKE $2)
        `;
    } else if (category) {
      countQuery += " WHERE categories.name ILIKE $1";
    } else if (keyword) {
      countQuery += `
          WHERE posts.title ILIKE $1 
          OR posts.description ILIKE $1 
          OR posts.content ILIKE $1
        `;
    }

    const countResult = await connectionPool.query(countQuery, countValues);
    const totalPosts = parseInt(countResult.rows[0].count, 10);

    // 8) สร้าง response พร้อมข้อมูลการแบ่งหน้า (pagination)
    const results = {
      totalPosts,
      totalPages: Math.ceil(totalPosts / safeLimit),
      currentPage: safePage,
      limit: safeLimit,
      posts: result.rows,
    };
    // เช็คว่ามีหน้าถัดไปหรือไม่
    if (offset + safeLimit < totalPosts) {
      results.nextPage = safePage + 1;
    }
    // เช็คว่ามีหน้าก่อนหน้าหรือไม่
    if (offset > 0) {
      results.previousPage = safePage - 1;
    }
    // 9) Return ตัว Response กลับไปหา Client ว่าสร้างสำเร็จ
    return res.status(200).json(results);
  } catch {
    return res.status(500).json({
      message: "Server could not read post because database issue",
    });
  }
});

postRouter.get("/:postId", async (req, res) => {
  // ลอจิกในอ่านข้อมูลโพสต์ด้วย Id ในระบบ
  // 1) Access ตัว Endpoint Parameter ด้วย req.params
  const postIdFromClient = req.params.postId;
  const limit = 3; // จำนวน comment ที่จะแสดงต่อหน้า
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;


  try {
    // 2) เขียน Query เพื่ออ่านข้อมูลโพสต์ ด้วย Connection Pool
    const results = await connectionPool.query(
      `
        SELECT posts.id, posts.image, categories.name AS category, posts.title, posts.description, posts.date, posts.content, statuses.status, posts.likes_count
        FROM posts
        INNER JOIN categories ON posts.category_id = categories.id
        INNER JOIN statuses ON posts.status_id = statuses.id
        WHERE posts.id = $1
        `,
      [postIdFromClient]
    );

    // เพิ่ม Conditional logic ว่าถ้าข้อมูลที่ได้กลับมาจากฐานข้อมูลเป็นค่า false (null / undefined)
    if (!results.rows[0]) {
      return res.status(404).json({
        message: `Server could not find a requested post (post id: ${postIdFromClient})`,
      });
    }

    const post = results.rows[0];

    const commentsQuery = await connectionPool.query(
      `
        SELECT c.comment_text, c.created_at, c.user_id, u.name, u.profile_pic AS image
          FROM comments c
          INNER JOIN users u ON c.user_id = u.id
          WHERE c.post_id = $1
          ORDER BY c.created_at DESC
          LIMIT $2 OFFSET $3
        `,
      [postIdFromClient, limit, offset]
    );

    const countResult = await connectionPool.query(
      `SELECT COUNT(*) FROM comments WHERE post_id = $1`,
      [postIdFromClient]
    );

    const totalComments = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalComments / limit);


    // แนบ comments เข้าใน post object
    post.comments = commentsQuery.rows;
    post.commentsPagination = {
      page,
      totalPages,
      totalComments,
      limit,
    };

    // 3) Return ตัว Response กลับไปหา Client
    return res.status(200).json(post);
  } catch {
    return res.status(500).json({
      message: `Server could not read post because database issue`,
    });
  }
});

postRouter.put("/:postId", validatePostData, protectUser, async (req, res) => {
  // ลอจิกในการแก้ไขข้อมูลโพสต์ด้วย Id ในระบบ

  // 1) Access ตัว Endpoint Parameter ด้วย req.params
  // และข้อมูลโพสต์ที่ Client ส่งมาแก้ไขจาก Body ของ Request
  const postIdFromClient = req.params.postId;
  const updatedPost = { ...req.body, date: new Date() };

  try {
    // 2) เขียน Query เพื่อแก้ไขข้อมูลโพสต์ ด้วย Connection Pool
    const result = await connectionPool.query(
      `
          UPDATE posts
          SET title = $2,
              image = $3,
              category_id = $4,
              description = $5,
              content = $6,
              status_id = $7,
              date = $8
          WHERE id = $1
        `,
      [
        postIdFromClient,
        updatedPost.title,
        updatedPost.image,
        updatedPost.category_id,
        updatedPost.description,
        updatedPost.content,
        updatedPost.status_id,
        updatedPost.date,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: `Server could not find a requested post to update (post id: ${postIdFromClient})`,
      });
    }

    // 3) Return ตัว Response กลับไปหา Client
    return res.status(200).json({
      message: "Updated post successfully",
    });
  } catch {
    // จัดการข้อผิดพลาดที่อาจเกิดขึ้นขณะ Query ฐานข้อมูล
    return res.status(500).json({
      message: `Server could not update post because database connection`,
    });
  }
});

postRouter.delete("/:postId", protectUser, async (req, res) => {
  // ลอจิกในการลบข้อมูลโพสต์ด้วย Id ในระบบ

  // 1) Access ตัว Endpoint Parameter ด้วย req.params
  const postIdFromClient = req.params.postId;

  try {
    // 2) เขียน Query เพื่อลบข้อมูลโพสต์ ด้วย Connection Pool
    const result = await connectionPool.query(
      `DELETE FROM posts
         WHERE id = $1`,
      [postIdFromClient]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: `Server could not find a requested post to delete (post id: ${postIdFromClient})`,
      });
    }

    // 3) Return ตัว Response กลับไปหา Client
    return res.status(200).json({
      message: "Deleted post successfully",
    });
  } catch {
    return res.status(500).json({
      message: `Server could not delete post because database connection`,
    });
  }
});

postRouter.post("/:postId/comments", protectUser, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id; // ได้จาก protectUser
  const { comment } = req.body;
  

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ message: "Comment is required" });
  }

  try {
    const result = await connectionPool.query(
      `INSERT INTO comments (post_id, user_id, comment_text, created_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [postId, userId, comment]
    );

    res.status(201).json({
      message: "Comment created successfully",
      comment: result.rows[0],
    });
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: "Database error" });
  }
});


postRouter.post("/:postId/like", protectUser,async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;

  try {
    // 1. ตรวจสอบว่าผู้ใช้กด Like โพสต์นี้ไปแล้วหรือยัง
    const { rows: existingLikes } = await connectionPool.query(
      "SELECT * FROM likes WHERE post_id = $1 AND user_id = $2",
      [postId, userId]
    );

    if (existingLikes.length > 0) {
      // 2. ถ้ามี Like อยู่แล้ว => ลบ Like (ยกเลิก)
      await connectionPool.query(
        "DELETE FROM likes WHERE post_id = $1 AND user_id = $2",
        [postId, userId]
      );

      // ลด likes_count ลง 1 (ไม่ให้ต่ำกว่า 0)
      await connectionPool.query(
        "UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1",
        [postId]
      );

      return res.status(200).json({ message: "Like removed" });
    } else {
      // 3. ถ้ายังไม่มี Like => เพิ่ม Like ใหม่
      await connectionPool.query(
        "INSERT INTO likes (post_id, user_id) VALUES ($1, $2)",
        [postId, userId]
      );

      // เพิ่ม likes_count ขึ้น 1
      await connectionPool.query(
        "UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1",
        [postId]
      );

      return res.status(201).json({ message: "Post liked" });
    }
  } catch (err) {
    console.error("Error toggling like:", err);
    return res.status(500).json({ message: "Database error" });
  }
});


export default postRouter;

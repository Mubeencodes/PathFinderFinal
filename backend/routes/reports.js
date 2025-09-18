const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const auth = require("../middleware/auth");

// List reports for current user
router.get("/", auth, async (req, res) => {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });
  if (error)
    return res
      .status(500)
      .json({ msg: "Failed to fetch reports", error: error.message });
  res.json(data || []);
});

// Create report
router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ msg: "Title is required" });
  const { data, error } = await supabase
    .from("reports")
    .insert([{ user_id: req.user.id, title, content: content || "" }])
    .select()
    .single();
  if (error)
    return res
      .status(500)
      .json({ msg: "Failed to create report", error: error.message });
  res.status(201).json(data);
});

// Update report
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const updates = {};
  if (typeof title === "string") updates.title = title;
  if (typeof content === "string") updates.content = content;
  const { data, error } = await supabase
    .from("reports")
    .update(updates)
    .eq("id", id)
    .eq("user_id", req.user.id)
    .select()
    .single();
  if (error)
    return res
      .status(500)
      .json({ msg: "Failed to update report", error: error.message });
  res.json(data);
});

// Delete report
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from("reports")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.id);
  if (error)
    return res
      .status(500)
      .json({ msg: "Failed to delete report", error: error.message });
  res.status(204).send();
});

module.exports = router;

const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const auth = require("../middleware/auth");

// List sessions
router.get("/", auth, async (req, res) => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", req.user.id)
    .order("started_at", { ascending: false });
  if (error)
    return res
      .status(500)
      .json({ msg: "Failed to fetch sessions", error: error.message });
  res.json(data || []);
});

// Create session
router.post("/", auth, async (req, res) => {
  const { status } = req.body;
  const { data, error } = await supabase
    .from("sessions")
    .insert([{ user_id: req.user.id, status: status || "active" }])
    .select()
    .single();
  if (error)
    return res
      .status(500)
      .json({ msg: "Failed to create session", error: error.message });
  res.status(201).json(data);
});

// Update session
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { status, ended_at } = req.body;
  const updates = {};
  if (typeof status === "string") updates.status = status;
  if (ended_at) updates.ended_at = ended_at;
  const { data, error } = await supabase
    .from("sessions")
    .update(updates)
    .eq("id", id)
    .eq("user_id", req.user.id)
    .select()
    .single();
  if (error)
    return res
      .status(500)
      .json({ msg: "Failed to update session", error: error.message });
  res.json(data);
});

// Delete session
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.id);
  if (error)
    return res
      .status(500)
      .json({ msg: "Failed to delete session", error: error.message });
  res.status(204).send();
});

module.exports = router;

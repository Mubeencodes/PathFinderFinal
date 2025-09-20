const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// Get all colleges with optional filtering
router.get("/", async (req, res) => {
  try {
    const {
      stream,
      type,
      state,
      city,
      search,
      limit = 50,
      offset = 0,
      sort_by = "rating",
      sort_order = "desc",
    } = req.query;

    let query = supabase
      .from("colleges")
      .select("*")
      .order(sort_by, { ascending: sort_order === "asc" });

    // Apply filters
    if (stream && stream !== "all") {
      query = query.eq("stream", stream);
    }

    if (type && type !== "all") {
      query = query.eq("type", type);
    }

    if (state && state !== "all") {
      query = query.eq("state", state);
    }

    if (city && city !== "all") {
      query = query.eq("city", city);
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,location.ilike.%${search}%,state.ilike.%${search}%`
      );
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching colleges:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch colleges",
        details: error.message,
      });
    }

    res.json({
      success: true,
      data: data || [],
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: count || data?.length || 0,
      },
    });
  } catch (error) {
    console.error("Error in colleges route:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Get college by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          error: "College not found",
        });
      }
      console.error("Error fetching college:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch college",
        details: error.message,
      });
    }

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error in college detail route:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Get colleges for comparison (multiple IDs)
router.post("/compare", async (req, res) => {
  try {
    const { collegeIds } = req.body;

    if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "College IDs are required",
      });
    }

    if (collegeIds.length > 3) {
      return res.status(400).json({
        success: false,
        error: "Cannot compare more than 3 colleges",
      });
    }

    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .in("id", collegeIds);

    if (error) {
      console.error("Error fetching colleges for comparison:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch colleges for comparison",
        details: error.message,
      });
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Error in college comparison route:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Get unique values for filters
router.get("/filters/options", async (req, res) => {
  try {
    const { data: streams } = await supabase
      .from("colleges")
      .select("stream")
      .not("stream", "is", null);

    const { data: types } = await supabase
      .from("colleges")
      .select("type")
      .not("type", "is", null);

    const { data: states } = await supabase
      .from("colleges")
      .select("state")
      .not("state", "is", null);

    const { data: cities } = await supabase
      .from("colleges")
      .select("city")
      .not("city", "is", null);

    // Extract unique values
    const uniqueStreams = [
      ...new Set(streams?.map((item) => item.stream) || []),
    ];
    const uniqueTypes = [...new Set(types?.map((item) => item.type) || [])];
    const uniqueStates = [...new Set(states?.map((item) => item.state) || [])];
    const uniqueCities = [...new Set(cities?.map((item) => item.city) || [])];

    res.json({
      success: true,
      data: {
        streams: uniqueStreams.sort(),
        types: uniqueTypes.sort(),
        states: uniqueStates.sort(),
        cities: uniqueCities.sort(),
      },
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch filter options",
      details: error.message,
    });
  }
});

// Search colleges by name or location
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 10 } = req.query;

    const { data, error } = await supabase
      .from("colleges")
      .select("id, name, location, state, stream, type, rating")
      .or(
        `name.ilike.%${query}%,location.ilike.%${query}%,state.ilike.%${query}%`
      )
      .order("rating", { ascending: false })
      .limit(parseInt(limit));

    if (error) {
      console.error("Error searching colleges:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to search colleges",
        details: error.message,
      });
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Error in college search route:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
});

module.exports = router;

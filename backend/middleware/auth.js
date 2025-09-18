const supabase = require("../config/supabase");

module.exports = async function (req, res, next) {
  const authHeader = req.header("Authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ msg: "Token is not valid" });
    }
    req.user = { id: data.user.id };
    req.supabaseToken = token;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token validation failed" });
  }
};

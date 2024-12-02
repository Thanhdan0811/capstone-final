const jwt = require("jsonwebtoken");

exports.createToken = (data) => {
    return jwt.sign({payload: data}, process.env.ACCESS_TOKEN_KEY, {
        algorithm: "HS256",
        expiresIn: "10d",
    })
}

exports.getUserIdFromToken = (token) => {
    const decodeTok = jwt.decode(token);
    if (!decodeTok || decodeTok?.papyload?.user_id) return null;
    return decodeTok?.payload?.user_id || null;
}

exports.middlewareCheckToken = async (req, res, next) => {
    const { tok } = req.headers || {};
    if (!tok) throw {message: "Unauthorized", status: 403};
    const checkTok = await jwt.verify(tok, process.env.ACCESS_TOKEN_KEY);
    if(!checkTok) throw {message: "Unauthorized", status: 403};
    req.user_id = exports.getUserIdFromToken(tok);
    next();
}
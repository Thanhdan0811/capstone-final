const { registerService, loginService } = require("./auth.service.js");



exports.register = async (req, res) => {
    await registerService(req.body);
    res.json({message: 'register successed', data: null});

}

exports.login = async (req, res) => {
    const token = await loginService(req.body);
    res.json({message: 'lLogin successed', data: token.accessToken});
}


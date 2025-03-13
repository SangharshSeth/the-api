
export const logger = (req, res, next) => {
    console.log(`${req.ip}\t${req.method}\t${req.path}\t${new Date().toISOString()}`);
    next();
}

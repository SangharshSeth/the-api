
export const logger = (req, res, next) => {
    console.log(`${req.method}\t${req.path}\t${new Date().toISOString()}`);
    next();
}

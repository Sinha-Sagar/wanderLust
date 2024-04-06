const asyncWrap = (fn) => {
    return function(req, res, next){
        // Execute the function and check if it returns a promise
        const result = fn(req, res, next);
        
        // If it doesn't return a promise, we'll handle it
        if (!result || !result.catch) {
            // Wrap in a promise and resolve immediately
            return Promise.resolve(result).catch(err => next(err));
        }

        // If it returns a promise, handle errors with catch
        return result.catch((err) => next(err));
    };
};

module.exports = asyncWrap;

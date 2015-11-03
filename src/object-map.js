const objectMap = (obj, fn) => {
    const res = {};
    Object.keys(obj).map(k => {
        res[k] = fn(obj[k], k, obj);
    });
    return res;
};

export default objectMap;
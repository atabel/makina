const objectMap = (obj, fn) => {
    const res = {};
    Object.entries(obj).map(([k, v]) => {
        res[k] = fn(v, k, obj);
    });
    return res;
};

export default objectMap;
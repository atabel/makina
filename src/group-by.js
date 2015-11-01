const groupBy = (key, list) => {
    if (!list) {
        return l => groupBy(key, l);
    }
    const groups = {};
    list.forEach(obj => {
        const value = obj[key];
        if (!groups[value]) {
            groups[value] = [];
        }
        groups[value].push(obj);
    });
    return groups;
};

export default groupBy;
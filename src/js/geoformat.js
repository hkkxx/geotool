/*
https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.8

忽略实现：
1，几何图形的 position 顺序，包括不限于面图形的外圈和内圈的前后顺序
2, 坐标使用经纬度判断，无法进行笛卡尔坐标（东向北向巨鹿）判断。（不具备坐标转换能力）
3，没有边界 bbox 的判断。
4，没有子午线切割（ Antimeridian Cutting）的检查
5,还有一些前后与以上的约束不进行判断，
    ——（7.1 Semantics of GeoJSON Members and Types Are Not Changeable）
基本判断注意点：
不接受三个元素以上的坐标数组，只两二元素、三元素坐标。（超过四个元素的坐标只存在于古老系统中）
 */


const res = {result: false, msg: "no msg"}
const geoJsonType = ["Feature", "FeatureCollection", 'Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon', 'GeometryCollection']
export const geometryType = ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon', 'GeometryCollection']
/*
 The GeoJSON object MAY have any number of other members.Implementations MUST ignore unrecognized members.
 */
const options = {
    simple: false,
    alt: {
        enable: false,
        max: 50000,
        min: -50000
    },
}


export function geoformat(jsonStr) {
    //一个有意义的json文件，
    if (geoJsonType.includes(jsonStr["type"]) && (Array.isArray(jsonStr["features"]))) {
        // switch (jsonStr["features"]) {
        //     case "FeatureCollection":
        //
        //         break
        //     default:
        //         break
        // }

        if ((jsonStr["bbox"] != null)) {
            if (Array.isArray(jsonStr["bbox"])) {
                try {
                    let temp = Float64Array.from(jsonStr["bbox"])
                    if (!numberCheck(temp)) {
                        return {result: false, msg: "bbox error"}
                    }
                    if ((temp.length % 2) !== 0) {
                        return {result: false, msg: "bbox length error"}
                    }
                } catch (error) {
                    console.error(error);
                    res.msg = "warm" + error.message
                    return res
                }
                return geoin(jsonStr['features'])
            } else {
                res.msg = jsonStr["bbox"] + " is not float/double array"
                return res
            }
        } else {
            return geoin(jsonStr['features'])
        }
    } else {
        res.msg = "json not geojson."
        return res
    }

}

function numberCheck(temp) {
    for (let i of temp) {
        if (isNaN(i)) {
            return false
        }
        if (typeof i !== "number") {
            return false
        }
    }
    return true

}

function positionCheck(a2item) {
    if (a2item.length === 2) {
        // (x,y)
        // let xy;
        return a2item[0] > -180 && a2item[0] < 180 && a2item[1] < 90 && a2item[1] > -90
    }
    if (a2item.length === 3) {
        let l1 = a2item.length >= 2 && a2item[0] > -180 && a2item[0] < 180 && a2item[1] < 90 && a2item[1] > -90
        return options.alt.enable && l1 && a2item[2] > options.alt.min && a2item[2] < options.alt.max
    } else {
        return false
    }
}

function positionDiff(p1, p2) {
    let l1 = p1[0] === p2[0] && p1[1] === p2[1]
    return options.alt.enable ? l1 && p1[2] === p2[2] : l1
}

function pointCheck(metry) {
    try {
        let floatArray = Float64Array.from(metry)
        if (!positionCheck(floatArray)) {
            return false
        }
    } catch (error) {
        console.error(error);
        return false
    }
    return true
}

function MultiPointCheck(metry) {
    for (let position of metry) {
        try {
            let floatArray = Float64Array.from(position)
            if (!positionCheck(floatArray)) {
                return false
            }
        } catch (error) {
            console.error(error);
            return false
        }
    }
    return true
}

function LineStringCheck(metry) {
    if (!(metry.length >= 2)) {
        return false
    }
    for (let position of metry) {
        try {
            let floatArray = Float64Array.from(position)
            if (!positionCheck(floatArray)) {
                return false
            }
        } catch (error) {
            console.error(error);
            return false
        }
    }
    return true
}

function MultiLineStringCheck(metry) {
    for (let position of metry) {
        if (!(position.length >= 2)) {
            return false
        }
        for (let i of position) {
            try {
                let floatArray = Float64Array.from(i)
                if (!positionCheck(floatArray)) {
                    return false
                }
            } catch (error) {
                console.error(error);
                return false
            }
        }
    }
    return true
}

function PolygonCheck(metry) {

    if ((metry.length >= 1)) {
        for (let positions of metry) {
            if (positions.length < 4 || !positionDiff(positions[0], positions[positions.length - 1])) {
                return false
            }
            for (let i of positions) {
                try {
                    let floatArray = Float64Array.from(i)
                    if (!positionCheck(floatArray)) {
                        return false
                    }
                } catch (error) {
                    console.error(error);
                    return false
                }
            }
        }
        return true
    } else {
        return false
    }
}

function MultiPolygonCheck(metry) {
    if ((metry.length >= 1)) {
        for (let position of metry) {
            if (!PolygonCheck(position))
                return false;
        }
        return true
    } else {
        return false
    }
}

function GeometryCollectionCheck(metry) {
    let resCheck = {result: false, msg: "no msg"}
    // geometries:{}
    if (metry['geometry']['geometries'] != null && Array.isArray(metry['geometry']['geometries'])) {
        let tries = metry['geometry']['geometries']
        for (let i in tries) {
            let item = tries[i];
            if (item != null && typeof item == "object") {
                if (item["type"] != null && geometryType.includes(item['type'])) {

                    let coordinates = item["coordinates"]

                    switch (item["type"]) {
                        case "Point":
                            if (!pointCheck(coordinates)) {
                                resCheck.msg = `GeometryCollection-${i}/${item["type"]} error`
                                return resCheck
                            }
                            break;
                        case "MultiPoint":
                            if (!MultiPointCheck(coordinates)) {
                                resCheck.msg = `GeometryCollection-${i}/${item["type"]} error`
                                return resCheck
                            }
                            break;
                        case "LineString":
                            if (!LineStringCheck(coordinates)) {
                                resCheck.msg = `GeometryCollection-${i}/${item["type"]} error`
                                return resCheck
                            }
                            break;
                        case "MultiLineString":
                            if (!MultiLineStringCheck(coordinates)) {
                                resCheck.msg = `GeometryCollection-${i}/${item["type"]} error`
                                return resCheck
                            }
                            break;
                        case "Polygon":
                            if (!PolygonCheck(coordinates)) {
                                resCheck.msg = `GeometryCollection-${i}/${item["type"]} error`
                                return resCheck
                            }
                            break;
                        case "MultiPolygon":
                            if (!MultiPolygonCheck(coordinates)) {
                                resCheck.msg = `GeometryCollection-${i}/${item["type"]} error`
                                return resCheck
                            }
                            break;
                        // case "GeometryCollection":
                        //     return GeometryCollectionCheck(item)
                        default : {
                            resCheck.msg = `GeometryCollection-${i}/${item["type"]} MUST be one of geometry type`
                            return resCheck
                        }
                    }
                } else {
                    resCheck.msg = `${JSON.stringify(item)} type error`
                    return resCheck
                }
            } else {
                resCheck.msg = `${item} error`
                return resCheck
            }
        }
        return {result: true, msg: "ok"}
    } else {
        resCheck.msg = `${metry} geometries error`
        return resCheck
    }
}

// A feature object MUST
function geoin(jsonStr) {
    for (let item of jsonStr) {
        if (options.simple && !JSON.isRawJSON(item)) {
            continue
        }
        if (item["geometry"] != null && typeof item["geometry"] == "object") {
            if (item["properties"] != null && (typeof item["properties"] == "object")) {
                if (typeof item["type"] == "string" && geoJsonType.includes(item["type"])) {
                    let metryCoordinates = item["geometry"]["coordinates"]
                    let metryType = item["geometry"]["type"]
                    if (metryType === "GeometryCollection") {
                        let res = GeometryCollectionCheck(item);
                        if (!res.result) {
                            return res
                        }
                        continue
                    }

                    if (metryCoordinates != null && Array.isArray(metryCoordinates) && metryCoordinates.length > 0) {
                        switch (metryType) {
                            case "Point":
                                if (!pointCheck(metryCoordinates)) {
                                    return {result: false, msg: metryCoordinates + " point error"}
                                }
                                break;
                            case "MultiPoint":
                                if (!MultiPointCheck(metryCoordinates)) {
                                    return {result: false, msg: metryCoordinates + " MultiPoint error"}
                                }
                                break;
                            case "LineString":
                                if (!LineStringCheck(metryCoordinates)) {
                                    return {result: false, msg: metryCoordinates + " LineString error"}
                                }
                                break;
                            case "MultiLineString":
                                if (!MultiLineStringCheck(metryCoordinates)) {
                                    return {result: false, msg: metryCoordinates + " MultiLineString error"}
                                }
                                break;
                            // 不判断外环在内环之外
                            case "Polygon":
                                if (!PolygonCheck(metryCoordinates)) {
                                    return {result: false, msg: metryCoordinates + " Polygon error"}
                                }
                                break;
                            case "MultiPolygon":
                                if (!MultiPolygonCheck(metryCoordinates)) {
                                    return {result: false, msg: metryCoordinates + " MultiPolygon error"}
                                }
                                break;
                            // case "GeometryCollection": {
                            //     let res = GeometryCollectionCheck(item);
                            //     if (!res.result) {
                            //         return res
                            //     }
                            // }
                            //     break;
                            default : {
                                res.msg = metryType + "  MUST be one of geometry type "
                                return res
                            }
                        }
                    } else {
                        res.msg = JSON.stringify(item) + " coordinates error "
                        return res
                    }
                } else {
                    res.msg = JSON.stringify(item) + " type error "
                    return res
                }
            } else {
                res.msg = JSON.stringify(item) + " propertie error"
                return res
            }
        } else {
            res.msg = JSON.stringify(item) + " geometry error"
            return res
        }
    }
    return {result: true, msg: "ok"}
}
// 生成antd table
export function geotable(str) {
    if (Array.isArray(str["features"])) {
        let data = {}
        for (let j of geometryType) {
            data[j] = []
        }
        let features = Array.from(str["features"])
        let propKey = []

        for (let i in features) {
            let me = features[i]
            data[me['geometry']['type']].push({attr: me["properties"], skey: parseInt(i)})
            propKey.push(Object.keys(me.properties));
        }

        let datasource = []
        for (let i in geometryType) {
            let type = geometryType[i]
            datasource.push({key: i, metry: type, note: data[type]})
        }
        propKey = Array.from(new Set(propKey.flat()));
        return {datasource, propKey}
    } else {
        throw new SyntaxError("geojson 语法错误")
    }
}

export function any2str(obj) {
    switch (typeof obj) {
        case "string":
            return obj;
        case "number":
            return obj.toString();
        case "boolean":
            return obj ? "true" : "false";
        case "undefined":
            return "undefined";
        case "object":
            if (Array.isArray(obj)) {
                return obj.join("-");
            } else {
                return JSON.stringify(obj);
            }
        default:
            return "XXX";
    }
}

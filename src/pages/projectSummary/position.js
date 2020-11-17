const getRandomNum = (Min, Max) => {
  var Range = Max - Min;
  var Rand = Math.random();
  return (Min + Math.round(Rand * Range));
}

export let positionList = [
  {
    position: {
      longitude: 116.736312,
      latitude: 39.954423,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.747646,
      latitude: 39.947646,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.762124,
      latitude: 39.951522,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.737386,
      latitude: 39.968448,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  // -----
  {
    position: {
      longitude: 116.525799,
      latitude: 39.728815,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.521249,
      latitude: 39.721254,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  // ----------
  {
    position: {
      longitude: 116.210577,
      latitude: 40.171233,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.211799,
      latitude: 40.172249,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.209975,
      latitude: 40.170794,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.208564,
      latitude: 40.171885,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  // --=
  {
    position: {
      longitude: 116.36852,
      latitude: 39.923352,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.369083,
      latitude: 39.922986,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.368651,
      latitude: 39.913255,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  // ------- 右上
  {
    position: {
      longitude: 116.482668,
      latitude: 39.985835,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.494754,
      latitude: 39.973177,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.463421,
      latitude: 39.980463,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  // ----房山
  {
    position: {
      longitude: 116.19557,
      latitude: 39.739464,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.216807,
      latitude: 39.724584,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.200369,
      latitude: 39.725583,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.182723,
      latitude: 39.718062,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  // ------
  {
    position: {
      longitude: 116.665837,
      latitude: 40.132859,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.677094,
      latitude: 40.127867,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.659851,
      latitude: 40.130358,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.693226,
      latitude: 40.098955,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  // -----
  {
    position: {
      longitude: 116.431164,
      latitude: 40.130304,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.428851,
      latitude: 40.101366,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.392092,
      latitude: 40.130719,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  // -----
  {
    position: {
      longitude: 116.50615,
      latitude: 39.864141,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.511487,
      latitude: 39.880465,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
  {
    position: {
      longitude: 116.528197,
      latitude: 39.869946,
    },
    status: getRandomNum(0, 3),
    type: getRandomNum(1, 2)
  },
]


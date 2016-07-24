webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(5);
	module.exports = __webpack_require__(6);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _Stage = __webpack_require__(6);

	var _Stage2 = _interopRequireDefault(_Stage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(0, _jquery2.default)(function () {

		// ステージの作成
		var stage = new _Stage2.default();
		var html = stage.createHtmlInitialStage();

		// ステージを描画
		stage.renderStage(html);

		// セルをクリックしたら
		(0, _jquery2.default)('td').on('click', stage.click.bind(stage));
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _underscore = __webpack_require__(3);

	var _underscore2 = _interopRequireDefault(_underscore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var STAGE_CELL_NUM_TO_HORIZONTAL = 4;
	var EMPTY = 'empty';
	var WHITE = 'white';
	var BLACK = 'black';

	var Stage = function () {
		function Stage() {
			_classCallCheck(this, Stage);

			this.stage = {};
		}

		_createClass(Stage, [{
			key: 'createHtmlInitialStage',
			value: function createHtmlInitialStage() {
				var _this = this;

				_underscore2.default.times(STAGE_CELL_NUM_TO_HORIZONTAL, function (x) {
					_underscore2.default.times(STAGE_CELL_NUM_TO_HORIZONTAL, function (y) {
						_this.stage[[x + '-' + y]] = EMPTY;
					});
				});

				this.stage[['1-1']] = WHITE;
				this.stage[['2-1']] = BLACK;
				this.stage[['1-2']] = BLACK;
				this.stage[['2-2']] = WHITE;

				return this.stage;
			}
		}, {
			key: 'renderStage',
			value: function renderStage(html) {
				var stage = '';
				var counter = 0;

				stage += '<table><tr>';
				_underscore2.default.times(STAGE_CELL_NUM_TO_HORIZONTAL, function (x) {
					_underscore2.default.times(STAGE_CELL_NUM_TO_HORIZONTAL, function (y) {
						counter++;

						stage += '<td class="' + html[x + '-' + y] + '" data-id="' + x + '-' + y + '" data-index="' + counter + '"></td>';

						if (counter % 4 == 0) {
							stage += '</tr><tr>';
						}
					});
				});
				stage += '</tr></table>';

				(0, _jquery2.default)('.container').html(stage);
			}
		}, {
			key: 'renderCanClickStage',
			value: function renderCanClickStage(player) {
				var _this2 = this;

				var arr = [];

				_underscore2.default.times(STAGE_CELL_NUM_TO_HORIZONTAL, function (x) {
					_underscore2.default.times(STAGE_CELL_NUM_TO_HORIZONTAL, function (y) {
						arr.push(_this2.canClick(x, y, player));
					});
				});

				console.log(arr);
			}
		}, {
			key: 'click',
			value: function click(event) {
				var _this3 = this;

				var $target = (0, _jquery2.default)(event.target);
				var cell_id = $target.data('id') + '';
				var cell_index = $target.data('index');
				var cell_id_split = cell_id.split('');
				var cell_x = Number(cell_id_split[2]);
				var cell_y = Number(cell_id_split[0]);

				if (this.stage[cell_id] != EMPTY) {
					return false;
				}

				var arr = [];
				for (var x = -1; x < 2; x++) {
					for (var y = -1; y < 2; y++) {
						var num_x = cell_x + x;
						var num_y = cell_y + y;

						if (num_x >= 0 && num_x <= 3 && num_y >= 0 && num_y <= 3) {
							arr.push(num_y + '-' + num_x);
						}
					}
				}

				var is_changed = false;
				_underscore2.default.map(arr, function (id) {
					if (_this3.stage[id] == BLACK) {
						var hougaku = _this3.getHougaku(cell_id, id);
						var array = []; // その方角のid(配列)
						array = _this3.getHougakuIds(id, hougaku);
						array.unshift(id);

						_underscore2.default.each(array, function (id, index) {
							if (_this3.stage[id] == WHITE) {
								is_changed = true;
								var id = array[index - 1];
								_this3.stage[id] = WHITE;
							}
						});

						console.log(_this3.stage);
					}
				});

				if (is_changed) {
					$target.addClass('white');
				}
			}
		}, {
			key: 'render',
			value: function render() {}
		}, {
			key: 'getHougaku',
			value: function getHougaku(cell_id, id) {
				var hougaku = '';
				var start_x = Number(cell_id.split('')[2]);
				var start_y = Number(cell_id.split('')[0]);
				var goal_x = Number(id.split('')[2]);
				var goal_y = Number(id.split('')[0]);

				switch (start_x - goal_x) {
					case -1:
						switch (start_y - goal_y) {
							case -1:
								hougaku = 'TOP_LEFT';
								break;
							case 0:
								hougaku = 'CENTER_LEFT';
								break;
							case 1:
								hougaku = 'BOTTOM_LEFT';
								break;
						}
						break;
					case 0:
						switch (start_y - goal_y) {
							case -1:
								hougaku = 'TOP_CENTER';
								break;
							case 0:
								hougaku = 'CENTER_CENTER';
								break;
							case 1:
								hougaku = 'BOTTOM_CENTER';
								break;
						}
						break;
					case 1:
						switch (start_y - goal_y) {
							case -1:
								hougaku = 'TOP_RIGHT';
								break;
							case 0:
								hougaku = 'CENTER_RIGHT';
								break;
							case 1:
								hougaku = 'BOTTOM_RIGHT';
								break;
						}
						break;
				}

				return hougaku;
			}
		}, {
			key: 'getHougakuIds',
			value: function getHougakuIds(id, hougaku) {
				var arr = [];
				var id_x = Number(id.split('')[2]);
				var id_y = Number(id.split('')[0]);

				function getId(num) {
					while (id_x == 3) {
						id_x += 1;
					}
				}

				var counter = 0;
				switch (hougaku) {
					case 'TOP_LEFT':
						if (3 - id_x && 3 - id_y) {
							counter = Math.min(3 - id_x, 3 - id_y);
						}
						_underscore2.default.times(counter, function () {
							id_x += 1;
							id_y += 1;
							arr.push(id_y + '-' + id_x);
						});
						break;
					case 'CENTER_LEFT':
						if (3 - id_x) {
							counter = 3 - id_x;
						}
						_underscore2.default.times(counter, function () {
							id_x += 1;
							arr.push(id_y + '-' + id_x);
						});
						break;
					case 'BOTTOM_LEFT':
						if (3 - id_x && id_y) {
							counter = Math.min(3 - id_x, id_y);
						}
						_underscore2.default.times(counter, function () {
							id_x += 1;
							id_y -= 1;
							arr.push(id_y + '-' + id_x);
						});
						break;
					case 'TOP_CENTER':
						if (3 - id_y) {
							counter = 3 - id_y;
						}
						_underscore2.default.times(counter, function () {
							id_y += 1;
							arr.push(id_y + '-' + id_x);
						});
						break;
					case 'CENTER_CENTER':

						break;
					case 'BOTTOM_CENTER':
						if (id_y) {
							counter = id_y;
						}
						_underscore2.default.times(counter, function () {
							id_y -= 1;
							arr.push(id_y + '-' + id_x);
						});
						break;
					case 'TOP_RIGHT':
						if (id_x && 3 - id_y) {
							counter = Math.min(id_x, 3 - id_y);
						}
						_underscore2.default.times(counter, function () {
							id_x -= 1;
							id_y += 1;
							arr.push(id_y + '-' + id_x);
						});
						break;
					case 'CENTER_RIGHT':
						if (id_x) {
							counter = id_x;
						}
						_underscore2.default.times(counter, function () {
							id_x -= 1;
							arr.push(id_y + '-' + id_x);
						});
						break;
					case 'BOTTOM_RIGHT':
						if (id_x && id_y) {
							counter = Math.min(id_x, id_y);
						}
						_underscore2.default.times(counter, function () {
							id_x -= 1;
							id_y -= 1;
							arr.push(id_y + '-' + id_x);
						});
						break;
				}

				return arr;
			}
		}]);

		return Stage;
	}();

	module.exports = Stage;

/***/ }
]);
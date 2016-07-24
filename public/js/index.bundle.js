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

	var _Config = __webpack_require__(7);

	var _Config2 = _interopRequireDefault(_Config);

	var _Player = __webpack_require__(8);

	var _Player2 = _interopRequireDefault(_Player);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Stage = function () {
		function Stage() {
			_classCallCheck(this, Stage);

			this.$container = (0, _jquery2.default)('.container');

			this.stage = {};

			this.player = new _Player2.default();
		}

		_createClass(Stage, [{
			key: 'createHtmlInitialStage',
			value: function createHtmlInitialStage() {
				var _this = this;

				_underscore2.default.times(_Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL, function (x) {
					_underscore2.default.times(_Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL, function (y) {
						_this.stage[[x + '-' + y]] = _Config2.default.EMPTY;
					});
				});

				this.stage[['3-3']] = _Config2.default.WHITE;
				this.stage[['3-4']] = _Config2.default.BLACK;
				this.stage[['4-3']] = _Config2.default.BLACK;
				this.stage[['4-4']] = _Config2.default.WHITE;

				return this.stage;
			}
		}, {
			key: 'renderStage',
			value: function renderStage(html) {
				var stage = '';
				var counter = 0;

				stage += '<table><tr>';
				_underscore2.default.times(_Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL, function (x) {
					_underscore2.default.times(_Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL, function (y) {
						counter++;

						stage += '<td class="' + html[x + '-' + y] + '" data-id="' + x + '-' + y + '" data-index="' + counter + '">' + x + '-' + y + '</td>';

						if (counter % _Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL == 0) {
							stage += '</tr><tr>';
						}
					});
				});
				stage += '</tr></table>';

				this.player.renderPlayer();
				this.$container.append(stage);
			}
		}, {
			key: 'click',
			value: function click(event) {
				var _this2 = this;

				var $target = (0, _jquery2.default)(event.target);
				var cell_id = $target.data('id') + '';
				var cell_index = $target.data('index');
				var cell_id_split = cell_id.split('');
				var cell_x = Number(cell_id_split[2]);
				var cell_y = Number(cell_id_split[0]);

				if (this.stage[cell_id] != _Config2.default.EMPTY) {
					return false;
				}

				var target_siege_ids = []; // クリックしたマスの包囲マス
				for (var x = -1; x < 2; x++) {
					for (var y = -1; y < 2; y++) {
						var num_x = cell_x + x;
						var num_y = cell_y + y;

						if (num_x >= 0 && num_x < _Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL && num_y >= 0 && num_y < _Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL) {
							target_siege_ids.push(num_y + '-' + num_x);
						}
					}
				}
				console.log('target_siege_ids: ' + target_siege_ids);

				var is_changed = false; // ひっくり返すマスがあるか
				var enemy_name = this.player.getNextPlayer(this.player.current_player);
				_underscore2.default.map(target_siege_ids, function (id) {
					if (_this2.stage[id] == enemy_name) {
						var direction = _this2.getDirection(cell_id, id); // どの方角か
						var direction_ids = []; // その方角のid(配列)
						direction_ids = _this2.getDirectionIds(id, direction);
						direction_ids.unshift(id);
						console.log(direction_ids);

						// 方角のidに自分マスがあったらひっくり返す
						var turn_over_ids = [];
						_underscore2.default.some(direction_ids, function (id, index) {
							if (_this2.stage[id] == _Config2.default.EMPTY) return true; // 空マスが見つかったらひっくり返さない

							if (_this2.stage[id] == _this2.player.current_player) {
								is_changed = true;

								// 囲われた相手マスを自分マスに
								_underscore2.default.times(index, function (index) {
									var id = direction_ids[index];
									_this2.stage[id] = _this2.player.current_player;
								});
								_this2.stage[cell_id] = _this2.player.current_player; // クリックした箇所を自分マスに

								return true; // 自分マスがあったらそこでループ終了
							}
						});
					}
				});
				console.log('--------------------');

				if (is_changed) {
					this.render($target);
				}
			}
		}, {
			key: 'render',
			value: function render($target) {
				(0, _jquery2.default)('td').removeClass();
				_underscore2.default.each(this.stage, function (value, key) {
					(0, _jquery2.default)('[data-id="' + key + '"]').addClass(value);
				});

				this.player.current_player = this.player.getNextPlayer(this.player.current_player);
				this.player.renderPlayer();
			}
		}, {
			key: 'getDirection',
			value: function getDirection(cell_id, id) {
				var direction = '';
				var start_x = Number(cell_id.split('')[2]);
				var start_y = Number(cell_id.split('')[0]);
				var goal_x = Number(id.split('')[2]);
				var goal_y = Number(id.split('')[0]);

				switch (start_x - goal_x) {
					case -1:
						switch (start_y - goal_y) {
							case -1:
								direction = 'TOP_LEFT';
								break;
							case 0:
								direction = 'CENTER_LEFT';
								break;
							case 1:
								direction = 'BOTTOM_LEFT';
								break;
						}
						break;
					case 0:
						switch (start_y - goal_y) {
							case -1:
								direction = 'TOP_CENTER';
								break;
							case 0:
								direction = 'CENTER_CENTER';
								break;
							case 1:
								direction = 'BOTTOM_CENTER';
								break;
						}
						break;
					case 1:
						switch (start_y - goal_y) {
							case -1:
								direction = 'TOP_RIGHT';
								break;
							case 0:
								direction = 'CENTER_RIGHT';
								break;
							case 1:
								direction = 'BOTTOM_RIGHT';
								break;
						}
						break;
				}

				return direction;
			}
		}, {
			key: 'getDirectionIds',
			value: function getDirectionIds(id, direction) {
				var arr = [];
				var id_x = Number(id.split('')[2]);
				var id_y = Number(id.split('')[0]);

				var counter = 0;
				switch (direction) {
					case 'TOP_LEFT':
						if (_Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL - 1 - id_x && _Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL - 1 - id_y) {
							counter = Math.min(_Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL - 1 - id_x, _Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL - 1 - id_y);
						}
						_underscore2.default.times(counter, function () {
							id_x += 1;
							id_y += 1;
							arr.push(id_y + '-' + id_x);
						});
						break;
					case 'CENTER_LEFT':
						if (_Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL - 1 - id_x) {
							counter = _Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL - 1 - id_x;
						}
						_underscore2.default.times(counter, function () {
							id_x += 1;
							arr.push(id_y + '-' + id_x);
						});
						break;
					case 'BOTTOM_LEFT':
						if (_Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL - 1 - id_x && id_y) {
							counter = Math.min(_Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL - 1 - id_x, id_y);
						}
						_underscore2.default.times(counter, function () {
							id_x += 1;
							id_y -= 1;
							arr.push(id_y + '-' + id_x);
						});
						break;
					case 'TOP_CENTER':
						if (_Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL - 1 - id_y) {
							counter = _Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL - 1 - id_y;
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
						if (id_x && _Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL - 1 - id_y) {
							counter = Math.min(id_x, _Config2.default.STAGE_CELL_NUM_TO_HORIZONTAL - 1 - id_y);
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

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	var Config = {
		STAGE_CELL_NUM_TO_HORIZONTAL: 8, // 横のマス目
		EMPTY: 'empty', // 空マス
		WHITE: 'white', // 白マス
		BLACK: 'black' // 黒マス
	};

	module.exports = Config;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _underscore = __webpack_require__(3);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _Config = __webpack_require__(7);

	var _Config2 = _interopRequireDefault(_Config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Player = function () {
		function Player() {
			_classCallCheck(this, Player);

			this.$player = (0, _jquery2.default)('.player');

			this.current_player = _Config2.default.WHITE;
		}

		_createClass(Player, [{
			key: 'renderPlayer',
			value: function renderPlayer() {
				this.$player.html(this.current_player);
			}
		}, {
			key: 'getNextPlayer',
			value: function getNextPlayer(player) {
				return player == _Config2.default.WHITE ? _Config2.default.BLACK : _Config2.default.WHITE;
			}
		}]);

		return Player;
	}();

	module.exports = Player;

/***/ }
]);
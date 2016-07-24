'use strict';

import $ from 'jquery';
import _ from 'underscore';
import Config from 'Config';
import Player from 'Player';

class Stage {
	constructor() {
		this.$container = $('.container');
		
		this.stage = {};
		
		this.player = new Player();
	}
	
	createHtmlInitialStage() {
		_.times(Config.STAGE_CELL_NUM_TO_HORIZONTAL, (x) => {
			_.times(Config.STAGE_CELL_NUM_TO_HORIZONTAL, (y) => {
				this.stage[[x +'-'+ y]] = Config.EMPTY;
			});
		});
		
		this.stage[['3-3']] = Config.WHITE;
		this.stage[['3-4']] = Config.BLACK;
		this.stage[['4-3']] = Config.BLACK;
		this.stage[['4-4']] = Config.WHITE;
		
		return this.stage;
	}
	
	renderStage(html) {
		var stage = '';
		var counter = 0;
		
		stage += '<table><tr>';
		_.times(Config.STAGE_CELL_NUM_TO_HORIZONTAL, (x) => {
			_.times(Config.STAGE_CELL_NUM_TO_HORIZONTAL, (y) => {
				counter++;
				var class_name = html[x +'-'+ y];
				if (class_name == Config.EMPTY) class_name = '';
				
				stage += '<td class="'+ class_name +'" data-id="'+ x +'-'+ y +'" data-index="'+ counter +'">'+ x +'-'+ y +'</td>'
				
				if (counter % Config.STAGE_CELL_NUM_TO_HORIZONTAL == 0) {
					stage += '</tr><tr>'
				}
			});
		});
		stage += '</tr></table>'
		
		this.player.renderPlayer();
		this.$container.append(stage);
	}
	
	click(event) {
		var $target = $(event.target);
		var cell_id = $target.data('id') +'';
		var cell_index = $target.data('index');
		var cell_id_split = cell_id.split('');
		var cell_x = Number(cell_id_split[2]);
		var cell_y = Number(cell_id_split[0]);
		
		if (this.stage[cell_id] != Config.EMPTY) {
			return false;
		}
		
		var target_siege_ids = []; // クリックしたマスの包囲マス
		for (var x = -1; x < 2; x++) {
			for (var y = -1; y < 2; y++) {
				var num_x = cell_x + x;
				var num_y = cell_y + y;
				
				if (num_x >= 0 && num_x < Config.STAGE_CELL_NUM_TO_HORIZONTAL && num_y >= 0 && num_y < Config.STAGE_CELL_NUM_TO_HORIZONTAL) {
					target_siege_ids.push(num_y +'-'+ num_x);
				}
			}
		}
		
		var is_changed = false; // ひっくり返すマスがあるか
		var enemy_name = this.player.getNextPlayer(this.player.current_player); 
		_.map(target_siege_ids, (id) => {
			if (this.stage[id] == enemy_name) {
				var direction = this.getDirection(cell_id, id); // どの方角か
				var direction_ids = []; // その方角のid(配列)
				direction_ids = this.getDirectionIds(id, direction);
				direction_ids.unshift(id)
				
				// 方角のidに自分マスがあったらひっくり返す
				var turn_over_ids = [];
				_.some(direction_ids, (id, index) => {
					if (this.stage[id] == Config.EMPTY) return true; // 空マスが見つかったらひっくり返さない
					
					if (this.stage[id] == this.player.current_player) {
						is_changed = true;
						
						// 囲われた相手マスを自分マスに
						_.times(index, (index) => {
							var id = direction_ids[index];
							this.stage[id] = this.player.current_player;
						})
						this.stage[cell_id] = this.player.current_player; // クリックした箇所を自分マスに
						
						return true; // 自分マスがあったらそこでループ終了
					}
					
				});
			}
		});
		
		if (is_changed) {
			this.render($target);
		}
	}
	
	render($target) {
		$('td').removeClass();
		_.each(this.stage, (value, key) => {
			if (value == Config.EMPTY) return false;
			 
			$('[data-id="'+ key +'"]').addClass(value);
		});
		
		this.player.current_player = this.player.getNextPlayer(this.player.current_player);
		this.player.renderPlayer();
	}
	
	getDirection(cell_id, id) {
		var direction = '';
		var start_x = Number(cell_id.split('')[2]);
		var start_y = Number(cell_id.split('')[0]);
		var goal_x = Number(id.split('')[2]);
		var goal_y = Number(id.split('')[0]);
		
		switch(start_x - goal_x) {
			case -1:
				switch(start_y - goal_y) {
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
				switch(start_y - goal_y) {
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
				switch(start_y - goal_y) {
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
	
	getDirectionIds(id, direction) {
		var arr = [];
		var id_x = Number(id.split('')[2]);
		var id_y = Number(id.split('')[0]);
		
		var counter = 0;
		switch(direction) {
			case 'TOP_LEFT':
				if ((Config.STAGE_CELL_NUM_TO_HORIZONTAL - 1) - id_x && (Config.STAGE_CELL_NUM_TO_HORIZONTAL - 1) - id_y) {
					counter = Math.min((Config.STAGE_CELL_NUM_TO_HORIZONTAL - 1) - id_x, (Config.STAGE_CELL_NUM_TO_HORIZONTAL - 1) - id_y);
				}
				_.times(counter, () => {
					id_x += 1;
					id_y += 1;
					arr.push(id_y +'-'+ id_x);
				});
				break;
			case 'CENTER_LEFT':
				if ((Config.STAGE_CELL_NUM_TO_HORIZONTAL - 1) - id_x) {
					counter = (Config.STAGE_CELL_NUM_TO_HORIZONTAL - 1) - id_x;
				}
				_.times(counter, () => {
					id_x += 1;
					arr.push(id_y +'-'+ id_x);
				});
				break;
			case 'BOTTOM_LEFT':
				if ((Config.STAGE_CELL_NUM_TO_HORIZONTAL - 1) - id_x && id_y) {
					counter = Math.min((Config.STAGE_CELL_NUM_TO_HORIZONTAL - 1) - id_x, id_y);
				}
				_.times(counter, () => {
					id_x += 1;
					id_y -= 1;
					arr.push(id_y +'-'+ id_x);
				});
				break;
			case 'TOP_CENTER':
				if ((Config.STAGE_CELL_NUM_TO_HORIZONTAL - 1) - id_y) {
					counter = (Config.STAGE_CELL_NUM_TO_HORIZONTAL - 1) - id_y;
				}
				_.times(counter, () => {
					id_y += 1;
					arr.push(id_y +'-'+ id_x);
				});
				break;
			case 'CENTER_CENTER':
				
				break;
			case 'BOTTOM_CENTER':
				if (id_y) {
					counter = id_y;
				}
				_.times(counter, () => {
					id_y -= 1;
					arr.push(id_y +'-'+ id_x);
				});
				break;
			case 'TOP_RIGHT':
				if (id_x && (Config.STAGE_CELL_NUM_TO_HORIZONTAL - 1) - id_y) {
					counter = Math.min(id_x, (Config.STAGE_CELL_NUM_TO_HORIZONTAL - 1) - id_y);
				}
				_.times(counter, () => {
					id_x -= 1;
					id_y += 1;
					arr.push(id_y +'-'+ id_x);
				});
				break;
			case 'CENTER_RIGHT':
				if (id_x) {
					counter = id_x;
				}
				_.times(counter, () => {
					id_x -= 1;
					arr.push(id_y +'-'+ id_x);
				});
				break;
			case 'BOTTOM_RIGHT':
				if (id_x && id_y) {
					counter = Math.min(id_x, id_y);
				}
				_.times(counter, () => {
					id_x -= 1;
					id_y -= 1;
					arr.push(id_y +'-'+ id_x);
				});
				break;
		}
		
		return arr;
	}
}

module.exports = Stage;
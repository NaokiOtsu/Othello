'use strict';

import $ from 'jquery';
import _ from 'underscore';

const STAGE_CELL_NUM_TO_HORIZONTAL = 4;
const EMPTY = 'empty';
const WHITE = 'white';
const BLACK = 'black';

class Stage {
	constructor() {
		this.stage = {};
	}
	
	createHtmlInitialStage() {
		_.times(STAGE_CELL_NUM_TO_HORIZONTAL, (x) => {
			_.times(STAGE_CELL_NUM_TO_HORIZONTAL, (y) => {
				this.stage[[x +'-'+ y]] = EMPTY;
			});
		});
		
		this.stage[['1-1']] = WHITE;
		this.stage[['2-1']] = BLACK;
		this.stage[['1-2']] = BLACK;
		this.stage[['2-2']] = WHITE;
		
		return this.stage;
	}
	
	renderStage(html) {
		var stage = '';
		var counter = 0;
		
		stage += '<table><tr>';
		_.times(STAGE_CELL_NUM_TO_HORIZONTAL, (x) => {
			_.times(STAGE_CELL_NUM_TO_HORIZONTAL, (y) => {
				counter++;
				
				stage += '<td class="'+ html[x +'-'+ y] +'" data-id="'+ x +'-'+ y +'" data-index="'+ counter +'"></td>'
				
				if (counter % 4 == 0) {
					stage += '</tr><tr>'
				}
			});
		});
		stage += '</tr></table>'
		
		$('.container').html(stage);
	}
	
	renderCanClickStage(player) {
		var arr = [];
		
		_.times(STAGE_CELL_NUM_TO_HORIZONTAL, (x) => {
			_.times(STAGE_CELL_NUM_TO_HORIZONTAL, (y) => {
				arr.push(this.canClick(x, y, player));
			});
		});
		
		console.log(arr)
		
	}
	
	click(event) {
		var $target = $(event.target);
		var cell_id = $target.data('id') +'';
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
					arr.push(num_y +'-'+ num_x);
				}
			}
		}
		
		var is_changed = false;
		_.map(arr, (id) => {
			if (this.stage[id] == BLACK) {
				var hougaku = this.getHougaku(cell_id, id);
				var array = []; // その方角のid(配列)
				array = this.getHougakuIds(id, hougaku);
				array.unshift(id)
				
				_.each(array, (id, index) => {
					if (this.stage[id] == WHITE) {
						is_changed = true;
						var id = array[index - 1];
						this.stage[id] = WHITE
					}
				});
				
				console.log(this.stage)
			}
		});
		
		if (is_changed) {
			$target.addClass('white')
		}
	}
	
	render() {
		
	}
	
	getHougaku(cell_id, id) {
		var hougaku = '';
		var start_x = Number(cell_id.split('')[2]);
		var start_y = Number(cell_id.split('')[0]);
		var goal_x = Number(id.split('')[2]);
		var goal_y = Number(id.split('')[0]);
		
		switch(start_x - goal_x) {
			case -1:
				switch(start_y - goal_y) {
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
				switch(start_y - goal_y) {
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
				switch(start_y - goal_y) {
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
	
	getHougakuIds(id, hougaku) {
		var arr = [];
		var id_x = Number(id.split('')[2]);
		var id_y = Number(id.split('')[0]);
		
		function getId(num) {
			while (id_x == 3) {
				id_x += 1;
			}
		}
		
		var counter = 0;
		switch(hougaku) {
			case 'TOP_LEFT':
				if (3 - id_x && 3 - id_y) {
					counter = Math.min(3 - id_x, 3 - id_y);
				}
				_.times(counter, () => {
					id_x += 1;
					id_y += 1;
					arr.push(id_y +'-'+ id_x);
				});
				break;
			case 'CENTER_LEFT':
				if (3 - id_x) {
					counter = 3 - id_x;
				}
				_.times(counter, () => {
					id_x += 1;
					arr.push(id_y +'-'+ id_x);
				});
				break;
			case 'BOTTOM_LEFT':
				if (3 - id_x && id_y) {
					counter = Math.min(3 - id_x, id_y);
				}
				_.times(counter, () => {
					id_x += 1;
					id_y -= 1;
					arr.push(id_y +'-'+ id_x);
				});
				break;
			case 'TOP_CENTER':
				if (3 - id_y) {
					counter = 3 - id_y;
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
				if (id_x && 3 - id_y) {
					counter = Math.min(id_x, 3 - id_y);
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
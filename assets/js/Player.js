'use strict';

import $ from 'jquery';
import _ from 'underscore';
import Config from 'Config';

class Player {
	constructor() {
		this.$player = $('.player');
		
		this.current_player = Config.WHITE;
	}
	
	renderPlayer() {
		this.$player.html(this.current_player);
	}
	
	getNextPlayer(player) {
		return (player == Config.WHITE) ? Config.BLACK : Config.WHITE;
	}
}

module.exports = Player;
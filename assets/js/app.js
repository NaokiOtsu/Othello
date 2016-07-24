'use strict';

import $ from 'jquery';
import Stage from 'Stage';

$(() => {
	
	// ステージの作成
	var stage = new Stage();
	var html = stage.createHtmlInitialStage();
	
	// ステージを描画
	stage.renderStage(html);
	
	// セルをクリックしたら
	$('td').on('click', stage.click.bind(stage));
});


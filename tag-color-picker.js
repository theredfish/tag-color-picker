/*
	Tag Color Picker Plugin 1.0.0
	Copyright (c) 2015 TheRedFish

	Documentation for this plugin here:
	https://github.com/theredfish/tag-color-picker

	Licensed under the MIT license:
	http://www.opensource.org/licenses/mit-license.php
*/


$(document).ready(function() {

	var input = $('#tagGenerator');
	var main = $('#tag-color-picker');
	var tags_list = [];
	/*
	 * Default key delimiters are :
	 * 188 : keyboard comma
	 * 13  : keyboard enter
	 */
	var delimiters = [188, 13];
	var color_picker = {
		cyan: '#0099FF',
		blue: '#005b96',
		yellow: '#edc951',
		orange: '#eb6841',
		red: '#cc2a36',
		green: '#419873',
		purple: '#673888',
	};

	/**
	* Control tag Generator field
	* Get substring by "," delimiter
	*/
	input.on('keyup', function(event) {
		var _this = $(this);
		/*var last_char = _this.val().substr(_this.val().length-1);*/
		var keyboard_event = event.which;

		if ($.inArray(keyboard_event, delimiters) !== -1) {
			var tag_name = _this.val();

			// remove comma from tag name
			if (keyboard_event === 188)
				tag_name = tag_name.split(',')[0];

			if (tag_name === '')
				return false;

			var tag = {
				name: tag_name,
			}

			tags_list.push(tag);
			addTag(tag);
		}
	});

	/**
	 * Add tag before input field
	 * @param tag which represents the tag to add
	 */
	function addTag(tag) {
		var new_tag = '<div class="tag">' + tag.name + ' <a href="#" class="close">x</a></div>';

		// if there isn't any tag we prepend main
		if (main.find($('.tag')).last().length === 0)
			main.prepend(new_tag);
		else
			$(new_tag).insertAfter(main.find($('.tag')).last());

		/**
		 * Attach close event to close button
		 */
		$('.close').on('click', function(e) {
			e.stopPropagation(); // stop click event propagation to parent
			removeTag($(this).parent());
		});

		input.val(''); // clear input
		addPopover(main.find($('.tag')).last()); // set popover to the tag
	}

	/**
	 * Remove specified tag from the DOM
	 * @param tag which represents the specified resource
	 * @return void
	 */
	function removeTag(tag) {
		if (popoverExists(tag))
			getPopover(tag).remove();

		tag.remove();
	}

	/**
	 * Get tag's popover
	 * @param tag which represents the specified resource
	 * @return Object which represents the tag's popover
	 */
	function getPopover(tag) {
		return $('#' + tag.attr('aria-describedby'));
	}

	/**
	 * Check if tag's popover exists
	 * Popover exists only if aria-describedby attribute is defined
	 * @param tag which represents the specified resource
	 * @return true if popover exists, else return false
	 */
	function popoverExists(tag) {
		return (typeof tag.attr('aria-describedby') !== typeof undefined
				&& tag.attr('aria-describedby') !== false);
	}

	/**
	 * Define popover to the specified tag resource
	 * Add beautiful color picker to the tag
	 * @param tag which represents the specified resource
	 */
	function addPopover(tag) {
		$(tag).popover({
			html: true,
			placement: 'bottom',
			trigger: 'manual', // avoid conflicts with initialization
			content: function() {
				var html_template = '';

				$.each(color_picker, function(key, value) {
					html_template += '<a href="#" id="' + value + '"><div class="box-color" style="background-color:' + value +'"></div></a>';
				});

				return html_template;
			},

			title: function() {
				return 'Select your tag color';
			},
		})
		.on({
			click: function() {
				// aria-describedby is defined when popover is opened
				// undefined && false to match with all browsers
				if (typeof tag.attr('aria-describedby') !== typeof undefined
					&& tag.attr('aria-describedby') !== false) {
					tag.popover('hide');
				}
				else {
					$('.popover:not(this)').popover('hide'); // close all other popover
					tag.popover('show');
				}
			},
		});

		addSelectColorEvents($(tag));
	}

	/**
	 * Attach select color event to popover's color boxes
	 * @param tag which represents the concerned tag
	 */
	function addSelectColorEvents(tag) {
		$(tag).on('inserted.bs.popover', function () {
			var popover = '#' + $(this).attr('aria-describedby');
			var old_hexa_color = $(tag).css('background-color');

			// Attach events for each box color
			$(popover).on({
				click: function(e) {
					var hexa_color = this.id;
					$(tag).css('background-color', hexa_color);
					$(tag).popover('hide');
				},

			}, 'a');
		});
	}

	/**
	 * Detect click inside tag-color-picker
	 * Trigger input focuse
	 */
	$('#tag-color-picker').on('click', function() {
		$('input', this).focus();
	});

});
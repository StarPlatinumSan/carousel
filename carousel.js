$(document).ready(function () {
	let imageList = $(".imageList");
	let scrollAmount = $(".imageList img").first().width();
	let visibleWidth = imageList.width();
	let imageListWidth = imageList[0].scrollWidth;
	let currentScrollPosition = 0;
	let isAnimating = false;

	let scrollBarThumb = $(".scrollbarThumb");
	let scrollbarTrack = $(".scrollbarTrack");
	let scrollbarTrackWidth = scrollbarTrack.width();
	let thumbMaxPosition = scrollbarTrackWidth - scrollBarThumb.width();

	function updateScrollbarThumb() {
		let thumbPosition = (currentScrollPosition / (imageListWidth - visibleWidth)) * thumbMaxPosition;
		scrollBarThumb.animate(
			{
				left: thumbPosition + "px",
			},
			400
		);
	}

	function updateScrollbarThumbNoAnim() {
		let thumbPosition = (currentScrollPosition / (imageListWidth - visibleWidth)) * thumbMaxPosition;
		scrollBarThumb.css("left", thumbPosition + "px");
	}

	function scrollTo(position, animate = true) {
		if (animate) {
			imageList.animate({ scrollLeft: position }, 400, function () {
				isAnimating = false;
			});
		} else {
			imageList.scrollLeft(position);
			isAnimating = false;
		}
		currentScrollPosition = position;
		updateScrollbarThumb();
	}

	$("#right").click(function () {
		if (!isAnimating) {
			isAnimating = true;
			let newPosition = currentScrollPosition + scrollAmount;
			if (newPosition + visibleWidth > imageListWidth) {
				newPosition = 0;
			}
			scrollTo(newPosition);
		}
	});

	$("#left").click(function () {
		if (!isAnimating) {
			isAnimating = true;
			let newPosition = currentScrollPosition - scrollAmount;
			if (newPosition < 0) {
				newPosition = imageListWidth - visibleWidth;
			}
			scrollTo(newPosition);
		}
	});

	scrollBarThumb.on("mousedown", function (e) {
		let initialMouseX = e.clientX;
		let initialThumbX = scrollBarThumb.position().left;
		$(document).on("mousemove.scroll", function (e) {
			let deltaX = e.clientX - initialMouseX;
			let newThumbX = initialThumbX + deltaX;
			if (newThumbX < 0) newThumbX = 0;
			if (newThumbX > thumbMaxPosition) newThumbX = thumbMaxPosition;
			let newScrollPosition = (newThumbX / thumbMaxPosition) * (imageListWidth - visibleWidth);
			imageList.scrollLeft(newScrollPosition);
			currentScrollPosition = newScrollPosition;
			updateScrollbarThumbNoAnim();
		});
		$(document).on("mouseup.scroll", function () {
			$(document).off(".scroll");
		});
	});
});

const hiddenElements = document.querySelectorAll('.hidden');

const observer = new IntersectionObserver((entries)  => {
	entries.forEach(entry => {
		entry.target.classList.toggle('show', entry.isIntersecting);
	});
});

hiddenElements.forEach((el) => {
        observer.observe(el);
})
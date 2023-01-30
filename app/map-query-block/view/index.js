// import apiFetch from '@wordpress/api-fetch'

// apiFetch({ path: '/wp/v2/posts' }).then((posts) => {
// 	console.log(posts);
// });

const mapQueries = document.querySelectorAll('.wp-block-flare-image-map')

mapQueries.forEach(blockEl => {
	const ids = blockEl.dataset.postIds.split(',')
	console.log(ids)
})

document.addEventListener('DOMContentLoaded', function() {
    const newPostForm = document.getElementById('new-post-form');
    const blogSection = document.getElementById('blog');

    newPostForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;

        const newArticle = document.createElement('article');
        newArticle.innerHTML = `
            <h3>${title}</h3>
            <p>${content.substring(0, 100)}...</p>
            <a href="#">続きを読む</a>
        `;

        blogSection.insertBefore(newArticle, blogSection.firstChild);

        newPostForm.reset();
    });
});


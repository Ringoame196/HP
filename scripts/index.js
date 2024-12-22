document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('viewPlugin');
    const cacheDuration = 10 * 60 * 1000; // 10分

    button.addEventListener('click', async () => {
        button.disabled = true;
        const username = 'ringoame196-s-mcPlugin';

        async function fetchRepositories() {
            // キャッシュがあれば利用し、なければAPIを呼び出す
            const cachedData = JSON.parse(localStorage.getItem('repoData'));
            const cacheTime = localStorage.getItem('cacheTime');

            if (cachedData && cacheTime && (Date.now() - cacheTime < cacheDuration)) {
                displayRepositories(cachedData);
                console.log("キャッシュからデータを表示しました");
                return;
            }

            // 最新9件のリポジトリ情報をAPIから取得
            const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=9&sort=created`);
            const repos = await response.json();
            localStorage.setItem('repoData', JSON.stringify(repos));
            localStorage.setItem('cacheTime', Date.now().toString());

            displayRepositories(repos);
            console.log("APIからリポジトリ情報を取得しました");
        }

        function displayRepositories(repos) {
            const repoList = document.getElementById('repo-list');
            repoList.innerHTML = '';
            repos.forEach(repo => {
                const repoDiv = document.createElement('div');
                repoDiv.classList.add('repo');
                repoDiv.innerHTML = `
                    <h2 id="title">${repo.name}</h2>
                    <p>${repo.description || 'No description'}</p>
                    <a href="${repo.html_url}" target="_blank">GitHubページへ</a>
                `;
                repoList.appendChild(repoDiv);
            });
        }

        await fetchRepositories();
    });
});
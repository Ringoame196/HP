document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('viewPlugin');
    
    button.addEventListener('click', async () => {
        // ボタンを無効にする
        button.disabled = true;

        const username = 'ringoame196-s-mcPlugin';

        async function fetchRepositories() {
            const response = await fetch(`https://api.github.com/users/${username}/repos`);
            const repos = await response.json();
            const repoList = document.getElementById('repo-list');
            repoList.innerHTML = ''; // リストをクリア

            // Promise.allで全てのリリース情報を取得する
            const repoPromises = repos.map(async (repo) => {
                const repoDiv = document.createElement('div');
                repoDiv.classList.add('repo');

                try {
                    const releaseResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/releases/latest`);
                    if (releaseResponse.ok) {
                        const releaseData = await releaseResponse.json();
                        // リリースがある場合
                        repoDiv.innerHTML = `
                            <h2 id="title">${repo.name}</h2>
                            <p>${repo.description || 'No description'}</p>
                            <a href="${releaseData.html_url}" target="_blank">プラグイン表示</a>
                        `;
                    } else {
                        // リリースがない場合
                        repoDiv.innerHTML = `
                            <h2 id="title">${repo.name}</h2>
                            <p>${repo.description || 'No description'}</p>
                            <p style="color: red;">配布されていません</p>
                        `;
                    }
                } catch {
                    // エラーハンドリング（リリース情報が取得できなかった場合）
                    repoDiv.innerHTML = `
                        <h2 id="title">${repo.name}</h2>
                        <p>${repo.description || 'No description'}</p>
                        <p style="color: red;">配布されていません</p>
                    `;
                }

                return repoDiv; // 完成したrepoDivを返す
            });

            // 全てのプロミスが解決するのを待ってからDOMに追加
            const repoDivs = await Promise.all(repoPromises);
            repoDivs.forEach(repoDiv => repoList.appendChild(repoDiv));
        }

        // 関数を呼び出してリポジトリ情報を取得
        await fetchRepositories();
        console.log("リポジトリ情報を取得しました");
    });
});
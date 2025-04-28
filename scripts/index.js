document.addEventListener('DOMContentLoaded', () => {
  // プロフィール画像のエラーハンドリング
  const profileImage = document.getElementById('profile-image');
  profileImage.onerror = () => {
    profileImage.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"%3E%3Crect width="128" height="128" fill="%231a5336"/%3E%3Ctext x="50%25" y="50%25" font-size="24" text-anchor="middle" alignment-baseline="middle" font-family="Arial, sans-serif" fill="white"%3Eりんご飴196%3C/text%3E%3C/svg%3E';
  };

  // 静的プロジェクトデータ
  const staticProjects = [
    {
      title: "Minecraft プラグイン",
      description: "Kotlinで開発したマインクラフトのプラグイン。サーバー運営に役立つ様々な機能を追加します。",
      icon: "🧩",
      link: "https://github.com/ringoame196-s-mcPlugin"
    },
    {
      title: "プラグインまとめ",
      description: "開発したプラグインの詳細な一覧と説明。機能や使い方について詳しく解説しています。",
      icon: "📝",
      link: "https://fixed-yumberry-efb.notion.site/196-1a4ff0fcfd5c80af8ec5cd214f1fb29c"
    }
  ];

  // GitHubリポジトリを取得する関数
  async function fetchGithubRepos() {
    // キャッシュチェック
    const cachedData = localStorage.getItem("github-repos-cache");
    const cachedTime = localStorage.getItem("github-repos-cache-time");
    
    if (cachedData && cachedTime && Date.now() - parseInt(cachedTime) < 3600000) {
      return JSON.parse(cachedData);
    }
    
    try {
      const response = await fetch(
        "https://api.github.com/users/ringoame196-s-mcPlugin/repos?sort=updated&per_page=5"
      );
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // キャッシュを更新
      localStorage.setItem("github-repos-cache", JSON.stringify(data));
      localStorage.setItem("github-repos-cache-time", Date.now().toString());
      
      return data;
    } catch (error) {
      console.error("Failed to fetch GitHub repos:", error);
      return [];
    }
  }

  // プロジェクトスライドを作成する関数
  function createProjectSlide(project) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    
    const link = document.createElement('a');
    link.href = project.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // アイコン
    const iconDiv = document.createElement('div');
    iconDiv.className = 'project-icon';
    if (project.isGithubRepo) {
      // Font Awesomeを使用
      iconDiv.innerHTML = '<i class="fab fa-github fa-3x"></i>';
    } else {
      iconDiv.textContent = project.icon;
    }
    
    // タイトル
    const title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = project.title;
    
    // 説明
    const description = document.createElement('p');
    description.className = 'project-description';
    description.textContent = project.description;
    
    // メタ情報（GitHubリポジトリの場合）
    if (project.isGithubRepo && (project.language || project.updatedAt)) {
      const meta = document.createElement('div');
      meta.className = 'project-meta';
      
      if (project.language) {
        const langContainer = document.createElement('span');
        langContainer.style.marginRight = '12px';
        
        const langDot = document.createElement('span');
        langDot.className = 'language-dot';
        
        const langText = document.createTextNode(project.language);
        
        langContainer.appendChild(langDot);
        langContainer.appendChild(langText);
        meta.appendChild(langContainer);
      }
      
      if (project.updatedAt) {
        const date = new Date(project.updatedAt);
        const dateText = document.createElement('span');
        dateText.textContent = `更新: ${date.toLocaleDateString('ja-JP')}`;
        meta.appendChild(dateText);
      }
      
      card.appendChild(meta);
    }
    
    // リンク
    const linkText = document.createElement('div');
    linkText.className = 'project-link';
    linkText.innerHTML = `
      <span>詳細を見る</span>
      <i class="fas fa-external-link-alt"></i>
    `;
    
    // 要素を組み立て
    card.appendChild(iconDiv);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(linkText);
    link.appendChild(card);
    slide.appendChild(link);
    
    return slide;
  }

  // カルーセルを初期化する関数
  async function initCarousel() {
    const carouselElement = document.getElementById('project-carousel');
    let currentIndex = 0;
    let allProjects = [...staticProjects];
    
    // GitHubリポジトリを取得して追加
    try {
      const githubRepos = await fetchGithubRepos();
      const formattedRepos = githubRepos.map(repo => ({
        title: repo.name,
        description: repo.description || "マインクラフトプラグイン",
        isGithubRepo: true,
        link: repo.html_url,
        language: repo.language,
        updatedAt: repo.updated_at
      }));
      
      allProjects = [...staticProjects, ...formattedRepos];
    } catch (error) {
      console.error("Error loading GitHub repos:", error);
    }
    
    // ローディング表示を削除
    carouselElement.innerHTML = '';
    
    // カルーセルコンテナを作成
    const container = document.createElement('div');
    container.className = 'carousel-container';
    
    // スライダーを作成
    const slider = document.createElement('div');
    slider.className = 'carousel-slider';
    
    // 各プロジェクトのスライドを作成
    allProjects.forEach(project => {
      const slide = createProjectSlide(project);
      slider.appendChild(slide);
    });
    
    // ナビゲーションボタンを作成
    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    // インジケーターを作成
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    
    allProjects.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${index === currentIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(index));
      indicators.appendChild(dot);
    });
    
    // 要素を追加
    container.appendChild(slider);
    carouselElement.appendChild(container);
    carouselElement.appendChild(prevButton);
    carouselElement.appendChild(nextButton);
    carouselElement.appendChild(indicators);
    
    // 次のスライドへ
    function nextSlide() {
      currentIndex = (currentIndex + 1) % allProjects.length;
      updateCarousel();
    }
    
    // 前のスライドへ
    function prevSlide() {
      currentIndex = (currentIndex - 1 + allProjects.length) % allProjects.length;
      updateCarousel();
    }
    
    // 特定のスライドへ
    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }
    
    // カルーセルの状態を更新
    function updateCarousel() {
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // インジケーターの更新
      const dots = indicators.querySelectorAll('.carousel-dot');
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
    
    // イベントリスナーを追加
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    // タッチスワイプ対応
    let touchStartX = 0;
    let touchEndX = 0;
    
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    function handleSwipe() {
      const threshold = 50;
      if (touchStartX - touchEndX > threshold) {
        nextSlide();
      } else if (touchEndX - touchStartX > threshold) {
        prevSlide();
      }
    }
    
    // 自動スライド
    let autoSlideInterval = setInterval(nextSlide, 6000);
    
    // マウスオーバーで自動スライドを一時停止
    container.addEventListener('mouseenter', () => {
      clearInterval(autoSlideInterval);
    });
    
    container.addEventListener('mouseleave', () => {
      autoSlideInterval = setInterval(nextSlide, 6000);
    });
  }
  
  // カルーセルを初期化
  initCarousel();
});
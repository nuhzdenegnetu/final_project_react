import { useState, useEffect } from "react";
import { Post } from "../../types/news.interface";
import { useFetch, useFilter } from "../../hooks";

export default function ForumPage() {
  const { data: posts, loading, error: fetchError } = useFetch<Post>('../data/forumPosts.json');
  const { filter: category, filteredItems: filteredPosts, handleFilterChange: handleCategoryChange } = 
    useFilter<Post>(posts, 'category' as keyof Post, 'Все');
  
  const [error, setError] = useState<string | null>(fetchError);
  const [animatedPosts, setAnimatedPosts] = useState<boolean[]>([]);

  // Эффект для анимированного появления постов
  useEffect(() => {
    if (filteredPosts.length > 0) {
      // Сбрасываем анимации при изменении фильтра
      setAnimatedPosts(new Array(filteredPosts.length).fill(false));
        
      // Постепенно показываем каждую карточку с интервалом
      const timer = setTimeout(() => {
        filteredPosts.forEach((_, index) => {
          setTimeout(() => {
            setAnimatedPosts(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }, index * 100); // 100ms интервал между появлением карточек
        });
      }, 100);
        
      return () => clearTimeout(timer);
    }
  }, [filteredPosts]);

  const handleDeletePost = async () => {
    try {
      // В будущем здесь будет вызов API для удаления поста
      // Пока просто эмулируем удаление
    } catch (err) {
      console.error('Ошибка удаления поста:', err);
      setError('Ошибка при удалении поста');
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl text-green-300">Загрузка данных форума...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-red-900 bg-opacity-20 rounded-xl p-6 border border-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xl text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center text-green-300 border-b border-green-800 pb-4">
        Форум Dota 2
      </h1>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-gray-800 p-4 rounded-lg">
        <select
          value={category}
          onChange={e => handleCategoryChange(e.target.value)}
          className="bg-gray-700 text-white border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        >
          <option value="Все">Все категории</option>
          <option value="Обновления">Обновления</option>
          <option value="Гайды">Гайды</option>
          <option value="Турниры">Турниры</option>
          <option value="Обсуждения">Обсуждения</option>
        </select>
      </div>

      <div className="space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <div 
              key={post.id} 
              className={`bg-gray-800 border border-gray-700 shadow-lg rounded-2xl overflow-hidden transition-all duration-500 transform ${
                animatedPosts[index] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              } hover:shadow-green-500/20 hover:shadow-xl hover:-translate-y-1`}
            >
              <div className="bg-gradient-to-r from-green-900 to-blue-900 p-3">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-white mb-1">{post.title}</h2>
                  <button 
                    onClick={() => handleDeletePost()}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center text-sm text-gray-300 mt-1 gap-2">
                  <span className="bg-gray-700 px-2 py-1 rounded text-xs">Автор: {post.author}</span>
                  <span className="bg-gray-700 px-2 py-1 rounded text-xs">Дата: {formatDate(post.date)}</span>
                  <span className="bg-green-800 text-green-200 px-2 py-1 rounded-full text-xs font-semibold">{post.category}</span>
                </div>
              </div>

              <div className="p-4">
                {post.imageUrl && (
                  <div className="mb-4">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg border border-gray-700"
                    />
                  </div>
                )}

                <p className="text-gray-300">{post.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-800 bg-opacity-50 rounded-xl">
            <img 
              src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/browse_no_results.png" 
              alt="Ничего не найдено" 
              className="mx-auto h-32 mb-4 opacity-60"
            />
            <p className="text-xl text-gray-400 mb-2">Посты не найдены</p>
            <p className="text-gray-500">Попробуйте изменить категорию</p>
          </div>
        )}
      </div>
    </div>
  );
} 
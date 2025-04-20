import { useState } from "react";
import { Post } from "../../types/news.interface";
import { useFetch, useFilter } from "../../hooks";

export default function ForumPage() {
  const { data: posts, loading, error: fetchError } = useFetch<Post>('../data/forumPosts.json');
  const { filter: category, filteredItems: filteredPosts, handleFilterChange: handleCategoryChange } = 
    useFilter<Post>(posts, 'category' as keyof Post, 'Все');
  
  const [error, setError] = useState<string | null>(fetchError);

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
      <div className="container mx-auto py-8 text-center">
        <p className="text-xl">Загрузка данных...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Форум Dota 2</h1>

      <div className="flex flex-wrap justify-between items-center mb-8">
        <div className="w-full">
          <select
            value={category}
            onChange={e => handleCategoryChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Все">Все категории</option>
            <option value="Обновления">Обновления</option>
            <option value="Гайды">Гайды</option>
            <option value="Турниры">Турниры</option>
            <option value="Обсуждения">Обсуждения</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h2>
                  <button 
                    onClick={() => handleDeletePost()}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <span className="mr-4">Автор: {post.author}</span>
                  <span>Дата: {formatDate(post.date)}</span>
                  <span className="ml-4 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">{post.category}</span>
                </div>

                {post.imageUrl && (
                  <div className="mb-4">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                <p className="text-gray-700">{post.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-xl">Нет постов в выбранной категории</p>
          </div>
        )}
      </div>
    </div>
  );
} 
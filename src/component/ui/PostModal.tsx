import { useState } from "react";
import { Post } from "../../types/news.interface";

interface PostModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  onAddPost: (post: Post) => void;
}

export default function PostModal({ showModal, setShowModal, onAddPost }: PostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Обсуждения");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert("Пожалуйста, заполните заголовок и содержимое поста");
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(), // Временное решение для ID
      title,
      content,
      author: "Пользователь", // В будущем будет браться из авторизации
      date: new Date().toISOString().split('T')[0],
      category,
      ...(imageUrl.trim() && { imageUrl }) // Добавляем поле только если оно не пустое
    };

    onAddPost(newPost);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("Обсуждения");
    setImageUrl("");
  };

  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Создать новый пост</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Заголовок
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите заголовок поста"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Содержимое
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
              placeholder="Введите содержимое поста"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Обновления">Обновления</option>
              <option value="Гайды">Гайды</option>
              <option value="Турниры">Турниры</option>
              <option value="Обсуждения">Обсуждения</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              URL изображения <span className="text-gray-500 text-xs">(необязательно)</span>
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">Оставьте поле пустым, если изображение не требуется</p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Опубликовать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
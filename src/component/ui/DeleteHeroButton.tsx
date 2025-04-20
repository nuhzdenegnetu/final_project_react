import { useDelete } from '../../hooks';
import { API_URL_HEROES } from '../../const/API_MOCKS';

interface DeleteHeroButtonProps {
  id: string | number;
  onSuccess?: () => void;
}

export const DeleteHeroButton = ({ id, onSuccess }: DeleteHeroButtonProps) => {
  const { deleteItem, isLoading } = useDelete(API_URL_HEROES, onSuccess);

  const handleDelete = async () => {
    await deleteItem(id);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className="text-red-500 hover:text-red-600 transition-colors"
      title="Удалить"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}; 
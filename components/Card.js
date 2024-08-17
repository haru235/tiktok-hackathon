export default function Card({ title, description, imageUrl }) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-64">
        <img src={imageUrl} alt={title} className="w-full h-40 object-cover"/>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>
      </div>
    );
  }
  
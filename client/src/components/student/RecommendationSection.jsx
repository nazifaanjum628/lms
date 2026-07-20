import { useNavigate } from 'react-router-dom';
import useRecommendations from '../../hooks/useRecommendations';
import { assets } from '../../assets/assets';

const RecommendationSection = () => {
  const { recommendations, type, loading } = useRecommendations();
  const navigate = useNavigate();

  if (loading) return (
    <div className='px-6 md:px-36 py-16 bg-gray-50/50'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='bg-gray-200 animate-pulse rounded-2xl h-80' />
        ))}
      </div>
    </div>
  );

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className='px-6 md:px-36 py-16 bg-gray-50/50'>
      <div className='mb-10'>
        <h2 className='text-3xl font-extrabold text-gray-900 tracking-tight'>
          {type === 'personalized' ? '✨ Recommended ' : '🔥 Popular Courses'}
        </h2>
        
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {recommendations.map((course) => {
         
          const finalPrice = (course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2);
          const hasDiscount = course.discount > 0;

          return (
            <div
              key={course._id}
              onClick={() => navigate(`/course/${course._id}`)}
              className='group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col border border-gray-100 min-h-[340px]'
            >
              
              <div className="relative w-full flex-1 overflow-hidden">
                <img 
                  src={assets.thumbnail} 
                  alt="Course Thumbnail"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <h3 className="text-white text-lg font-bold uppercase tracking-widest drop-shadow-md text-center px-4 leading-tight">
                    {course.courseTitle}
                  </h3>
                </div>
              </div>

              
              <div className='p-4 flex-1 flex flex-col justify-between text-left'>
                <div>
                  <h3 className='text-base font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors'>
                    {course.courseTitle}
                  </h3>
                  <span className='text-[10px] font-bold text-blue-500 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded'>
                    {course.category}
                  </span>
                </div>

                <div className='mt-4 pt-3 border-t border-gray-50'>
                  <div className='flex items-baseline gap-2'>
                    <p className='text-lg font-bold text-gray-900'>
                      ${finalPrice}
                    </p>
                    {hasDiscount && (
                      <p className='text-xs text-gray-400 line-through'>
                        ${course.coursePrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                  {hasDiscount && (
                    <p className='text-[10px] font-bold text-red-500'>
                      {course.discount}% OFF
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendationSection;





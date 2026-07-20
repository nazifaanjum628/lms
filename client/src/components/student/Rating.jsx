import React, { useEffect, useState } from 'react'


const Rating = ({ initialRating, onRate }) => {

  const [rating, setRating] = useState(initialRating || 0)
  const [hovered, setHovered] = useState(0)

  const handleRating = (value) => {
    setRating(value)
    if (onRate) onRate(value)
  }

  useEffect(() => {
    if (initialRating) setRating(initialRating)
  }, [initialRating])

  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1
        const filled = starValue <= (hovered || rating)
        return (
          <span
            key={index}
            className={`text-xl sm:text-2xl cursor-pointer transition-colors ${
              filled ? 'text-yellow-500' : 'text-gray-400'
            }`}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
          >
            &#9733;
          </span>
        )
      })}
    </div>
  )
}

export default Rating

{/*import React, { useEffect, useState } from 'react'

const Rating = ({initialRating,onRate}) => {

  const [rating,setRating]=useState(initialRating||0)

  const handleRating=(value)=>{
    setRating(value);
    if(onRate) onRate(value)
  }

  useEffect(()=>{
    if(initialRating){
      setRating(initialRating)
    }
  },[initialRating]);

  return (

    
    <div>
        {Array.from({length:5},(_,index)=>{
          const starValue=index+1;
          return (
            <span key={index} className={`text-xl sm:text-2xl cursor-pointer transition-colors ${starValue<=rating?'text-yellow-500':'text-gray-400'}`} onClick={()=>handleRating(starValue)}>&#9733; {/*html icon code */}

           {/*} </span>
          )
        })}
    </div>
  )
}

export default Rating*/}
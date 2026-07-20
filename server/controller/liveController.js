import axios from 'axios';

// Replace this with your actual Daily API key or load it from process.env.DAILY_API_KEY
const DAILY_API_KEY = 'YOUR_DAILY_REST_API_KEY_HERE'; 

export const startLiveClass = async (req, res) => {
  try {
    const { courseId, classId } = req.params;
    
    // 1. Fetch class details from your DB to get the title
    // const currentClass = await Class.findById(classId);
    const roomTitle = `Class-${classId}`;

    // 2. Request a secure, private room from Daily's servers
    const response = await axios.post(
      'https://daily.co',
      {
        name: roomTitle,
        privacy: 'public', // Set to 'private' if you want to use access tokens later
        properties: {
          enable_chat: true,
          enable_screenshare: true,
          exp: Math.floor(Date.now() / 1000) + 7200, // Room auto-expires and deletes in 2 hours
        }
      },
      {
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // 3. Save the room URL (response.data.url) to your database class object here if needed
    // currentClass.liveUrl = response.data.url;
    // await currentClass.save();

    res.json({ 
      success: true, 
      roomUrl: response.data.url 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.error || error.message 
    });
  }
};
